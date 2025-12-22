## MODIFIED Requirements

### Requirement: Media Upload Support
The system SHALL allow users to upload images, videos, and MP3 audio files as encrypted attachments in NIP-17 conversations.

Uploads SHALL be performed using Blossom servers:
- If the user has one or more configured Blossom servers, the client SHALL upload the encrypted blob to Blossom servers using BUD-03 server ordering and Blossom authorization events (kind `24242`) as defined by BUD-01/BUD-02.
- If the user has zero configured Blossom servers and attempts an upload, the client SHALL automatically configure the default Blossom server list (deployment-configurable; defaults: `https://blossom.data.haus`, `https://blossom.primal.net`), SHALL display an in-app informational modal indicating these servers were set, and SHALL then upload using Blossom as normal.

When Blossom uploads are used:
- The client MUST attempt to upload the blob to at least the first configured Blossom server.
- After the first successful upload, the client SHOULD attempt to mirror the blob to the remaining configured servers using BUD-04 `PUT /mirror` with the origin blob `url` in the request body.
- Mirroring SHOULD be best-effort and MUST NOT block the message send that depends on the primary upload.
- If a target Blossom server responds to `PUT /mirror` with HTTP `404`, `405`, or `501`, the client MAY fall back to re-uploading the blob to that server using `PUT /upload` on a best-effort basis.

#### Scenario: Client mirrors to a secondary Blossom server using BUD-04
- **GIVEN** the user has at least two configured Blossom server URLs
- **WHEN** the client uploads an encrypted blob to the first server using `PUT /upload` and receives a blob descriptor with a `url`
- **THEN** the client SHOULD send `PUT /mirror` to the second server with JSON body `{ "url": <primary url> }`
- **AND** the request SHOULD include a valid Blossom authorization event (kind `24242` with `t=upload` and an `x` tag matching the blob’s SHA-256)
- **AND** any failure to mirror MUST NOT prevent sending the file message using the primary server `url`.

#### Scenario: Mirror endpoint unsupported triggers fallback upload
- **GIVEN** the user has at least two configured Blossom server URLs
- **AND** the secondary server responds to `PUT /mirror` with HTTP `404`, `405`, or `501`
- **WHEN** the client attempts best-effort mirroring
- **THEN** the client MAY fall back to uploading the blob to the secondary server using `PUT /upload`.

#### Scenario: Mirror endpoint auth failure does not trigger fallback upload
- **GIVEN** the user has at least two configured Blossom server URLs
- **AND** the secondary server responds to `PUT /mirror` with HTTP `401` or `403`
- **WHEN** the client attempts best-effort mirroring
- **THEN** the client MUST NOT fall back to re-uploading the blob to that server.

### Requirement: Manage Contacts Search via NIP-50 Relay
The Manage Contacts modal SHALL support searching for users by name or phrase using a dedicated NIP-50 search relay, while preserving the existing direct-add behavior for `npub` inputs.

The NIP-50 search relay URL SHALL be deployment-configurable at runtime (default: `wss://relay.nostr.band`) and MUST use `wss://`.

#### Scenario: Direct npub entry bypasses search
- **GIVEN** the user opens the Manage Contacts modal
- **AND** the user enters a value that starts with `npub` into the contact input field
- **WHEN** the user clicks the "Add" button
- **THEN** the system SHALL treat the value as an `npub`
- **AND** SHALL attempt to resolve the profile and add the contact using the existing direct-add flow without performing a search

#### Scenario: Phrase input triggers search
- **GIVEN** the user opens the Manage Contacts modal
- **AND** the user enters a non-empty value that does not start with `npub` into the contact input field
- **AND** the entered value is at least three characters long after trimming whitespace
- **WHEN** the user stops typing for a short period
- **THEN** the system SHALL send a NIP-50 `search` query to the configured NIP-50 search relay (default: `wss://relay.nostr.band`) restricted to kind `0` metadata events with a maximum of 20 results
- **AND** the system SHALL display matching users in a dropdown under the contact input field

#### Scenario: Search results display
- **GIVEN** the system has received at least one matching user from the search relay
- **WHEN** the dropdown under the contact input is rendered
- **THEN** each result SHALL show the user's avatar when a profile picture is available
- **AND** SHALL show a primary display name derived from profile metadata when available
- **AND** SHALL show the user's shortened `npub` as secondary text
- **AND** MAY display additional metadata such as NIP-05 identifier when available

#### Scenario: Selecting a search result pre-fills npub
- **GIVEN** search results are visible in the dropdown under the contact input
- **WHEN** the user clicks on a search result
- **THEN** the system SHALL populate the contact input field with the selected user's `npub`
- **AND** SHALL close the search results dropdown
- **AND** SHALL require the user to click the existing "Add" button to finalize adding the contact

