## 1. Implementation
- [x] 1.1 Add a Capacitor Android plugin (`AndroidTapSound`) that plays the OS click sound effect.
- [x] 1.2 Register the plugin in the Android app shell activity.
- [x] 1.3 Add a TypeScript bridge (`registerPlugin`) for `AndroidTapSound`.
- [x] 1.4 Add a safe web utility wrapper that is Android-only and non-blocking.
- [x] 1.5 Trigger tap sound for the same micro-interactions that use selection haptics (shared UI components first).

## 2. Validation
- [x] 2.1 Add unit tests covering Android-only gating and error swallowing.
- [x] 2.2 Run `npm run check` and `npx vitest run`.
- [ ] 2.3 Manually verify on an Android device:
    - Tap sounds play when Android system “Touch sounds” are enabled.
    - Tap sounds do not play when Android system “Touch sounds” are disabled.
    - Web/PWA remains silent.
