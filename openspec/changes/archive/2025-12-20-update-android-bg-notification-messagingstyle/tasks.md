## 1. Specification
- [x] 1.1 Add `messaging` spec delta covering `MessagingStyle` conversation notifications

## 2. Android Implementation
- [x] 2.1 Update conversation notification text to latest-only (remove count aggregation)
- [x] 2.2 Build `Person` objects for sender and "You" using cached identity data
- [x] 2.3 Render conversation notifications using `NotificationCompat.MessagingStyle` with a single `MessagingStyle.Message`
- [x] 2.4 Use cached avatar bitmap as the sender `Person` icon (best-effort)
- [x] 2.5 Ensure generic encrypted-message notifications remain unchanged

## 3. Validation
- [x] 3.1 Build Android debug APK (`./gradlew :app:assembleDebug`)
- [x] 3.2 Type check/lint (`npm run check`)
- [x] 3.3 Unit tests (`npx vitest run`)
- [x] 3.4 Manual smoke test: receive DM while app UI not visible; verify avatar/title, single latest message line, and tap-to-chat routing