#### Scenario: Adding a contact via search result behaves like direct npub add
- **GIVEN** the user has clicked a search result and the contact input field contains the selected user's `npub`
- **WHEN** the user clicks the "Add" button
- **THEN** the system SHALL resolve the user's profile and relay information using the same logic as direct `npub` entry
- **AND** SHALL add the selected user to the contacts list with the same fields and downstream behaviour as a contact added by manually entering their `npub`

### Requirement: Post-login Empty Profile Setup Modal
After a successful login and completion of the ordered login history flow, the messaging experience SHALL display a blocking setup modal whenever the current user's profile has no configured messaging relays and no username-like metadata. The modal SHALL explain that at least one messaging relay and a basic profile identifier are required for a usable experience, SHALL pre-populate a small default set of messaging relays for the user (deployment-configurable; defaults: `wss://nostr.data.haus`, `wss://nos.lol`, `wss://relay.damus.io`) that can be edited later in Settings, and SHALL require the user to provide a simple name that is saved into their profile metadata and published to the network. The modal MAY offer a secondary dismiss action while still reappearing on future logins as long as the profile remains empty.

#### Scenario: Empty profile triggers messaging-relay setup modal on login
- **GIVEN** the user successfully logs into nospeak and the ordered login history/sync flow has completed
- **AND** the cached profile for the current user has no configured messaging relays (no kind 10050 list and no mailbox relay list translated into messaging relays)
- **AND** the profile metadata does not contain a `name`, `display_name`, or `nip05` value
- **WHEN** the main messaging UI becomes active
- **THEN** a blocking modal overlay SHALL be shown informing the user that messaging relays and profile information need to be configured for this key
- **AND** the modal SHALL explain that nospeak will configure the default messaging relays (deployment-configurable; defaults: `wss://nostr.data.haus`, `wss://nos.lol`, `wss://relay.damus.io`) on their behalf, with the ability to change them later in Settings → Messaging Relays
- **AND** the modal SHALL require the user to enter a non-empty name before continuing
- **AND** upon confirmation, the client SHALL persist the default relays as the user's messaging relays, update the profile metadata with the provided name, and publish both a NIP-17 messaging relay list (kind 10050 with `relay` tags) and profile metadata (kind 0) to all known relays including the blaster relay (deployment-configurable; default: `wss://sendit.nosflare.com`)
- **AND** the modal SHALL be shown again on subsequent logins while the profile continues to have no messaging relays and no username-like metadata (for example, if the user dismisses the modal or later removes all relays and name from their profile).

### Requirement: Sender Avatar Fallback for Messaging Notifications
When a message or reaction notification is shown for a specific sender, the system SHALL prefer showing the sender’s profile picture when available. When the sender has no profile picture, the system SHALL instead use a deterministic robohash avatar derived from the sender’s `npub` using the same seed logic as the in-app avatar fallback. The robohash base URL SHALL default to `https://robohash.org/` and MAY be overridden by deployment runtime configuration; the base URL MUST use `https://`. If the avatar cannot be resolved due to platform limitations or fetch failures, the system SHALL fall back to the branded nospeak icon while still showing the notification.

#### Scenario: Web notification uses sender profile picture when available
- **GIVEN** the user has granted notification permission and notifications are enabled in Settings
- **AND** Contact A has `metadata.picture` set to a non-empty URL
- **WHEN** a new message notification is shown for an incoming message from Contact A
- **THEN** the web/PWA notification icon uses Contact A’s `metadata.picture` URL.

#### Scenario: Web notification uses robohash avatar when profile picture missing
- **GIVEN** the user has granted notification permission and notifications are enabled in Settings
- **AND** Contact B has no profile picture (`metadata.picture` is missing or empty)
- **WHEN** a new message notification is shown for an incoming message from Contact B
- **THEN** the web/PWA notification icon uses the deterministic robohash avatar URL derived from Contact B’s `npub`.

#### Scenario: Android notification shows sender avatar as large icon
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **WHEN** a new message notification is shown for an incoming message from Contact C
- **THEN** the Android notification uses the branded nospeak icon as the small status-bar icon
- **AND** it SHOULD show Contact C’s avatar as the large icon, using Contact C’s profile picture when available and otherwise using the deterministic robohash avatar.

#### Scenario: Android notifications still fire when sender avatar cannot be resolved
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** message notifications are enabled in Settings → General
- **AND** the Android OS has granted permission for local notifications
- **AND** Contact D has no profile picture
- **AND** the robohash avatar cannot be fetched or stored (for example due to lack of network access)
- **WHEN** a new message notification is shown for an incoming message from Contact D
- **THEN** the Android OS notification is still shown
- **AND** it uses the branded nospeak icon assets required for Android notifications.
