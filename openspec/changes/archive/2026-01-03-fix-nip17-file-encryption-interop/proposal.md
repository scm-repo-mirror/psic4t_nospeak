# Change: Fix NIP-17 Kind 15 file message encryption interoperability

## Why
NIP-17 Kind 15 file messages sent from Amethyst could not be decrypted by nospeak, and vice versa. The error messages ("AES key data must be 128 or 256 bits" on Chrome, "Data provided to an operation does not meet requirements" on Firefox) indicated an encoding mismatch for the `decryption-key` and `decryption-nonce` tags.

## What Changes
- **Receiving**: Add support for hex-encoded keys/nonces (used by Amethyst) in addition to base64url
- **Sending**: Change key/nonce encoding from base64url to hex for interoperability
- **Sending**: Change nonce size from 12 bytes to 16 bytes (Amethyst format)
- **Sending**: Upload encrypted blobs with `application/octet-stream` content type so Blossom servers return `.bin` URLs
- Update spec to explicitly document the encoding format for encryption parameters

## Impact
- Affected specs: messaging
- Affected code: `src/lib/core/FileEncryption.ts`, `src/lib/core/Messaging.ts`
