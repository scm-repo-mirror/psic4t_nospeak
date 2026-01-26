## ADDED Requirements

### Requirement: Android Direct Share Targets
When running inside the Android Capacitor app shell on Android 10 (API 29) or higher, the nospeak client SHALL publish Sharing Shortcuts for the user's most recently active contacts so that these contacts appear directly in the Android system share sheet. Selecting a contact from the share sheet SHALL navigate directly to that conversation with the shared content ready to send, bypassing the contact picker.

#### Scenario: Direct share contacts appear in Android share sheet
- **GIVEN** the nospeak Android app is installed on a device running Android 10 or higher
- **AND** the user is logged in and has at least one conversation with recent activity
- **AND** another Android app offers a "Share" action for supported content (image, video, audio, or text)
- **WHEN** the user opens the Android share sheet
- **THEN** up to 4 nospeak contacts SHALL appear as direct share targets in the share sheet
- **AND** each contact SHALL display the contact's display name and avatar (when cached)
- **AND** contacts SHALL be ordered by most recent activity (matching the chat list order).

#### Scenario: Selecting direct share contact navigates to conversation
- **GIVEN** the nospeak Android app is installed and the user is logged in
- **AND** another Android app offers a "Share" action for a single image, video, audio file, or text/URL
- **WHEN** the user selects a nospeak contact directly from the Android share sheet (not the nospeak app icon)
- **THEN** the nospeak app SHALL open or be brought to the foreground
- **AND** it SHALL navigate directly to the conversation with the selected contact
- **AND** it SHALL NOT navigate to the contact list or require the user to select a contact again
- **AND** for media shares, it SHALL open the single-file media send preview with the shared media loaded
- **AND** for text/URL shares, it SHALL pre-fill the message input with the shared text.

#### Scenario: Sharing shortcuts update on app startup
- **GIVEN** the nospeak Android app is installed and the user is logged in
- **WHEN** the app starts and completes authentication restore
- **THEN** the app SHALL publish Sharing Shortcuts for up to 4 contacts with the most recent `lastActivityAt` timestamps
- **AND** the shortcuts SHALL include the sharing target category required by the `shortcuts.xml` configuration.

#### Scenario: Sharing shortcuts update when notifications arrive
- **GIVEN** the nospeak Android app background messaging service is running
- **AND** a new message notification is received and processed
- **WHEN** the service creates or updates a conversation shortcut for the notification
- **THEN** the shortcut SHALL include the sharing target category so it appears in the share sheet
- **AND** the shortcut SHALL be long-lived to remain eligible as a direct share target.

#### Scenario: Direct share gracefully degrades on older Android versions
- **GIVEN** the nospeak Android app is installed on a device running Android 9 (API 28) or lower
- **WHEN** the user shares content to nospeak from another app
- **THEN** the app SHALL use the existing inbound share flow that navigates to the contact list
- **AND** the app SHALL NOT crash or display errors related to Sharing Shortcuts
- **AND** the user SHALL still be able to share content by selecting a contact from the list.

#### Scenario: Direct share with no cached profile uses fallback display
- **GIVEN** the nospeak Android app is installed and the user is logged in
- **AND** a contact has recent activity but no cached profile data (name or avatar)
- **WHEN** the app publishes Sharing Shortcuts
- **THEN** the shortcut for that contact SHALL use a fallback display name (such as a truncated npub)
- **AND** the shortcut MAY omit the avatar icon or use a placeholder
- **AND** the shortcut SHALL still function correctly for direct sharing.
