## ADDED Requirements

### Requirement: Android Contact QR Scan Add Flow
The messaging experience SHALL allow users running the Android Capacitor app shell to add a new contact by scanning a `nostr:npub` QR code from the contacts header using a live camera preview.

#### Scenario: Android contact QR scan button visible
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the app is running inside the Android Capacitor app shell
- **WHEN** the contacts header is rendered
- **THEN** the header SHALL display an Android-only "+" control immediately to the right of the "Contacts" label
- **AND** this control SHALL NOT be rendered when the app is running in a standard web browser outside the Android shell.

#### Scenario: Live camera preview opens from contacts header
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell and viewing the contacts list
- **WHEN** the user taps the "+" control in the contacts header
- **THEN** the system SHALL open a glass-style full-screen "Scan contact QR" modal
- **AND** the modal SHALL show a live camera preview from the device's rear-facing camera while it is open
- **AND** the modal SHALL continuously sample frames from the preview to attempt QR decoding until either a valid contact QR is found, the user closes the modal, or an unrecoverable camera error occurs.

#### Scenario: Valid nostr npub QR opens confirmation modal
- **GIVEN** the "Scan contact QR" modal is open with an active live camera preview inside the Android Capacitor app shell
- **WHEN** the system successfully decodes a QR code from the preview whose text payload is either exactly a `npub` value or a `nostr:npub` URI (for example, `nostr:npub1…`)
- **THEN** the system SHALL normalize this payload to the underlying `npub` string
- **AND** SHALL stop the live camera preview and close the "Scan contact QR" modal
- **AND** SHALL open a separate "Contact from QR" confirmation modal that displays at least the resolved display name (or a shortened `npub` fallback) and profile picture when available for the scanned `npub`.

#### Scenario: Confirming add contact from QR creates a new contact
- **GIVEN** the "Contact from QR" confirmation modal is open for a scanned `npub` value that is not yet present in the user's contacts
- **WHEN** the user confirms by choosing to add the contact
- **THEN** the system SHALL invoke the same "add by npub" contact flow used by the Manage Contacts modal, including any profile resolution behavior
- **AND** upon success, the new contact SHALL appear in the contacts list with the same fields and display behavior as a contact added via direct `npub` entry.

#### Scenario: Already-existing contacts detected from QR
- **GIVEN** the "Contact from QR" confirmation modal is open for a scanned `npub` value
- **WHEN** the system determines that this `npub` is already present in the user's contacts
- **THEN** the modal SHALL indicate that the contact is already in the user's contacts
- **AND** SHALL NOT present an option to add a duplicate contact
- **AND** SHALL allow the user to dismiss the modal without modifying the contacts list.

#### Scenario: Non-npub QR codes are rejected gracefully
- **GIVEN** the "Scan contact QR" modal is open with an active live camera preview
- **WHEN** the system decodes a QR code whose text payload is not a `npub` value and does not match the `nostr:npub` URI form
- **THEN** the system SHALL treat this QR as invalid for the contact scan feature
- **AND** SHALL display a non-blocking error message indicating that the QR code does not contain a valid contact `npub`
- **AND** the modal SHALL remain open so the user can attempt to scan a different QR code or close the modal.

#### Scenario: Scan feature remains Android-only
- **GIVEN** the user is accessing nospeak in a standard web browser rather than the Android Capacitor app shell
- **WHEN** the contacts list is rendered and the user manages contacts
- **THEN** no "Scan QR" control SHALL be shown in the contacts header
- **AND** no live camera-based QR scan modal SHALL be exposed as part of the manage-contacts experience.
