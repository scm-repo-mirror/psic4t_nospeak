- [x] **Refactor MessagingService**: Extract history fetching logic into a reusable internal method to support different fetching strategies (sync vs pagination).
    *   Validation: Unit tests for `MessagingService`.
- [x] **Implement fetchOlderMessages**: Add `fetchOlderMessages(until, limit)` to `MessagingService` that fetches from relays without stopping on first duplicate.
    *   Validation: Unit test verifying it calls `connectionManager.fetchEvents` with correct filters and processes results.
- [x] **Update Chat Page Logic**: Modify `src/routes/chat/[npub]/+page.svelte` to detect when local DB is exhausted and call `fetchOlderMessages`.
    *   Validation: Manual test - scroll to top of chat with limited history, verify network request.
- [x] **Add Loading Indicator**: Update `ChatView.svelte` to show a spinner when `isFetchingHistory` is true.
    *   Validation: Visual check during fetch.
- [x] **Integration Test**: Verify that scrolling up seamlessly loads messages from DB then Network.
