# Design: Mobile and Android Settings Layout

## Overview
This design describes how the Settings experience will adapt across desktop web, mobile web (PWA), and the Android Capacitor app shell while preserving the same underlying settings semantics. The primary goals are to:
- Make Settings feel like a simple, tappable list of sections on mobile and Android, rather than a desktop-style tabbed sidebar.
- Use a card-based navigation layout that fits the existing glassmorphism visual language.
- Distinguish Android bottom sheet behavior from mobile web full-screen behavior without duplicating business logic.

## Layout Modes

### Desktop (Web, md+ breakpoints)
- Presentation:
  - A centered glassmorphism dialog with two columns: a left navigation area and a right content area.
  - Navigation uses a vertical list of categories (General, Profile, Messaging Relays, Security, About).
  - The currently selected category is visibly highlighted ("active" state) while content is shown.
- Rationale:
  - Existing behavior is already aligned with desktop expectations and other specs; this change clarifies its relationship to mobile layouts but does not substantially alter it.

### Mobile Web (PWA, < md breakpoints, non-Android)
- Presentation:
  - Settings appears as a full-screen overlay above the authenticated app window, visually similar to a route-level page.
  - The overlay has a top header bar with a title ("Settings") and a close/back control.
  - The body has two logical states:
    1. **Categories view**: vertical list of card-like entries, one per settings category.
    2. **Detail view**: content for a single category (General, Profile, etc.) with a header that includes a back control to return to categories.
- Navigation behavior:
  - Opening Settings on mobile shows the **Categories view** by default.
  - Tapping a category card sets the active category and shows the **Detail view**.
  - The category list itself does **not** retain a persistent colored `active` background after navigation; selection is reflected in the detail header instead.
- Rationale:
  - This mirrors common mobile settings patterns (lists that drill into detail screens) and keeps the category list visually simple and tappable.

### Android App Shell (isAndroidApp)
- Presentation:
  - Settings is rendered as a bottom sheet anchored to the bottom of the screen, with rounded top corners and a glassmorphism surface.
  - The sheet height is capped (e.g., ~80–90% of the viewport) to preserve context from the underlying chat/contacts screen.
  - A small drag handle is shown at the top of the sheet, followed by a header with a title and close control.
  - The body reuses the same two logical states as mobile web:
    - **Categories view**: card list of sections.
    - **Detail view**: per-category content with a back control.
- Navigation behavior:
  - Categories and detail use the same `activeCategory` semantics as other platforms.
  - The Android system back action and explicit close controls dismiss the sheet before performing any route-level navigation, consistent with existing back behavior requirements.
- Rationale:
  - A bottom sheet feels native on Android, maintains context, and aligns with the glass & slate visual language while allowing safe-area-aware layout.

## Card-Based Category Navigation

### Card Structure
Each settings category on mobile web and Android is represented as a card:
- Container:
  - Rounded-2xl glass surface with semi-transparent background and subtle border.
  - Uses visual-design tokens (border opacity, background opacity, shadow) consistent with other primary surfaces.
- Content:
  - Left: icon + text column.
    - Icon: monochrome SVG (stroke-only, `currentColor`) inside a small circular or pill-shaped backdrop.
    - Title: the localized category name (e.g., "General").
    - Optional subtitle: a brief description of what lives under that section.
  - Right: a chevron or similar affordance icon indicating that tapping will open a new view.

### Interaction States
- Default:
  - No persistent colored `active` background on mobile or Android for the cards themselves.
- On hover/press:
  - Slight increase in background opacity and optional shadow to create a tactile response.
  - Press state may also use a slight scale-down animation as long as it does not conflict with platform expectations.
- Accessibility:
  - Cards are keyboard-focusable and expose accessible labels that match their visual titles.

## State Management

- The existing `activeCategory` concept from the desktop dialog is reused across all layout modes.
- Mobile-specific state (e.g., `showMobileContent`) controls whether the user is currently on the categories list or inside a detail view.
- The modal open/close state continues to be managed by the existing settings modal store.

## Visual Design Alignment

- The card design relies on the existing `visual-design` spec for:
  - Glassmorphism surfaces, opacity, blur, borders, and shadows.
  - Typography tokens (Title, Section, Body, Meta) for card titles, subtitles, and metadata.
- Monochrome icons:
  - Icons are inline SVGs using `stroke="currentColor"` and no hard-coded fills.
  - Colors follow the active theme (Latte/Frappe) via Tailwind text color utilities.
- Platform-specific containers:
  - Mobile full-screen overlay and Android bottom sheet are both treated as primary glass surfaces and must obey safe-area insets as defined in `visual-design`.

## Alternatives Considered

- **Keeping sidebar everywhere**: Rejected for mobile and Android because it feels like a cramped desktop pattern, and the persistent active state made the Settings list look like tabs instead of a simple menu.
- **Using plain, flat list items**: Rejected because it would underuse the existing glassmorphism system and break visual cohesion with the rest of the app.
- **Separate components per platform**: Deferred in favor of a single configurable Settings layout component to reduce duplication; platform-specific branching will be encapsulated as layout modes inside the same Svelte component.
