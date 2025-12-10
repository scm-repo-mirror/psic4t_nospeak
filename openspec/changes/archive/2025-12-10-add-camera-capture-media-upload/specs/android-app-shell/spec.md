## ADDED Requirements
### Requirement: Android Native Camera Capture for Message Attachments
When running inside the Android Capacitor app shell, the messaging experience SHALL integrate a native camera capture flow for message attachments using a Capacitor-compatible camera plugin, while continuing to upload captured media to the canonical NIP-98 authenticated media upload endpoint and respecting the same resizing constraints defined for messaging.

#### Scenario: Android app uses native camera for "Take photo"
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the chat message input is visible
- **WHEN** the user opens the media upload dropdown and selects the "Take photo" option
- **THEN** the app SHALL invoke the native camera capture flow via a Capacitor camera plugin rather than relying solely on the WebView file input
- **AND** upon successful capture, SHALL obtain an image representation that can be processed by the web messaging client.

#### Scenario: Android app resizes and uploads captured photos via remote endpoint
- **GIVEN** the user has successfully captured a photo using the Android native camera flow from the chat media upload UI
- **WHEN** the app prepares the captured photo for upload
- **THEN** it SHALL resize the image client-side so that neither width nor height exceeds 2048px while preserving aspect ratio
- **AND** it SHALL encode the resized photo as JPEG with reasonable quality
- **AND** it SHALL upload the resulting image as an `image` media type via HTTPS POST to `https://nospeak.chat/api/upload` including a valid NIP-98 Authorization header as defined by the `messaging` Media Upload Support requirement
- **AND** the resulting media URL SHALL be inserted into the message input and rendered according to messaging media rendering rules.

#### Scenario: Android camera capture failure is non-blocking
- **GIVEN** the user selects the "Take photo" option from the media upload dropdown inside the Android app
- **WHEN** camera permissions are denied, the user cancels the capture, or the camera plugin returns an error
- **THEN** the app SHALL surface a non-blocking Android-native or in-app dialog message indicating that the capture or upload failed
- **AND** the messaging input, existing messages, and other media upload options (Image, Video) SHALL remain available and functional.
