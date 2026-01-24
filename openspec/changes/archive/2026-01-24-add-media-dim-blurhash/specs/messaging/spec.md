## MODIFIED Requirements

### Requirement: NIP-17 Kind 15 File Messages
The messaging experience SHALL represent binary attachments (such as images, videos, and audio files) sent over encrypted direct messages as unsigned NIP-17 file message rumors using Kind 15, sealed and gift-wrapped via the existing NIP-59 DM pipeline. Each file message SHALL carry enough metadata in its tags to describe the media type, basic size information, content hashes, and visual metadata (dimensions and blurhash placeholder), and SHALL reference an HTTPS URL where the encrypted file bytes can be fetched.

#### Scenario: Sending a file as a NIP-17 Kind 15 DM
- **GIVEN** the user is composing a one-to-one encrypted conversation and chooses an image, video, or audio file from the media upload affordance
- **WHEN** the client prepares the DM payload for this attachment
- **THEN** it SHALL construct an **unsigned** Kind 15 rumor whose tags include at minimum:
  - a `p` tag for the recipient pubkey
  - a `file-type` tag containing the original MIME type (for example, `image/jpeg`, `video/mp4`, or `audio/mpeg`)
  - an `x` tag containing the SHA-256 hash of the uploaded file bytes (encrypted or plaintext)
  - a `size` tag indicating the file size in bytes
- **AND** the rumor `.content` SHALL be set to the HTTPS URL returned from the Blossom upload.

#### Scenario: Sending an image or video includes dim and blurhash tags
- **GIVEN** the user is composing a one-to-one or group encrypted conversation and chooses an image or video file from the media upload affordance
- **WHEN** the client extracts the media dimensions and computes a blurhash before constructing the Kind 15 rumor
- **THEN** the Kind 15 rumor tags SHALL include a `dim` tag in the NIP-94 format `<width>x<height>` representing the pixel dimensions of the original media
- **AND** the Kind 15 rumor tags SHALL include a `blurhash` tag containing the blurhash-encoded placeholder string computed from the image pixels or video first frame
- **AND** for videos, the blurhash SHALL be computed from the first frame of the video file.

#### Scenario: Dimension and blurhash extraction failure does not block send
- **GIVEN** the user is sending an image or video file
- **WHEN** dimension extraction or blurhash computation fails (for example, due to an unsupported codec or canvas restriction)
- **THEN** the client SHALL still send the Kind 15 file message without `dim` and `blurhash` tags
- **AND** the send operation SHALL NOT be blocked or produce a user-visible error for metadata extraction failure.

#### Scenario: Receiving and displaying a NIP-17 Kind 15 DM
- **GIVEN** the messaging service unwraps a NIP-59 gift-wrap whose inner rumor is Kind 15
- **WHEN** the tags include a `p` tag for the current user and a `file-type` tag describing the media type
- **THEN** the system SHALL persist a message record that captures at least the file URL, MIME type, basic size/hash information, and any `dim` and `blurhash` tag values from the rumor tags
- **AND** the conversation UI SHALL render this record as a file attachment bubble that uses the MIME type to decide whether to show an inline image, video player, or audio player, consistent with the existing Media Upload Support behavior.

#### Scenario: Receiving dim and blurhash tags from Kind 15 messages
- **GIVEN** the messaging service unwraps a Kind 15 file message rumor
- **WHEN** the rumor tags include a `dim` tag in the format `<width>x<height>`
- **THEN** the system SHALL parse the width and height as integers and store them in the message record as `fileWidth` and `fileHeight`
- **AND** when the rumor tags include a `blurhash` tag, the system SHALL store the blurhash string in the message record as `fileBlurhash`.

#### Scenario: Fallback when a client only supports Kind 14 text messages
- **GIVEN** a remote client sends media by embedding a bare HTTP(S) URL in a Kind 14 chat message instead of using Kind 15
- **WHEN** nospeak receives and unwraps this message
- **THEN** the system SHALL continue to treat the message as a text chat bubble with media URL detection as defined in existing messaging requirements
- **AND** this behavior SHALL remain supported even after nospeak starts sending attachments using Kind 15 for its own clients.

