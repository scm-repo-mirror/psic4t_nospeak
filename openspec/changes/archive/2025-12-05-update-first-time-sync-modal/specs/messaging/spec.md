## MODIFIED Requirements
### Requirement: First-Time Sync Progress Indicator
The system SHALL display a blocking modal progress indicator during first-time message synchronization on both desktop and mobile devices to inform users of sync status and prevent interaction until complete. The indicator SHALL show the number of fetched messages and update in real time as history sync batches are processed.

#### Scenario: Desktop progress displayed in blocking modal
- **GIVEN** the user is on a desktop device (screen width > 768px)
- **AND** this is a first-time sync (empty cache)
- **WHEN** message synchronization is in progress
- **THEN** a blocking modal overlay covers the main chat interface and displays "Syncing messages... (X fetched)"
- **AND** the fetched message count updates in real time as batches complete
- **AND** the underlying chat area does not accept input while the modal is visible

#### Scenario: Mobile progress displayed in shared blocking modal
- **GIVEN** the user is on a mobile device (screen width <= 768px)
- **AND** this is a first-time sync (empty cache)
- **WHEN** message synchronization is in progress
- **THEN** the same blocking modal overlay is displayed with "Syncing messages... (X fetched)"
- **AND** the user cannot interact with the application until sync completes
- **AND** the fetched message count updates in real time as batches complete

#### Scenario: Progress indicator dismissal
- **GIVEN** the first-time sync progress indicator is displayed
- **WHEN** message synchronization completes
- **THEN** the progress indicator is removed
- **AND** on desktop, the application navigates to the contact with the newest message
