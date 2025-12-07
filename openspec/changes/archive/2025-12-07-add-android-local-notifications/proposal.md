# Change: Add Android local notifications for messaging

## Why
We currently expose a notifications toggle under Settings  General that controls browser notifications via the Web Notifications API, but this toggle is effectively non-functional inside the Android Capacitor app because the embedded WebView does not behave like a standard browser and cannot rely on push delivery. To provide a reliable experience for Android users while keeping nospeak as a fetch-only tool, we need a local, non-push notification mechanism that integrates with the existing messaging and settings behavior.

## What Changes
- Integrate a local notification mechanism for the Android Capacitor app using `@capacitor/local-notifications`, triggered by the existing messaging flows when new messages are fetched for the current user.
- Update the Settings  General notifications option so that it consistently represents a per-device "message notifications" preference on both web and Android, including requesting and reflecting OS-level permissions where applicable.
- Define messaging-level requirements for when new-message notifications are shown, what content they display, and how activating a notification routes the user back into the appropriate conversation on both web and Android.
- Extend the Android app shell capability to cover how local notifications are wired into the Capacitor runtime, including permission handling, channel configuration, and safe fallbacks when the plugin or permission is unavailable.

## Impact
- Affected specs: `messaging`, `settings`, `android-app-shell`.
- Affected code: notification flows in `src/lib/core/NotificationService.ts`, settings UI and persistence in `src/lib/components/SettingsModal.svelte`, Android Capacitor configuration and native project under `android/`, and any message delivery hooks that decide when to surface a notification.
