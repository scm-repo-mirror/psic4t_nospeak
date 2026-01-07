package com.nospeak.app;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaFormat;
import android.media.MediaMuxer;
import android.media.MediaRecorder;
import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * Native audio recorder using AudioRecord + MediaCodec + MediaMuxer.
 * Records audio to M4A (AAC-LC) format with live waveform peak callbacks.
 */
public class NativeAudioRecorder {

    private static final String TAG = "NativeAudioRecorder";

    // Audio capture config
    private static final int SAMPLE_RATE = 44100;
    private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
    private static final int CHANNELS = 1;

    // AAC encoding config
    private static final String MIME_TYPE = MediaFormat.MIMETYPE_AUDIO_AAC;
    private static final int AAC_BIT_RATE = 64000;
    private static final int AAC_PROFILE = MediaCodecInfo.CodecProfileLevel.AACObjectLC;

    // Peak callback interval (~125ms worth of samples at 44100Hz mono)
    private static final int PEAK_INTERVAL_SAMPLES = (int) (SAMPLE_RATE * 0.125);

    // State
    private AudioRecord audioRecord;
    private MediaCodec encoder;
    private MediaMuxer muxer;
    private int audioTrackIndex = -1;
    private File outputFile;

    private volatile boolean isRecording = false;
    private volatile boolean isPaused = false;

    private Thread recordingThread;
    private Callback callback;

    private long totalSamplesWritten = 0;
    private long presentationTimeUs = 0;
    private int bufferSize;

    // For peak computation
    private int samplesSincePeak = 0;
    private float peakAccumulator = 0f;
    private int peakSampleCount = 0;

    public interface Callback {
        void onPeak(float peak);
        void onError(String message);
    }

    public static class RecordingResult {
        public final String filePath;
        public final long durationMs;

        public RecordingResult(String filePath, long durationMs) {
            this.filePath = filePath;
            this.durationMs = durationMs;
        }
    }

    /**
     * Start recording to the specified output file.
     */
    public synchronized void start(File outputFile, Callback callback) throws IOException {
        if (isRecording) {
            throw new IllegalStateException("Already recording");
        }

        this.outputFile = outputFile;
        this.callback = callback;
        this.totalSamplesWritten = 0;
        this.presentationTimeUs = 0;
        this.samplesSincePeak = 0;
        this.peakAccumulator = 0f;
        this.peakSampleCount = 0;

        // Calculate buffer size
        bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT);
        if (bufferSize == AudioRecord.ERROR || bufferSize == AudioRecord.ERROR_BAD_VALUE) {
            bufferSize = SAMPLE_RATE * 2; // Fallback: 1 second of 16-bit mono
        }
        // Use at least 4x min buffer for smoother recording
        bufferSize = Math.max(bufferSize * 4, 8192);

        try {
            initAudioRecord();
            initEncoder();
            initMuxer();
        } catch (Exception e) {
            cleanup();
            throw new IOException("Failed to initialize recorder: " + e.getMessage(), e);
        }

        isRecording = true;
        isPaused = false;

        audioRecord.startRecording();

        recordingThread = new Thread(this::recordingLoop, "NativeAudioRecorder");
        recordingThread.start();

