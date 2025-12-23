## 1. Implementation
- [x] 1.1 Remove `startRelayConnections()` call from `evaluateAndApplyEnergyProfile()` method in `NativeBackgroundMessagingService.java`
- [x] 1.2 Update `evaluateAndApplyEnergyProfile()` to only call `updateServiceNotificationForHealth()` after profile change
- [x] 1.3 Verify that `client` reference is still rebuilt with new ping interval when profile changes
- [x] 1.4 Ensure new connections (created by `onSocketClosedOrFailed` retry logic) use the updated `client` instance

## 2. Validation
- [x] 2.1 Manual test: screen-off → 60s grace period → verify no connection restart when profile changes to locked
- [x] 2.2 Manual test: unlock device → verify no connection restart when profile changes back to active
- [x] 2.3 Manual test: plug/unplug charger while device is locked → verify no connection restart
- [x] 2.4 Manual test: verify that natural reconnections use updated ping interval after profile change
- [x] 2.5 Battery observation: run background messaging with typical usage and compare battery drain to current version

## 3. Tooling
- [x] 3.1 Build Android debug APK (`./gradlew :app:assembleDebug`)
- [x] 3.2 Run any existing Android unit tests (`./gradlew test`)
