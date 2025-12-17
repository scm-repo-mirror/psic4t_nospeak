## ADDED Requirements

### Requirement: Android Native Tap Sound for Micro-Interactions
When running inside the Android Capacitor app shell, the app SHALL be able to play the Android OS-native “tap/click” sound effect for selected micro-interactions (such as lightweight selections and button presses) using a minimal, intent-based API. Tap sound playback SHALL respect Android system sound settings (including the system “Touch sounds” preference and the device’s current ringer mode), and tap sound calls SHALL be non-blocking when sound effects are unavailable.

#### Scenario: Tap sound plays for selection-style micro-interactions
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** Android system “Touch sounds” are enabled
- **WHEN** the user performs a micro-interaction configured to trigger tap sound feedback (for example, pressing a button or toggling a setting)
- **THEN** the Android shell SHALL play the OS-native click sound effect
- **AND** the interaction behavior SHALL complete normally even if sound playback fails.

#### Scenario: Tap sound is suppressed when Android system touch sounds are disabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** Android system “Touch sounds” are disabled
- **WHEN** the user performs a micro-interaction configured to trigger tap sound feedback
- **THEN** no audible tap sound SHALL be produced.

#### Scenario: Web behavior remains unchanged outside Android shell for tap sound
- **GIVEN** the user is accessing nospeak via a standard web browser rather than the Android Capacitor app shell
- **WHEN** the user performs the same interactions that would normally trigger Android tap sounds
- **THEN** the system SHALL NOT require an Android tap sound API to be present
- **AND** the absence of tap sound feedback SHALL NOT block or degrade the primary interaction behavior.
