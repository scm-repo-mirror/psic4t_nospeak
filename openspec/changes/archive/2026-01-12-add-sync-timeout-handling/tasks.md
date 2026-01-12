## 1. Toast System

- [x] 1.1 Create `src/lib/stores/toast.ts` with toast store, types, and `showToast`/`dismissToast` functions
- [x] 1.2 Create `src/lib/components/Toast.svelte` component with stacked toasts, auto-dismiss, and type-based styling
- [x] 1.3 Add `Toast` component to `src/routes/+layout.svelte`

## 2. Sync Store Updates

- [x] 2.1 Add `RelayError` interface and new state fields to `src/lib/stores/sync.ts`:
  - `hasError`, `errorMessage`, `relayErrors[]`
  - `canDismiss`, `isBackgroundMode`, `startedAt`
- [x] 2.2 Add new exported functions:
  - `setSyncError(message: string)`
  - `addRelayError(url: string, error: string, step: LoginSyncStepId)`
  - `setCanDismiss(canDismiss: boolean)`
  - `setBackgroundMode()`
  - `resetSyncFlow()`

## 3. AuthService Timeout and Error Handling

- [x] 3.1 Add constants `SYNC_GLOBAL_TIMEOUT_MS` (5 min) and `SYNC_DISMISS_DELAY_MS` (2 min)
- [x] 3.2 Refactor `runLoginHistoryFlow` to wrap sync in `Promise.race` with timeout
- [x] 3.3 Add dismiss timer that calls `setCanDismiss(true)` after 2 minutes
- [x] 3.4 Track relay errors during each step (catch errors, call `addRelayError`)
- [x] 3.5 On timeout or error, call `setSyncError` with collected relay errors
- [x] 3.6 Support background mode: continue sync when modal dismissed, show toast on completion
- [x] 3.7 Add `retrySyncFlow()` method that resets state and re-runs the flow

## 4. SyncProgressModal UI Updates

- [x] 4.1 Import additional sync state (`hasError`, `errorMessage`, `relayErrors`, `canDismiss`)
- [x] 4.2 Add error state UI: error icon, error message, relay errors list with step context
- [x] 4.3 Add "Retry" button that calls `authService.retrySyncFlow()`
- [x] 4.4 Add "Skip and continue" button that sets background mode and closes modal
- [x] 4.5 Add "Continue in background" button (visible when `canDismiss` is true)

## 5. Translations

- [x] 5.1 Add sync error keys to `src/lib/i18n/locales/en.ts`
- [x] 5.2 Add sync error keys to `src/lib/i18n/locales/de.ts`
- [x] 5.3 Add sync error keys to `src/lib/i18n/locales/es.ts`
- [x] 5.4 Add sync error keys to `src/lib/i18n/locales/fr.ts`
- [x] 5.5 Add sync error keys to `src/lib/i18n/locales/it.ts`
- [x] 5.6 Add sync error keys to `src/lib/i18n/locales/pt.ts`

## 6. Validation

- [x] 6.1 Run `npm run check` and fix any type errors
- [x] 6.2 Run `npx vitest run` and ensure tests pass
- [ ] 6.3 Manual test: simulate slow relay to verify 5-min timeout triggers error UI
- [ ] 6.4 Manual test: verify "Continue in background" appears after 2 minutes
- [ ] 6.5 Manual test: verify toast appears when background sync completes
