# relay-management Specification

## Purpose
TBD - created by archiving change update-relay-connections-modal. Update Purpose after archive.
## Requirements
### Requirement: Relay Connections Modal Behavior
The system SHALL present Relay Connections management as a blocking modal overlay on both desktop and mobile/Android, instead of a separate window on mobile, so that users experience a consistent relay configuration workflow across platforms.

#### Scenario: Desktop Relay Connections modal overlay
- **GIVEN** the user is viewing the messaging interface on a desktop-sized layout
- **WHEN** the user opens Relay Connections from the UI
- **THEN** the system SHALL display a centered modal overlay that sits above the main app window and background
- **AND** interaction with the underlying chat and contacts surfaces SHALL be blocked while the Relay Connections modal is open
- **AND** closing the modal SHALL return focus to the previously active messaging context.

#### Scenario: Mobile Relay Connections modal overlay
- **GIVEN** the user is using the app on a mobile or Android device
- **WHEN** the user opens Relay Connections from the UI
- **THEN** the system SHALL display Relay Connections as a full-screen or near-full-screen modal overlay instead of navigating to a separate window or page
- **AND** interaction with the underlying messaging UI SHALL be blocked until the modal is dismissed
- **AND** closing the modal SHALL return the user to the same conversation or screen they were viewing before opening Relay Connections.

### Requirement: Temporary Messaging Relays and Retry Behavior
The messaging stack SHALL manage temporary relay connections used for sending NIP-17 direct messages in a way that avoids silently dropping events sent in quick succession (such as a Kind 15 file message followed immediately by a Kind 14 caption message).

#### Scenario: Temporary messaging relays stay alive long enough for queued DMs
- **GIVEN** the messaging service opens one or more temporary relay connections to send encrypted gift-wrap events (kind 1059) for a NIP-17 conversation
- **WHEN** multiple gift-wrap events are enqueued for the same conversation within a short time window (for example, a Kind 15 file message followed immediately by a Kind 14 caption reply)
- **THEN** those temporary relay connections SHALL remain managed and eligible for publish attempts by the retry queue for at least 15 seconds after the first event is enqueued
- **AND** the retry queue SHALL be allowed to perform its normal retry/backoff behavior for each enqueued event before any associated temporary relay connection is torn down.

#### Scenario: Retry queue does not silently drop DMs due to early relay cleanup
- **GIVEN** an encrypted gift-wrap event (kind 1059) for a NIP-17 conversation has been enqueued to the retry queue for delivery to a particular relay
- **WHEN** the underlying relay connection is cleaned up as a temporary connection
- **THEN** the retry queue SHALL NOT immediately drop the pending event solely because the relay is no longer managed
- **AND** instead SHALL either keep the event until its retry limit is exhausted while the connection lifecycle honors the minimum 15 second window, or re-establish a temporary connection for that relay according to relay-management policies.

### Requirement: NIP-42 Relay Authentication for Relay Connections
The relay connection layer SHALL support NIP-42 client authentication (kind `22242` `AUTH`) when a relay requires it for reads or writes. The system SHALL authenticate only when required by the relay, and SHALL NOT proactively authenticate on connect absent a relay challenge or explicit `auth-required:` rejection.

When a relay requires authentication:
- The system SHALL attempt to authenticate using the current session signer.
- If authentication succeeds, the system SHALL retry the original operation (publish or subscription) exactly once.
- If authentication is required but the session has no signer, the system SHALL mark relay auth as failed with `lastAuthError="Missing signer"`.
- The system SHALL avoid infinite auth loops by limiting retries and preserving the failure state.

#### Scenario: Relay requires auth before accepting an EVENT publish
- **GIVEN** Relay A requires NIP-42 authentication for accepting event publishes
- **AND** the user is authenticated and a signer is available
- **WHEN** the client attempts to publish an event to Relay A
- **AND** the relay rejects the publish with an `auth-required:` reason
- **THEN** the client SHALL perform NIP-42 authentication in response to the relay challenge
- **AND** SHALL retry the publish exactly once after authentication succeeds
- **AND** if the publish is subsequently acknowledged by the relay, the publish attempt SHALL be treated as successful.

