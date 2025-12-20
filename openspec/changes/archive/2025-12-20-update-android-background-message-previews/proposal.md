# Change: Improve Android background messaging notifications

## Why
Android background messaging currently raises only generic "new encrypted message" notifications and does not route taps into the relevant conversation. In practice this yields a poor user experience (no preview, no reaction info, no deep link) and can also lead to duplicate notifications when both the web runtime and the native foreground service attempt to notify.

The goal is to provide high-quality Android OS notifications (plaintext previews, reaction previews, and correct chat routing) while keeping the current trust model and limiting scope to **Amber-only** (NIP-55 external signer) for decryption.

## What Changes
- The Android background messaging native foreground service will decrypt NIP-17 gift-wraps via Amber (NIP-55 content provider) and show **plaintext previews**.
- The service will generate notifications only for messages/reactions **not authored by the current user** (by checking the decrypted rumor pubkey).
- Notifications will be **grouped per conversation** and combine message + reaction activity into a single per-partner notification.
- Notification taps will **route to the correct `/chat/<npub>` conversation**.
- When Android background messaging is enabled, Android notifications will be **outsourced to the native service**; app-side Android local notifications are used only when background messaging is disabled.
- Background notification delivery reliability will improve via EOSE timeout fallback and persistent dedupe across service restarts.

## Impact
- Affected specs:
  - `specs/messaging/spec.md`
  - `specs/android-app-shell/spec.md`
  - `specs/settings/spec.md`
- Affected code (implementation stage):
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java`
  - `android/app/src/main/java/com/nospeak/app/AndroidBackgroundMessagingPlugin.java`
  - `android/app/src/main/java/com/nospeak/app/AndroidBackgroundMessagingPrefs.java`
  - `android/app/src/main/java/com/nospeak/app/MainActivity.java`
  - `src/lib/core/NotificationService.ts`
  - `src/routes/+layout.svelte`

