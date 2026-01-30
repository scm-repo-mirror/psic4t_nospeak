## 1. ProfileResolver Changes

- [x] 1.1 Add `resolveProfilesBatch(npubs: string[]): Promise<void>` method to ProfileResolver
- [x] 1.2 Create multi-author filter for kinds 0, 10050, 10002, 10063
- [x] 1.3 Track received events by npub and cache profiles as they complete
- [x] 1.4 Use 5-second timeout for batch resolution

## 2. ContactSyncService Integration

- [x] 2.1 Import profileResolver into ContactSyncService
- [x] 2.2 Collect npubs of newly added contacts during merge loop
- [x] 2.3 Call `resolveProfilesBatch()` after merge completes with new contact npubs

## 3. Verification

- [x] 3.1 Test with fresh account that has contacts in Kind 30000 but no local cache
- [x] 3.2 Verify contacts display with names/pictures after initial sync
- [x] 3.3 Run `npm run check` and ensure no type errors
