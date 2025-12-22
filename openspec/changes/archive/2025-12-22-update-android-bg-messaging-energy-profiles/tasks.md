## 1. Implementation
- [x] 1.1 Confirm current Android background messaging service ping interval and reconnect behavior.
- [x] 1.2 Add device-state receiver (screen off, user present, power connected/disconnected) to native foreground service.
- [x] 1.3 Implement 60s grace period before entering locked profile.
- [x] 1.4 Refactor OkHttp client construction to support ping interval changes (120s active, 300s locked).
- [x] 1.5 Restart relay sockets only when profile changes; keep existing reconnect backoff.
- [x] 1.6 Skip avatar fetch and shortcut publishing while in locked profile.
- [x] 1.7 Add debug-only profile transition log line (debuggable build only).

## 2. Validation
- [x] 2.1 Manual test: screen off <60s does not restart connections.
- [x] 2.2 Manual test: screen off >60s switches to locked profile and reconnects once.
- [x] 2.3 Manual test: unlock switches back to active profile quickly.
- [x] 2.4 Manual test: charging while locked forces active profile.
- [x] 2.5 Verify notifications still follow backlog guard semantics (no flood on reconnect).

## 3. Tooling
- [x] 3.1 Build Android debug APK (`./gradlew :app:assembleDebug`).
- [x] 3.2 Run any existing Android unit tests (`./gradlew test`).
