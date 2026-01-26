## Context

Android's **Sharing Shortcuts** API (introduced in Android 10/API 29) allows apps to publish shortcuts that appear directly in the system share sheet. This is the mechanism WhatsApp, Signal, and other messaging apps use to show recent contacts at the top of the share dialog.

The nospeak Android app already:
1. Receives inbound shares via `ACTION_SEND` intent filters
2. Creates dynamic shortcuts when notifications arrive (`NativeBackgroundMessagingService.java`)
3. Stores profile data in `AndroidProfileCachePrefs.java` for notification rendering
4. Has contact/conversation data with `lastActivityAt` timestamps in IndexedDB

### Key Android Concepts

- **Sharing Shortcuts**: Dynamic shortcuts with a special category that Android's share sheet can display
- **`shortcuts.xml`**: Declares share targets and their MIME type filters
- **`ShortcutInfo.SHORTCUT_CATEGORY_CONVERSATION`**: Standard category for conversation shortcuts
- **Custom category**: We'll use `com.nospeak.app.category.SHARE_TARGET` to match our `shortcuts.xml`

## Goals / Non-Goals

**Goals:**
- Show 4 most recently active contacts in Android share sheet
- One-tap sharing: selecting a contact goes directly to that chat
- Keep shortcuts fresh (update on startup + notification)

**Non-Goals:**
- Support for Android < 10 (graceful degradation to existing flow)
- Message frequency-based ranking (using recency is simpler and matches chat list)
- Real-time shortcut updates on every message (too expensive)

## Decisions

### Decision 1: Use Custom Share Target Category
We'll use `com.nospeak.app.category.SHARE_TARGET` as the category in `shortcuts.xml` and when creating shortcuts.

**Rationale:** Using the standard `ShortcutInfo.SHORTCUT_CATEGORY_CONVERSATION` requires additional Person metadata. Our custom category gives us control and matches the `shortcuts.xml` declaration.

### Decision 2: Publish 4 Shortcuts
Android guidelines recommend 4-8 sharing shortcuts. We'll start with 4 for a clean appearance.

**Rationale:** Fewer shortcuts = faster rendering, less complexity. Can increase later if needed.

### Decision 3: Update Strategy - Startup + Notification
Shortcuts update when:
1. App starts (after auth restore)
2. Background service receives a notification (already creates shortcuts)

**Rationale:** Balances freshness with battery/performance. User's most active contacts will appear after receiving messages from them or opening the app.

### Decision 4: New Capacitor Plugin for Publishing
Create `AndroidSharingShortcutsPlugin` to expose shortcut publishing to TypeScript.

**Rationale:** The web layer has access to conversation data with `lastActivityAt`. Native layer needs to create `ShortcutInfoCompat` objects. A Capacitor plugin bridges this cleanly.

### Decision 5: Reuse Profile Cache for Avatars
Use existing `AndroidProfileCachePrefs` to fetch cached profile names/avatars when creating shortcuts.

**Rationale:** Avoids duplicating avatar loading logic. Profile cache is already populated by notification handling.

### Decision 6: Extract Shortcut ID from Intent for Direct Navigation
When a direct share arrives, the intent includes `EXTRA_SHORTCUT_ID`. Extract this to skip contact picker.

**Rationale:** This is the standard Android pattern. Shortcut IDs are already formatted as `chat_<conversationId>`.

## Architecture

```
                          Android Share Sheet
                                  |
                                  v
                    +---------------------------+
                    |    shortcuts.xml          |
                    |    (MIME type filters)    |
                    +---------------------------+
                                  |
                    Selects nospeak contact shortcut
                                  |
                                  v
                    +---------------------------+
                    |    MainActivity           |
                    |    (receives intent)      |
                    +---------------------------+
                                  |
                                  v
                    +---------------------------+
                    |  AndroidShareTargetPlugin |
                    |  (extracts shortcut ID)   |
                    +---------------------------+
                                  |
                                  v
                    +---------------------------+
                    |  Web Layer (+layout.svelte)|
                    |  (navigates to chat)      |
                    +---------------------------+

        Publishing Flow:
        
        +------------------+     +---------------------------+
        | Web Layer        | --> | AndroidSharingShortcuts   |
        | (conversations)  |     | Plugin (creates shortcuts)|
        +------------------+     +---------------------------+
                                          |
                                          v
                                 +---------------------------+
                                 | ShortcutManagerCompat     |
                                 | (system shortcut store)   |
                                 +---------------------------+
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Shortcuts may show stale contacts | Update on startup + notification keeps them reasonably fresh |
| Avatar loading blocks shortcut creation | Use cached avatars from `AndroidProfileCachePrefs`; fall back to placeholder |
| API 29+ only | Graceful degradation: older Android versions use existing contact picker flow |
| Profile data not yet cached on first install | Shortcuts will use display name without avatar initially; updates as notifications arrive |

## Migration Plan

No migration needed. This is an additive feature:
- Existing inbound share flow continues to work
- Direct share is an enhancement for users on Android 10+
- No data schema changes

## Open Questions

None - design decisions finalized based on user preferences (4 contacts, recency-based, startup+notification updates).
