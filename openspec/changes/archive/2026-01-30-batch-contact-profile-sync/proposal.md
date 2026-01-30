## Why

After initial history sync, contacts fetched from the Kind 30000 encrypted follow set are missing usernames and profile pictures. This happens because `ContactSyncService.fetchAndMergeContacts()` adds contacts to the database but never resolves their profiles. Only contacts who exchanged messages during the sync window get profile resolution (via `autoAddContact`).

## What Changes

- Add batch profile resolution method to `ProfileResolver` that fetches Kind 0/10050/10002/10063 events for multiple authors in a single relay request
- Call batch profile resolution after contacts are merged from Kind 30000 in `ContactSyncService.fetchAndMergeContacts()`
- Ensure newly synced contacts display with usernames and profile pictures immediately after sync

## Capabilities

### New Capabilities

None - this enhances existing contact sync behavior.

### Modified Capabilities

- `contacts` - Contact sync will now resolve profiles for contacts fetched from Kind 30000

## Impact

- **Affected code**: `ProfileResolver.ts`, `ContactSyncService.ts`
- **User experience**: Contacts will show names/pictures after initial sync instead of truncated npubs
- **Performance**: Batch resolution is faster than individual requests (single multi-author filter vs N individual filters)
- **No breaking changes**: Existing sync flow enhanced, no API changes
