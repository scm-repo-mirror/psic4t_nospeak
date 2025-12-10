# Change: Desktop chat page-key scrolling

## Why
Desktop users expect PageUp, PageDown, Home, and End keys to scroll long content areas even while typing. The current chat interface does not wire these keys to the messages list, making it harder to navigate long conversations using the keyboard.

## What Changes
- Add desktop-only keyboard handling so PageUp and PageDown scroll the chat messages window by approximately one viewport while a conversation is active.
- Add desktop-only handling for Home and End to jump to the top or bottom of the visible message history, respectively.
- Ensure page-key scrolling cooperates with existing infinite scroll behavior when reaching the top of the list.
- Scope the behavior so it applies while the chat view is active, including when the message input textarea has focus, without affecting other application views.

## Impact
- Affected specs: `messaging` capability (new requirement for desktop message list keyboard scrolling).
- Affected code: `src/lib/components/ChatView.svelte` (message list container and keyboard event handling), related desktop/mobile heuristics.
- No breaking changes: mobile behavior and existing mouse/touch scroll behavior remain unchanged.
