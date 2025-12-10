## ADDED Requirements
### Requirement: Desktop Message List Page-Key Scrolling
On desktop devices, the chat interface message list SHALL support PageUp, PageDown, Home, and End keys for scrolling long conversations while a chat is active, including when the message input has focus.

#### Scenario: PageUp and PageDown scroll the message list
- **GIVEN** the user is on a desktop device (screen width > 768px)
- **AND** a chat conversation is open with enough messages to require scrolling
- **AND** either the message list or the message input textarea has focus
- **WHEN** the user presses the PageDown key
- **THEN** the message list scrolls down by approximately one visible page of messages without changing the active conversation
- **AND** the top and bottom chat header and input bar remain fixed.
- **WHEN** the user presses the PageUp key
- **THEN** the message list scrolls up by approximately one visible page of messages without changing the active conversation
- **AND** when the scroll position reaches the top threshold, any existing infinite scroll behavior for loading older messages continues to function.

#### Scenario: Home and End jump to top or bottom of history
- **GIVEN** the user is on a desktop device (screen width > 768px)
- **AND** a chat conversation is open with enough messages to require scrolling
- **AND** either the message list or the message input textarea has focus
- **WHEN** the user presses the End key
- **THEN** the message list scrolls to the bottom so the most recent message is visible
- **AND** the existing behavior that auto-scrolls on sending a message continues to work.
- **WHEN** the user presses the Home key
- **THEN** the message list scrolls to the top of the currently loaded history
- **AND** any existing infinite scroll behavior for requesting older messages remains available when the top of the list is reached.

#### Scenario: Mobile and non-chat views are unaffected
- **GIVEN** the user is on a mobile device (screen width <= 768px) or using an Android native shell
- OR the user is viewing a non-chat page or modal outside the main chat view
- WHEN** the user presses PageUp, PageDown, Home, or End
- **THEN** the messaging-specific page-key scrolling behavior does not interfere with the current view's normal keyboard behavior.
