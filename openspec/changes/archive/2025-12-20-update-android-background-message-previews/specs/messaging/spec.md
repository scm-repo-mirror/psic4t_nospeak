## MODIFIED Requirements

### Requirement: Local Message Notifications for New Messages
When message notifications are enabled for the current device and the platform has granted notification permission, the messaging experience SHALL surface user-visible notifications for newly received messages using the platform-appropriate mechanism (browser notifications on web, OS-level notifications in the Android app) while the application is running.

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

### Requirement: Local Notifications for Message Reactions
When message notifications are enabled for the current device and the platform has granted notification permission, the messaging experience SHALL surface foreground notifications for newly received NIP-25 `kind 7` reactions on NIP-17 encrypted direct messages using the same channels, suppression rules, and navigation semantics as existing message notifications, while continuing to keep reactions out of the visible chat message list.

#### Scenario: Web browser shows notification for reaction in different or inactive conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings → General
- **AND** the browser has granted notification permission
- **AND** either the nospeak window is not the active, focused foreground tab or the user is currently viewing an open conversation with Contact A
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received from Contact B (a different conversation) and processed by the messaging pipeline
- **THEN** the system SHALL display a browser notification indicating that Contact B reacted to the user's message (for example, including the sender name and reaction emoji when available)
- **AND** activating the notification SHALL keep or bring the nospeak window to the foreground and navigate to the conversation with Contact B.

#### Scenario: Web browser suppresses reaction notification for active conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings → General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is visible and focused
- **AND** the user is currently viewing an open conversation with Contact C
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received from Contact C and processed by the messaging pipeline
- **THEN** the system SHALL NOT display a browser notification for that reaction
- **AND** the reaction SHALL still be rendered under the corresponding message and SHALL update unread indicators according to the reaction unread requirements.

#### Scenario: Android app shows local notification for reaction via background service
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **AND** Android background messaging is enabled and the native foreground service for background messaging is active
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received while the app UI is not visible
- **THEN** the native foreground service SHALL emit an Android OS notification for the new reaction
- **AND** the notification body SHALL include a short reaction preview (for example, `Reaction: ❤️`)
- **AND** activating the notification SHALL bring the nospeak Android app to the foreground and navigate to the conversation with that sender.

#### Scenario: Reaction notifications suppressed when disabled or permission missing
- **GIVEN** either message notifications are disabled in Settings → General for the current device or the platform has denied notification permission
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received
- **THEN** the system SHALL NOT show a browser or Android OS notification for that reaction
- **AND** the rest of the messaging behavior for reactions (storage and in-app display under messages, and unread indicators) SHALL continue to function normally.

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

#### Scenario: Background delivery suppresses self-authored message and reaction rumors
- **GIVEN** the same background messaging setup as above
- **WHEN** a gift-wrapped event is delivered whose decrypted inner rumor is authored by the current user
- **THEN** the native service SHALL NOT raise an Android OS message/reaction notification for that event
- **AND** it SHALL continue to maintain relay subscriptions as long as background messaging remains enabled.

#### Scenario: Background delivery groups message and reaction activity per conversation
- **GIVEN** background messaging is enabled and the native foreground service is active
- **AND** the service has already raised a notification for conversation activity with Contact A
- **WHEN** additional message or reaction gift-wrap events for Contact A are delivered while the app UI is not visible
- **THEN** the native service SHALL update a single grouped notification entry for Contact A (rather than creating a new notification per event)
- **AND** the grouped notification SHALL represent combined message and reaction activity.

#### Scenario: Background delivery respects notification settings and permissions
- **GIVEN** the user is running nospeak in the Android app, and the native background messaging service is active
- **WHEN** message notifications are disabled in Settings → General for the current device, or Android has denied local notification permission
- **THEN** the native background messaging service SHALL continue to maintain relay subscriptions as long as background messaging remains enabled
- **AND** it SHALL NOT surface OS notifications for new messages or reactions while notifications are disabled or permission is denied.

### Requirement: Background Messaging Covers Reaction Gift-Wrap Events
When running inside the Android Capacitor app shell with background messaging enabled, the Android-native foreground service responsible for background messaging SHALL handle gift-wrapped events whose inner rumor is a NIP-25 `kind 7` reaction and SHALL surface an Android OS notification preview for them when decryption is available.

#### Scenario: Background service raises reaction preview notification for reaction gift-wrap
- **GIVEN** the user is logged in, has enabled background messaging in Settings → General, and is running inside the Android Capacitor app shell
- **AND** the native Android foreground service for background messaging is active and subscribed to NIP-17 DM gift-wrapped events addressed to the user
- **AND** message notifications are enabled and Android has granted local notification permission
- **WHEN** a gift-wrapped event is delivered from any configured read relay whose decrypted inner rumor is a NIP-25 `kind 7` reaction authored by another user
- **THEN** the native service SHALL raise an Android OS notification whose body includes a short reaction preview (for example, `Reaction: ❤️`)
- **AND** it SHALL include this activity in the same per-conversation grouping used for other background message notifications.
