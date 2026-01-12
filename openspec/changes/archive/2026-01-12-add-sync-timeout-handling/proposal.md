# Change: Add Sync Timeout Handling and Error Recovery

## Why

Users report waiting 10+ minutes on the initial history sync screen after login with no feedback or escape path. The current implementation has per-batch timeouts but no global sync timeout, no error UI, and no way to dismiss the modal or retry when sync stalls or fails.

## What Changes

- Add a **5-minute global timeout** for the entire sync flow that triggers error handling when exceeded
- Display **relay-specific errors** showing which relays failed and during which step
- Provide **Retry** and **Skip and continue** buttons when sync fails or times out
- Allow users to **Continue in background** after 2 minutes of waiting, dismissing the modal while sync continues
- Show a **toast notification** when background sync completes
- Add a **minimal toast notification system** (store + component) for in-app notifications

## Impact

- Affected specs: `messaging` (First-Time Sync Progress Indicator requirement)
- Affected code:
  - `src/lib/stores/sync.ts` - add error state, relay errors, background mode
  - `src/lib/core/AuthService.ts` - global timeout, error tracking, retry support
  - `src/lib/components/SyncProgressModal.svelte` - error UI, action buttons
  - `src/lib/stores/toast.ts` - new toast store
  - `src/lib/components/Toast.svelte` - new toast component
  - `src/routes/+layout.svelte` - add Toast component
  - `src/lib/i18n/locales/*.ts` - add translation keys (6 languages)
