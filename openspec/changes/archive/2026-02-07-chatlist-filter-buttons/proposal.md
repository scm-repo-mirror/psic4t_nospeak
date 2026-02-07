## Why

The chat list currently shows all conversations in a single flat list with no way to filter. Users with many conversations cannot quickly find unread messages or group chats, reducing messaging efficiency.

## What Changes

- Add a second header row with filter tab buttons ("All", "Unread", "Groups") to the ChatList component, visible on all screen sizes
- Remove the desktop-only "Chats" title text from the second header row (replaced by the filter tabs)
- Filter the displayed chat items based on the selected tab
- Show contextual empty-state messages when a filter yields no results ("No unread chats", "No groups")
- Add i18n translations for filter labels and empty states across all 6 locales

## Capabilities

### New Capabilities

_None — this is a UI enhancement to existing chat list behavior._

### Modified Capabilities

- `messaging` — adds chat list filtering requirement and scenarios to the existing messaging spec

## Impact

- Affected specs: `messaging`
- Affected code: `src/lib/components/ChatList.svelte`, all i18n locale files (`src/lib/i18n/locales/{en,de,es,fr,it,pt}.ts`)
- No database, API, or dependency changes
- No breaking changes
