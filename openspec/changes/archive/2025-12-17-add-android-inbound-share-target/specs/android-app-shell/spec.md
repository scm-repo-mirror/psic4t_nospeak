## ADDED Requirements

### Requirement: Android inbound share target for media and text
When running inside the Android Capacitor app shell, the nospeak client SHALL appear as an Android share target for supported media (images, video, audio) and text/URLs, and SHALL route inbound shares into the existing direct message experience by requiring the user to pick a contact and then either opening the single-file media send preview with the shared media or pre-filling the message input with the shared text. Inbound shares received while the user is not logged in SHALL display a clear message that login is required and SHALL NOT retain the shared content for later use.

#### Scenario: Logged-in user shares media to nospeak
- **GIVEN** the nospeak Android app is installed and the user is currently logged in
- **AND** another Android app (such as a gallery, files app, or browser) offers an "Share" action for a single image, video, or audio file
- **WHEN** the user selects the nospeak app from the Android share sheet
- **THEN** the nospeak Android app shell SHALL open or be brought to the foreground
- **AND** it SHALL navigate to the contact list view (for example, the `/chat` contact list) rather than directly opening any existing conversation
- **AND** when the user selects a contact from the list, the messaging UI for that contact SHALL open the existing single-file media send preview with the shared media already loaded as the pending attachment
- **AND** sending that attachment (optionally with a caption) SHALL use the same encrypted file-message and caption flow defined by the existing messaging requirements for DM media.

#### Scenario: Logged-in user shares text or URL to nospeak
- **GIVEN** the nospeak Android app is installed and the user is currently logged in
- **AND** another Android app offers a "Share" action for a single text snippet or HTTP(S) URL
- **WHEN** the user selects the nospeak app from the Android share sheet
- **THEN** the nospeak Android app shell SHALL open or be brought to the foreground
- **AND** it SHALL navigate to the contact list view rather than directly opening any existing conversation
- **AND** when the user selects a contact from the list, the messaging UI for that contact SHALL pre-fill the message input with the shared text or URL while leaving the user free to edit or discard it before sending
- **AND** sending the message SHALL follow the existing DM text message semantics defined by the messaging specification (including any URL preview behavior that applies after send).

#### Scenario: Inbound share always goes through explicit contact selection
- **GIVEN** the nospeak Android app shell is running and may currently be displaying either the contact list or an existing DM conversation
- **WHEN** the user shares a supported media file or text/URL from another Android app and selects nospeak in the share sheet
- **THEN** the Android app shell SHALL navigate to the contact list view (if it is not already visible)
- **AND** it SHALL NOT automatically route the inbound share into whichever DM conversation happens to be currently open
- **AND** only after the user explicitly selects a contact from the list SHALL the app either open the single-file media send preview with the shared media or pre-fill the message input for that specific contact with the shared text.

#### Scenario: Inbound share while logged out is rejected without retention
- **GIVEN** the nospeak Android app is installed but the user is not currently logged in (for example, at the unauthenticated login screen)
- **AND** another Android app offers a "Share" action for a media file or text/URL
- **WHEN** the user selects the nospeak app from the Android share sheet
- **THEN** the nospeak Android app shell SHALL display a clear, non-blocking message informing the user that they must log in to share content
- **AND** it SHALL NOT retain the shared media or text for later use after login (for example, it SHALL NOT queue the share in local storage or memory for later delivery)
- **AND** after logging in, the user MUST start a new share action from the original app if they still wish to send that content.

#### Scenario: Unsupported inbound share content is safely ignored
- **GIVEN** the nospeak Android app is installed and may be either logged in or logged out
- **AND** another Android app attempts to share content to nospeak using a MIME type or payload that is not supported by the nospeak Android inbound share implementation (for example, an `ACTION_SEND_MULTIPLE` with multiple attachments or a non-media, non-text type)
- **WHEN** the user selects nospeak in the share sheet for such unsupported content
- **THEN** the nospeak Android app shell MAY either show a brief error message indicating that the content cannot be shared or silently ignore the inbound share
- **BUT** in all cases it SHALL avoid crashing, freezing, or leaving the UI in an inconsistent state
- **AND** it SHALL NOT partially apply the share in a way that could result in corrupted or ambiguous DM state.
