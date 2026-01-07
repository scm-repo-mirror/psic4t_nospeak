## MODIFIED Requirements

### Requirement: Message Input Interface
The message input area SHALL provide a media upload button and a text input. The message input area SHALL also provide a microphone button to the immediate right of the message text input for recording voice messages.

- The microphone button SHALL be hidden when the message input contains any non-whitespace text.
- The microphone button SHALL be hidden when voice recording is unsupported on the current platform (for example, when `MediaRecorder` or microphone capture APIs are unavailable).
- On desktop devices, the inline circular Send button behavior remains unchanged: it SHALL only be visible when the input contains non-whitespace text.

#### Scenario: Microphone button is hidden when user typed text
- **GIVEN** the user is viewing a conversation
- **WHEN** the message input contains any non-whitespace characters
- **THEN** the microphone button is not displayed
- **AND** the existing Send button behavior applies for desktop.

#### Scenario: Microphone button is hidden when recording is unsupported
- **GIVEN** the user is viewing a conversation on a platform that does not support voice recording
- **WHEN** the message input is empty
- **THEN** the microphone button is not displayed.

### Requirement: Media Upload Support
The system SHALL allow users to upload images, videos, and audio files as encrypted attachments in NIP-17 conversations.

- The system SHALL continue to accept MP3 audio files as attachments.
- The system SHALL also accept Opus audio attachments (for example, recorded voice messages stored in a WebM or Ogg container).

#### Scenario: User sends an Opus audio attachment
- **GIVEN** the user has created an audio file whose MIME type represents Opus audio (for example `audio/webm;codecs=opus`)
- **WHEN** the user sends the audio as an attachment in an encrypted conversation
- **THEN** the client uploads the encrypted blob as `application/octet-stream` to Blossom so the resulting URL ends in `.bin`
- **AND** the sent Kind 15 file message SHALL preserve the original audio MIME type in its `file-type` tag.

### Requirement: NIP-17 Kind 15 File Messages
The messaging experience SHALL represent binary attachments (such as images, videos, and audio files) sent over encrypted direct messages as unsigned NIP-17 file message rumors using Kind 15, sealed and gift-wrapped via the existing NIP-59 DM pipeline. Each file message SHALL carry enough metadata in its tags to describe the media type, basic size information, and content hashes, and SHALL reference an HTTPS URL where the encrypted file bytes can be fetched.

#### Scenario: Kind 15 file-type tag supports Opus audio
- **GIVEN** the user sends or receives a Kind 15 file message rumor that represents an Opus audio attachment
- **WHEN** the Kind 15 rumor includes a `file-type` tag with a value such as `audio/webm;codecs=opus` or `audio/ogg;codecs=opus`
- **THEN** the client SHALL treat the attachment as an audio message and render an audio player UI consistent with existing audio rendering behavior.

### Requirement: Message Media Preview Modal
The messaging interface SHALL present a media preview surface when the user selects a file attachment from the message input media menu, before any file or caption is sent to the conversation.

#### Scenario: Voice recording does not use the generic media preview
- **GIVEN** the user initiates a voice recording from the microphone button in the message input
- **WHEN** the voice recording bottom sheet is opened
- **THEN** the system SHALL NOT open the generic attachment preview modal for this action.

## ADDED Requirements

### Requirement: Voice Message Recording
The messaging interface SHALL allow users to record and send voice messages as audio attachments.

- When the user taps the microphone button, the client SHALL open a bottom sheet and begin recording immediately.
- The bottom sheet SHALL display a live waveform derived from the active microphone input.
- The bottom sheet SHALL display a running timer.
- The bottom sheet SHALL include:
  - a Cancel action that discards the recording and closes the sheet
  - a Send action that sends the recorded audio immediately
  - **Web/Desktop**: a Pause/Resume control that pauses and resumes the recording
  - **Android native**: a Done control that finalizes the recording (no resume available)
  - a Play/Pause control that previews the recorded audio once a recording is available
- The client SHALL enforce a maximum duration of 3 minutes for a single voice message. When the cap is reached, the client SHALL stop recording and keep the bottom sheet open in a ready-to-send state.

#### Scenario: Tapping the microphone starts recording immediately
- **GIVEN** the message input is empty and voice recording is supported
- **WHEN** the user taps the microphone button
- **THEN** a bottom sheet opens
- **AND** recording begins immediately without additional confirmation.

#### Scenario: User pauses and resumes recording (Web/Desktop)
- **GIVEN** the user is recording a voice message on a web or desktop platform and the bottom sheet is open
- **WHEN** the user presses Pause
- **THEN** the recording is paused and the timer stops advancing
- **WHEN** the user presses Resume
- **THEN** the recording continues and the timer resumes advancing.

#### Scenario: User finalizes recording (Android native)
- **GIVEN** the user is recording a voice message on Android native and the bottom sheet is open
- **WHEN** the user presses Done
- **THEN** the recording is finalized
- **AND** the Play button becomes available for previewing
- **AND** the user cannot resume recording (must re-record or send).

#### Scenario: User previews the recorded audio
- **GIVEN** the user has stopped recording (via Pause on web, Done on Android, or auto-stopped at 3-minute cap)
- **WHEN** the user presses Play
- **THEN** the recorded audio begins playback in the bottom sheet
- **AND** pressing Pause stops playback.

#### Scenario: Sending a voice message sends immediately
- **GIVEN** the voice message bottom sheet has a recorded audio result available
- **WHEN** the user presses Send
- **THEN** the client sends the voice message as a Kind 15 encrypted attachment
- **AND** the bottom sheet is dismissed after the send operation is initiated.

#### Scenario: Cancel discards a voice message
- **GIVEN** the voice message bottom sheet is open
- **WHEN** the user presses Cancel
- **THEN** the recording is discarded
- **AND** the microphone capture is stopped (web) or native recorder is stopped and temp file deleted (Android)
- **AND** no message is sent.

### Requirement: Voice Message File Construction
When constructing the client-side `File` object for a recorded voice message, the client SHALL use a `.bin` filename suffix for consistency with encrypted attachment conventions.

- **Web/Desktop**: The recorded file's MIME type MUST reflect the actual recorded container (for example `audio/webm;codecs=opus`).
- **Android native**: The recorded file's MIME type MUST be `audio/mp4` (M4A with AAC-LC codec).
- The encrypted upload to Blossom remains `application/octet-stream` as defined by the existing encrypted upload requirements.

#### Scenario: Recorded voice message uses `.bin` filename with Opus MIME (Web/Desktop)
- **GIVEN** the client has completed recording a voice message via `MediaRecorder` on web or desktop
- **WHEN** it constructs a `File` object to pass into the encrypted upload pipeline
- **THEN** the file name ends with `.bin`
- **AND** the file MIME type indicates the recorded Opus container.

#### Scenario: Recorded voice message uses `.bin` filename with M4A MIME (Android native)
- **GIVEN** the client has completed recording a voice message via native recording on Android
- **WHEN** it constructs a `File` object to pass into the encrypted upload pipeline
- **THEN** the file name ends with `.bin`
- **AND** the file MIME type is `audio/mp4`.
