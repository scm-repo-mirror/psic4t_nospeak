## ADDED Requirements

### Requirement: Themed Logo and Icon Branding for Messaging
The messaging interface and related browser surfaces SHALL use the updated nospeak logo with Catppuccin-aligned coloring. In-app chat views SHALL render the nospeak logo using a theme-aware style that displays Latte Lavender in bright/light appearances and a white logo matching Frappe text color in dark appearances. Browser favicons, PWA icons, and messaging notification icons SHALL use a Latte Text-tinted version of the nospeak logo.

#### Scenario: Chat header logo reflects bright theme
- **GIVEN** the effective theme is light (Catppuccin Latte)
- **WHEN** the user views any chat conversation
- **THEN** the nospeak logo shown in the chat header appears in a bright violet consistent with Catppuccin Latte Lavender
- **AND** the logo uses a single shared styling mechanism so that other in-app uses of the nospeak logo share the same appearance.

#### Scenario: Chat header logo reflects dark theme
- **GIVEN** the effective theme is dark (Catppuccin Frappe)
- **WHEN** the user views any chat conversation
- **THEN** the nospeak logo shown in the chat header appears as a white logo that visually matches the Catppuccin Frappe text color against dark backgrounds
- **AND** changing the theme mode between Light, Dark, and System updates the header logo appearance without requiring a reload.

#### Scenario: Favicons and PWA icons use Latte Lavender
- **WHEN** the user views the nospeak web app in a browser tab or installs it as a PWA
- **THEN** the browser tab favicon, app icon, and any PWA home screen or app switcher icons use a nospeak logo tinted with Catppuccin Latte Lavender
- **AND** these icons remain Latte Lavender regardless of the runtime theme mode.

#### Scenario: Messaging notifications show Latte Lavender icon
- **GIVEN** the user has granted notification permission and notifications are enabled in Settings
- **WHEN** a new message notification is shown for an incoming message
- **THEN** the notification icon and badge use a nospeak logo tinted with Catppuccin Latte Lavender
- **AND** the icon asset used for notifications is consistent with the branding used for favicons and PWA icons.
