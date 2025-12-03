## 1. Database & Repository
- [x] 1.1 Update `MessageRepository.getMessages` to support pagination (offset/limit or cursor-based) for infinite scroll.
- [x] 1.2 Add efficient "existence check" method to `MessageRepository` for batch validation (if not already optimized).

## 2. Core Messaging Logic
- [x] 2.1 Refactor `MessagingService.fetchHistory` to process events in a pipeline (fetch batch -> decrypt -> save -> notify) instead of `Promise.all` on the entire set.
- [x] 2.2 Implement checkpointing: Stop the history fetch loop when a batch contains a high percentage of duplicate messages (indicating overlap with local DB).
- [x] 2.3 Restore safe timeouts and limits for individual network requests.

## 3. User Interface (ChatView)
- [x] 3.1 Implement infinite scroll detection in `ChatView.svelte` (detect scroll to top).
- [x] 3.2 Update `ChatView` to append older messages to the list without losing scroll position.
- [x] 3.3 Re-introduce the initial load limit (e.g., 50 messages) in `+page.svelte` to ensure fast initial render.
