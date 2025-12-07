## ADDED Requirements
### Requirement: Mobile contacts header app name styling
The nospeak app name label in the mobile contacts sidebar header SHALL follow the existing visual design system for typography, spacing, and glassmorphism so that the label feels integrated with the rest of the interface.

#### Scenario: App name label matches visual language
- **GIVEN** the nospeak app name label is rendered next to the current user's avatar in the contacts header on a mobile-sized layout
- **WHEN** the header is displayed in light or dark theme
- **THEN** the label uses a small, bold type treatment consistent with other header labels
- **AND** the text color respects the active Catppuccin theme for readability
- **AND** the spacing between the avatar, label, and settings control aligns with the glassmorphism-based layout without causing overlap or truncation in typical mobile widths.