        Log.d(TAG, "Recording started: " + outputFile.getAbsolutePath());
    }

    /**
     * Pause recording (releases microphone but keeps encoder/muxer open).
     */
    public synchronized void pause() {
        if (!isRecording || isPaused) {
            return;
        }

        isPaused = true;

        // Stop AudioRecord to release microphone
        if (audioRecord != null) {
            try {
                audioRecord.stop();
            } catch (Exception e) {
                Log.w(TAG, "Error stopping AudioRecord on pause", e);
            }
        }

        Log.d(TAG, "Recording paused");
    }

    /**
     * Resume recording after pause.
     */
    public synchronized void resume() {
        if (!isRecording || !isPaused) {
            return;
        }

        // Reinitialize and start AudioRecord
        try {
            if (audioRecord != null) {
                audioRecord.release();
            }
            initAudioRecord();
            audioRecord.startRecording();
            isPaused = false;
            Log.d(TAG, "Recording resumed");
        } catch (Exception e) {
            Log.e(TAG, "Failed to resume recording", e);
            if (callback != null) {
                callback.onError("Failed to resume recording: " + e.getMessage());
            }
        }
    }

    /**
     * Stop recording and finalize the output file.
     * @return RecordingResult with file path and duration
     */
    public synchronized RecordingResult stop() {
        if (!isRecording) {
            return null;
        }

        isRecording = false;
        isPaused = false;

        // Wait for recording thread to finish
        if (recordingThread != null) {
            try {
                recordingThread.join(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            recordingThread = null;
        }

        // Drain encoder
        drainEncoder(true);

        // Calculate duration
        long durationMs = (totalSamplesWritten * 1000L) / SAMPLE_RATE;

        // Cleanup
        cleanup();

        Log.d(TAG, "Recording stopped. Duration: " + durationMs + "ms, File: " + outputFile.getAbsolutePath());

        return new RecordingResult(outputFile.getAbsolutePath(), durationMs);
    }

    /**
     * Check if currently recording.
     */
    public boolean isRecording() {
        return isRecording;
    }

    /**
     * Check if currently paused.
     */
    public boolean isPaused() {
        return isPaused;
    }

    private void initAudioRecord() {
        audioRecord = new AudioRecord(
            MediaRecorder.AudioSource.MIC,
            SAMPLE_RATE,
            CHANNEL_CONFIG,
            AUDIO_FORMAT,
            bufferSize
        );

        if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
            throw new RuntimeException("AudioRecord initialization failed");
        }
    }

    private void initEncoder() throws IOException {
        MediaFormat format = MediaFormat.createAudioFormat(MIME_TYPE, SAMPLE_RATE, CHANNELS);
        format.setInteger(MediaFormat.KEY_AAC_PROFILE, AAC_PROFILE);
        format.setInteger(MediaFormat.KEY_BIT_RATE, AAC_BIT_RATE);
        format.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, bufferSize);

        encoder = MediaCodec.createEncoderByType(MIME_TYPE);
        encoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
        encoder.start();
    }

    private void initMuxer() throws IOException {
        muxer = new MediaMuxer(outputFile.getAbsolutePath(), MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
        audioTrackIndex = -1; // Will be set when we get the output format from encoder
    }

    private void recordingLoop() {
        short[] audioBuffer = new short[bufferSize / 2];
        MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();

        while (isRecording) {
            if (isPaused) {
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
                continue;
            }

            // Read audio data
            int shortsRead = audioRecord.read(audioBuffer, 0, audioBuffer.length);

            if (shortsRead > 0) {
                // Compute peak for waveform visualization
                processPeaks(audioBuffer, shortsRead);

                // Convert shorts to bytes for encoder
                byte[] byteBuffer = shortsToBytes(audioBuffer, shortsRead);

                // Feed to encoder
                feedEncoder(byteBuffer, shortsRead);

                // Drain encoder output
                drainEncoder(false);

                totalSamplesWritten += shortsRead;
            } else if (shortsRead < 0) {
                Log.e(TAG, "AudioRecord.read error: " + shortsRead);
                if (callback != null) {
                    callback.onError("Audio read error: " + shortsRead);
                }
                break;
            }
        }
    }

    private void processPeaks(short[] buffer, int length) {
        // Compute RMS for this chunk
        float sumSquares = 0f;
        for (int i = 0; i < length; i++) {
            float sample = buffer[i] / 32768f; // Normalize to -1.0 to 1.0
            sumSquares += sample * sample;
        }

        peakAccumulator += sumSquares;
        peakSampleCount += length;
        samplesSincePeak += length;

        // Emit peak at regular intervals
        if (samplesSincePeak >= PEAK_INTERVAL_SAMPLES && peakSampleCount > 0) {
            float rms = (float) Math.sqrt(peakAccumulator / peakSampleCount);
            // Scale RMS to 0.0-1.0 range (with some headroom)
            float peak = Math.min(1.0f, 0.08f + rms * 1.25f);

            if (callback != null) {
                callback.onPeak(peak);
            }

            // Reset accumulators
            samplesSincePeak = 0;
            peakAccumulator = 0f;
            peakSampleCount = 0;
        }
    }

    private byte[] shortsToBytes(short[] shorts, int length) {
        byte[] bytes = new byte[length * 2];
        for (int i = 0; i < length; i++) {
            bytes[i * 2] = (byte) (shorts[i] & 0xFF);
            bytes[i * 2 + 1] = (byte) ((shorts[i] >> 8) & 0xFF);
        }
        return bytes;
    }

    private void feedEncoder(byte[] data, int sampleCount) {
        int inputBufferIndex = encoder.dequeueInputBuffer(10000);
        if (inputBufferIndex >= 0) {
            ByteBuffer inputBuffer = encoder.getInputBuffer(inputBufferIndex);
            if (inputBuffer != null) {
                inputBuffer.clear();
                inputBuffer.put(data);

                long pts = presentationTimeUs;
                presentationTimeUs += (sampleCount * 1000000L) / SAMPLE_RATE;

                encoder.queueInputBuffer(inputBufferIndex, 0, data.length, pts, 0);
            }
        }
    }

    private void drainEncoder(boolean endOfStream) {
        if (endOfStream) {
            int inputBufferIndex = encoder.dequeueInputBuffer(10000);
            if (inputBufferIndex >= 0) {
                encoder.queueInputBuffer(inputBufferIndex, 0, 0, presentationTimeUs, MediaCodec.BUFFER_FLAG_END_OF_STREAM);
            }
        }

        MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();

        while (true) {
            int outputBufferIndex = encoder.dequeueOutputBuffer(bufferInfo, endOfStream ? 10000 : 0);

            if (outputBufferIndex == MediaCodec.INFO_TRY_AGAIN_LATER) {
                if (!endOfStream) {
                    break;
                }
                // Keep trying if we're draining at end
            } else if (outputBufferIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                // First time: add track to muxer
                if (audioTrackIndex < 0) {
                    MediaFormat newFormat = encoder.getOutputFormat();
                    audioTrackIndex = muxer.addTrack(newFormat);
                    muxer.start();
                    Log.d(TAG, "Muxer started with format: " + newFormat);
                }
            } else if (outputBufferIndex >= 0) {
                ByteBuffer outputBuffer = encoder.getOutputBuffer(outputBufferIndex);

                if (outputBuffer != null && audioTrackIndex >= 0 && bufferInfo.size > 0) {
                    outputBuffer.position(bufferInfo.offset);
                    outputBuffer.limit(bufferInfo.offset + bufferInfo.size);
                    muxer.writeSampleData(audioTrackIndex, outputBuffer, bufferInfo);
                }

                encoder.releaseOutputBuffer(outputBufferIndex, false);

                if ((bufferInfo.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0) {
                    break;
                }
            } else {
                break;
            }
        }
    }

    private void cleanup() {
        if (audioRecord != null) {
            try {
                if (audioRecord.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING) {
                    audioRecord.stop();
                }
                audioRecord.release();
            } catch (Exception e) {
                Log.w(TAG, "Error releasing AudioRecord", e);
            }
            audioRecord = null;
        }

        if (encoder != null) {
            try {
                encoder.stop();
                encoder.release();
            } catch (Exception e) {
                Log.w(TAG, "Error releasing encoder", e);
            }
            encoder = null;
        }

        if (muxer != null) {
            try {
                muxer.stop();
                muxer.release();
            } catch (Exception e) {
                Log.w(TAG, "Error releasing muxer", e);
            }
            muxer = null;
        }

        audioTrackIndex = -1;
    }
}
