## 1. Implementation
- [x] 1.1 Design the `AndroidBackgroundMessaging` Capacitor plugin API surface (`start`, `update`, `stop`) and document expected parameters for nsec vs Amber sessions.
- [x] 1.2 Implement the native `AndroidBackgroundMessaging` plugin and `NativeBackgroundMessagingService` foreground service on Android, including relay connections, subscription management, and event deduplication.
- [x] 1.3 Implement generic background notification behavior in the native service: treat gift-wrap events as opaque envelopes and fire generic Android notifications indicating that new encrypted messages have arrived without exposing sender or content.
- [x] 1.4 Ensure that the native service's behavior is the same for on-device nsec and Amber sessions, without performing native decryption.
- [x] 1.5 Add and document a dedicated Android notification channel and persistent foreground notification for the native service, including text that summarizes connected read relays.
- [x] 1.6 Integrate the new plugin with the web `BackgroundMessaging` helper so that enabling background messaging on Android starts the native service with the correct parameters based on the current auth method (nsec or Amber).
- [x] 1.7 Update Settings behavior so that background messaging is clearly described and, in Amber sessions, explains the generic-notification limitation.
- [x] 1.8 Remove the existing Capawesome foreground-service plugin usage and the legacy JS/WebView-based background messaging code path once the native service is in place.

## 2. Validation
- [ ] 2.1 On an Android device with nsec login, enable background messaging and verify that new messages received while the app UI is backgrounded trigger generic Android notifications indicating that encrypted messages arrived and that messages appear in the correct conversations when the app returns to the foreground.
- [ ] 2.2 On an Android device with Amber login, enable background messaging and verify that new messages received while the app UI is backgrounded trigger generic Android notifications indicating that encrypted messages arrived without revealing sender or content, and that messages are readable only after returning to the app.
- [ ] 2.3 Verify that disabling background messaging or logging out stops the native service, removes the persistent foreground notification, and stops all background relay connections.
- [ ] 2.4 Verify that web and desktop behavior for message notifications and history sync remain unchanged.
- [x] 2.5 Run `npm run check` and `npx vitest run` to ensure TypeScript, Svelte, and unit tests pass after the integration changes.
