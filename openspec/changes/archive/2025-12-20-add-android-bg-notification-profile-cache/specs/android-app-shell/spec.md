## MODIFIED Requirements

### Requirement: Android Background Messaging Foreground Service
The Android Capacitor app shell SHALL provide a background messaging mode that keeps the user's read relays connected while the app UI is not visible by running the messaging stack inside a native Android foreground service that is started and controlled via a dedicated Capacitor plugin. When the current session uses an external signer such as Amber, this native service SHALL decrypt gift-wrapped messages via the signer integration and raise OS notifications that include short plaintext previews for messages and reactions.

#### Scenario: Native foreground service emits preview notifications and routes taps
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell and has enabled background messaging
- **AND** the native foreground service is active
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a new gift-wrapped message or reaction addressed to the current user is delivered from any configured read relay while the app UI is not visible
- **THEN** the native foreground service SHALL attempt to decrypt the gift-wrap using the active signer integration when available
- **AND** it SHALL raise an Android OS notification that includes a short preview (for example, a truncated plaintext message preview or `Reaction: ❤️`)
- **AND** it SHALL group notification entries per conversation and combine message + reaction activity
- **AND** when a locally cached contact identity exists for the sender public key, it SHOULD use the cached **username** as the notification title
- **AND** when a locally cached avatar URL exists for that sender, it SHOULD display the corresponding avatar as the notification large icon on a best-effort basis
- **AND** the username used for this title SHALL be derived strictly from Nostr kind `0` metadata field `name` (it SHALL NOT use `display_name`)
- **AND** the native service SHALL NOT subscribe to Nostr kind `0` metadata events to obtain this identity (it relies on local cache only)
- **AND** activating the notification SHALL open the nospeak app and navigate to the corresponding chat conversation.
