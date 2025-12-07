## 1. Implementation
- [x] 1.1 Add `@capacitor/local-notifications` to the Android Capacitor project and configure a default "messages" notification channel with the nospeak Latte Lavender icon.
- [x] 1.2 Extend `NotificationService` with an Android adapter that uses `LocalNotifications` when `isAndroidNative()` is true, while preserving existing web notification behavior.
- [x] 1.3 Update `SettingsModal.svelte` to ensure the notifications toggle behaves correctly on Android (including requesting local notification permissions) and to keep the browser behavior unchanged.
- [x] 1.4 Wire new-message delivery points in the messaging flow to call the unified `notificationService` so both web and Android receive notifications when enabled.

## 2. Validation
- [x] 2.1 Add or update unit tests around `NotificationService` to cover environment detection and the Android adapter behavior (mocking the Capacitor plugin where necessary).
- [x] 2.2 Manually verify notifications on desktop web (supported browser) to confirm no regressions.
- [x] 2.3 Manually verify local notifications on an Android emulator and at least one physical device, including enabling/disabling via Settings and tapping notifications to open the correct conversation.
