## 1. Implementation
- [x] 1.1 Extend the `Contact` store model to include an optional last-message preview text field derived from stored messages.
- [x] 1.2 Update contacts refresh logic to load the most recent message per contact from the message repository and compute a normalized, single-line preview string.
- [x] 1.3 Update the contacts list UI to render a truncated last-message preview line under each contact name on mobile-sized layouts only, preserving existing theming and unread indicators.
- [x] 1.4 Add or update tests to cover contact list last-message preview behavior, including contacts with and without messages and desktop vs mobile layout differences.
- [x] 1.5 Run `npm run check` and `npx vitest run` and perform manual verification on desktop and mobile breakpoints.
