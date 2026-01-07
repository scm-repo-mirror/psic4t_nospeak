## ADDED Requirements

### Requirement: Android Microphone Permission for Voice Messages
When running inside the Android Capacitor app shell, the application SHALL declare and request microphone permissions required for recording voice messages.

- The Android manifest SHALL declare `uses-permission android:name="android.permission.RECORD_AUDIO"`.
- When the user initiates voice recording from the chat UI, the app SHALL request microphone permission via the native Capacitor plugin before starting recording.
- If the user denies microphone permission or the permission is unavailable, the app SHALL remain functional and the voice message UI SHALL fail gracefully (for example by closing the sheet and showing a non-blocking dialog).

#### Scenario: AndroidManifest declares microphone permission
- **GIVEN** the project builds the Android app shell
- **WHEN** the Android manifest is generated for the app
- **THEN** it includes `android.permission.RECORD_AUDIO`.

#### Scenario: Permission denial does not crash the app
- **GIVEN** the user is running nospeak inside the Android app shell
- **WHEN** the user attempts to record a voice message and denies microphone permission
- **THEN** the app remains usable
- **AND** the user is informed that voice recording is unavailable.

### Requirement: Native Audio Recording Plugin
The Android app shell SHALL provide a native Capacitor plugin for recording voice messages, bypassing WebView `getUserMedia` limitations on Android 16+.

- The plugin SHALL use `AudioRecord` with `AudioSource.MIC` for raw PCM audio capture.
- The plugin SHALL use `MediaCodec` to encode audio to AAC-LC format in real-time.
- The plugin SHALL use `MediaMuxer` to write the encoded audio to an M4A container file in the app's cache directory.
- The plugin SHALL compute RMS waveform peaks from the raw PCM samples and emit them to JavaScript via Capacitor plugin events at approximately 125ms intervals.
- The plugin SHALL support the following methods callable from JavaScript:
  - `requestPermission()`: Request `RECORD_AUDIO` permission, returns `{ granted: boolean }`.
  - `startRecording()`: Begin native recording, returns `{ success: boolean, error?: string }`.
  - `stopRecording()`: Finalize recording, returns `{ filePath: string, durationMs: number }`.
  - `pauseRecording()`: Pause recording (releases microphone).
  - `resumeRecording()`: Resume recording after pause.
  - `deleteRecordingFile({ filePath })`: Delete a recorded file from the cache.
- The plugin SHALL emit `waveformPeak` events with `{ peak: number }` (0.0 to 1.0) during recording.
- The plugin SHALL emit `recordingError` events with `{ error: string }` if an error occurs during recording.

#### Scenario: Native recording produces M4A file
- **GIVEN** the user initiates voice recording on Android
- **WHEN** the native recording plugin captures and encodes audio
- **THEN** the output file is an M4A container with AAC-LC audio at 44.1kHz mono, approximately 64kbps.

#### Scenario: Live waveform peaks are emitted during recording
- **GIVEN** the user is recording a voice message on Android
- **WHEN** the native plugin captures audio
- **THEN** it emits `waveformPeak` events to JavaScript at approximately 125ms intervals
- **AND** each event contains a `peak` value between 0.0 and 1.0 representing the audio amplitude.

#### Scenario: Recording file is deleted after sending
- **GIVEN** the user has recorded and sent a voice message on Android
- **WHEN** the send operation is initiated
- **THEN** the client calls `deleteRecordingFile` to remove the temporary M4A file from the cache.
