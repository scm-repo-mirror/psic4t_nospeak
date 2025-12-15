## 1. Specification and Design
- [x] Review existing `android-app-shell` and `visual-design` specifications to understand current bottom sheet and modal interaction requirements.
- [x] Confirm which modals are treated as Android bottom sheets (at minimum Settings and Manage Contacts) and ensure the gesture scope is limited to those.
- [x] Define gesture thresholds (drag distance and/or direction) and the primary drag area (top handle or header region) to avoid conflicts with scrolling content.

## 2. Gesture Behavior and Implementation
- [x] Implement a swipe-down-to-close gesture for Android bottom sheets that:
  - Starts from a defined drag area (such as a top handle or header bar) on the sheet surface.
  - Tracks vertical drag distance while the pointer is down.
  - Applies a temporary downward translation (and optional opacity adjustment) to the sheet while dragging.
  - On release, closes the sheet when the drag exceeds a configured threshold, otherwise animates it back to its resting position.
- [x] Ensure the gesture is active only when running inside the Android app shell (`isAndroidApp`) and does not affect desktop or mobile web behavior.
- [x] Ensure the gesture does not interfere with vertical scrolling inside the sheet content (lists, forms) by restricting the active drag area.

## 3. Visual Design and Motion
- [x] Apply motion and visual feedback consistent with the existing glassmorphism and modal transition guidelines when the sheet is dragged and dismissed.
- [x] Ensure the drag and snap-back animations feel smooth and performant on typical Android devices.
- [x] Confirm that the swipe-to-close gesture and resulting transitions visually align with the Android Settings bottom sheet visual treatment already defined in `visual-design`.

## 4. Validation
- [x] Run `npm run check` to validate Svelte/TypeScript types after implementation.
- [x] Run `npx vitest run` to ensure existing tests pass; add or update tests around Android-specific modal behavior if needed.
- [x] Manually verify behavior on:
  - Android app shell (emulator or device) for both Settings and Manage Contacts bottom sheets.
  - Desktop and mobile web to confirm no regressions in modal behavior.

## 5. Documentation and Cleanup
- [x] Update any relevant UI or interaction documentation to mention the Android swipe-to-close gesture for bottom sheets.
- [x] Ensure the OpenSpec `android-app-shell` and `visual-design` specs are updated from this change proposal when it is archived.
- [x] Remove any dead code or unused utilities introduced while experimenting with gesture handling.
