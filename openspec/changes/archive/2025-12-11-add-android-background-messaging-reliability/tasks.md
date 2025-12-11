## 1. Implementation
- [x] 1.1 Review existing Android background messaging implementation (foreground service, plugin, and TS bridge) against the current `messaging` and `android-app-shell` specs.
- [x] 1.2 Implement WebSocket heartbeat behavior for Android background messaging connections using OkHttp ping intervals and appropriate read timeout settings.
- [x] 1.3 Implement per-relay reconnection with conservative exponential backoff when background WebSocket connections fail or close while the service is running.
- [x] 1.4 Update the Android foreground notification text to reflect background messaging health (for example, connected, reconnecting, or not connected) based on relay connection state.
- [x] 1.5 Ensure that background messaging stops reconnecting and tears down sockets cleanly when the user signs out or disables Android background messaging.
- [x] 1.6 Add or update automated tests where practical (for example, unit tests around connection-management logic) and document a manual test plan for Android devices (including long-idle and network-change scenarios).
- [x] 1.7 Run `npm run check`, `npx vitest run`, and the Android build to confirm there are no regressions, then validate behavior on at least one physical Android device (for example, a Pixel) with background messaging enabled.

## 2. Manual Android Test Plan
- Verify short idle behavior: enable background messaging, close the UI, wait 15–30 minutes on stable Wi-Fi, send a test message from another client, and confirm a generic encrypted-message notification appears.
- Verify long idle behavior: with background messaging enabled and the app UI closed, leave the device idle for at least 1–2 hours on charger, then send a test message and confirm a notification appears.
- Verify network change handling: start on Wi-Fi with background messaging enabled, then switch to mobile data (or toggle Wi-Fi off), send a message, and confirm that notifications still arrive after the network change.
- Verify disabling behavior: disable Android background messaging in Settings → General (or sign out), confirm that the persistent foreground notification disappears, and that no further reconnect attempts or background notifications occur.
