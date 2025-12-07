## ADDED Requirements
### Requirement: Mobile contacts header shows app name
The contacts sidebar header on mobile-sized layouts SHALL display the nospeak app name label next to the current user's avatar so that users can clearly recognize the app context when viewing or switching contacts.

#### Scenario: Mobile contacts header includes app name
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout (for example, screen width <= 768px or native mobile shell)
- **WHEN** the contacts sidebar header is rendered
- **THEN** the current user's avatar is shown
- **AND** a textual "nospeak" label appears adjacent to the avatar within the same header grouping
- **AND** the existing settings control remains accessible on the opposite side of the header without overlapping the label.
