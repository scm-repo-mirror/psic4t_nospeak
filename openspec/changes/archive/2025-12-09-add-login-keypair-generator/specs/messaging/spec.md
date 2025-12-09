## ADDED Requirements
### Requirement: Login Screen Local Keypair Generator
The unauthenticated login screen SHALL provide a locally generated Nostr keypair option in addition to existing login methods (Amber and NIP-07 extension, and manual `nsec` entry). The keypair generator flow SHALL be accessible via a small link under the local `nsec` login control, SHALL open a dedicated modal that displays the newly generated `npub` and `nsec`, and SHALL offer controls to regenerate and to log in using the currently displayed secret key. Key generation SHALL occur entirely on the client using a standard Nostr keypair format, and the generated keys SHALL NOT be persisted by the keypair UI itself until or unless the user explicitly chooses to log in with them.

#### Scenario: User opens keypair generator from login screen
- **GIVEN** the unauthenticated login screen is visible with options for Amber, NIP-07 extension (when available), and manual `nsec` entry
- **WHEN** the user clicks the "Generate new keypair" link under the local `nsec` login section
- **THEN** a glass-style modal appears over the login background
- **AND** the modal displays a newly generated Nostr keypair where the `npub` and `nsec` are shown as bech32-encoded strings.

#### Scenario: User regenerates keypair in modal
- **GIVEN** the keypair generator modal is open and displaying a keypair
- **WHEN** the user clicks the recycle-style generate-again control
- **THEN** the system discards the previous keypair from the modal state
- **AND** generates and displays a new `npub`/`nsec` pair in the same modal without requiring the user to close and reopen it.

#### Scenario: User logs in using generated keypair
- **GIVEN** the keypair generator modal is open and displaying a generated keypair
- **WHEN** the user clicks the primary action button labeled "Use this keypair and login"
- **THEN** the system logs the user in using the currently displayed `nsec` via the existing local `nsec` login flow
- **AND** the resulting authenticated session behavior (including navigation to `/chat`, relay initialization, and first-time sync flows) SHALL match the behavior of a successful manual `nsec` login
- **AND** the underlying auth implementation MAY persist the `nsec` to local storage according to existing local login semantics, but the keypair generator modal itself SHALL NOT add any additional persistence beyond invoking the login action.

### Requirement: Post-login Empty Profile Setup Modal
After a successful login and completion of the ordered login history flow, the messaging experience SHALL display a blocking setup modal whenever the current user's profile has no configured messaging relays and no username-like metadata. The modal SHALL explain that at least one messaging relay and a basic profile identifier are required for a usable experience, SHALL pre-populate a small default set of read/write messaging relays for the user (nostr.data.haus, nos.lol, relay.damus.io) that can be edited later in Settings, and SHALL require the user to provide a simple name that is saved into their profile metadata and published to the network. The modal MAY offer a secondary dismiss action while still reappearing on future logins as long as the profile remains empty.

#### Scenario: Empty profile triggers setup modal on login
- **GIVEN** the user successfully logs into nospeak and the ordered login history/sync flow has completed
- **AND** the cached profile for the current user has no `readRelays` and no `writeRelays`
- **AND** the profile metadata does not contain a `name`, `display_name`, or `nip05` value
- **WHEN** the main messaging UI becomes active
- **THEN** a blocking modal overlay SHALL be shown informing the user that messaging relays and profile information need to be configured for this key
- **AND** the modal SHALL explain that nospeak will configure the default messaging relays `wss://nostr.data.haus`, `wss://nos.lol`, and `wss://relay.damus.io` on their behalf, with the ability to change them later in Settings
- **AND** the modal SHALL require the user to enter a non-empty name before continuing
- **AND** upon confirmation, the client SHALL persist the default relays as the user's read/write relays, update the profile metadata with the provided name, and publish both the relay list (NIP-65) and profile metadata (kind 0) to all known relays including the blaster relay
- **AND** the modal SHALL be shown again on subsequent logins while the profile continues to have no messaging relays and no username-like metadata (for example, if the user dismisses the modal or later removes all relays and name from their profile).
