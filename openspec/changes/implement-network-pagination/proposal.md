# Implement Network Pagination (Infinite Scroll)

## Summary
Implement a network-backed infinite scroll mechanism for chat history. Currently, scrolling up only loads messages existing in the local database. This proposal adds the capability to fetch older messages from relays when the local cache is exhausted, ensuring users can seamless access their full conversation history.

## Motivation
The current "stop-on-duplicate" optimization during the initial history fetch prevents gaps in history from being filled if the application has recent messages. Users cannot access older messages that weren't synced, as scrolling up only queries the local database. A true infinite scroll that falls back to the network is required for a complete user experience.

## Proposed Solution
1.  **MessagingService Update**: Add a `fetchOlderMessages(until, limit)` method that bypasses the strict "stop-on-duplicate" logic used in the initial sync.
2.  **UI Integration**: Update the Chat View to detect when the user scrolls to the top of the locally cached history and trigger a network fetch for older messages.
3.  **UX Improvement**: Add loading indicators to the top of the chat view during network fetches.
