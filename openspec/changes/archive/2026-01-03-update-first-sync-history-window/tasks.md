## 1. Implementation
- [x] 1.1 Add `FIRST_SYNC_BACKFILL_DAYS` constant (value: 30) to `Messaging.ts`
- [x] 1.2 Extend `fetchMessages()` signature to accept optional `minUntil?: number` parameter
- [x] 1.3 Modify `fetchMessages()` batching loop to stop when `until < minUntil`
- [x] 1.4 Update `fetchHistory()` to compute `cutoffUntil` from now minus 30 days when `isFirstSync` is true
- [x] 1.5 Pass `minUntil: cutoffUntil` to `fetchMessages()` only for first-sync (not returning-user sync)

## 2. Tests
- [x] 2.1 Add test: First-time sync stops at cutoff (mock `countMessages` to return 0, mock multiple batches with descending `created_at`, assert paging stops before cutoff)
- [x] 2.2 Add test: Returning-user sync behavior unchanged (count > 0, only one fetch batch)
- [x] 2.3 Add test: `fetchOlderMessages()` unaffected (still requests exactly one batch, no minUntil logic)
- [x] 2.4 Ensure all tests for this change pass (`MessagingService.test.ts`)

## 3. Validation
- [x] 3.1 Run `npm run check` and resolve any type errors
- [x] 3.2 Run `npx vitest run` (note: repository currently has a failing test in `SettingsModal.unifiedPush.test.ts` unrelated to this change)
- [x] 3.3 Verify first-sync cutoff via unit test coverage
- [x] 3.4 Verify older-history backfill remains available via existing `fetchOlderMessages` tests

## 4. Documentation
- [x] 4.1 No new user documentation needed (existing "Fetch older messages" UI covers this)
- [x] 4.2 Inline code comments explain the 30-day cutoff and NIP-59 timestamp approximation
