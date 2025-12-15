# visual-design – Change: Card-Based Settings Categories and Bottom Sheet Presentation

## ADDED Requirements

### Requirement: Card-Based Settings Category Visual Design
The Settings category navigation on mobile web (PWA) and inside the Android app shell SHALL use card-based visual treatments that align with the glass & slate visual design system while remaining performant on small screens. Each category card SHALL be a rounded-2xl glass surface with a subtle border, SHALL use monochrome SVG icons that follow the active theme via `currentColor`, and SHALL avoid a persistent colored active background state on the card list, relying instead on hover/press feedback and contextual headings to indicate selection.

#### Scenario: Settings category cards use glassmorphism surfaces and typography
- **GIVEN** the user is viewing the Settings categories list on a mobile web handset viewport or inside the Android Settings bottom sheet
- **WHEN** the category cards are rendered
- **THEN** each card SHALL use a semi-transparent glass background with rounded-2xl corners, a subtle translucent border, and a soft shadow consistent with other primary glass surfaces defined in `visual-design`
- **AND** the category title text SHALL use the shared Section or Body typography styles
- **AND** any optional subtitle text SHALL use the shared Meta typography style so that hierarchy remains consistent with the rest of the interface.

#### Scenario: Settings category cards use monochrome SVG icons
- **GIVEN** the Settings categories list is rendered on mobile web or Android
- **WHEN** an icon is displayed for a category (such as a gear for General or a user silhouette for Profile)
- **THEN** the icon SHALL be implemented as an inline or componentized SVG that uses `stroke="currentColor"` (and no hard-coded fill color)
- **AND** the icon SHALL appear inside a small circular or pill-shaped backdrop consistent with other icon treatments in the app
- **AND** the apparent icon color SHALL derive from the active theme via text color utilities (for example, Tailwind `text-*` classes) so that it remains legible in both light and dark modes.

#### Scenario: Settings category cards provide transient interaction feedback only
- **GIVEN** the user is interacting with the Settings category cards on mobile web or Android
- **WHEN** the user hovers (on desktop-class devices) or presses a card (on touch devices)
- **THEN** the card SHALL provide transient interaction feedback such as a slight increase in background opacity, a subtle shadow, or a small scale-down effect while the interaction is active
- **AND** after navigation into a category detail view, the originating card in the list SHALL NOT remain with a persistent colored active background; selection MAY instead be communicated via the detail view header or supporting copy.

### Requirement: Android Settings Bottom Sheet Visual Treatment
The Android Settings bottom sheet SHALL follow the same glassmorphism visual language as other primary overlays while clearly reading as a sheet anchored to the bottom of the viewport. It SHALL use rounded top corners, a safe-area-aware layout, and an optional drag handle, and it SHALL visually integrate with the authenticated app background and gradients without introducing harsh edges.

#### Scenario: Android Settings bottom sheet matches primary glass surfaces
- **GIVEN** the user opens Settings inside the Android Capacitor app shell
- **WHEN** the Settings bottom sheet is rendered above the chat UI
- **THEN** the sheet surface SHALL use semi-transparent glass backgrounds with blur, soft rounded top corners, subtle borders, and shadows consistent with other primary modal surfaces defined in `visual-design`
- **AND** the sheet SHALL respect OS-provided safe-area insets at the bottom and sides so that interactive elements are not obscured by gesture navigation regions
- **AND** the visual transition from the main app window to the sheet (such as slide-up and backdrop fade) SHALL feel consistent with other modal transitions described in the motion and interaction guidelines.