#### Scenario: Optional caption sent as separate Kind 14 message
- **GIVEN** the user has entered non-empty caption text while preparing a file attachment in the media preview for a NIP-17 conversation
- **WHEN** the messaging service sends the Kind 15 file message rumor and corresponding gift-wrap for that attachment
- **THEN** it SHALL also send a separate NIP-17 Kind 14 text message in the same conversation whose content is the caption text
- **AND** the caption Kind 14 text message SHALL include an `e` tag whose value is the rumor id of the corresponding Kind 15 file message, denoting that file message as the direct parent according to the NIP-17 definition of the `e` tag.
- **AND** the conversation UI SHALL present the file attachment bubble and caption text as a single visual message unit by rendering the caption text directly below the file preview inside the same bubble, without a separate caption avatar.

#### Scenario: Kind 15 tags include MIME type, size, and hash
- **WHEN** nospeak sends a Kind 15 file message rumor for any attachment
- **THEN** it SHALL include:
  - `file-type` with the MIME type of the original, unencrypted file
  - `size` with the byte length of the encrypted file blob that will be uploaded (matching what is served at the content URL)
  - `x` with the SHA-256 hex-encoded hash of the encrypted file blob
  - `encryption-algorithm` with the value `aes-gcm`
  - `decryption-key` carrying the serialized AES-GCM key material needed to decrypt the blob
  - `decryption-nonce` carrying the serialized AES-GCM nonce associated with this blob
- **AND** when nospeak receives Kind 15 file messages from other clients that do not include these encryption tags, it SHALL still attempt to render the attachment based on the available URL and MIME metadata without attempting decryption.

#### Scenario: Kind 15 messages are stored distinctly from text rumors
- **WHEN** a Kind 15 file message is persisted in the local database
- **THEN** the stored message record SHALL identify that the underlying rumor kind is 15 and SHALL preserve file metadata (such as MIME type, URL, dimensions, and blurhash) separately from any freeform text content
- **AND** the UI and history views SHALL be able to distinguish between text-only messages (Kind 14) and file messages (Kind 15) even when both appear in the same conversation.

#### Scenario: Caption detection and grouping for NIP-17 messages
- **GIVEN** a NIP-17 conversation history that contains a Kind 15 file message `F` and a Kind 14 text message `C` authored by the same pubkey
- **WHEN** `C` includes an `e` tag whose value is the rumor id of `F`, denoting `F` as the direct parent according to NIP-17
- **AND** `C` appears immediately after `F` in the locally ordered list of messages for that conversation
- **THEN** the conversation UI SHALL treat `C` as a caption for `F` and render the caption text as part of the same visual message unit as `F`, directly below the file preview and without a separate caption avatar row
- **AND** when these conditions are not met, Kind 14 text messages SHALL be rendered as normal chat bubbles without caption-style grouping.

### Requirement: File Message Metadata for Interoperability
The messaging implementation for Kind 15 file messages SHALL standardize on a minimal tag set so that other NIP-17 clients can reliably interpret nospeak file DMs without needing to understand internal upload semantics. For image and video attachments, the tag set SHALL additionally include NIP-94 compatible `dim` and `blurhash` tags to enable receiving clients to pre-render media placeholders.

#### Scenario: Kind 15 tags include MIME type, size, and hash
- **WHEN** nospeak sends a Kind 15 file message rumor for any attachment
- **THEN** it SHALL include:
  - `file-type` with the MIME type of the original, unencrypted file
  - `size` with the byte length of the encrypted file blob that will be uploaded (matching what is served at the content URL)
  - `x` with the SHA-256 hex-encoded hash of the encrypted file blob
  - `encryption-algorithm` with the value `aes-gcm`
  - `decryption-key` carrying the hex-encoded AES-GCM key material (64 hex characters for AES-256, 32 hex characters for AES-128) needed to decrypt the blob
  - `decryption-nonce` carrying the hex-encoded 16-byte AES-GCM nonce (32 hex characters) associated with this blob
- **AND** when nospeak receives Kind 15 file messages from other clients that do not include these encryption tags, it SHALL still attempt to render the attachment based on the available URL and MIME metadata without attempting decryption.

