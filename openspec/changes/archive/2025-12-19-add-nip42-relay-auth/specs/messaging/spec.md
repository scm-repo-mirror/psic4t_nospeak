## ADDED Requirements

### Requirement: NIP-42 Authentication for Messaging Reads and Writes
The messaging stack SHALL support NIP-42 relay authentication for both reads (subscriptions) and writes (publishing events) when interacting with messaging relays.

- The system SHALL only authenticate when required by a relay, as indicated by either a relay `AUTH` challenge or an `auth-required:` rejection.
- When authentication is required and a signer is available, the system SHALL authenticate and then retry the original operation exactly once.
- When authentication is required but no signer is available, the system SHALL treat the relay as auth failed (see `relay-management` auth visibility requirements) and the affected messaging operation SHALL proceed according to existing failure semantics (for example, DM sending fails when no recipient relay acknowledges within the confirmation window).

#### Scenario: Subscription recovers after relay closes with auth-required
- **GIVEN** the user is logged in and the real-time gift-wrap subscription is active
- **AND** a connected relay requires NIP-42 authentication to serve DM subscriptions
- **WHEN** the relay closes the subscription with an `auth-required:` reason
- **THEN** the client SHALL authenticate to that relay using NIP-42
- **AND** SHALL re-open the subscription exactly once after authentication succeeds
- **AND** upon success, subsequent gift-wrap events delivered on that relay SHALL be processed normally.

#### Scenario: DM publish succeeds after auth-required challenge
- **GIVEN** the user submits an outgoing encrypted DM gift-wrap
- **AND** at least one recipient messaging relay requires NIP-42 authentication for accepting publishes
- **WHEN** the client attempts to publish the gift-wrap to that relay
- **AND** the relay rejects the publish with an `auth-required:` reason
- **THEN** the client SHALL authenticate using NIP-42 and retry the publish once
- **AND** if the relay acknowledges the publish after the retry within the existing confirmation window, the send attempt SHALL be treated as successful.

#### Scenario: DM send fails when all recipient relays require auth and signer is missing
- **GIVEN** the user submits an outgoing encrypted DM gift-wrap
- **AND** all recipient messaging relays require NIP-42 authentication
- **AND** the session has no signer available
- **WHEN** the client attempts to publish the gift-wrap to the recipient relays
- **THEN** the client SHALL mark auth as failed for those relays with `lastAuthError="Missing signer"`
- **AND** the send attempt SHALL fail according to existing DM delivery confirmation requirements.
