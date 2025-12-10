## ADDED Requirements
### Requirement: Camera Capture for Message Media Upload
The message input area SHALL provide a camera capture option labeled "Take photo" in the media upload affordance on supported devices so that users can capture and send photos directly from the chat UI. Camera-captured photos SHALL be treated as image uploads that use the existing NIP-98 authenticated media upload endpoint and rendering semantics, and the client SHALL resize captured photos client-side to a maximum dimension of 2048px (width or height) and encode them as JPEG before upload when feasible.

#### Scenario: Camera capture option available on mobile and Android app shell
- **GIVEN** the user is composing a message in the chat input
- **AND** the device is either running the nospeak Android Capacitor app shell or a mobile browser environment that supports camera capture via file input
- **WHEN** the user opens the media upload dropdown from the message input
- **THEN** the dropdown SHALL include a "Take photo" option in addition to existing Image and Video options.

#### Scenario: Captured photo is resized and uploaded as image
- **GIVEN** the user selects "Take photo" from the media upload dropdown
- **AND** the user successfully captures a photo using the device camera
- **WHEN** the client processes the captured image
- **THEN** the client SHALL resize the photo so that neither width nor height exceeds 2048px while preserving aspect ratio
- **AND** the client SHALL encode the resized photo as a JPEG with reasonable quality before uploading it as an image to the canonical media upload endpoint using a valid NIP-98 Authorization header.

#### Scenario: Captured photo URL is inserted into message input
- **GIVEN** a captured photo has been successfully uploaded as an image via the media upload endpoint
- **WHEN** the upload completes successfully
- **THEN** the resulting media URL SHALL be inserted into the message input content using the same format as existing image uploads
- **AND** when the message is sent, the photo SHALL be rendered inline in the conversation according to existing media rendering rules.

#### Scenario: Camera capture failure is non-blocking
- **GIVEN** the user selects "Take photo" from the media upload dropdown
- **WHEN** camera access is denied, the capture is cancelled, or the capture operation fails
- **THEN** the system SHALL display a non-blocking error or informational message indicating that the photo could not be captured or uploaded
- **AND** the rest of the messaging input and sending behavior SHALL remain usable.
