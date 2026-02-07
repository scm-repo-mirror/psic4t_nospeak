## Context

The ChatList component (`src/lib/components/ChatList.svelte`) renders a flat list of all conversations (1-on-1 and groups) sorted by most recent activity. The header has two rows: the first with avatar/QR/title/settings, and a second row currently showing only a "Chats" title on desktop (`hidden md:flex`). The project already has a reusable `Tab` component (`src/lib/components/ui/Tab.svelte`) with Material 3 styling and keyboard navigation.

## Goals / Non-Goals

**Goals:**
- Add filter tabs to the chat list header visible on all screen sizes
- Reuse the existing `Tab` component for consistency
- Provide contextual empty-state messages per filter

**Non-Goals:**
- Persisting filter state across page reloads
- Adding count badges to filter tabs (e.g. "Unread (3)")
- Server-side or database-level filtering

## Decisions

### 1. Reuse existing Tab component

Use `$lib/components/ui/Tab.svelte` for the filter row. It already handles keyboard navigation, haptic feedback, and the animated indicator.

**Alternatives considered:**
- Custom pill/chip buttons: Rejected because it duplicates existing Tab functionality and breaks visual consistency with the QR modal tabs.

### 2. Client-side derived filtering

Use a Svelte 5 `$derived` rune to filter the already-loaded `chatItems` array. No additional database queries needed since all data (isGroup, hasUnread) is already available.

**Alternatives considered:**
- Database-level filtering via separate Dexie queries: Rejected as unnecessary overhead; the list is already fully loaded in memory.

### 3. Replace "Chats" title with filter tabs on all breakpoints

The second header row currently shows "Chats" only on desktop. Replace it with filter tabs visible on all screen sizes. The app name "nospeak" is already displayed in the first header row.

**Alternatives considered:**
- Keep "Chats" title alongside tabs: Rejected as it would make the header too tall and redundant.

## Risks / Trade-offs

- Slightly taller header on mobile reduces visible chat area → Mitigated by the tabs being compact (h-10) and providing real filtering value.
- Unread/Groups filters may show empty lists for new users → Mitigated by showing helpful empty-state messages.
