## MODIFIED Requirements

### Requirement: Mobile contacts last message preview
The mobile contacts list SHALL display a single-line preview of the most recent message under each contact's name when the viewport corresponds to a mobile-sized layout (for example, screen width <= 768px or a native mobile shell), using the latest stored message content for that contact. The preview SHALL be truncated when it does not fit in the available width and SHALL be omitted for contacts that have no stored messages. Desktop layouts (screen width > 768px) SHALL continue to display only the contact name and unread indicator without a message preview line.

When the most recent message is a media attachment (file message with a MIME type), the preview SHALL display a localized media-type label with an icon (for example `🎤 Voice Message`, `📷 Image`) instead of the raw file URL. When the most recent message is a location message (message with a `location` field), the preview SHALL display `📍` followed by a localized "Location" label instead of the raw `geo:` coordinate string.

#### Scenario: Mobile contacts list shows last message preview
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout (for example, screen width <= 768px or native mobile shell)
- **AND** Contact A has at least one stored message
- **WHEN** the contacts list is rendered
- **THEN** Contact A's row SHALL show their name as the primary text
- **AND** a secondary line under the name that displays a single-line truncated preview of the most recent message content for Contact A.

#### Scenario: No preview when contact has no messages
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout
- **AND** Contact B has no stored messages
- **WHEN** the contacts list is rendered
- **THEN** Contact B's row SHALL show their name and any unread indicator as currently specified
- **AND** SHALL NOT display an empty or placeholder last-message preview line.

#### Scenario: Desktop contacts list omits message preview
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a desktop-sized layout (screen width > 768px)
- **WHEN** the contacts list is rendered
- **THEN** each contact row SHALL display the contact name and unread indicator as currently specified
- **AND** SHALL NOT display a last-message preview line, even if stored messages exist for that contact.

#### Scenario: Location message shows localized label in preview
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout
- **AND** the most recent message from Contact C is a location message (has a `location` field with latitude and longitude)
- **WHEN** the contacts list is rendered
- **THEN** the preview line for Contact C SHALL display `📍` followed by the localized location label (for example "Location" in English, "Standort" in German)
- **AND** SHALL NOT display the raw `geo:lat,lng` coordinate string.

### Requirement: Local Message Notifications for New Messages
When message notifications are enabled for the current device and the platform has granted notification permission, the messaging experience SHALL surface user-visible notifications for newly received messages using the platform-appropriate mechanism (browser notifications on web, OS-level notifications in the Android app) while the application is running.

When the received message is a media attachment (file message with a MIME type), the notification body SHALL display a localized media-type label with an icon instead of the raw file URL. When the received message is a location message (message with a `location` field), the notification body SHALL display `📍` followed by a localized "Location" label instead of the raw `geo:` coordinate string.

#### Scenario: Web browser shows new message notification
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings → General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is not the active, focused foreground tab (for example, the user has switched to another tab, minimized the window, or switched to another application or virtual desktop)
- **WHEN** a new message addressed to the current user is received and processed by the messaging pipeline
- **THEN** the system SHALL display a browser notification indicating a new message, including the sender name when available and a short message preview
- **AND** activating the notification SHALL focus the nospeak window and navigate to the conversation with that sender.

#### Scenario: Web browser shows notification for different active conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings → General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is visible and focused
- **AND** the user is currently viewing an open conversation with Contact A
- **WHEN** a new message addressed to the current user is received from Contact B (a different conversation) and processed by the messaging pipeline
- **THEN** the system SHALL display a browser notification indicating a new message from Contact B, including the sender name when available and a short message preview
- **AND** activating the notification SHALL keep or bring the nospeak window to the foreground and navigate to the conversation with Contact B.

#### Scenario: Web browser suppresses notification for active conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings → General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is visible and focused
- **AND** the user is currently viewing an open conversation with Contact A
- **WHEN** a new message addressed to the current user is received from Contact A and processed by the messaging pipeline
- **THEN** the system SHALL NOT display a browser notification for that message
- **AND** the message SHALL still appear in the in-app conversation view and update unread indicators according to existing messaging requirements.

#### Scenario: Android app shows local notification for new message via background service
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **AND** Android background messaging is enabled and the native foreground service for background messaging is active
- **WHEN** a new message addressed to the current user is received while the app UI is not visible
- **THEN** the native foreground service SHALL emit an Android OS notification for the new message
- **AND** the notification body SHALL include a short plaintext preview when decryption via the active signer is available
- **AND** activating the notification SHALL bring the nospeak Android app to the foreground and navigate to the conversation with that sender.

#### Scenario: Android app uses JS-driven notifications only when background messaging disabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **AND** Android background messaging is disabled
- **WHEN** a new message addressed to the current user is received and processed while the app UI is not visible
- **THEN** the web runtime MAY emit an Android OS notification via the existing notification service
- **AND** this notification behavior SHALL remain eligible only while the web runtime is executing.

