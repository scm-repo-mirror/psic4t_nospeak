## MODIFIED Requirements

### Requirement: Android Background Message Delivery
When running inside the Android Capacitor app shell with background messaging enabled, the messaging experience on Android SHALL delegate background message reception and notification to a native foreground service that connects to the user's read relays, subscribes to gift-wrapped messages, and triggers OS notifications even while the WebView is suspended.

#### Scenario: Background subscriptions deliver plaintext previews on Android
- **GIVEN** the user is logged in and has enabled background messaging in Settings → General while running inside the Android Capacitor app shell
- **AND** the native Android foreground service for background messaging is active
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a new gift-wrapped message addressed to the current user is delivered from any configured read relay while the app UI is not visible
- **THEN** the native service SHALL attempt to decrypt the gift-wrap using the active Android signer integration
- **AND** when the inner rumor is a Kind 14 text message authored by another user, it SHALL raise an Android OS notification whose body includes a truncated plaintext preview
- **AND** when the inner rumor is a Kind 15 file message authored by another user, it SHALL raise an Android OS notification whose body includes the phrase `Message: Sent you an attachment`
- **AND** when decryption is not available or fails, it SHALL instead raise a generic notification that indicates a new encrypted message has arrived.

#### Scenario: Background notifications show cached sender identity when available
- **GIVEN** the same background messaging setup as above
- **AND** the web runtime has previously resolved and cached the sender's Nostr kind `0` metadata on this Android installation
- **WHEN** the native background messaging service raises an Android OS notification for conversation activity from that sender
- **THEN** it SHOULD use the cached **username** derived from kind `0.name` as the notification title
- **AND** it SHOULD display the cached avatar derived from kind `0.picture` as the notification large icon on a best-effort basis
- **AND** it SHALL fall back to existing generic notification titling when no cached username is available
- **AND** it SHALL NOT subscribe to kind `0` metadata events from relays as part of notification emission.
