# Change: Add voice messages

## Why
Typing is slow on mobile. Voice messages provide a fast, low-friction way to communicate and reuse the existing encrypted Kind 15 attachment pipeline.

## What Changes
- Add a voice-message recording affordance in the message input: a microphone button to the right of the text input, hidden when the user has typed text.
- On microphone tap, open a bottom sheet and start recording immediately.
- Bottom sheet shows a live waveform, timer, Cancel, Send, plus:
  - **Web/Desktop**: Pause/Resume for recording, Play/Pause for previewing
  - **Android native**: Done button to finalize recording, then Play/Pause for previewing (no resume)
- Enforce a maximum voice message duration of 3 minutes.
- **Web/Desktop**: Voice messages are recorded as Opus audio via `MediaRecorder`.
- **Android native**: Voice messages are recorded natively using `AudioRecord` + `MediaCodec` to M4A (AAC-LC) format, bypassing WebView audio capture limitations on Android 16+.
- Unsupported platforms (notably iOS Safari/PWA) hide the microphone button rather than showing a broken control.
- Recorded audio is sent as an encrypted NIP-17 Kind 15 file message using the existing Blossom upload flow; the encrypted upload remains `application/octet-stream` so the remote URL ends in `.bin`, while the original audio MIME is preserved in the Kind 15 `file-type` tag.

## Impact
- Affected specs:
  - `openspec/specs/messaging/spec.md` (message input UI, media support)
  - `openspec/specs/android-app-shell/spec.md` (microphone permission declaration, native recording plugin)
- Affected code (implementation stage):
  - `src/lib/components/ChatView.svelte` (mic button + open voice sheet)
  - `src/lib/components/VoiceMessageSheet.svelte` (voice recording bottom sheet)
  - `src/lib/core/VoiceRecorder.ts` (Opus MIME detection, duration helpers)
  - `src/lib/core/AndroidMicrophone.ts` (Capacitor plugin wrapper for native recording)
  - `android/app/src/main/java/com/nospeak/app/NativeAudioRecorder.java` (native AudioRecord + MediaCodec + MediaMuxer)
  - `android/app/src/main/java/com/nospeak/app/AndroidMicrophonePlugin.java` (Capacitor plugin for native recording)
  - `android/app/src/main/AndroidManifest.xml` (add `RECORD_AUDIO` permission)

## Non-Goals
- iOS voice message recording or playback support (the UI will hide the feature there).
- Server-side transcoding or codec negotiation.
- Group voice messages with captions (voice notes are sent as a single Kind 15 message).
