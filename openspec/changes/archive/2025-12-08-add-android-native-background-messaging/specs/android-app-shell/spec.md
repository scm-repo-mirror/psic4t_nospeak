## MODIFIED Requirements
### Requirement: Android Background Messaging Foreground Service
The Android Capacitor app shell SHALL provide a background messaging mode that keeps the user's read relays connected while the app UI is not visible by running the messaging stack inside a native Android foreground service that is started and controlled via a dedicated Capacitor plugin. This native service SHALL treat incoming gift-wrapped events as opaque envelopes and raise only generic "new encrypted message" notifications, regardless of whether the current session uses an on-device nsec or an external signer such as Amber.

#### Scenario: Native foreground service keeps relay connections active
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- AND the user has enabled background messaging in Settings → General
- AND the app is in a session where relay configuration and the user's public key are known
- WHEN the user backgrounds the app (for example, by switching to another app or returning to the home screen)
- THEN the app SHALL start or maintain a native Android foreground service that keeps WebSocket connections to the user's configured read relays active
- AND the native service SHALL reuse the same real-time subscription semantics defined in the `messaging` spec for receiving gift-wrapped messages for the current user.

#### Scenario: Native foreground service behavior is generic for nsec and Amber sessions
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell and has enabled background messaging
- AND the native foreground service is active
- WHEN a new gift-wrapped message addressed to the current user is delivered from any configured read relay while the app UI is not visible
- THEN the native foreground service SHALL treat the event as an opaque envelope
- AND it SHALL raise an Android OS notification that indicates a new encrypted message has arrived without revealing the sender's identity or message content
- AND this behavior SHALL be the same whether the session is using an on-device nsec or an external signer such as Amber.

#### Scenario: Background messaging stops when disabled or user signs out
- **GIVEN** background messaging is currently active for the Android app
- WHEN the user either signs out of nospeak, disables background messaging in Settings → General, or the app determines that required background execution privileges are no longer available
- THEN the app SHALL stop the native background messaging foreground service
- AND it SHALL close the associated relay connections
- AND it SHALL remove the persistent foreground notification associated with background messaging.
