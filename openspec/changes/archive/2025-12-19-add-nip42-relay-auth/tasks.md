## 1. Proposal
- [x] 1.1 Finalize NIP-42 relay auth proposal and spec deltas for `messaging` and `relay-management`.
- [x] 1.2 Align on UX for auth status indicator (dot color + counts) and error wording.

## 2. Connection Layer Implementation
- [x] 2.1 Extend relay health model to track auth status and last auth error.
- [x] 2.2 Wire a signer-backed `relay.onauth` handler into the relay connection manager.
- [x] 2.3 Ensure auth requirement state is sticky across reconnects.

## 3. Read Path (Subscriptions)
- [x] 3.1 Detect `auth-required:` subscription close reasons and attempt auth.
- [x] 3.2 Re-subscribe once after successful auth (with loop guard).

## 4. Write Path (Publishes)
- [x] 4.1 Detect `auth-required:` publish failures and attempt auth.
- [x] 4.2 Retry publish once after successful auth (with loop guard).
- [x] 4.3 Apply the same behavior to retry queue publishes.

## 5. UI and i18n
- [x] 5.1 Update Relay Connections modal to display per-relay auth status and last auth error.
- [x] 5.2 Update connection status button to show auth counts and to use green/yellow/red indicator.
- [x] 5.3 Add English/German translations for auth status labels.

## 6. One-off Publishers
- [x] 6.1 Update profile/relay-settings publish helpers to auth+retry when relays require NIP-42.

## 7. Tests and Validation
- [x] 7.1 Add/extend unit tests for publish auth-required → auth → retry success.
- [x] 7.2 Add unit tests for subscription auth-required → auth → resubscribe.
- [x] 7.3 Run `npm run check`.
- [x] 7.4 Run `npx vitest run`.

## 8. Manual Verification
- [x] 8.1 Verify sending a DM succeeds on an auth-required relay.
- [x] 8.2 Verify subscription recovers when a relay closes with `auth-required:`.
- [x] 8.3 Verify UI surfaces auth required/failed states and indicator colors.
