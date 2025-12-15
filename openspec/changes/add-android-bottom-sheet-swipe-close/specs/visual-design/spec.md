# visual-design – Change: Swipe-to-Close Gesture Visual and Motion Treatment

## ADDED Requirements

### Requirement: Android Bottom Sheet Drag Handle and Drag Motion
Android bottom sheet modals, including Settings and Manage Contacts, SHALL provide a clear visual affordance for drag-to-dismiss and a motion treatment consistent with the existing glassmorphism and modal transition guidelines. The drag handle or header region used to initiate the swipe-to-close gesture SHALL be visually integrated with the sheet surface, and the sheet SHALL move as a cohesive glass surface during drag and dismissal.

#### Scenario: Bottom sheet shows drag affordance in Android app shell
- **GIVEN** the user opens a bottom sheet modal (such as Settings or Manage Contacts) inside the Android Capacitor app shell
- **WHEN** the bottom sheet is fully visible
- **THEN** the sheet SHALL include a visible drag affordance near its top edge (for example, a small rounded bar or a header region that visually suggests it can be grabbed)
- **AND** this affordance SHALL follow the existing glassmorphism visual language (subtle opacity, rounded shape, and appropriate contrast in both light and dark themes).

#### Scenario: Bottom sheet drag motion matches glassmorphism transitions
- **GIVEN** the user is dragging a bottom sheet modal downward from the drag handle or header area on Android
- **WHEN** the drag is in progress
- **THEN** the entire sheet surface (including its glass background, border, and contents) SHALL translate downward as a single unit without distortion
- **AND** any backdrop or shadow changes during the drag SHALL remain subtle and consistent with the existing modal open/close transitions described in `visual-design`.

#### Scenario: Bottom sheet snap-back and dismiss animations feel cohesive
- **GIVEN** the user releases a dragged bottom sheet after initiating a swipe-to-close gesture on Android
- **WHEN** the drag distance is below the threshold and the sheet snaps back, or above the threshold and the sheet dismisses
- **THEN** the snap-back and dismiss animations SHALL use easing and timing that feel consistent with other modal transitions in the app
- **AND** the sheet SHALL not appear to jitter, stutter, or leave visual artifacts during or after these animations
- **AND** the drag handle or header region SHALL remain visually aligned with the sheet surface throughout the animations.
