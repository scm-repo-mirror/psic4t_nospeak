## ADDED Requirements

### Requirement: Chat List Filter Tabs

The chat list header SHALL display a row of filter tabs below the primary header row, visible on all screen sizes. The filter tabs SHALL include "All", "Unread", and "Groups" options. The default active filter SHALL be "All". When "All" is selected, the chat list SHALL display all conversations. When "Unread" is selected, the chat list SHALL display only conversations with unread messages. When "Groups" is selected, the chat list SHALL display only group conversations. Filter tab labels SHALL be localized using the i18n system.

#### Scenario: Default filter shows all conversations
- **GIVEN** the user opens the chat list
- **WHEN** the chat list renders with the default filter
- **THEN** the "All" tab is active
- **AND** all conversations (1-on-1 and groups) are displayed sorted by most recent activity

#### Scenario: Unread filter shows only unread conversations
- **GIVEN** the user is viewing the chat list
- **AND** some conversations have unread messages
- **WHEN** the user selects the "Unread" filter tab
- **THEN** only conversations with unread messages are displayed
- **AND** conversations without unread messages are hidden

#### Scenario: Groups filter shows only group conversations
- **GIVEN** the user is viewing the chat list
- **AND** the user has both 1-on-1 and group conversations
- **WHEN** the user selects the "Groups" filter tab
- **THEN** only group conversations are displayed
- **AND** 1-on-1 conversations are hidden

#### Scenario: Empty state for unread filter
- **GIVEN** the user is viewing the chat list
- **AND** no conversations have unread messages
- **WHEN** the user selects the "Unread" filter tab
- **THEN** a message "No unread chats" is displayed

#### Scenario: Empty state for groups filter
- **GIVEN** the user is viewing the chat list
- **AND** the user has no group conversations
- **WHEN** the user selects the "Groups" filter tab
- **THEN** a message "No groups" is displayed

#### Scenario: Filter tabs visible on all screen sizes
- **GIVEN** the user is viewing the chat list on any device
- **WHEN** the chat list header is rendered
- **THEN** the filter tab row is visible on both mobile and desktop layouts
- **AND** the previous desktop-only "Chats" title text is no longer displayed
