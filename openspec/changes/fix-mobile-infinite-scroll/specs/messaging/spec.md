# Messaging Specification

## MODIFIED Requirements

### Requirement: Message History Display
The chat interface SHALL implement infinite scrolling to handle large message histories without performance degradation.

#### Scenario: Load older messages from database
- **GIVEN** the user is viewing the chat
- **AND** there are older messages in the local database
- **WHEN** the user scrolls **near** the top of the message list (within 50px)
- **OR** the message list does not fill the visible area
- **THEN** the next batch of older messages is loaded from the database
- **AND** inserted at the top of the list without disrupting the scroll position

#### Scenario: Fetch from network on scroll
- **GIVEN** the user scrolls **near** the top of the message list (within 50px)
- **AND** all locally stored messages have been displayed
- **WHEN** the user triggers the "load more" action (by scrolling or auto-trigger)
- **THEN** the system fetches a batch of older messages from the relays
- **AND** displays a loading indicator while fetching
- **AND** appends any newly found messages to the history view once decrypted
