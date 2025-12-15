# Design: Swipe-to-Close for Android Bottom Sheets

## Overview
This design adds a swipe-down-to-close gesture for bottom sheet modals used in the Android Capacitor app shell. The primary goal is to make sheets like Settings and Manage Contacts feel more native to Android users while preserving existing close actions and not changing the underlying modal semantics.

## Scope

- **In scope**:
  - Android-only bottom sheet modals that are already implemented as sheets (currently Settings and Manage Contacts).
  - A simple, threshold-based swipe-down gesture that closes the sheet when the drag is sufficiently large.
- **Out of scope**:
  - Non-Android web modals and PWA full-screen overlays.
  - Converting other dialogs into bottom sheets.
  - Complex physics or velocity-sensitive sheet behaviors.

## Interaction Model

### Gesture Entry Point
- The swipe gesture SHALL start from a defined drag area near the top of the bottom sheet surface.
- This drag area MAY be implemented as:
  - A explicit visual handle (small rounded bar) at the top of the sheet; and/or
  - The upper header region that already contains the sheet title and optional close/back controls.
- The drag area SHOULD be large enough to be easily targeted by touch without interfering with taps on the primary controls.

### Drag Behavior
- When the user begins a downward drag from the drag area while the sheet is fully open:
  - The sheet enters a "dragging" state and follows the pointer/finger vertically with a constrained translation (no upward drag beyond the resting position).
  - The translation distance is represented as `dragDeltaY`, clamped to `>= 0`.
- The backdrop MAY slightly lighten or adjust opacity during a drag to reinforce the sense that the sheet is moving towards dismissal.

### Release and Threshold
- On release (pointer up/cancel), the sheet decides between two outcomes:
  1. **Close**:
     - If `dragDeltaY` exceeds a configured threshold (for example, 80–120px), the sheet transitions into its normal close state and the existing modal exit animation plays.
  2. **Snap back**:
     - If `dragDeltaY` is below the threshold, the sheet snaps back to its original position with a short, ease-out animation.
- The threshold SHOULD be tuned so that casual scrolling or minor mis-swipes from the header do not cause accidental closures.

### Relationship with Other Controls
- Existing close actions remain valid and unchanged:
  - Tapping outside the sheet.
  - Tapping the header close button or back arrow.
  - Using the Android system back button.
- The swipe-down gesture is an additional affordance that maps to the same close semantics as these other actions.

## Platform and Layout Considerations

- The gesture is active **only** when `isAndroidApp` is true and the layout is using a bottom sheet configuration (anchored to the bottom with rounded top corners).
- On desktop and mobile web, the modal continues to behave as a standard centered dialog or full-screen glass overlay without drag-to-dismiss.
- The drag area MUST be chosen so that vertical scroll gestures inside the main content area of the sheet (contact lists, settings forms) are not intercepted or degraded by the swipe-to-close behavior.

## Visual and Motion Alignment

- While dragging, the sheet maintains its glassmorphism styling (blur, border, rounded corners) as defined in `visual-design`.
- The snap-back and close animations SHOULD reuse or closely approximate the existing modal `glassModal` transitions for consistency:
  - Snap-back: short `translateY` animation to zero offset with ease-out.
  - Close: existing scale/fade plus a final downward motion as the sheet leaves the viewport.
- The drag handle, if introduced, should align with the Android Settings bottom sheet visual treatment requirement and use the existing color and opacity tokens.

## Error Handling and Edge Cases

- If the drag gesture is interrupted (e.g. pointer cancel, multitouch interference), the sheet SHOULD return to its resting position without closing.
- Rapid open/close cycles via taps and swipes SHOULD not leave the sheet in a partially translated state; the implementation must reset offsets when the sheet is fully opened.
- Accessibility:
  - Keyboard and assistive technologies continue to rely on the existing close buttons and system back behavior; the swipe gesture is an optional enhancement for touch users.
