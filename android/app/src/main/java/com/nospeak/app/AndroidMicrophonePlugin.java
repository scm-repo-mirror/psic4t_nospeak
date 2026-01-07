package com.nospeak.app;

import android.Manifest;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.File;
import java.io.IOException;

@CapacitorPlugin(
    name = "AndroidMicrophone",
    permissions = {
        @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = AndroidMicrophonePlugin.MICROPHONE)
    }
)
public class AndroidMicrophonePlugin extends Plugin {

    private static final String TAG = "AndroidMicrophonePlugin";

    static final String MICROPHONE = "microphone";

    private NativeAudioRecorder recorder;
    private File currentOutputFile;

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (getPermissionState(MICROPHONE) == PermissionState.GRANTED) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        requestAllPermissions(call, "permissionsCallback");
    }

    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        boolean granted = getPermissionState(MICROPHONE) == PermissionState.GRANTED;

        JSObject result = new JSObject();
        result.put("granted", granted);
        call.resolve(result);
    }

    @PluginMethod
    public void startRecording(PluginCall call) {
        if (getPermissionState(MICROPHONE) != PermissionState.GRANTED) {
            call.reject("Microphone permission not granted");
            return;
        }

        if (recorder != null && recorder.isRecording()) {
            call.reject("Already recording");
            return;
        }

        try {
            // Create output file in cache directory
            File cacheDir = getContext().getCacheDir();
            currentOutputFile = new File(cacheDir, "voice_" + System.currentTimeMillis() + ".m4a");

            recorder = new NativeAudioRecorder();
            recorder.start(currentOutputFile, new NativeAudioRecorder.Callback() {
                @Override
                public void onPeak(float peak) {
                    JSObject data = new JSObject();
                    data.put("peak", peak);
                    notifyListeners("waveformPeak", data);
                }

                @Override
                public void onError(String message) {
                    Log.e(TAG, "Recording error: " + message);
                    JSObject data = new JSObject();
                    data.put("error", message);
                    notifyListeners("recordingError", data);
                }
            });

            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);

            Log.d(TAG, "Recording started: " + currentOutputFile.getAbsolutePath());

        } catch (IOException e) {
            Log.e(TAG, "Failed to start recording", e);
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.resolve(result);
        }
    }

    @PluginMethod
    public void stopRecording(PluginCall call) {
        if (recorder == null || !recorder.isRecording()) {
            call.reject("Not recording");
            return;
        }

        try {
            NativeAudioRecorder.RecordingResult result = recorder.stop();
            recorder = null;

            if (result != null) {
                JSObject response = new JSObject();
                response.put("filePath", result.filePath);
                response.put("durationMs", result.durationMs);
                call.resolve(response);

                Log.d(TAG, "Recording stopped: " + result.filePath + ", duration: " + result.durationMs + "ms");
            } else {
                call.reject("Failed to stop recording");
            }

        } catch (Exception e) {
            Log.e(TAG, "Failed to stop recording", e);
            call.reject("Failed to stop recording: " + e.getMessage());
        }
    }

    @PluginMethod
    public void pauseRecording(PluginCall call) {
        if (recorder == null || !recorder.isRecording()) {
            call.reject("Not recording");
            return;
        }

        recorder.pause();
        call.resolve();

        Log.d(TAG, "Recording paused");
    }

    @PluginMethod
    public void resumeRecording(PluginCall call) {
        if (recorder == null || !recorder.isRecording()) {
            call.reject("Not recording");
            return;
        }

        recorder.resume();
        call.resolve();

        Log.d(TAG, "Recording resumed");
    }

    @PluginMethod
    public void deleteRecordingFile(PluginCall call) {
        String filePath = call.getString("filePath");
        if (filePath == null || filePath.isEmpty()) {
            call.reject("filePath is required");
            return;
        }

        File file = new File(filePath);
        if (file.exists()) {
            boolean deleted = file.delete();
            Log.d(TAG, "Delete recording file: " + filePath + ", success: " + deleted);
        }

        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();

        // Clean up recorder if activity is destroyed
        if (recorder != null && recorder.isRecording()) {
            try {
                recorder.stop();
            } catch (Exception e) {
                Log.w(TAG, "Error stopping recorder on destroy", e);
            }
            recorder = null;
        }
    }
}
