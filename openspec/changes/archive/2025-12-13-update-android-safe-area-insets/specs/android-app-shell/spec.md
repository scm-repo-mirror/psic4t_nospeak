## MODIFIED Requirements

### Requirement: Android Capacitor App Shell
The project SHALL provide an Android application package that wraps the existing nospeak web client using Capacitor, bundles the compiled web assets locally, and launches directly into the chat experience without requiring an external browser. When running on supported Android versions, the app shell SHALL use edge-to-edge window insets and a StatusBar overlay configuration so that the web UI can manage safe areas via CSS instead of reserving a fixed-height status bar region.

#### Scenario: Android app launches bundled nospeak UI edge-to-edge
- **GIVEN** the nospeak Android app is installed on a supported Android device
- **WHEN** the user taps the nospeak app icon
- **THEN** the app SHALL open a Capacitor-powered WebView that loads the bundled nospeak web UI from local assets
- **AND** the content SHALL extend behind the Android system status bar using edge-to-edge window insets
- **AND** the web UI SHALL rely on safe-area insets (for example `env(safe-area-inset-top)` padding) to ensure headers and interactive elements are not obscured by the status bar.

#### Scenario: Status bar overlays WebView with theme-aware styling
- **GIVEN** the nospeak Android app is running in the foreground on a supported Android device
- **WHEN** the app initializes its shell and applies the active visual theme
- **THEN** it SHALL configure the Android status bar to overlay the WebView rather than reserving a fixed content inset
- **AND** it SHALL use the Capacitor `StatusBar` plugin (or equivalent) to set a background that is visually compatible with the glassmorphism design
- **AND** it SHALL choose a status bar icon style (light or dark) that maintains legible contrast against the current theme background.

#### Scenario: Web behavior unchanged outside Android shell
- **GIVEN** the user is accessing nospeak in a standard web browser rather than the Android Capacitor app shell
- **WHEN** the layout applies safe-area CSS utilities
- **THEN** the application SHALL NOT require Capacitor status bar APIs or native insets configuration to render correctly
- **AND** the top-level layout and modal overlays SHALL continue to render without extra Android-only padding, treating safe-area env variables as zero when not provided.
