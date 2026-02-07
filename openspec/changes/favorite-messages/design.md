## Context

Nospeak uses NIP-17 direct messages with encrypted relay storage. Contacts are already stored as an encrypted Kind 30000 parameterized replaceable event (`dm-contacts`) with NIP-44 self-encryption. This design replicates that pattern for message favorites using a `dm-favorites` d-tag.

The ChatList currently shows conversations with filter tabs (All/Unread/Groups). The message context menu supports Cite and Copy actions. Messages are rendered in ChatView with bubble styling and metadata rows.

## Goals / Non-Goals

**Goals:**
- Allow users to favorite/unfavorite individual messages via context menu
- Persist favorites across devices using encrypted relay storage
- Provide a dedicated Favorites view accessible from the ChatList
- Show visual indicator (star overlay) on favorited messages in conversations
- Navigate from a favorite directly to its original conversation and position

**Non-Goals:**
- Syncing favorites in real-time across simultaneously active devices (login-time sync is sufficient)
- Favorite annotations or categories
- Sharing favorites with other users
- Full-text search within favorites

## Decisions

### 1. Encrypted List Storage via Kind 30000

Store favorites as a Kind 30000 event with `d: "dm-favorites"`, same event kind and encryption approach as contacts. The encrypted content uses `[["e", "<eventId>", "<conversationId>"], ...]` tag format to store both the message reference and its conversation context.

**Rationale:** Reusing the proven `dm-contacts` pattern minimizes new code and ensures consistency. Storing `conversationId` alongside `eventId` enables the Favorites view to group messages by conversation and navigate back without a database join.

**Alternatives considered:**
- Adding a boolean `isFavorite` field to the Message table: Rejected because it wouldn't sync across devices and requires schema migration for every message row.
- Using a separate Nostr event kind: Rejected because Kind 30000 is the established NIP-51 list kind, and using a different d-tag is the standard way to create distinct private lists.

### 2. Local IndexedDB Table + Reactive Store

Create a `favorites` table in IndexedDB (schema v11) with `eventId` as primary key and `conversationId` + `createdAt` indices. A Svelte writable store holds the set of favorited eventIds for O(1) lookup in the UI render loop.

**Rationale:** The store avoids async DB queries during message rendering. The IndexedDB table provides persistence and allows the Favorites view to query all favorites with conversation grouping.

**Alternatives considered:**
- Store-only without IndexedDB: Rejected because favorites would be lost on page reload until relay sync completes.
- Dexie liveQuery only: Rejected because liveQuery adds subscription overhead per message; a pre-loaded Set is more efficient for the hot render path.

### 3. Sync at Same Points as Contacts

Favorites are fetched/published at the exact same integration points as contacts: on login (`AuthService`), delayed refresh (`+layout.svelte`), and own profile refresh (`ProfileModal.svelte`). Publishing is fire-and-forget on toggle.

**Rationale:** This ensures consistent behavior and avoids introducing new sync timing logic. Users already understand the contact sync cadence.

### 4. Dedicated `/favorites` Route

Create a new SvelteKit route at `/favorites` that displays all favorited messages grouped by conversation. Clicking a message navigates to `/chat/<conversationId>?highlight=<eventId>` to scroll to and highlight the original message.

**Rationale:** A dedicated route is simpler than a modal overlay and allows deep linking. The `highlight` query parameter is a lightweight way to communicate the target message to ChatView without adding route complexity.

**Alternatives considered:**
- Modal overlay: Rejected because it limits screen space for browsing potentially many favorites.
- Inline expansion in ChatList: Rejected because it would complicate the ChatList component and conflict with the filter tabs.

### 5. Star Icon as Absolute Overlay

Display a small star icon badge in the top-right corner of favorited message bubbles using CSS absolute positioning. The badge uses a yellow circular background with a white star SVG.

**Rationale:** Top-right overlay is visually distinct without affecting message layout or content flow. It's consistent with common "pinned/starred" patterns in messaging apps.

## Risks / Trade-offs

- **Union-only merge may accumulate stale favorites**: If a message is deleted or conversation is lost, the favorite reference persists. Mitigation: The Favorites view gracefully handles missing messages by showing a "message unavailable" placeholder.
- **No real-time cross-device sync**: A favorite added on device A won't appear on device B until next login/refresh. Mitigation: Acceptable for initial implementation; matches contact sync behavior.
- **Relay publish failure**: If all relay publishes fail, favorites exist locally but not remotely. Mitigation: Next successful publish will include all local favorites (full state publish, not delta).
- **Large favorite lists**: Very large lists could slow down the encrypt/publish cycle. Mitigation: Unlikely in practice for individual favorites; if needed, pagination can be added later.

## Migration Plan

- Database schema v11 adds the `favorites` table. Dexie handles this automatically on next app load.
- No data migration needed — new table starts empty.
- No breaking changes to existing functionality.
- Rollback: Remove the favorites table in a subsequent schema version if needed.
