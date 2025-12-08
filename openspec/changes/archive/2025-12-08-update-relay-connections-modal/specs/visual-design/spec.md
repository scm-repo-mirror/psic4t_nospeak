## ADDED Requirements
### Requirement: Relay Connections Modal Visual Design
The Relay Connections modal SHALL use the same glassmorphism-based visual treatment, layout structure, and motion patterns as the existing first-time sync progress modal so that relay management feels like a cohesive part of the primary app surfaces.

#### Scenario: Relay Connections modal matches SyncProgress glassmorphism treatment
- **GIVEN** the Relay Connections modal is displayed on desktop or mobile
- **WHEN** the modal surface is rendered
- **THEN** it SHALL use semi-transparent glass backgrounds with blur, soft rounded corners, subtle borders, and shadows consistent with the first-time sync progress modal
- **AND** it SHALL respect the active Catppuccin theme tokens for light and dark modes while preserving text and control legibility.

#### Scenario: Relay Connections modal aligns with primary modal layout and motion
- **GIVEN** the Relay Connections modal is opened or closed
- **WHEN** the modal appears over the authenticated app window
- **THEN** it SHALL be positioned and sized consistent with other primary modals defined in the visual design spec (centered on desktop, full-screen glass surface on mobile)
- **AND** it SHALL use the same modal open/close transitions (backdrop fade and content scale/fade) as the first-time sync progress modal.
