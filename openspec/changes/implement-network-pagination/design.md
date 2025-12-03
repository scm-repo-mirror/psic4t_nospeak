# Design: Network Pagination

## Architecture Changes

### MessagingService
We will introduce a new method `fetchOlderMessages(until: number, limit: number)` designed specifically for pagination.

*   **Logic**:
    1.  Accepts an `until` timestamp (timestamp of the oldest message currently displayed).
    2.  Queries relays for `kind 1059` (Gift Wrap) events where `#p` is the current user, with `until` set to the provided timestamp.
    3.  Processes incoming events through the standard decryption pipeline (`handleGiftWrap` / `processRumor`).
    4.  **Key Difference**: Unlike `fetchHistory`, this method will NOT abort immediately upon finding a duplicate. It will process the requested batch size to ensure gaps are filled. It may optionally use a "consecutive duplicates" threshold (e.g., stop after 5 duplicates) to be efficient but robust.

### ChatView UI State
The `ChatView` component (or the page wrapper) needs to manage a new state: `isFetchingNetworkHistory`.

*   **Logic**:
    1.  When `handleLoadMore` is triggered (user scrolls to top):
        a.  Load more from `IndexedDB` (existing logic).
        b.  Check if the number of messages returned from DB increased.
        c.  **New**: If DB returns no *additional* messages (or fewer than limit), trigger `messagingService.fetchOlderMessages` using the timestamp of the oldest message.
        d.  Show a loading spinner at the top of the chat.
    2.  When network fetch completes:
        a.  The `liveQuery` subscription will automatically update the UI with any newly saved messages.
        b.  Hide loading spinner.

## Data Flow
1.  **User scrolls up** -> `ChatView` calls `onLoadMore`.
2.  **Page** increments local limit.
3.  **Dexie** returns same count? -> **Page** calls `MessagingService.fetchOlderMessages(oldestMessage.sentAt)`.
4.  **MessagingService** fetches from relays -> Decrypts -> Saves to **Dexie**.
5.  **Dexie** `liveQuery` emits new list -> **Page** updates `messages` prop.
6.  **ChatView** renders new messages at top.

## Trade-offs
*   **Performance**: Decrypting Gift Wraps is CPU intensive. Fetching large batches might cause main thread jank. We will keep batch sizes small (e.g., 20-50).
*   **Complexity**: We are mixing "local pagination" (Dexie limit) with "network pagination". The coordination needs to be clean to avoid race conditions (e.g., fetching same history twice).
