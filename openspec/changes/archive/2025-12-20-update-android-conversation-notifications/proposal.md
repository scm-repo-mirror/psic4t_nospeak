# Change: Conversation-style Android background notifications

## Why
Android background messaging notifications currently rely on a standard `MessagingStyle` notification with an optional `largeIcon`. This does not reliably surface the contact avatar as the system-level **conversation icon** on Android 11+, and the current notification channel management can overwrite user-customized channel settings when recreated.

We want Android notifications that look and behave like true conversations: prominent contact icon, correct conversation grouping, and lockscreen-safe presentation.

## What Changes
- Bind background message notifications to Android conversation shortcuts so Android 11+ can render a contact **conversation icon**.
- Treat background message notifications as **sensitive** on the lockscreen:
  - Show the contact name.
  - Redact message preview content.
  - Preserve full preview text in the unlocked notification shade.
- Make notification channel creation **idempotent** (create-if-missing) so user-customized channel settings (sound/vibration/badges) persist across app restarts and updates.
- Update avatar handling to refresh the conversation shortcut icon when an avatar becomes available.

## Non-Goals
- Inline reply or direct message sending from notification actions.
- Changing the underlying background messaging relay/decryption behavior.

## Impact
- Affected specs:
  - `android-app-shell`
- Affected code (implementation stage):
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java`
  - Potentially AndroidX dependencies for shortcut APIs
- User impact:
  - More prominent contact avatars (conversation icon) in notifications.
  - Safer lockscreen behavior (no message preview leakage).
  - Notification channel preferences no longer reset unexpectedly.
