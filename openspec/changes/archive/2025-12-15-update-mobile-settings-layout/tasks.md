## 1. Specification and Design
- [x] Review existing `settings` and `visual-design` specifications for current Settings layout, typography, and modal behavior.
- [x] Confirm platform targets and breakpoints for desktop, mobile web (PWA), and Android app shell.
- [x] Finalize interaction flow for card-based Settings navigation on mobile and Android, including transitions between category list and detail views.

## 2. Layout and Navigation Implementation
- [x] Refactor `SettingsModal.svelte` to support three presentation modes:
  - Desktop dialog with sidebar (existing behavior, clarified).
  - Full-screen Settings overlay on mobile web (PWA).
  - Bottom sheet Settings presentation when running inside the Android app shell.
- [x] Implement a card-based Settings category list for mobile web and Android that:
  - Uses one card per category (General, Profile, Messaging Relays, Security, About).
  - Uses monochrome SVG icons and semantic typography tokens defined by `visual-design`.
  - Does not retain a persistent "active" background state on the selected card once navigated into detail.
- [x] Wire navigation from the card list into per-category detail views on mobile/Android using existing `activeCategory` semantics (or equivalent) without changing underlying settings behavior.

## 3. Visual Design and Responsiveness
- [x] Apply glassmorphism card styling (rounded-2xl surfaces, subtle borders, appropriate opacity) that matches the existing design language while remaining performant on mobile and Android.
- [x] Ensure the Android bottom sheet respects safe-area insets, uses rounded top corners, and visually aligns with other modal surfaces.
- [x] Ensure the mobile web full-screen Settings overlay integrates cleanly with the authenticated app window and app background, including transitions.

## 4. Validation
- [x] Run `npm run check` to validate Svelte/TypeScript types after implementation.
- [x] Run `npx vitest run` to ensure existing tests pass; add or update tests around Settings layout behavior if needed.
- [x] Manually verify Settings behavior on:
  - Desktop web at typical breakpoints.
  - Mobile web (responsive viewport) for PWA layout.
  - Android app shell (emulator or device) for bottom sheet behavior and back/close interactions.

## 5. Documentation and Cleanup
- [x] Update any relevant UI or architecture documentation to reflect the new Settings layouts.
- [x] Ensure the OpenSpec `settings` and `visual-design` specs are updated from this change proposal when it is archived.
- [x] Remove any dead code or unused styles related to the previous mobile Settings sidebar layout.
