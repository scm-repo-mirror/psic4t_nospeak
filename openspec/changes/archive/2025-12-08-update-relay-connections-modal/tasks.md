## 1. Implementation
- [x] 1.1 Update Relay Connections UI to be driven by the global modal host instead of a separate mobile/Android window.
- [x] 1.2 Ensure Relay Connections opens as a blocking overlay modal on desktop, mobile web, and Android shell builds.
- [x] 1.3 Apply the same glassmorphism surface treatment, layout spacing, and motion used by the first-time sync progress modal to the Relay Connections modal container.
- [x] 1.4 Confirm that opening and closing Relay Connections returns the user to the same messaging context (conversation or view) they were on before.

## 2. Validation
- [ ] 2.1 Manually test Relay Connections on desktop to verify modal overlay behavior, blocking interactions, and glassmorphism styling.
- [ ] 2.2 Manually test Relay Connections on mobile web and Android to verify it appears as a modal (not a separate window), blocks background interaction, and matches SyncProgress modal styling.
- [x] 2.3 Run the full test suite and `npm run check` to ensure no regressions.
