## Context

The Android native background messaging service (`NativeBackgroundMessagingService.java`) runs as a foreground service to receive gift-wrapped DM events (kind 1059) while the app is backgrounded. It maintains its own WebSocket connections separate from the WebView's `ConnectionManager`.

Currently, the service only handles `EVENT` and `EOSE` message types. When relays require NIP-42 authentication:
1. `AUTH` challenges are ignored
2. `CLOSED` messages with `auth-required:` are ignored
3. The subscription silently fails and no messages are received

This creates a gap where users with authenticated relays don't receive background notifications.

## Goals / Non-Goals

**Goals:**
- Enable the native service to authenticate with relays that require NIP-42
- Support both `nsec` mode (local signing) and `amber` mode (NIP-55 ContentResolver)
- Maintain parity with WebView authentication behavior
- Minimal code changes to existing service structure

**Non-Goals:**
- Proactive authentication on connect (per NIP-42 spec)
- Complex retry strategies beyond single retry with delay
- UI feedback for auth state in native service (WebView handles this)

## Decisions

### Decision: Use existing BouncyCastle for Schnorr signing

The service already uses BouncyCastle for secp256k1 ECDH operations (NIP-44 decryption). We'll extend this to implement BIP-340 Schnorr signatures for kind 22242 AUTH events in `nsec` mode.

**Alternatives considered:**
- Add secp256k1-kmp library: Would add dependency but provide cleaner API
- Call WebView for signing: Would require complex bridge, defeats purpose of native service

### Decision: Reactive authentication only

Per NIP-42 spec: "SHALL NOT proactively authenticate on connect absent a relay challenge." We'll only authenticate when:
1. Relay sends `CLOSED` with `auth-required:` for our subscription
2. We have a stored challenge from a previous `AUTH` message

### Decision: Single retry with 5-second delay

On auth failure, retry once after 5 seconds. If that fails, mark relay as failed and wait for natural reconnection cycle. This matches the simplicity requested and avoids complex retry logic.

### Decision: Pass relay URL to message handler

Currently `handleNostrMessage(WebSocket, String)` doesn't know which relay sent the message. We'll capture `relayUrl` in the WebSocket listener closure and pass it through, enabling per-relay auth state tracking.

## Risks / Trade-offs

- **Risk:** Schnorr signing adds ~60 lines of crypto code
  - Mitigation: Well-tested BIP-340 algorithm, BouncyCastle handles EC math

- **Risk:** Amber may not have granted kind 22242 permission
  - Mitigation: Add 22242 to permission request; ContentResolver returns null/rejected if not granted, triggering fallback error handling

- **Trade-off:** Auth state is not persisted across service restarts
  - Acceptable: Fresh auth on reconnect is normal NIP-42 behavior

## Migration Plan

No migration needed. Changes are additive to existing service behavior.

## Open Questions

None - all decisions confirmed with user.
