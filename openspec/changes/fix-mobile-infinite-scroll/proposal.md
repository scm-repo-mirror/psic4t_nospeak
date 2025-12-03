# Fix Mobile Infinite Scroll

## Summary
Relax the scroll threshold for triggering infinite scroll on mobile devices and handle cases where content doesn't overflow.

## Motivation
Users report that history fetching is not triggering on mobile. This is likely due to the strict `scrollTop === 0` check in `ChatView.svelte`, which can be difficult to hit precisely on touch screens due to momentum scrolling or overscroll behavior. Additionally, if the message history is short and doesn't overflow the container, scrolling is impossible, preventing users from fetching older messages.

## Proposed Solution
1.  **Relax Scroll Threshold**: Change `scrollTop === 0` to `scrollTop < 50` (pixels) to be more forgiving.
2.  **Auto-load on Top**: If `messages.length > 0` and `scrollTop < 50` (even if not strictly 0), trigger `onLoadMore` if we aren't already loading.
3.  **Initial Load Check**: On mount or update, if the content height is smaller than the container height (no scrollbar) but we have messages, automatically attempt to load more to fill the screen.
