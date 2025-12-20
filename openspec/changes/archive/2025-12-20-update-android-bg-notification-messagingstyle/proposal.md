# Change: Update Android background message notifications to MessagingStyle

## Why
Android background message notifications emitted by the native foreground service are currently rendered as a basic single-line notification (`setContentTitle`/`setContentText` with an optional large icon). On modern Android versions this presents like a generic app alert rather than a conversation, and it does not take advantage of OS messaging UI affordances (sender avatar/person, message row rendering, etc.).

Using `NotificationCompat.MessagingStyle` improves readability and consistency with platform expectations while keeping the existing privacy/security model (no new data sources, no new background fetching).

## What Changes
- Conversation notifications emitted by the Android background messaging native service SHALL migrate to `NotificationCompat.MessagingStyle`.
- Each conversation notification SHALL render only the latest incoming activity as a single `MessagingStyle.Message` (no multi-message history in notifications).
- Sender identity SHALL be represented with a `Person` whose icon is derived from the cached avatar bitmap when available.
- Existing notification routing behavior (tap → open the correct chat) SHALL remain unchanged.
- The generic "New encrypted message" notification (used when decryption or sender identity is unavailable) SHALL remain unchanged.
- The persistent foreground-service notification (health/relay status) SHALL remain unchanged.

## Impact
- Affected specs:
  - `messaging`
- Affected code (implementation stage):
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java`
  - Uses existing cached identity from `android/app/src/main/java/com/nospeak/app/AndroidProfileCachePrefs.java`
- Risks:
  - OEM notification UIs may render `MessagingStyle` differently; we will preserve `setContentTitle`/`setContentText` as a fallback.
  - Icon rendering depends on cached avatar availability; the system will remain best-effort and fall back gracefully.
