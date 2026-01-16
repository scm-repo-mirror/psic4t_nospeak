## 1. Add NIP-42 State Tracking

- [x] 1.1 Add auth state fields to `NativeBackgroundMessagingService` (challenge map, auth status map, pending auth event IDs)
- [x] 1.2 Add `socketToRelay` map to associate WebSocket instances with relay URLs
- [x] 1.3 Update `connectRelay()` to initialize auth state and populate `socketToRelay`
- [x] 1.4 Update `onSocketClosedOrFailed()` to clear auth state for disconnected relay

## 2. Extend Message Handling

- [x] 2.1 Change `handleNostrMessage` signature to accept relay URL parameter
- [x] 2.2 Update WebSocket listener to pass relay URL to message handler
- [x] 2.3 Add `AUTH` message parsing to store challenge per relay
- [x] 2.4 Add `CLOSED` message parsing to detect `auth-required:` and trigger auth flow
- [x] 2.5 Add `OK` message parsing to handle auth event confirmation

## 3. Implement AUTH Event Building

- [x] 3.1 Add `buildAuthEvent(relayUrl, challenge)` method to create unsigned kind 22242 event
- [x] 3.2 Add `serializeEventForId(event)` method for NIP-01 event serialization
- [x] 3.3 Add `sha256(bytes)` utility method
- [x] 3.4 Add `bytesToHex(bytes)` utility method

## 4. Implement Event Signing

- [x] 4.1 Add `schnorrSign(message, privateKey)` method using BouncyCastle for nsec mode
- [x] 4.2 Add `bigIntTo32Bytes(val)` and `xorBytes(a, b)` helper methods
- [x] 4.3 Add `localSignEvent(unsignedEventJson)` method for nsec mode
- [x] 4.4 Add `amberSignEvent(unsignedEventJson)` method using ContentResolver for amber mode
- [x] 4.5 Add `signEvent(unsignedEventJson)` dispatcher that routes to correct signer

## 5. Implement Auth Flow

- [x] 5.1 Add `attemptAuthentication(relayUrl, socket)` method
- [x] 5.2 Add `handleAuthResponse(relayUrl, socket, success)` method
- [x] 5.3 Add `scheduleAuthRetry(relayUrl)` method with 5-second delay
- [x] 5.4 Add `resubscribeToRelay(relayUrl, socket)` method to re-send REQ after auth

## 6. Update Amber Permissions

- [x] 6.1 Add kind 22242 to Amber permission request in `AndroidNip55SignerPlugin.java`

## 7. Validation

- [x] 7.1 Build Android app and verify no compilation errors (pre-existing Capacitor plugin issue, Java code compiles)
- [x] 7.2 Run `npm run check` to verify TypeScript changes pass (pre-existing StatusBar error unrelated)
- [x] 7.3 Run `npx vitest run` to verify existing tests pass (210 tests pass)