#### Scenario: Relay requires auth but there is no signer
- **GIVEN** Relay B requires NIP-42 authentication
- **AND** the user is not authenticated or no signer is available
- **WHEN** the relay challenges the client or rejects an operation with `auth-required:`
- **THEN** the system SHALL mark Relay B as `Auth: Failed`
- **AND** SHALL set `lastAuthError` to `Missing signer`.

### Requirement: Web/PWA Connection Keep-Alive and Recovery
The relay connection manager for web and PWA environments SHALL maintain durable WebSocket connections to the user's configured messaging relays by using application-level keep-alive pings and visibility-based connection recovery. This ensures connections remain active during extended background periods when browser timer throttling and NAT timeouts would otherwise cause silent connection drops.

The connection manager SHALL:
- Send periodic application-level ping messages to all persistent relay connections using a lightweight Nostr subscription request (for example, a REQ with an impossible filter that immediately receives EOSE) to keep NAT mappings alive and detect dead connections.
- Use a ping interval of **120 seconds** (2 minutes) to match Android active profile behavior.
- Use a ping timeout of **5 seconds** to detect unresponsive connections.
- Listen for browser visibility change events and immediately verify actual WebSocket state for all relays when the tab or PWA becomes visible.
- Verify actual WebSocket `readyState` during health checks rather than relying solely on cached connection state.
- Trigger reconnection attempts for any relay where the underlying WebSocket is no longer in OPEN state.

#### Scenario: Ping keeps NAT mappings alive during background operation
- **GIVEN** the user is running nospeak as a PWA or in a browser tab
- **AND** at least one persistent relay connection is active
- **WHEN** the application remains in the background or idle for several minutes
- **THEN** the connection manager SHALL send application-level ping messages at 120-second intervals
- **AND** relays that respond within the ping timeout SHALL remain marked as connected
- **AND** relays that fail to respond within 5 seconds SHALL be marked as disconnected and scheduled for reconnection.

#### Scenario: Visibility change triggers immediate connection verification
- **GIVEN** the user is running nospeak as a PWA or in a browser tab
- **AND** the tab or PWA has been in the background or hidden
- **WHEN** the user returns to the app and the document becomes visible
- **THEN** the connection manager SHALL immediately verify the actual WebSocket state of all relay connections
- **AND** any relay whose WebSocket is no longer OPEN SHALL be marked as disconnected and scheduled for reconnection
- **AND** the UI SHALL reflect the updated connection state.

#### Scenario: Health check detects stale connection state
- **GIVEN** the connection manager tracks a relay as connected based on cached state
- **AND** the underlying WebSocket has silently closed (for example, due to NAT timeout or server-side idle disconnect)
- **WHEN** the periodic health check runs
- **THEN** the connection manager SHALL verify the actual WebSocket `readyState`
- **AND** SHALL clear the stale connected state and trigger reconnection if the socket is CLOSED or CLOSING.

#### Scenario: Ping timeout triggers reconnection
- **GIVEN** a persistent relay connection is active
- **AND** the connection manager sends an application-level ping
- **WHEN** the relay does not respond with EOSE within 5 seconds
- **THEN** the connection manager SHALL mark the relay as disconnected
- **AND** SHALL close the existing socket and schedule a reconnection attempt using standard backoff behavior.

### Requirement: Relay Authentication Status Visibility
The Relay Connections UI SHALL surface per-relay authentication status alongside basic connection health so users can diagnose why a relay is failing.

Per relay, the system SHALL expose at least the following auth states:
- `not_required`
- `required`
- `authenticating`
- `authenticated`
- `failed`

The connection status control (relay indicator button) SHALL reflect auth state using:
- A green indicator when at least one relay is connected and no connected relay is in `failed` state and no connected relay is pending auth.
- A yellow indicator when at least one relay is connected and at least one connected relay is in `required` or `authenticating` state.
- A red indicator when no relays are connected, or when any connected relay is in `failed` state.

Auth counts shown in the connection status control SHALL be computed for connected relays only.

#### Scenario: Relay Connections UI shows auth status and aggregates
- **GIVEN** the user is viewing the authenticated messaging UI
- **AND** at least one relay is connected
- **AND** one connected relay has required NIP-42 authentication during this session
- **WHEN** the user opens the Relay Connections modal
- **THEN** the modal SHALL show each relay’s auth status
- **AND** if a relay is in `failed` state, the modal SHALL display the last auth error message
- **AND** the connection status control SHALL show an auth count summary for connected relays and use the appropriate green/yellow/red indicator.

