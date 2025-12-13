# Change: Update Android safe-area insets and status bar

## Why
Android currently relies on hard-coded top padding (`pt-10`) in the Svelte layout and modals to avoid overlapping the system status bar, rather than using proper safe-area insets or Capacitor StatusBar overlay handling. This leads to brittle spacing, inconsistent behavior across devices, and prevents the Android shell from going truly edge-to-edge.

## What Changes
- Update the Android Capacitor app shell to run edge-to-edge by letting content draw behind system bars and delegating spacing to web safe-area handling.
- Introduce consistent safe-area handling in the web client using CSS `env(safe-area-inset-*)` variables instead of Android-only `pt-10` padding hacks.
- Integrate Capacitor `StatusBar` APIs so the Android status bar overlays the WebView and tracks the active light/dark theme for icon contrast.
- Ensure web and desktop behavior remains unchanged when not running inside the Android native shell.

## Impact
- Affected specs: `android-app-shell`, `visual-design`.
- Affected code: Android `MainActivity` window insets, Capacitor `StatusBar` helper, Svelte root layout, and modal overlay components using Android-specific `pt-10` padding.
