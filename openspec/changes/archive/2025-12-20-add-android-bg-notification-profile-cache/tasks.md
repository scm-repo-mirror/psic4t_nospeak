## 1. Spec & Docs
- [x] 1.1 Add OpenSpec deltas for `android-app-shell` and `messaging`
- [x] 1.2 Run `openspec validate add-android-bg-notification-profile-cache --strict`

## 2. Android Native
- [x] 2.1 Add SharedPreferences-backed profile cache (max 100)
- [x] 2.2 Add Capacitor plugin method to upsert cached profiles
- [x] 2.3 Update native background messaging notifications to use cached username
- [x] 2.4 Implement avatar download + memory/disk cache + notification refresh
- [x] 2.5 Add JUnit tests for cache pruning and parsing

## 3. Web Runtime (SvelteKit)
- [x] 3.1 Add Android plugin wrapper/type for profile cache upsert
- [x] 3.2 Push cached kind `0.name` + `picture` into native cache after profile resolution
- [x] 3.3 Add unit tests for username extraction and non-empty gating

## 4. Validation
- [x] 4.1 Run `npm run check`
- [x] 4.2 Run `npx vitest run`
- [x] 4.3 Run `./android/gradlew :app:assembleDebug`
