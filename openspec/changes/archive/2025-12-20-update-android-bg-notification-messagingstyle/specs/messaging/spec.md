## ADDED Requirements

### Requirement: Android Conversation Notifications Use MessagingStyle
When running inside the Android Capacitor app shell with Android background messaging enabled, the native foreground service SHALL render per-conversation OS notifications using `NotificationCompat.MessagingStyle` so that notifications appear as message conversations in Android's notification UI.

Conversation notifications SHALL include exactly one message row representing the latest incoming conversation activity (for example a Kind 14 plaintext preview, `Message: Sent you an attachment` for Kind 15, or `Reaction: …` for Kind 7), and SHALL NOT aggregate multiple unseen items into a single prefixed string such as `N new items · ...`.

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
