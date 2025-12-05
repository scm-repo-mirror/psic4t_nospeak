# Change: Unify First-Time Sync Progress Modal Across Devices

## Why
The initial message sync experience currently uses two different UI patterns: a blocking modal overlay on mobile and an inline status view in the desktop chat area. This inconsistency is confusing and the mobile-style modal has been identified as the preferred design.

## What Changes
- Update messaging requirements so first-time sync progress is shown using a single blocking modal overlay on both desktop and mobile.
- Clarify that the modal shows a live-updating fetched message count during history sync.
- Preserve the existing behavior where, after first-time sync completes, desktop automatically navigates to the contact with the newest message.

## Impact
- Affected specs: `messaging` (First-Time Sync Progress Indicator requirement)
- Affected code: `src/routes/chat/+layout.svelte`, `src/routes/chat/+page.svelte`, `src/lib/components/SyncProgressModal.svelte`, and any other views that reference first-time sync status.
