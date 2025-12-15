# Change: Add swipe-to-close gesture for Android bottom sheets

## Why
The Android app shell now presents some dialogs, such as Settings and Manage Contacts, as bottom sheets anchored to the bottom of the screen. While this matches the visual design requirements, closing these sheets currently relies on tap targets (close/back buttons, tapping outside) or system back navigation only. On Android, users also expect to be able to grab the sheet and swipe down to dismiss it. Adding a simple, safe swipe-down-to-close gesture will make these bottom sheets feel more native and intuitive without changing their content or semantics.

## What Changes
- Introduce a swipe-down-to-close interaction for Android-only bottom sheets (for example, Settings and Manage Contacts) that allows users to drag the sheet downward from a designated handle or header area to dismiss it.
- Define minimal gesture behavior and thresholds so that a downward drag beyond a certain distance closes the sheet, while short or partial drags cause the sheet to snap back to its resting position.
- Ensure this gesture is scoped to the Android Capacitor app shell and does not interfere with normal scrolling and tapping behavior inside the sheet content.
- Keep the existing close actions (back button, header close icon, tapping outside) fully functional and unchanged.

## Impact
- **Affected specs**: `android-app-shell`, `visual-design`.
- **Affected code (indicative)**:
  - `src/lib/components/SettingsModal.svelte` (Android bottom sheet container and header/handle area).
  - `src/lib/components/ManageContactsModal.svelte` (Android bottom sheet container and header area).
  - Potential shared gesture/helpers (if factored) under `src/lib/utils` or similar.

## Out of Scope
- Changing which modals are implemented as bottom sheets vs centered dialogs.
- Adding swipe-to-close behavior for non-Android web modals or PWA full-screen overlays.
- Introducing complex physics-based sheet behavior (velocity-sensitive flings, overscroll effects) beyond a simple threshold-based close vs snap-back interaction.
