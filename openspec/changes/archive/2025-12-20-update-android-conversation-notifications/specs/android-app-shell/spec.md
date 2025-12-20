## MODIFIED Requirements

### Requirement: Android Background Messaging Foreground Service
The Android Capacitor app shell SHALL provide a background messaging mode that keeps the user's read relays connected while the app UI is not visible by running the messaging stack inside a native Android foreground service that is started and controlled via a dedicated Capacitor plugin. When the current session uses an external signer such as Amber, this native service SHALL decrypt gift-wrapped messages via the signer integration and raise OS notifications that include short plaintext previews for messages and reactions.

#### Scenario: Native foreground service emits preview notifications and routes taps
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell and has enabled background messaging
- **AND** the native foreground service is active
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a new gift-wrapped message or reaction addressed to the current user is delivered from any configured read relay while the app UI is not visible
- **THEN** the native foreground service SHALL attempt to decrypt the gift-wrap using the active signer integration when available
- **AND** it SHALL raise an Android OS notification that includes a short preview (for example, a truncated plaintext message preview or `Reaction: ❤️`) when the device is unlocked
- **AND** it SHALL group notification entries per conversation and combine message + reaction activity
- **AND** when a locally cached contact identity exists for the sender public key, it SHOULD use the cached **username** as the notification title
- **AND** when a locally cached avatar URL exists for that sender, it SHOULD display the corresponding avatar as the conversation icon on a best-effort basis
- **AND** activating the notification SHALL open the nospeak app and navigate to the corresponding chat conversation
- **AND** the username used for this title SHALL be derived strictly from Nostr kind `0` metadata field `name` (it SHALL NOT use `display_name`)
- **AND** the native service SHALL NOT subscribe to Nostr kind `0` metadata events to obtain this identity (it relies on local cache only)

#### Scenario: Android 11+ conversation icon uses dynamic shortcut
- **GIVEN** the user receives a background message notification on an Android 11+ device
- **WHEN** the native service raises the OS notification for the corresponding chat
- **THEN** the service SHALL publish or update a dynamic shortcut for that conversation using a stable identifier derived from the partner public key (for example `chat_<partnerPubkeyHex>`)
- **AND** it SHALL bind the notification to that shortcut identifier so Android can render a conversation icon
- **AND** the shortcut intent SHOULD be uniquely addressable per conversation (for example `ACTION_VIEW` with `nospeak://chat/<partnerPubkeyHex>`), while still routing into the app’s chat screen
- **AND** when an avatar bitmap is available for the contact, it SHOULD be used as the shortcut icon

#### Scenario: Lockscreen shows contact name but redacts preview text
- **GIVEN** the user receives a background message notification while the device is locked
- **WHEN** the OS renders the notification on the lockscreen with sensitive content hidden
- **THEN** the notification SHALL display the contact name as the title
- **AND** it SHALL NOT display the plaintext message preview on the lockscreen
- **AND** it SHALL still route taps to the correct chat conversation.

#### Scenario: Shortcut failures do not suppress notifications
- **GIVEN** a background message notification is raised
- **WHEN** Android rejects conversation shortcut publication or shortcut binding (for example due to OEM limits or rate limiting)
- **THEN** the service SHALL still post a message notification to the message notification channel
- **AND** it SHOULD fall back to displaying the contact avatar as a large icon when available.

#### Scenario: Notification channel settings persist across updates
- **GIVEN** the user has customized the Android notification channel settings for background message notifications (for example sound or vibration)
- **WHEN** the app is restarted or updated
- **THEN** the app SHALL NOT delete or recreate the existing channel solely to apply defaults
- **AND** the user’s channel customizations SHALL remain in effect.
