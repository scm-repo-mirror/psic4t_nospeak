# Change: Add Android native tap sound feedback

## Why
The Android app currently provides subtle haptics for key micro-interactions, but it lacks the familiar Android “tap” click sound that many users associate with tactile UI feedback. Providing the OS-native click sound (while respecting the device’s system “Touch sounds” setting and ringer modes) can make interactions feel more responsive without introducing a new in-app audio preference.

## What Changes
- Add an Android-only, non-blocking tap-sound API that triggers the platform’s built-in click sound effect.
- Wire the tap sound into the same micro-interactions that currently use selection haptics (e.g., buttons, toggles, lightweight selections).
- Ensure web/PWA behavior remains unchanged (no sound) outside the Android Capacitor shell.

## Impact
- Affected specs: `android-app-shell`.
- Affected code: Android Capacitor shell (new plugin registration) and shared UI interaction helpers.
- Behavior notes: Tap sounds MUST respect Android system sound settings; no new app-level setting is introduced.
