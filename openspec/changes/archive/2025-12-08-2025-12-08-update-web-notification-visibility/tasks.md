## 1. Specification and Design
- [x] 1.1 Review existing `messaging` notification requirements and document current web behavior for visibility, focus, and per-conversation suppression.
- [x] 1.2 Finalize notification eligibility rules for web, covering foreground tab, minimized window, virtual desktops, and different active conversations.

## 2. Implementation
- [x] 2.1 Update `NotificationService.showNewMessageNotification` to treat the app as foreground only when the nospeak tab is visible and has focus, and to consider the currently active conversation when deciding whether to suppress a notification.
- [x] 2.2 Derive the active conversation identifier from the current URL or routing state and compare it to the incoming message recipient so that notifications are suppressed only for messages in the conversation currently in view.
- [x] 2.3 Ensure Android local notification behavior remains unchanged and continues to bypass web-specific visibility and conversation checks.

## 3. Validation
- [x] 3.1 Extend or add unit tests around `NotificationService` to cover foreground vs background tab, minimized/other-desktop cases (as far as observable in the browser APIs), and same-conversation vs different-conversation notifications.
- [x] 3.2 Manually verify desktop browser and PWA behavior for: background tab, minimized window, virtual desktops/workspaces, and active-conversation vs other-conversation messages.
- [x] 3.3 Run `npm run check` and `npx vitest run` to ensure type-checking and tests pass.
