# Change: Add NIP-42 Authentication to Android Native Background Messaging Service

## Why

The Android native background messaging service (`NativeBackgroundMessagingService.java`) maintains its own WebSocket connections to relays, separate from the WebView. When a user's only non-authenticated relay goes offline, the native service cannot receive messages from authenticated relays because it ignores `AUTH` challenges and `CLOSED` messages with `auth-required:` reasons. This causes Android users to stop receiving background notifications until they manually reload the app.

The WebView-based `ConnectionManager.ts` already implements NIP-42 authentication as specified in `relay-management` and `messaging` specs, but the Android native service lacks equivalent functionality.

## What Changes

- The Android native foreground service SHALL handle NIP-42 `AUTH` challenges from relays
- The service SHALL handle `CLOSED` messages with `auth-required:` reasons by authenticating and re-subscribing
- The service SHALL handle `OK` messages to confirm authentication success
- The service SHALL sign kind 22242 AUTH events using either:
  - Local Schnorr signing when in `nsec` mode (using existing BouncyCastle dependency)
  - Amber ContentResolver when in `amber` mode (using existing NIP-55 integration)
- The service SHALL retry authentication once after failure (with 5-second delay)
- The Amber permission request SHALL include kind 22242 for background AUTH signing

## Impact

- Affected specs: `android-app-shell`
- Affected code:
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java` - Add NIP-42 message handling, auth state tracking, event signing
  - `android/app/src/main/java/com/nospeak/app/AndroidNip55SignerPlugin.java` - Add kind 22242 to Amber permission request
