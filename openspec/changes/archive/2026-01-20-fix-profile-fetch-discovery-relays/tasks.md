## 1. Implementation - Simplified Profile Fetching
- [x] 1.1 Remove early discovery relay cleanup in `AuthService.ts` (keep discovery relays connected during history sync)
- [x] 1.2 Remove step 5 code block (redundant contact profile loop) since `autoAddContact` handles profile resolution
- [x] 1.3 Renumber step 6 → step 5 in comments
- [x] 1.4 Remove `fetch-contact-profiles` from `sync.ts` (type, step order, initial steps)
- [x] 1.5 Remove `fetch-contact-profiles` from `SyncProgressModal.svelte` label mapping

## 2. Implementation - UI Reactivity (from earlier fix)
- [x] 2.1 Emit `nospeak:profiles-updated` event in `AuthService.ts` after sync completes
- [x] 2.2 Add event listener in `ContactList.svelte` for `nospeak:profiles-updated`
- [x] 2.3 Add event listener in `ChatView.svelte` for `nospeak:profiles-updated`

## 3. Validation
- [x] 3.1 Run `npm run check` to verify no type errors
- [x] 3.2 Run `npx vitest run` to verify all tests pass
- [x] 3.3 Manual test: Login with a user that has a single blank/new messaging relay and verify all contact profiles are fetched and displayed
