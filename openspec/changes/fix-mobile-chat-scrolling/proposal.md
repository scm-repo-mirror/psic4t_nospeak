# Fix Mobile Chat Scrolling

## Summary
The current mobile chat interface allows the header (contact info) and footer (message input) to scroll off-screen along with the messages. This change enforces a fixed layout where only the message list scrolls, keeping the header and footer permanently visible.

## Problem
On mobile devices, the chat view behaves like a standard document where the entire page scrolls. This causes the contact header and message input to disappear when scrolling through long message histories, degrading the user experience and requiring users to scroll back to interact with these elements.

## Solution
Reinforce the flexbox layout constraints to ensure the chat container fills the viewport exactly (`100dvh`) and handles overflow internally.
- Update `src/routes/chat/+layout.svelte` to ensure the content wrapper has strict height and overflow constraints.
- Update `src/lib/components/ChatView.svelte` to guarantee the root container clips overflow and properly distributes space to the scrollable message list.

## Impact
- **Mobile UX**: Significantly improved by keeping navigation and input always accessible.
- **Desktop UX**: Should remain unchanged (already works correctly).
- **Code**: Minimal CSS class changes.
