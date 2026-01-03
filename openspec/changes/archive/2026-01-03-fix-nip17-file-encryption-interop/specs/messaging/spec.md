## MODIFIED Requirements

### Requirement: File Message Metadata for Interoperability
The messaging implementation for Kind 15 file messages SHALL standardize on a minimal tag set so that other NIP-17 clients can reliably interpret nospeak file DMs without needing to understand internal upload semantics.

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
- **THEN** the stored message record SHALL identify that the underlying rumor kind is 15 and SHALL preserve file metadata (such as MIME type and URL) separately from any freeform text content
- **AND** the UI and history views SHALL be able to distinguish between text-only messages (Kind 14) and file messages (Kind 15) even when both appear in the same conversation.
