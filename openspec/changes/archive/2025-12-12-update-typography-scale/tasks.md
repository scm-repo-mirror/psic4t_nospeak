## 1. Implementation
- [x] 1.1 Define shared typography utility classes for Title, Section, Body, and Meta text in the web client (e.g., Tailwind component layer in `src/app.css`).
- [x] 1.2 Apply the shared Title and Section styles to primary modal and panel titles (Settings, Relay Connections, Sync Progress, Manage Contacts, Empty Profile, Amber login, and similar surfaces).
- [x] 1.3 Apply the shared Meta style to chat timestamps, date separators, relay history status chips, relay status badges, and other small labels.
- [x] 1.4 Apply the shared Body and Meta styles to explanatory copy in Settings, first-time sync, empty-profile setup, and login helpers.
- [x] 1.5 Run `npm run check` and `npx vitest run` and fix any regressions discovered.

## 2. Validation
- [x] 2.1 Visually confirm on desktop and mobile layouts that the typography scale feels consistent across chat, Relay Connections, Settings, login, and empty-profile flows.
- [x] 2.2 Confirm that accessibility and readability remain acceptable for timestamps and meta text on both light (Latte) and dark (Frappe) themes.
- [x] 2.3 Capture before/after screenshots or notes for key views (chat with timestamps, Relay Connections modal, Settings → General, first-time sync modal) for review.