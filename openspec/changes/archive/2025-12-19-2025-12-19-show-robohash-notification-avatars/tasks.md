## 1. Implementation
- [x] 1.1 Add deterministic robohash URL helper for notifications
- [x] 1.2 Update web/PWA notification `icon` fallback to robohash when `metadata.picture` missing
- [x] 1.3 Keep notification `badge` as nospeak branded icon
- [x] 1.4 Add Android local notification large icon support (profile pic → robohash, best-effort)
- [x] 1.5 Ensure Android background messaging notifications remain unchanged

## 2. Tests
- [x] 2.1 Update/add NotificationService unit tests for web `icon` selection (picture vs robohash)
- [x] 2.2 Update/add NotificationService unit tests for Android `largeIcon` behavior (success + failure paths)

## 3. Validation
- [x] 3.1 Run `npm run check`
- [x] 3.2 Run `npx vitest run`
- [x] 3.3 Manually verify on web/PWA
- [x] 3.4 Manually verify on Android emulator/device
