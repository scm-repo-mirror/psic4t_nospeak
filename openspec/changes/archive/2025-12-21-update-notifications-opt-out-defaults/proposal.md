# Change: Default Notifications and Background Messaging (Opt-out)

## Why
Notifications are a core part of the messaging UX, but today they default to off and Android exposes two toggles (message notifications + background messaging) whose relationship is unclear. This leads to missed notifications and confusion about which setting is actually responsible for delivering them.

## What Changes
- Default **Notifications** to enabled (opt-out) when a device has no stored preference.
- Default Android **Background Messaging** to enabled (opt-out) when a device has no stored preference.
- Prompt for OS notification permission once during an explicit, user-driven login action (not during silent restore).
- Rename the Settings label from “Message Notifications” to “Notifications”.
- Hide the Android Background Messaging toggle when Notifications are disabled.
- If the user disables Notifications, the app SHALL also disable Background Messaging and stop the Android foreground service.
- Prevent Android background messaging from auto-starting (including on boot/package replace) when Notifications are disabled.

## Impact
- Affected specs:
  - `openspec/specs/settings/spec.md`
  - `openspec/specs/android-app-shell/spec.md`
- Affected systems (implementation stage):
  - Settings UI state defaults + persistence (`nospeak-settings`)
  - Login flows (Android + web) for one-time permission prompting
  - Android background messaging boot/start guard
- Key implementation touchpoints (non-exhaustive; for later apply stage):
  - `src/lib/components/SettingsModal.svelte`
  - `src/lib/core/AuthService.ts`
  - `src/lib/core/NotificationService.ts`
  - `src/lib/core/BackgroundMessaging.ts`
  - `android/app/src/main/java/com/nospeak/app/AndroidBackgroundMessagingPrefs.java`
  - `src/lib/i18n/locales/en.ts`, `src/lib/i18n/locales/de.ts`
