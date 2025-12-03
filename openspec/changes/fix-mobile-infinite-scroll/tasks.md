- [x] **Relax Scroll Threshold**: Update `ChatView.svelte` to trigger `onLoadMore` when `scrollTop < 50` instead of `=== 0`.
- [x] **Handle Non-Overflow**: Add logic in `ChatView.svelte` to check if `scrollHeight <= clientHeight` and trigger `onLoadMore` if so.
    *   Validation: Manual check - open a chat with few messages, ensure it tries to load more.
