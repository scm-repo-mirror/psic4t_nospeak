## Why
Some Nostr relays require NIP-42 authentication (client `AUTH`) before they will accept writes or serve certain reads (notably encrypted DMs). The nospeak web client currently signs events for identity, but does not respond to relay `AUTH` challenges, which can cause:
- Direct message publishes to fail with `auth-required` errors.
- Subscriptions (including real-time gift-wrap subscriptions) to be closed with `auth-required` reasons.

Adding NIP-42 support improves compatibility with relays that enforce authenticated access without introducing server-side accounts.

## What Changes
- Implement NIP-42 client authentication for both relay writes (publishing events) and reads (subscriptions).
- Authenticate only when a relay requires it:
  - When the relay sends an `AUTH` challenge message, or
  - When a publish or subscription is rejected with an `auth-required:` reason.
- Retry the original publish or subscription once after successful authentication, while avoiding infinite auth loops.
- Persist per-relay auth requirement state while the app is running (once a relay is observed to require auth, it remains marked as requiring auth across reconnects).
- Surface auth status in the relay status UI:
  - Relay Connections modal shows per-relay auth status and last auth error.
  - Connection status button uses green/yellow/red indicator and shows aggregate auth counts for connected relays.
- When authentication is required but no signer is available, mark auth as failed with `lastAuthError="Missing signer"`.

## Impact
- Affected specs: `messaging`, `relay-management`.
- Affected code (implementation stage): relay connection manager, publish deadline wrapper, retry queue, subscription management, and relay status UI.
- User impact:
  - Relays that require auth should start working for DM reads and writes.
  - Some signers may prompt the user to sign NIP-42 auth events when a relay requires it.
- Risk/compatibility:
  - If a relay requires auth but never sends an `AUTH` challenge, the client may still fail gracefully; this will be visible in relay status as `Auth: Failed`.
