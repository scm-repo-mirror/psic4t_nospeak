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

