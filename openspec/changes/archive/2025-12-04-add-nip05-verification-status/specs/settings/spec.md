## ADDED Requirements
### Requirement: NIP-05 Status Display in Settings
The Settings interface SHALL surface NIP-05 verification status for the current user's configured NIP-05 identifier in the profile or general settings section. The status SHALL be derived from the same cached verification data used by messaging, and SHALL avoid implying verification when the identifier has not been checked or when verification is inconclusive.

#### Scenario: Settings shows verified NIP-05 for current user
- **GIVEN** the current user's profile metadata includes a `nip05` field
- **AND** the system has recorded the NIP-05 status as `valid` for the user's public key based on a successful lookup to `/.well-known/nostr.json`
- **WHEN** the user opens the Settings view containing their NIP-05 field
- **THEN** the UI SHALL display the NIP-05 identifier using the `_@domain` to `domain` visual transformation when applicable
- **AND** SHALL show a clear textual or icon-based indicator that the identifier is verified for the current key.

#### Scenario: Settings shows not-verified state for invalid NIP-05
- **GIVEN** the current user's profile metadata includes a `nip05` field
- **AND** the system has recorded the NIP-05 status as `invalid` for the user's public key
- **WHEN** the user opens the Settings view containing their NIP-05 field
- **THEN** the UI SHALL display the NIP-05 identifier
- **AND** SHALL display a clear \"not verified\" state (for example, a warning icon and explanatory text) indicating that the identifier does not match the current key according to NIP-05 records.

#### Scenario: Settings shows neutral state for unknown NIP-05
- **GIVEN** the current user's profile metadata includes a `nip05` field
- **AND** the system either has not yet attempted verification or has recorded the status as `unknown` due to network or CORS failure
- **WHEN** the user opens the Settings view containing their NIP-05 field
- **THEN** the UI SHALL display the NIP-05 identifier without a verified or not-verified badge
- **AND** MAY display a short helper message explaining that verification has not completed or could not be confirmed.

#### Scenario: Editing NIP-05 resets status until re-verified
- **GIVEN** the Settings view allows the user to edit their NIP-05 identifier
- **AND** the system has previously recorded a NIP-05 status for the old value
- **WHEN** the user changes the NIP-05 field to a different value and saves their profile
- **THEN** the previous NIP-05 status SHALL be cleared or marked as unknown for the new value
- **AND** the system SHALL perform a fresh verification attempt for the new identifier before displaying it as verified in Settings or messaging UIs.
