## ADDED Requirements

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
