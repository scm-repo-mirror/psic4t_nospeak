## 1. Specification
- [x] 1.1 Add spec delta for voice messages in `specs/messaging/spec.md`
- [x] 1.2 Add spec delta for Android microphone permission in `specs/android-app-shell/spec.md`
- [x] 1.3 Add spec delta for Android native recording plugin in `specs/android-app-shell/spec.md`
- [x] 1.4 Run `openspec validate add-voice-messages --strict` and fix issues

## 2. Core recording helper (web)
- [x] 2.1 Implement supported Opus `MediaRecorder` mime selection helper
- [x] 2.2 Implement recorder state machine (recording/paused/ready/sending/error)
- [x] 2.3 Enforce max duration (3:00) with auto-stop

## 3. Voice message sheet UI
- [x] 3.1 Add bottom sheet component with waveform + timer
- [x] 3.2 Add Pause/Resume recording control (web/desktop)
- [x] 3.3 Add Done control for Android native recording (finalizes, no resume)
- [x] 3.4 Add Play/Pause preview control after recording is ready
- [x] 3.5 Add Cancel (discard) and Send (send immediately) actions
- [x] 3.6 Hide microphone control on unsupported platforms

## 4. Chat input integration
- [x] 4.1 Add microphone button right of input (hidden when input has text)
- [x] 4.2 Wire sheet Send to existing `sendFileMessage(..., 'audio')` pipeline
- [x] 4.3 Ensure recorded `File` uses `.bin` filename and correct `type` MIME

## 5. Android app shell
- [x] 5.1 Add `android.permission.RECORD_AUDIO` to `AndroidManifest.xml`
- [x] 5.2 Implement `AndroidMicrophonePlugin.java` Capacitor plugin with:
  - `requestPermission()` - Request RECORD_AUDIO permission
  - `startRecording()` - Start native recording
  - `stopRecording()` - Stop and return file path + duration
  - `pauseRecording()` / `resumeRecording()` - Pause/resume (kept for future use)
  - `deleteRecordingFile()` - Delete temp file after sending
  - `waveformPeak` event emission during recording
- [x] 5.3 Implement `NativeAudioRecorder.java` with:
  - `AudioRecord` for raw PCM capture from `AudioSource.MIC`
  - `MediaCodec` for real-time AAC-LC encoding
  - `MediaMuxer` for M4A container output
  - RMS peak computation for waveform visualization
- [x] 5.4 Implement `AndroidMicrophone.ts` TypeScript wrapper for native plugin
- [x] 5.5 Update `VoiceMessageSheet.svelte` to use native recording on Android
- [x] 5.6 Verify permission denial/cancel surfaces a non-crashing dialog

## 6. Validation
- [x] 6.1 Add unit tests for mime selection + duration cap logic
- [x] 6.2 Run `npm run check`
- [x] 6.3 Run `npx vitest run`
