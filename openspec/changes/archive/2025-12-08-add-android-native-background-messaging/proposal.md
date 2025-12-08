# Change: Add native Android background messaging

## Why
The current Android background messaging implementation relies on a WebView-based foreground service and a Capacitor foreground-service plugin. On real devices, this keeps the process and sockets nominally alive but does not reliably keep the JavaScript runtime active: new messages received while the UI is backgrounded are only decrypted and surfaced once the app returns to the foreground, at which point delayed notifications fire. In addition, the current design does not cleanly support Amber-based authorization, where nospeak never has direct access to the secret key.

We need a native Android component that can continue receiving messages and firing notifications while the WebView is suspended, without changing the trust model for Amber sessions. For this iteration, native background messaging will only ever produce generic "new encrypted message" notifications; rich sender/content previews remain a responsibility of the foreground web client when it is active.

## What Changes
- Replace the existing JS/WebView-based background messaging foreground-service design on Android with a native foreground service that connects to read relays, subscribes to gift-wrapped messages, and triggers OS notifications directly while the WebView is suspended.
- Keep background notifications generic for all authorization methods (nsec and Amber): the native service treats gift-wraps as opaque envelopes and only indicates that a new encrypted message arrived, without revealing sender or content.
- Introduce a dedicated Capacitor plugin/API for starting, updating, and stopping the native Android background messaging service, replacing the current Capawesome foreground-service dependency.
- Update `android-app-shell` and `messaging` specs so that:
  - Background delivery requirements are explicitly owned by the native service on Android.
  - The same generic envelope-notification behavior is used for both nsec and Amber sessions.
  - The web client remains the source of truth for message history and storage; the native service is notification-only.

## Impact
- Affected specs:
  - `android-app-shell`: background messaging foreground service, permissions, and app-shell behavior on Android.
  - `messaging`: Android-specific background delivery semantics and notification behavior for both nsec and Amber sessions.
- Affected code (later implementation phase):
  - Android: new native foreground service and Capacitor plugin; removal of the current Capawesome foreground-service plugin usage and obsolete custom background messaging plugin.
  - Web: `BackgroundMessaging` helper and Settings integration will change to call the new native plugin and to reflect that native background notifications are always generic.
