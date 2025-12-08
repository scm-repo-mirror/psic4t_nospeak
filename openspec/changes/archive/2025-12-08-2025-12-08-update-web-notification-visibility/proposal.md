# Change: Refine web notification visibility and conversation rules

## Why
Desktop and PWA notifications for new messages currently only appear when the nospeak tab becomes non-visible according to `document.visibilityState`. On some platforms, minimizing the window or moving it to another virtual desktop does not change `visibilityState`, so users miss notifications even though the app is effectively backgrounded. Additionally, when the user is actively viewing a conversation with Contact A, new messages from Contact B do not trigger notifications, even though they represent unseen activity in another conversation.

## What Changes
- Update the messaging notification requirements for web to define foreground/active state in terms of both tab visibility and window focus, so that minimized windows or windows on other virtual desktops are treated as background for notification eligibility.
- Extend the messaging notification requirements to distinguish between the conversation currently in view and other conversations, ensuring that notifications are suppressed only when the user is actively viewing the same conversation as the incoming message.
- Clarify how the existing browser notification requirement applies to multi-conversation scenarios, including when the user is on the contacts list or another non-chat route.

## Impact
- Affected specs: `messaging`.
- Affected code: new-message notification gating logic in `src/lib/core/NotificationService.ts`, routing and URL-based context used to infer the currently active conversation, and any tests that assert when browser notifications should be shown or suppressed.
