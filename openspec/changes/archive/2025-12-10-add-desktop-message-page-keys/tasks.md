## 1. Implementation
- [x] 1.1 Add desktop-only PageUp/PageDown/Home/End key handling for the chat message list in `src/lib/components/ChatView.svelte`.
- [x] 1.2 Ensure page-key scrolling continues to trigger existing infinite scroll loading when reaching the top of the list.
- [x] 1.3 Guard the behavior to apply only on desktop form factors, preserving current behavior on mobile and Android native shells.

## 2. Validation
- [x] 2.1 Manually verify PageUp/PageDown/Home/End scroll the messages window while the textarea has focus and while the message list itself is focused.
- [x] 2.2 Manually verify scrolling near the top via PageUp still loads older messages as expected and that sending messages still auto-scrolls to the bottom.
- [x] 2.3 Run `npm run check` to ensure type checking and Svelte checks pass.
- [x] 2.4 Run `npx vitest run` to ensure all tests pass.