#### Scenario: Notifications suppressed when disabled or permission missing
- **GIVEN** either message notifications are disabled in Settings → General for the current device or the platform has denied notification permission
- **WHEN** a new message is received (regardless of whether it is processed by the web runtime or the Android background service)
- **THEN** the system SHALL NOT show a browser or Android OS notification for that message
- **AND** the rest of the messaging behavior (message storage and in-app display) SHALL continue to function normally.

#### Scenario: Location message notification shows localized label
- **GIVEN** message notifications are enabled and the platform has granted notification permission
- **AND** the user is not currently viewing the conversation with the sender
- **WHEN** a new location message (message with a `location` field) is received and processed by the messaging pipeline
- **THEN** the notification body SHALL display `📍` followed by the localized location label (for example "Location" in English, "Standort" in German)
- **AND** SHALL NOT display the raw `geo:lat,lng` coordinate string as the notification body.

### Requirement: Android Background Message Delivery
When running inside the Android Capacitor app shell with background messaging enabled, the messaging experience on Android SHALL delegate background message reception and notification to a native foreground service that connects to the user's read relays, subscribes to gift-wrapped messages, and triggers OS notifications even while the WebView is suspended.

#### Scenario: Background subscriptions deliver plaintext previews on Android
- **GIVEN** the user is logged in and has enabled background messaging in Settings → General while running inside the Android Capacitor app shell
- **AND** the native Android foreground service for background messaging is active
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a new gift-wrapped message addressed to the current user is delivered from any configured read relay while the app UI is not visible
- **THEN** the native service SHALL attempt to decrypt the gift-wrap using the active Android signer integration
- **AND** when the inner rumor is a Kind 14 text message authored by another user, it SHALL raise an Android OS notification whose body includes a truncated plaintext preview
- **AND** when the inner rumor is a Kind 14 location message (has a `location` tag or content starting with `geo:`) authored by another user, it SHALL raise an Android OS notification whose body is `📍 Location`
- **AND** when the inner rumor is a Kind 15 file message authored by another user, it SHALL raise an Android OS notification whose body includes the phrase `Message: Sent you an attachment`
- **AND** when the decrypted inner rumor is a NIP-25 `kind 7` reaction, it SHALL NOT raise an Android OS notification for that reaction
- **AND** when decryption is not available or fails, it SHALL NOT raise a generic "new encrypted message" notification.

#### Scenario: Background notifications show cached sender identity when available
- **GIVEN** the same background messaging setup as above
- **AND** the web runtime has previously resolved and cached the sender's Nostr kind `0` metadata on this Android installation
- **WHEN** the native background messaging service raises an Android OS notification for conversation activity from that sender
- **THEN** it SHOULD use the cached **username** derived from kind `0.name` as the notification title
- **AND** it SHOULD display the cached avatar derived from kind `0.picture` as the notification large icon on a best-effort basis
- **AND** it SHALL fall back to existing generic notification titling when no cached username is available
- **AND** it SHALL NOT subscribe to kind `0` metadata events from relays as part of notification emission.

### Requirement: Android Conversation Notifications Use MessagingStyle
When running inside the Android Capacitor app shell with Android background messaging enabled, the native foreground service SHALL render per-conversation OS notifications using `NotificationCompat.MessagingStyle` so that notifications appear as message conversations in Android's notification UI.

Conversation notifications SHALL include exactly one message row representing the latest incoming conversation activity (for example a Kind 14 plaintext preview, `📍 Location` for Kind 14 location messages, `Message: Sent you an attachment` for Kind 15, or `Reaction: …` for Kind 7), and SHALL NOT aggregate multiple unseen items into a single prefixed string such as `N new items · ...`.

When cached sender identity data is available on the device, the native service SHOULD represent the sender using a `Person` whose name is derived from the cached username and whose icon is derived from the cached avatar bitmap on a best-effort basis. When cached identity data is not available, the notification SHALL fall back to the existing generic conversation titling behavior.

#### Scenario: Android conversation notification renders latest activity as MessagingStyle
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** Android background messaging is enabled and the native foreground service for background messaging is active
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **WHEN** the native service raises an Android OS notification for conversation activity from a contact while the app UI is not visible
- **THEN** the notification SHALL be rendered using `NotificationCompat.MessagingStyle`
- **AND** the notification SHALL include exactly one `MessagingStyle.Message` whose text is the latest conversation activity preview
- **AND** when cached sender identity is available, the sender `Person` SHOULD use the cached username and cached avatar as its icon on a best-effort basis
- **AND** activating the notification SHALL bring the nospeak Android app to the foreground and navigate to the conversation with that sender.
