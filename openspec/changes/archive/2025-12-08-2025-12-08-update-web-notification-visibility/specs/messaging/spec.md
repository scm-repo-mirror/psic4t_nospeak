## MODIFIED Requirements
### Requirement: Local Message Notifications for New Messages
When message notifications are enabled for the current device and the platform has granted notification permission, the messaging experience SHALL surface user-visible notifications for newly received messages using the platform-appropriate mechanism (browser notifications on web, OS-level notifications in the Android app) while the application is running.

#### Scenario: Web browser shows new message notification
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings  General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is not the active, focused foreground tab (for example, the user has switched to another tab, minimized the window, or switched to another application or virtual desktop)
- **WHEN** a new message addressed to the current user is received and processed by the messaging pipeline
- **THEN** the system SHALL display a browser notification indicating a new message, including the sender name when available and a short message preview
- **AND** activating the notification SHALL focus the nospeak window and navigate to the conversation with that sender.

#### Scenario: Web browser shows notification for different active conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings  General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is visible and focused
- **AND** the user is currently viewing an open conversation with Contact A
- **WHEN** a new message addressed to the current user is received from Contact B (a different conversation) and processed by the messaging pipeline
- **THEN** the system SHALL display a browser notification indicating a new message from Contact B, including the sender name when available and a short message preview
- **AND** activating the notification SHALL keep or bring the nospeak window to the foreground and navigate to the conversation with Contact B.

#### Scenario: Web browser suppresses notification for active conversation
- **GIVEN** the user is accessing nospeak in a supported web browser
- **AND** message notifications are enabled in Settings  General
- **AND** the browser has granted notification permission
- **AND** the nospeak window is visible and focused
- **AND** the user is currently viewing an open conversation with Contact A
- **WHEN** a new message addressed to the current user is received from Contact A and processed by the messaging pipeline
- **THEN** the system SHALL NOT display a browser notification for that message
- **AND** the message SHALL still appear in the in-app conversation view and update unread indicators according to existing messaging requirements.

#### Scenario: Android app shows local notification for new message
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings  General
- **AND** the Android OS has granted permission for local notifications
- **WHEN** a new message addressed to the current user is received and processed while the app is in the background or not currently visible
- **THEN** the system SHALL display an Android OS notification for the new message using the configured messages notification channel and icon
- **AND** activating the notification SHALL bring the nospeak Android app to the foreground and navigate to the conversation with that sender.

#### Scenario: Notifications suppressed when disabled or permission missing
- **GIVEN** either message notifications are disabled in Settings  General for the current device or the platform has denied notification permission
- **WHEN** a new message is received and processed by the messaging pipeline
- **THEN** the system SHALL NOT show a browser or Android local notification for that message
- **AND** the rest of the messaging behavior (message storage and in-app display) SHALL continue to function normally.
