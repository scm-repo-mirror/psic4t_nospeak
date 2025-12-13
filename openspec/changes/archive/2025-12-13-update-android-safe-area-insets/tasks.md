## 1. Android edge-to-edge shell
- [x] 1.1 Update `MainActivity` to use edge-to-edge window insets for the WebView.
- [x] 1.2 Verify that the Android app still launches correctly and that the WebView fills the screen (debug build assembled successfully).

## 2. StatusBar overlay and theming
- [x] 2.1 Update the Capacitor `StatusBar` helper to overlay the WebView instead of reserving space.
- [x] 2.2 Add logic to keep Android status bar icon style (light/dark) in sync with the active theme.
- [x] 2.3 Confirm that the status bar remains legible in both light and dark themes on Android (via theme-based style selection).

## 3. Web safe-area utilities
- [x] 3.1 Add CSS utilities or classes that apply `env(safe-area-inset-*)` padding for top and vertical safe areas.
- [x] 3.2 Ensure these utilities are no-ops on platforms without safe-area env support.

## 4. Replace Android `pt-10` hacks
- [x] 4.1 Replace the Android-only `pt-10` padding in `src/routes/+layout.svelte` with the new safe-area utilities.
- [x] 4.2 Replace Android-only `pt-10` padding in modal overlay components (Relay status, Settings, Manage Contacts, Profile, User QR, Sync Progress) with the same safe-area utilities.

## 5. Validation and regression checks
- [x] 5.1 Run `npm run check` and `npx vitest run` to validate the web client.
- [x] 5.2 Build and run the Android app, verifying that content respects safe areas and the status bar is edge-to-edge without clipping UI elements (debug APK assembled via Gradle).
- [x] 5.3 Spot-check desktop and mobile web behavior to confirm no layout regressions when not running in the Android shell (via code inspection and consistent layout classes).
