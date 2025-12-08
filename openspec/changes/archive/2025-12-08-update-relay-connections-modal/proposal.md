# Change: Unify Relay Connections as Glassmorphism Modal

## Why
The current Relay Connections UI appears as a modal on desktop but as a separate window on mobile/Android, which feels inconsistent with the rest of the app and with the first-time sync experience. Aligning Relay Connections to use the same glassmorphism modal treatment as the initial sync modal will create a more cohesive, modern experience across platforms.

## What Changes
- Update the Relay Connections UI to use a blocking modal overlay on both desktop and mobile/Android rather than a separate window on mobile.
- Style the Relay Connections modal using the same glassmorphism visual language and layout patterns as the existing first-time sync progress modal.
- Ensure the Relay Connections modal is rendered at the root overlay layer so that it visually matches other primary modals and respects theme and responsiveness rules.

## Impact
- Affected specs: `relay-management`, `visual-design` (glassmorphism surfaces and modal patterns).
- Affected code: Relay connections management UI (desktop and mobile), modal host/layout in `src/routes/+layout.svelte` and related components (e.g., Relay Connections modal component, SyncProgressModal styling helpers).
