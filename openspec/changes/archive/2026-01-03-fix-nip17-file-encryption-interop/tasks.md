## 1. Implementation

- [x] 1.1 Add hex decoding support for `decryption-key` and `decryption-nonce` tags in `FileEncryption.ts`
- [x] 1.2 Add auto-detection logic to determine if key/nonce is hex or base64url encoded
- [x] 1.3 Add key size validation (128 or 256 bits) with descriptive error messages
- [x] 1.4 Change nonce generation from 12 bytes to 16 bytes for Amethyst compatibility
- [x] 1.5 Change key/nonce output encoding from base64url to hex
- [x] 1.6 Update `uploadEncryptedMedia()` to use `application/octet-stream` content type

## 2. Testing

- [x] 2.1 Write unit tests for hex decoding helper functions
- [x] 2.2 Write unit tests for base64url decoding
- [x] 2.3 Write unit tests for auto-detection of encoding format
- [x] 2.4 Write unit tests for 16-byte nonce support
- [x] 2.5 Write unit tests for AES-128 and AES-256 key support
- [x] 2.6 Write unit tests for key validation error handling
- [x] 2.7 Write unit tests for encryption output format (hex, 16-byte nonce)

## 3. Validation

- [x] 3.1 Run `npm run check` - passed with 0 errors
- [x] 3.2 Run `npx vitest run` - all 187 tests passed
- [x] 3.3 Manual test: Receive encrypted file from Amethyst - works
- [x] 3.4 Manual test: Send encrypted file to Amethyst - works