#### Scenario: Kind 15 tags include dim and blurhash for images and videos
- **WHEN** nospeak sends a Kind 15 file message rumor for an image or video attachment
- **AND** the client has successfully extracted dimensions and computed a blurhash
- **THEN** it SHALL include:
  - `dim` with the value `<width>x<height>` representing the pixel dimensions of the original media (for example, `1920x1080`)
  - `blurhash` with the blurhash-encoded placeholder string (for example, `LEHV6nWB2yk8pyo0adR*.7kCMdnj`)
- **AND** audio attachments SHALL NOT include `dim` or `blurhash` tags.

#### Scenario: Decryption accepts hex or base64url encoded keys and nonces
- **WHEN** nospeak receives a Kind 15 file message with `decryption-key` and `decryption-nonce` tags
- **THEN** it SHALL auto-detect the encoding format by checking if the value is valid hex (only characters 0-9, a-f, A-F)
- **AND** if the value is valid hex, it SHALL decode using hex decoding
- **AND** if the value is not valid hex, it SHALL decode using base64url decoding
- **AND** it SHALL validate that the decoded key is either 16 bytes (AES-128) or 32 bytes (AES-256) and reject keys of other sizes with a descriptive error

#### Scenario: Encrypted file uploads use octet-stream content type
- **WHEN** nospeak uploads an encrypted file blob to a Blossom server
- **THEN** it SHALL set the content type to `application/octet-stream` regardless of the original file MIME type
- **AND** this ensures the resulting URL ends with `.bin` for consistency with other NIP-17 implementations

#### Scenario: Kind 15 messages are stored distinctly from text rumors
- **WHEN** a Kind 15 file message is persisted in the local database
- **THEN** the stored message record SHALL identify that the underlying rumor kind is 15 and SHALL preserve file metadata (such as MIME type, URL, dimensions, and blurhash) separately from any freeform text content
- **AND** the UI and history views SHALL be able to distinguish between text-only messages (Kind 14) and file messages (Kind 15) even when both appear in the same conversation.

## ADDED Requirements

### Requirement: Media Blurhash Placeholder Rendering
The messaging UI SHALL render a blurhash-decoded placeholder image with the correct aspect ratio for file message bubbles that contain `fileWidth`, `fileHeight`, and `fileBlurhash` metadata, so that the message list reserves the correct vertical space before the actual media loads and avoids layout shift.

#### Scenario: Blurhash placeholder shown while media loads
- **GIVEN** a file message record has `fileWidth`, `fileHeight`, and `fileBlurhash` values
- **WHEN** the message bubble is rendered in the conversation UI
- **THEN** the system SHALL render a container element with CSS `aspect-ratio` set to `fileWidth / fileHeight` and `max-height` of 300px
- **AND** the system SHALL decode the blurhash string to a 32x32 pixel buffer, render it to a canvas element inside the container, and CSS-scale the canvas to fill the container
- **AND** the blurhash canvas SHALL be visible until the actual media (image or video) finishes loading.

#### Scenario: Blurhash placeholder hidden after media loads
- **GIVEN** a file message bubble is displaying a blurhash placeholder
- **WHEN** the actual image fires its `load` event or the video fires its `loadeddata` event
- **THEN** the blurhash canvas SHALL be hidden or removed
- **AND** the real media element SHALL be displayed in the same container without changing the container dimensions.

#### Scenario: Media bubble without blurhash metadata renders without placeholder
- **GIVEN** a file message record does NOT have `fileBlurhash` or `fileWidth`/`fileHeight` values (for example, from another client that does not send these tags)
- **WHEN** the message bubble is rendered in the conversation UI
- **THEN** the system SHALL render the media element with the existing `max-w-full max-h-[300px]` styling without a blurhash placeholder
- **AND** layout shift MAY occur as the media loads, consistent with current behavior.

#### Scenario: Aspect-ratio container respects max-height constraint
- **GIVEN** a file message has dimensions where the computed height at full width exceeds 300px
- **WHEN** the blurhash container is rendered
- **THEN** the container height SHALL be capped at 300px
- **AND** the container width SHALL be proportionally reduced to maintain the correct aspect ratio.
