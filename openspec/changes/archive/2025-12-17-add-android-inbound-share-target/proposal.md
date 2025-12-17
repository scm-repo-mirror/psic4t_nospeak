# Change: Android inbound share target for media and text

## Why
Android users can currently share content *from* nospeak (for example, images from the in-app viewer) via the native share sheet, but cannot choose nospeak itself as a target when sharing media or links from other apps. This makes it harder to start a DM in nospeak based on content discovered elsewhere on the device.

## What Changes
- Add an Android share target so nospeak appears in the system share sheet for media (images, video, audio) and text/URLs.
- Define a consistent in-app flow where selecting nospeak opens the app, requires the user to pick a contact, and then opens the existing DM attachment preview with the shared media or pre-fills the message input with the shared text.
- Specify behavior when the user is not logged in (show a clear "Please log in to share" message and discard the share, without caching it).
- Capture constraints for unsupported content and non-media types to keep the behavior predictable and non-surprising.

## Impact
- Affected specs: `android-app-shell` (new requirement describing inbound share target behavior and flows).
- Affected code: Android Capacitor shell (MainActivity and a small native plugin), web client bootstrap/layout, contact list and chat view components, and any related Android-native dialog surfaces for error reporting. Implementation details will follow after this proposal is approved.
