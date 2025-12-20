## 1. Proposal Validation
- [x] 1.1 Run `openspec validate update-android-background-message-previews --strict`

## 2. Android Native: Background Notifications
- [x] 2.1 Add Amber-backed decrypt helper to native background service
- [x] 2.2 Decrypt giftwrap → seal → rumor and derive preview text
- [x] 2.3 Suppress notifications for self-authored rumors
- [x] 2.4 Implement combined per-conversation grouping (message + reaction)
- [x] 2.5 Add persistent dedupe across service restarts
- [x] 2.6 Add EOSE timeout fallback for live detection
- [x] 2.7 Add tap intent extras (partner pubkey) to message/reaction notifications

## 3. Android Native: Tap Routing Bridge
- [x] 3.1 Add Capacitor plugin to read route extras from intents
- [x] 3.2 Emit `routeReceived` event for in-app taps
- [x] 3.3 Register plugin in `MainActivity`

## 4. Web App: Navigation + Notification Suppression
- [x] 4.1 Add TS bridge for the Android route plugin
- [x] 4.2 Handle initial route + routeReceived in `src/routes/+layout.svelte`
- [x] 4.3 Suppress Android `NotificationService` scheduling when background messaging is enabled
- [x] 4.4 Add/adjust unit tests for notification suppression

## 5. Validation
- [x] 5.1 Run `npm run check`
- [x] 5.2 Run `npx vitest run`
- [x] 5.3 (Optional) Build Android debug APK via Gradle
