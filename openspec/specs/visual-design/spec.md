# Visual Design Specification

## Purpose
This spec defines the shared visual design system for the nospeak web client, including glassmorphism treatment, color palette, typography, motion, and layout patterns used across authenticated and unauthenticated states.
## Requirements
### Requirement: Consistent glassmorphism visual language
The application interface SHALL use the glass & slate visual language described in this spec for primary containers, backgrounds, and interactive elements, **EXCEPT** where performance constraints on mobile/Android devices necessitate simpler rendering for scrolling content. When running inside the Android Capacitor app shell with edge-to-edge layout enabled, primary surfaces and full-screen glass overlays (such as the authenticated app window and root-level modals) SHALL respect OS-provided safe-area insets so that content does not clash with the system status bar or gesture regions.

#### Scenario: Simplified rendering on Android/Mobile for scrolling content
- **GIVEN** the application is running on an Android device or mobile viewport
- **WHEN** rendering scrolling lists (such as message bubbles in a chat)
- **THEN** the application MAY disable `backdrop-filter` (blur) effects on individual list items
- **AND** SHALL use increased opacity (e.g., 90% instead of 70%) to maintain legibility and contrast against the background
- **AND** static elements (headers, footers) MAY retain glassmorphism if performance permits.

#### Scenario: Root layout and modals respect safe-area insets on Android
- **GIVEN** the application is running inside the Android Capacitor app shell with edge-to-edge layout and a StatusBar overlay configuration
- **WHEN** the authenticated app window and full-screen glass modals are rendered (including Settings, Manage Contacts, Profile, Relay Status, User QR, and Sync Progress overlays)
- **THEN** their top and bottom padding or layout constraints SHALL include OS-provided safe-area insets (for example via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`) instead of hard-coded Android-only padding constants
- **AND** the visual alignment of these surfaces with the ambient glassmorphism background SHALL remain consistent between Android, desktop, and mobile web usage.

#### Scenario: Desktop and web layouts remain visually consistent
- **GIVEN** the user is accessing nospeak via a standard desktop or mobile web browser
- **WHEN** the same root layout and modal components are rendered
- **THEN** the use of safe-area-aware CSS utilities SHALL not introduce visible extra gaps where OS safe-area insets are zero
- **AND** the floating glass container and modal overlays SHALL maintain their existing spacing, rounded corners, and shadows as defined by the glassmorphism visual language.

### Requirement: URL Preview Card Visual Design
The URL preview card for non-media links in chat messages SHALL follow the existing messaging visual design system, using Catppuccin theme tokens for colors, typography, and spacing. The card SHALL present link metadata in a compact, readable layout that works across desktop and mobile breakpoints.

#### Scenario: Preview card layout and theming
- **WHEN** a URL preview card is rendered under a message bubble
- **THEN** the card SHALL use a background and border treatment that clearly associates it with the message while remaining visually distinct from the message text
- **AND** the card SHALL display the link title as primary text, the effective domain as secondary text, and MAY show a short description when available
- **AND** all text and icon colors SHALL respect the active Catppuccin theme (Latte or Frappe) for readability and contrast.

#### Scenario: Responsive behavior on mobile and desktop
- **GIVEN** the user views a conversation on a mobile device or a desktop device
- **WHEN** a URL preview card is rendered
- **THEN** the card layout SHALL adapt so that content remains legible without horizontal scrolling
- **AND** any thumbnail or favicon image SHALL scale or reposition to avoid overwhelming the text content on small screens.

#### Scenario: Hover, focus, and active states
- **WHEN** the user hovers over, focuses, or activates the URL preview card
- **THEN** the card SHALL provide clear visual feedback (such as subtle background or border changes) consistent with other interactive elements in the messaging UI
- **AND** focus indicators SHALL be visible and accessible for keyboard and assistive technology users.

### Requirement: Mobile contacts header app name styling
The nospeak app name label in the mobile contacts sidebar header SHALL follow the existing visual design system for typography, spacing, and glassmorphism so that the label feels integrated with the rest of the interface.

#### Scenario: App name label matches visual language
- **GIVEN** the nospeak app name label is rendered next to the current user's avatar in the contacts header on a mobile-sized layout
- **WHEN** the header is displayed in light or dark theme
- **THEN** the label uses a small, bold type treatment consistent with other header labels
- **AND** the text color respects the active Catppuccin theme for readability
- **AND** the spacing between the avatar, label, and settings control aligns with the glassmorphism-based layout without causing overlap or truncation in typical mobile widths.

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

### Requirement: Semantic Typography Scale for Primary Surfaces
The messaging UI SHALL use a small, semantic typography scale instead of ad-hoc font sizes for common text elements across primary surfaces. The scale SHALL define at least the following semantic styles: Title (primary headings such as modal and panel titles), Section (secondary headings such as section titles within a view), Body (standard paragraph content), and Meta (small, secondary information such as timestamps, chips, and helper labels). Implementations MAY express these styles using Tailwind utility composition or an equivalent mechanism, but the semantics and visual hierarchy SHALL remain consistent across chat, settings, and relay-management views.

#### Scenario: Chat timestamps and message metadata share Meta style
- **GIVEN** the user is viewing any chat conversation
- **AND** the interface renders per-message timestamps, date separators, or a short summary of relay delivery status (for example, "sent to X/Y relays")
- **WHEN** these message metadata elements are displayed under or between message bubbles
- **THEN** they SHALL use the shared Meta typography style (small size, reduced emphasis relative to Body text, and consistent letter-spacing)
- **AND** the chosen Meta style SHALL remain readable on both Catppuccin Latte and Frappe themes.

#### Scenario: Relay Connections modal labels and status chips use Section and Meta styles
- **GIVEN** the user opens the Relay Connections modal from the messaging UI
- **WHEN** the modal displays its primary title, per-relay URL row, and status indicators (for example, Connected / Disconnected chips and small numeric stats)
- **THEN** the modal title SHALL use the shared Title typography style
- **AND** field labels and small statistics (such as "Type", "Last Connected", counts, and status chips) SHALL use the shared Meta typography style
- **AND** any descriptive copy within the modal SHALL use the shared Body typography style when present.

#### Scenario: Modal titles and explanatory copy use Title, Section, and Body styles
- **GIVEN** the user sees blocking or prominent modals in the messaging experience (including first-time sync progress, empty profile setup, login with Amber, Manage Contacts, and Settings)
- **WHEN** each modal renders its main heading, internal section titles, and explanatory paragraphs
- **THEN** the main modal heading SHALL use the shared Title typography style
- **AND** any internal section headings (for example, category headers inside Settings) SHALL use the shared Section typography style
- **AND** explanatory paragraphs and helper text SHALL use the shared Body typography style, with only truly small, secondary labels (such as field labels or short hints) using the Meta style.

## 1. Design Philosophy

The application follows a "Glass & Slate" aesthetic, prioritizing depth, motion, and airiness over flat utility. The interface simulates a floating glass layer over a dynamic background, creating a sense of context and modernity.

## 2. Visual Language

### Glassmorphism
*   **Surface:** Primary containers and overlays use semi-transparent backgrounds with background blur.
    *   Light Mode: `bg-white/70` with `backdrop-blur-xl`.
    *   Dark Mode: `bg-slate-900/70` with `backdrop-blur-xl`.
*   **Borders:** Subtle, translucent borders define edges without harsh contrast.
    *   `border-white/20` (Light) or `border-white/10` (Dark).
*   **Shadows:** Deep, diffuse shadows (`shadow-2xl`) lift floating elements (modals, main window) off the background.
*   **Background:** Ambient, blurred gradient blobs (Blue/Purple) provide depth behind the glass layers.

### Color Palette
*   **Theme:** Catppuccin (Mocha/Latte).
*   **Dark Mode Base (Mocha):** Overrides `slate` palette.
    *   Background: `#11111b` (Crust)
    *   Surface: `#1e1e2e` (Base)
    *   Sidebar: `#181825` (Mantle)
    *   Text: `#cdd6f4` (Text)
*   **Light Mode Base (Latte):** Overrides `gray` palette.
    *   Background: `#eff1f5` (Base)
    *   Surface: `#ffffff` (Base/White)
*   **Accents:**
    *   Primary: **Lavender** (`#7287fd` -> `#5b6ee1`) overriding `blue` palette.
    *   Success: `Green-500`
    *   Error: `Red-500`

### Shapes & Geometry
*   **Windows & Modals:** Large `rounded-3xl` corners.
*   **List Items & Bubbles:** Soft `rounded-2xl` corners.
*   **Inputs & Buttons:** Full "Pill" shapes (`rounded-full` or `rounded-xl`).
*   **Avatars:** Circular (`rounded-full`) with a subtle ring (`ring-white/50` or `ring-white/10`) to separate from glass backgrounds.

### Typography
*   **Font:** System sans-serif, `antialiased` for crisp rendering.
*   **Weights:**
    *   Headers: `font-bold`
    *   Body: `font-normal` or `font-medium`
    *   Labels: `font-medium`

## 3. Layout Architecture

### Authenticated State
*   **App Window:** A single, central glass container holding the Sidebar (Contacts) and Main Content (Chat).
*   **Responsiveness:**
    *   Desktop: Floating centered window with rounded corners and padding.
    *   Mobile: Full-screen glass interface.
*   **Modals:** Rendered at the root level (`+layout.svelte`) to overlay the entire application window and background.

### Unauthenticated State
*   **Login Modal:** A focused, free-floating glass card centered on the background.
*   **App Window:** Hidden until successful authentication.

## 4. Motion & Interaction

### Transitions
*   **Page Navigation:** Subtle `fade` (150ms) transition when switching contexts (e.g., chat threads).
*   **Modals:** Fade-in backdrop with scaled content entry.
*   **Messages:** `fly` (y: 20px) entrance animation with `cubicOut` easing.

### Micro-interactions
*   **Hover:** Elements (contacts, buttons) brighten and/or shift background color.
*   **Active:** Interactive elements scale down (`scale-95`) on press for tactile feedback.
*   **Haptics:** Soft vibration on mobile interactions where supported.

## 5. Loading States
*   **Skeleton Loaders:** Pulsing shapes (gray/slate blocks) replace spinners for content loading (Profile, Contacts).
*   **Spinners:** Minimal use, primarily for action states (e.g., "Sending", "Saving").
