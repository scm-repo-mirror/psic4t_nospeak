## MODIFIED Requirements

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
