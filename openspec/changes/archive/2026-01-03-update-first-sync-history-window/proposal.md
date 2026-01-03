# Proposal: Limit First-Time Sync to ~30 Days

## Why
First-time message synchronization can take an unbounded amount of time for users with extensive history, because the current spec requires fetching **ALL** available gift-wrap events from relays. This degrades the initial login experience, especially on mobile devices. Users should be able to start using the app quickly, with older history available on-demand.

## What Changes
- First-time sync (empty local cache after login/logout) is capped to fetch gift-wrap events with `created_at` timestamps approximately within the last 30 days.
- The sync paging loop stops when the `until` parameter would drop below the calculated cutoff.
- The existing "Fetch older messages from relays" UI and `fetchOlderMessages()` API remain unchanged and continue to allow on-demand older-history backfill for any conversation.
- No changes to returning-user sync behavior or real-time subscriptions.

**Known tradeoffs (documented in spec delta):**
- The 30-day boundary is approximate because NIP-59 gift-wrap `created_at` timestamps may be randomized by clients (accepted).
- Contacts with no activity in the last ~30 days won't auto-appear during first sync; they'll be created when older history is backfilled (accepted).

## Impact
- **Affected specs**: `messaging` (modify first-time sync behavior)
- **Affected code**:
  - `src/lib/core/Messaging.ts`: Add `FIRST_SYNC_BACKFILL_DAYS` constant and cutoff logic in `fetchHistory()` and `fetchMessages()`
  - `src/lib/core/MessagingService.test.ts`: Add tests for cutoff behavior
- **No UI changes** needed: "Fetch older messages from relays" control already exists
- **Platform**: All platforms (web, PWA, Android) - same behavior everywhere
