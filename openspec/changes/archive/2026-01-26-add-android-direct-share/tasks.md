## 1. Android Configuration
- [x] 1.1 Create `android/app/src/main/res/xml/shortcuts.xml` with share target definition
- [x] 1.2 Add `<meta-data android:name="android.app.shortcuts">` to MainActivity in `AndroidManifest.xml`

## 2. Update Existing Shortcut Creation
- [x] 2.1 Modify `NativeBackgroundMessagingService.ensureConversationShortcut()` to add sharing categories to shortcuts

## 3. Create Sharing Shortcuts Plugin
- [x] 3.1 Create `AndroidSharingShortcutsPlugin.java` with `publishShortcuts()` method
- [x] 3.2 Register plugin in `MainActivity.java`
- [x] 3.3 Create `src/lib/core/AndroidSharingShortcuts.ts` TypeScript interface

## 4. Startup Shortcut Publishing
- [x] 4.1 Add helper function to get top 4 recent conversations from DB
- [x] 4.2 Add shortcut publishing call in `+layout.svelte` after auth restore (Android only)

## 5. Handle Direct Share Intent
- [x] 5.1 Modify `AndroidShareTargetPlugin.java` to extract `EXTRA_SHORTCUT_ID` and return `targetConversationId`
- [x] 5.2 Update `src/lib/stores/androidShare.ts` to include `targetConversationId` in payload types
- [x] 5.3 Update `+layout.svelte` share handling to navigate directly to target conversation when `targetConversationId` is present

## 6. Testing & Validation
- [x] 6.1 Test sharing image from Photos app - verify contacts appear in share sheet
- [x] 6.2 Test direct share tap - verify navigation to correct chat
- [ ] 6.3 Test text/URL sharing via direct share
- [ ] 6.4 Test shortcut updates after receiving notification
- [ ] 6.5 Test on Android 10, 11, 12, 13, 14
- [ ] 6.6 Test graceful degradation on Android 9 (should fall back to contact picker)

## 7. Bug Fixes (discovered during testing)
- [x] 7.1 Fix shortcut ID length issue (npub IDs exceeded Android's 65-char limit) - use hashed IDs
- [x] 7.2 Fix data source issue (1-on-1 chats were in `contacts` table, not `conversations` table)
- [x] 7.3 Fix sorting issue (use actual last message time from `messages` table, not stale `lastActivityAt`)
- [x] 7.4 Fix old shortcuts persisting (clear all dynamic shortcuts before publishing new ones)
- [x] 7.5 Remove debug logging
