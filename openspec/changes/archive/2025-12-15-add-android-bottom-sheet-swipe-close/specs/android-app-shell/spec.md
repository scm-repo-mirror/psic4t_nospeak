# android-app-shell – Change: Swipe-to-Close for Android Bottom Sheets

## ADDED Requirements

### Requirement: Android Bottom Sheet Swipe-to-Close Gesture
The Android Capacitor app shell SHALL support a swipe-down-to-close gesture for designated bottom sheet modals (including at least Settings and Manage Contacts) so that users can dismiss these sheets by dragging them downward from a defined drag area near the top of the sheet surface. The gesture SHALL be threshold-based, SHALL only apply when running inside the Android app shell, and SHALL not interfere with primary scrolling and tapping behavior inside the sheet content.

#### Scenario: Swipe-down closes Settings bottom sheet on Android
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the Settings experience is currently presented as a bottom sheet anchored to the bottom of the screen, as defined in the `settings` and `visual-design` specifications
- **WHEN** the user places a finger or pointer in the defined drag area near the top of the Settings bottom sheet and drags downward beyond a configured threshold distance
- **THEN** the Settings bottom sheet SHALL dismiss, triggering the same close behavior as tapping the header close control or using the Android system back action
- **AND** the drag SHALL not prevent normal vertical scrolling or tapping inside the Settings content area when the drag begins outside the defined drag area.

#### Scenario: Swipe-down closes Manage Contacts bottom sheet on Android
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the Manage Contacts modal is currently presented as a bottom sheet anchored to the bottom of the screen
- **WHEN** the user initiates a downward drag from the defined drag area at the top of the Manage Contacts bottom sheet and drags beyond the configured threshold distance
- **THEN** the Manage Contacts bottom sheet SHALL dismiss, triggering the same close behavior as tapping the close or back control in the header
- **AND** vertical scrolling within the contacts list or search results SHALL remain unaffected when the user scrolls from within the main content area instead of the drag area.

#### Scenario: Short drags cause Android bottom sheets to snap back
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** a bottom sheet modal such as Settings or Manage Contacts is currently open
- **WHEN** the user initiates a drag from the defined drag area at the top of the sheet but releases it before reaching the configured threshold distance
- **THEN** the sheet SHALL animate back to its resting position without dismissing
- **AND** the sheet SHALL not enter an intermediate or partially translated state after the animation completes
- **AND** existing close mechanisms (tapping outside, header close button, Android system back) SHALL continue to operate as before.

#### Scenario: Web and PWA behavior unchanged outside Android shell
- **GIVEN** the user is accessing nospeak via a standard desktop or mobile web browser, not inside the Android Capacitor app shell
- **WHEN** they interact with Settings, Manage Contacts, or other modals that appear as centered dialogs or full-screen overlays
- **THEN** no Android-specific swipe-to-close behavior SHALL be required or implemented
- **AND** the modals SHALL continue to use their existing close controls and interactions as defined by the `visual-design` and `settings` specifications.
