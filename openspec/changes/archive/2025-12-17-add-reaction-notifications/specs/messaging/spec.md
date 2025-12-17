## ADDED Requirements
### Requirement: Reactions Drive Unread Indicators
Incoming NIP-25 `kind 7` reactions associated with NIP-17 encrypted direct messages SHALL be treated as conversation activity for the purposes of contact unread indicators, without being promoted to standalone chat message bubbles.

#### Scenario: New reaction from inactive contact shows unread indicator
- **GIVEN** the user is viewing the contact list
- **AND** the user is NOT currently viewing an open conversation with Contact A
- **AND** Contact A has at least one existing NIP-17 encrypted direct message with the user
- **WHEN** a new NIP-25 `kind 7` reaction from Contact A targeting one of these messages is received and processed
- **THEN** the system SHALL update Contact A's activity state so that the unread indicator (green dot) appears next to Contact A in the contact list
- **AND** this indicator SHALL remain until the user views Contact A's conversation and it is marked as read according to existing messaging requirements.

#### Scenario: Reaction from current conversation does not create unread indicator
- **GIVEN** the user is actively viewing an open conversation with Contact B
- **WHEN** a new NIP-25 `kind 7` reaction from Contact B targeting a message in that same conversation is received and processed
- **THEN** the system SHALL render the reaction under the target message as defined by existing reaction requirements
- **AND** it SHALL NOT create or leave a persistent unread indicator for Contact B once the conversation view has been refreshed.

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

#### Scenario: Android app shows local notification for reaction in background or different conversation
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **AND** either the app UI is not visible or the user is viewing an open conversation with Contact D
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received from Contact E (a different conversation) and processed while the app is running
- **THEN** the system SHALL display an Android OS notification for the new reaction using the configured messages notification channel and icon
- **AND** activating the notification SHALL bring the nospeak Android app to the foreground and navigate to the conversation with Contact E.

#### Scenario: Reaction notifications suppressed when disabled or permission missing
- **GIVEN** either message notifications are disabled in Settings → General for the current device or the platform has denied notification permission
- **WHEN** a new NIP-25 `kind 7` reaction addressed to the current user is received and processed by the messaging pipeline
- **THEN** the system SHALL NOT show a browser or Android local notification for that reaction
- **AND** the rest of the messaging behavior for reactions (storage and in-app display under messages, and unread indicators) SHALL continue to function normally.

### Requirement: Background Messaging Covers Reaction Gift-Wrap Events
When running inside the Android Capacitor app shell with background messaging enabled, the Android-native foreground service responsible for background messaging SHALL treat gift-wrapped events whose inner rumor is a NIP-25 `kind 7` reaction as opaque encrypted messages and SHALL surface generic encrypted-message notifications for them using the same channel and policy as for other NIP-17 gift-wrapped messages, without learning or exposing the reaction details.

#### Scenario: Background service raises generic notification for reaction gift-wrap
- **GIVEN** the user is logged in, has enabled background messaging in Settings → General, and is running inside the Android Capacitor app shell
- **AND** the native Android foreground service for background messaging is active and subscribed to NIP-17 DM gift-wrapped events addressed to the user
- **WHEN** a gift-wrapped event is delivered from any configured read relay whose inner rumor is a NIP-25 `kind 7` reaction involving the current user
- **THEN** the native service SHALL treat this event as an opaque encrypted message
- **AND** SHALL raise a generic Android OS notification for a new encrypted message using the same notification channel and wording used for other background DM gift-wraps
- **AND** the user SHALL only see the decrypted sender, message, and reaction details after returning to the app and allowing the foreground messaging pipeline to process the event.
