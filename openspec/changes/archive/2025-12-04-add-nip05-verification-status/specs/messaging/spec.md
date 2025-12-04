## ADDED Requirements
### Requirement: NIP-05 Verification for Profiles and Contacts
The messaging experience SHALL treat NIP-05 identifiers as identity hints only when they have been verified against NIP-05 DNS records, and SHALL avoid displaying verification badges or icons for identifiers that have not been validated. The system SHALL cache NIP-05 verification status per profile so that messaging UIs can consistently display whether a given contact's identifier is verified, invalid for their key, or unknown.

#### Scenario: NIP-05 verified for profile pubkey
- **GIVEN** a profile metadata event of kind 0 that includes a `nip05` field with value `<local-part>@<domain>`
- **AND** the system has decoded the user's public key for that profile
- **WHEN** the client performs a NIP-05 lookup to `https://<domain>/.well-known/nostr.json?name=<local-part>`
- **AND** the JSON response contains a `names` object whose entry for `<local-part>` matches the profile's public key in hex format
- **THEN** the system SHALL record the NIP-05 status for that profile as `valid`
- **AND** SHALL persist the last-checked time alongside the profile's cached metadata for use by messaging UIs.

#### Scenario: NIP-05 invalid for profile pubkey
- **GIVEN** a profile metadata event of kind 0 that includes a `nip05` field with value `<local-part>@<domain>`
- **AND** the system has decoded the user's public key for that profile
- **WHEN** the client performs a NIP-05 lookup to `https://<domain>/.well-known/nostr.json?name=<local-part>`
- **AND** the JSON response is successfully retrieved and parsed
- **AND** the `names` object does not contain an entry for `<local-part>` that matches the profile's public key in hex format
- **THEN** the system SHALL record the NIP-05 status for that profile as `invalid`
- **AND** SHALL persist this status and last-checked time for downstream messaging UIs.

#### Scenario: NIP-05 verification unknown due to network or CORS failure
- **GIVEN** a profile metadata event of kind 0 that includes a `nip05` field
- **WHEN** the client attempts to fetch `/.well-known/nostr.json` for that identifier
- **AND** the fetch fails due to network errors, missing resource, or browser CORS restrictions
- **THEN** the system SHALL record the NIP-05 status for that profile as `unknown`
- **AND** SHALL avoid displaying the identifier as verified in any messaging UI.

#### Scenario: `_@domain` displayed as `domain` in messaging UI
- **GIVEN** a verified or unverified NIP-05 identifier of the form `_@example.com`
- **WHEN** the identifier is rendered in any messaging UI (including profile views and search results)
- **THEN** the UI SHALL display the identifier as `example.com` while still using `_@example.com` for NIP-05 verification lookups and storage.

### Requirement: NIP-05-Aware Contact Search Ranking and Badges
The Manage Contacts modal search results SHALL prefer contacts whose NIP-05 identifiers are verified for their public keys, and SHALL surface verification status using icons next to the identifier. The search experience SHALL avoid implying verification for identifiers that are unknown, and SHALL explicitly indicate identifiers that are known to be invalid for the corresponding key.

#### Scenario: Verified NIP-05 contacts appear first in search
- **GIVEN** the user types a search phrase in the Manage Contacts modal and matching results are returned from the NIP-50 search relay
- **AND** some results include a NIP-05 identifier that has been verified as valid for the result's public key
- **AND** other results include NIP-05 identifiers that are invalid or have unknown verification status
- **WHEN** the results list is rendered
- **THEN** contacts with `valid` NIP-05 status SHALL be ordered before contacts whose NIP-05 status is `unknown` or `invalid`.

#### Scenario: Search results show green checkmark for verified NIP-05
- **GIVEN** a search result row in the Manage Contacts modal includes a NIP-05 identifier
- **AND** the system has recorded that identifier as `valid` for the result's public key
- **WHEN** the row is rendered in the dropdown
- **THEN** the UI SHALL display a small green checkmark icon next to the NIP-05 identifier
- **AND** SHALL display the identifier using the `_@domain` to `domain` visual transformation when applicable.

#### Scenario: Search results show not-verified icon for invalid NIP-05
- **GIVEN** a search result row in the Manage Contacts modal includes a NIP-05 identifier
- **AND** the system has recorded that identifier as `invalid` for the result's public key
- **WHEN** the row is rendered in the dropdown
- **THEN** the UI SHALL display a small warning or information icon next to the NIP-05 identifier
- **AND** SHALL expose a tooltip or accessible label that communicates that the NIP-05 identifier is not verified for this key.

#### Scenario: Search results avoid badges for unknown NIP-05 status
- **GIVEN** a search result row in the Manage Contacts modal includes a NIP-05 identifier
- **AND** the system has not yet attempted verification or has recorded the status as `unknown`
- **WHEN** the row is rendered in the dropdown
- **THEN** the UI SHALL display the NIP-05 identifier without a verification or not-verified icon
- **AND** the row SHALL still be sortable below entries with `valid` status.

#### Scenario: Top search results are verified eagerly
- **GIVEN** the user enters a search phrase that returns multiple results from the NIP-50 search relay
- **WHEN** the client prepares to render the dropdown of results
- **THEN** the client SHALL attempt NIP-05 verification for only the top subset of results (for example, the first 5 entries that include a NIP-05 identifier)
- **AND** SHALL update each affected row's ordering and iconography as verification results become available, without blocking the initial display of results.
