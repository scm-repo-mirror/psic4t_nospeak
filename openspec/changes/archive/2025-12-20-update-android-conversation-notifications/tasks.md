## 1. Specification
- [x] 1.1 Update `android-app-shell` spec delta to require conversation shortcuts, sensitive lockscreen previews, and create-if-missing channels.
- [x] 1.2 Run `openspec validate update-android-conversation-notifications --strict`.

## 2. Implementation (after approval)
- [x] 2.1 Update Android notification channel creation to create-if-missing (no deletion/recreation).
- [x] 2.2 Add dynamic shortcut publishing per conversation (stable `conversationId`).
- [x] 2.3 Bind message notifications to shortcuts (`setShortcutId`) and ensure per-conversation notification ids remain stable.
- [x] 2.4 Implement sensitive lockscreen behavior using `VISIBILITY_PRIVATE` + `publicVersion` (title=contact name, body redacted).
- [x] 2.5 Refresh shortcut icon when avatar fetch completes (best-effort, avoid redundant updates).

## 3. Validation
- [x] 3.1 Manual test on Android 11+ device/emulator:
  - Conversation icon shows contact avatar.
  - Unlocked shade shows full preview.
  - Lockscreen shows contact name but redacted body.
  - Tap opens the correct chat.
- [x] 3.2 Run `npm run check`.
- [x] 3.3 Run `npx vitest run`.
