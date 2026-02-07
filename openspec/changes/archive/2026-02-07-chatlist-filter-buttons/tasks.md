## 1. i18n Translations

- [x] 1.1 Add filter tab labels and empty-state strings to `en.ts` (`chats.filterAll`, `chats.filterUnread`, `chats.filterGroups`, `chats.emptyUnread`, `chats.emptyGroups`)
- [x] 1.2 Add translations to `de.ts`
- [x] 1.3 Add translations to `es.ts`
- [x] 1.4 Add translations to `fr.ts`
- [x] 1.5 Add translations to `it.ts`
- [x] 1.6 Add translations to `pt.ts`

## 2. ChatList Component

- [x] 2.1 Import `Tab` component and add `filter` state variable (`'all' | 'unread' | 'groups'`, default `'all'`)
- [x] 2.2 Add `filteredChatItems` derived state that filters `chatItems` based on active filter
- [x] 2.3 Replace second header row: remove `hidden md:flex` and "Chats" title, add `Tab` component with three filter tabs
- [x] 2.4 Update scroll container top-padding to account for taller header on all breakpoints
- [x] 2.5 Update `{#each}` loop to iterate over `filteredChatItems` instead of `chatItems`
- [x] 2.6 Add filter-specific empty-state messages ("No unread chats", "No groups") when filtered list is empty but `chatItems` has items

## 3. Validation

- [x] 3.1 Run `npm run check` and fix any type errors
- [x] 3.2 Run `npx vitest run` and fix any test failures
