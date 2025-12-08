## ADDED Requirements
### Requirement: Mobile contacts last message preview
The mobile contacts list SHALL display a single-line preview of the most recent message under each contact's name when the viewport corresponds to a mobile-sized layout (for example, screen width <= 768px or a native mobile shell), using the latest stored message content for that contact. The preview SHALL be truncated when it does not fit in the available width and SHALL be omitted for contacts that have no stored messages. Desktop layouts (screen width > 768px) SHALL continue to display only the contact name and unread indicator without a message preview line.

#### Scenario: Mobile contacts list shows last message preview
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout (for example, screen width <= 768px or native mobile shell)
- **AND** Contact A has at least one stored message
- **WHEN** the contacts list is rendered
- **THEN** Contact A's row SHALL show their name as the primary text
- **AND** a secondary line under the name that displays a single-line truncated preview of the most recent message content for Contact A.

#### Scenario: No preview when contact has no messages
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a mobile-sized layout
- **AND** Contact B has no stored messages
- **WHEN** the contacts list is rendered
- **THEN** Contact B's row SHALL show their name and any unread indicator as currently specified
- **AND** SHALL NOT display an empty or placeholder last-message preview line.

#### Scenario: Desktop contacts list omits message preview
- **GIVEN** the user is authenticated and viewing the contacts list
- **AND** the viewport corresponds to a desktop-sized layout (screen width > 768px)
- **WHEN** the contacts list is rendered
- **THEN** each contact row SHALL display the contact name and unread indicator as currently specified
- **AND** SHALL NOT display a last-message preview line, even if stored messages exist for that contact.
