## 1. Implementation
- [x] 1.1 Update notification default preference to opt-out
- [x] 1.2 Update Android background messaging default to opt-out
- [x] 1.3 Prompt notification permission once on explicit login
- [x] 1.4 Rename Settings label to “Notifications”
- [x] 1.5 Hide background messaging when notifications off
- [x] 1.6 Disable background service when notifications off
- [x] 1.7 Prevent Android boot/start when notifications off

## 2. Tests
- [x] 2.1 Add AuthService tests for one-time permission prompt
- [x] 2.2 Update notification/background messaging tests for new defaults

## 3. Validation
- [x] 3.1 Run `npm run check`
- [x] 3.2 Run `npx vitest run`
- [ ] 3.3 Manually sanity-check Android toggle behavior
