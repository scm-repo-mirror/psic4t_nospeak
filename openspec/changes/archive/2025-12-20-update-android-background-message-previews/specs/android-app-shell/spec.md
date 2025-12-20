## MODIFIED Requirements

### Requirement: Android Background Messaging Foreground Service
The Android Capacitor app shell SHALL provide a background messaging mode that keeps the user's read relays connected while the app UI is not visible by running the messaging stack inside a native Android foreground service that is started and controlled via a dedicated Capacitor plugin. When the current session uses an external signer such as Amber, this native service SHALL decrypt gift-wrapped messages via the signer integration and raise OS notifications that include short plaintext previews for messages and reactions.

#### Scenario: Native foreground service keeps relay connections active
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the user has enabled background messaging in Settings → General
- **AND** the app is in a session where relay configuration and the user's public key are known
- **WHEN** the user backgrounds the app (for example, by switching to another app or returning to the home screen)
- **THEN** the app SHALL start or maintain a native Android foreground service that keeps WebSocket connections to the user's configured read relays active
- **AND** the native service SHALL reuse the same real-time subscription semantics defined in the `messaging` spec for receiving gift-wrapped messages for the current user.

#### Scenario: Native foreground service emits preview notifications and routes taps
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell and has enabled background messaging
- **AND** the native foreground service is active
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a new gift-wrapped message or reaction addressed to the current user is delivered from any configured read relay while the app UI is not visible
- **THEN** the native foreground service SHALL attempt to decrypt the gift-wrap using the active signer integration when available
- **AND** it SHALL raise an Android OS notification that includes a short preview (for example, a truncated plaintext message preview or `Reaction: ❤️`)
- **AND** it SHALL group notification entries per conversation and combine message + reaction activity
- **AND** activating the notification SHALL open the nospeak app and navigate to the corresponding chat conversation.

#### Scenario: Native foreground service suppresses self-authored activity
- **GIVEN** the same background messaging setup as above
- **WHEN** a gift-wrapped event is delivered whose decrypted inner rumor is authored by the current user
- **THEN** the native foreground service SHALL NOT raise an Android OS message/reaction notification for that event.

#### Scenario: Background messaging stops when disabled or user signs out
- **GIVEN** background messaging is currently active for the Android app
- **WHEN** the user either signs out of nospeak, disables background messaging in Settings → General, or the app determines that required background execution privileges are no longer available
- **THEN** the app SHALL stop the native background messaging foreground service
- **AND** it SHALL close the associated relay connections
- **AND** it SHALL remove the persistent foreground notification associated with background messaging.
