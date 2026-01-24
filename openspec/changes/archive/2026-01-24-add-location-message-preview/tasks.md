## 1. Localization

- [x] 1.1 Add `location` key to `contacts.mediaPreview` in all 6 locale files (en, de, es, fr, it, pt)

## 2. Preview Helper

- [x] 2.1 Add `getLocationPreviewLabel()` function to `src/lib/utils/mediaPreview.ts`

## 3. Notification Body (Web/JS)

- [x] 3.1 Update notification body logic in `src/lib/core/Messaging.ts` to check `message.location` before falling through to raw text

## 4. Chat List Preview

- [x] 4.1 Update chat list preview logic in `src/lib/components/ChatList.svelte` (1-on-1 conversations) to check `lastMsg.location`
- [x] 4.2 Update chat list preview logic in `src/lib/components/ChatList.svelte` (group conversations) to check `lastMsg.location`

## 5. Android Native Notifications

- [x] 5.1 Update `resolveRumorPreview()` in `NativeBackgroundMessagingService.java` to detect location messages (kind 14 with `location` tag or `geo:` content prefix) and return `📍 Location`

## 6. Validation

- [x] 6.1 Run `npm run check` (type check)
- [x] 6.2 Run `npx vitest run` (unit tests)
