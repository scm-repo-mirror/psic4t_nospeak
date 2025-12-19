## MODIFIED Requirements

### Requirement: Themed Logo and Icon Branding for Messaging
The messaging interface and related browser surfaces SHALL use the updated nospeak logo with Catppuccin-aligned coloring. In-app chat views SHALL render the nospeak logo using a theme-aware style that displays Latte Lavender in bright/light appearances and a white logo matching Frappe text color in dark appearances. Browser favicons and PWA icons SHALL use a Latte Text-tinted version of the nospeak logo. Messaging notifications SHALL use the Latte Text-tinted nospeak logo for their badge and for any platform-required small status-bar icon.

#### Scenario: Messaging notifications show Latte Lavender branded badge
- **GIVEN** the user has granted notification permission and notifications are enabled in Settings
- **WHEN** a new message notification is shown for an incoming message
- **THEN** the notification badge uses a nospeak logo tinted with Catppuccin Latte Lavender
- **AND** where the platform requires a small status-bar icon (for example Android), it uses the same branded Latte Lavender nospeak icon asset.

## ADDED Requirements

### Requirement: Sender Avatar Fallback for Messaging Notifications
When a message or reaction notification is shown for a specific sender, the system SHALL prefer showing the sender’s profile picture when available. When the sender has no profile picture, the system SHALL instead use a deterministic robohash avatar derived from the sender’s `npub` using the same seed logic as the in-app avatar fallback. If the avatar cannot be resolved due to platform limitations or fetch failures, the system SHALL fall back to the branded nospeak icon while still showing the notification.

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
