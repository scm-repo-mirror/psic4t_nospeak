# Change: Add Android Direct Share Targets

## Why
Currently, when sharing content to nospeak from another Android app, users must select nospeak from the share sheet and then manually pick a contact. WhatsApp and other messaging apps show frequently-contacted users directly in the Android share sheet, allowing one-tap sharing to specific conversations. This is a standard Android UX pattern that significantly reduces friction for sharing content.

## What Changes
- Add Android Sharing Shortcuts that appear directly in the system share sheet
- Display the 4 most recently active contacts as direct share targets
- Update shortcuts on app startup and when notifications arrive
- Handle direct share intents to bypass the contact picker and navigate directly to the target conversation

## Impact
- Affected specs: `android-app-shell`
- Affected code:
  - New: `android/app/src/main/res/xml/shortcuts.xml`
  - New: `AndroidSharingShortcutsPlugin.java` (Capacitor plugin)
  - New: `src/lib/core/AndroidSharingShortcuts.ts`
  - Modified: `AndroidManifest.xml` (add shortcuts meta-data)
  - Modified: `NativeBackgroundMessagingService.java` (add sharing categories to shortcuts)
  - Modified: `AndroidShareTargetPlugin.java` (extract shortcut ID from intent)
  - Modified: `MainActivity.java` (register new plugin)
  - Modified: `src/routes/+layout.svelte` (publish shortcuts on startup)
  - Modified: `src/lib/stores/androidShare.ts` (handle target conversation ID)
