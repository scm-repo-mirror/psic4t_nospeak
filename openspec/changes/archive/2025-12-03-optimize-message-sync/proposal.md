# Change: Optimize Message Synchronization

## Why
The current message history fetching mechanism retrieves all historical messages at once without limits. This causes significant performance issues:
- **App Freeze**: Decrypting thousands of messages in a single batch blocks the main thread.
- **Slow UI**: Rendering the entire message history slows down the interface.
- **Data Waste**: The application re-downloads the entire history on every startup.

## What Changes
- **Pipeline Fetching**: Messages will be fetched, decrypted, and saved in small batches (streaming) rather than waiting for the entire download to complete.
- **Smart Checkpointing**: The fetch process will stop automatically when it encounters messages that already exist in the local database.
- **Infinite Scroll**: The chat UI will initially load a limited number of messages (e.g., 50) and lazily load older messages as the user scrolls up.

## Impact
- **Specs**: `messaging` capability.
- **Code**: 
    - `src/lib/core/Messaging.ts` (Fetch logic)
    - `src/lib/db/MessageRepository.ts` (Pagination support)
    - `src/routes/chat/[npub]/+page.svelte` (Data binding)
    - `src/lib/components/ChatView.svelte` (UI scrolling)
