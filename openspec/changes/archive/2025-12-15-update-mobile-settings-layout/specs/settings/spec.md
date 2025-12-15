# settings – Change: Update Mobile Settings Layout

## ADDED Requirements

### Requirement: Settings Layout Across Desktop, Mobile Web, and Android
The Settings experience SHALL adapt its layout and navigation pattern to the users platform and viewport while preserving the same set of categories (including General, Profile, Messaging Relays, Security, and About) and underlying settings semantics. Desktop web SHALL continue to use a two-column dialog with persistent sidebar navigation, while mobile web (PWA) and the Android app shell SHALL use a card-based navigation pattern without a persistent active background state on the list of categories.

#### Scenario: Desktop settings use sidebar navigation
- **GIVEN** the user is accessing nospeak in a desktop-class browser at a layout where the authenticated app window is rendered as a centered glass container with a visible left contacts column and right chat area
- **AND** the user opens the Settings experience from the contacts header
- **WHEN** the Settings dialog is rendered
- **THEN** it SHALL appear as a glassmorphism dialog with a left navigation area listing Settings categories (including General, Profile, Messaging Relays, Security, and About)
- **AND** selecting any category in this navigation area SHALL keep the navigation visible while the corresponding detail view is shown on the right
- **AND** the currently selected category in the navigation area SHALL be visually distinguished with an "active" treatment consistent with the visual-design specification.

#### Scenario: Mobile web Settings use full-screen card navigation
- **GIVEN** the user is accessing nospeak via a mobile web browser (PWA) at a handset-sized viewport outside of the Android app shell
- **AND** the authenticated app window is rendered as a full-screen glass surface
- **WHEN** the user opens the Settings experience
- **THEN** Settings SHALL appear as a full-screen overlay above the authenticated app window with a header bar containing a title and close/back control
- **AND** the initial view within this overlay SHALL present a vertical list of card-like entries, one per Settings category (including General, Profile, Messaging Relays, Security, and About)
- **AND** tapping a card SHALL navigate to a dedicated detail view for that category within the same overlay
- **AND** the card list itself SHALL NOT retain a persistent colored active background on the previously tapped card once the user is in the detail view; the current category MAY instead be indicated in the detail header.

#### Scenario: Android Settings use bottom sheet card navigation
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the authenticated chat UI is visible behind any overlays
- **WHEN** the user opens the Settings experience
- **THEN** Settings SHALL be presented as a bottom sheet anchored to the bottom of the screen with rounded top corners and a glassmorphism surface
- **AND** the bottom sheet content SHALL reuse the same card-based category list and per-category detail views as the mobile web Settings overlay
- **AND** the card list in the Android bottom sheet SHALL NOT retain a persistent colored active background state on the previously tapped card once the user is viewing a categorys detail content
- **AND** the Android system back action and explicit close controls SHALL dismiss the Settings bottom sheet before causing any route-level navigation, consistent with existing Android back behavior requirements.
