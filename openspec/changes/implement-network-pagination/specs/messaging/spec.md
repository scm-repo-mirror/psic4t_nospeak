# Messaging Specification

## MODIFIED Requirements

### Requirement: Message History Display
The chat interface SHALL implement infinite scrolling to handle large message histories without performance degradation.

#### Scenario: Initial load limit
- **GIVEN** a conversation with thousands of messages
- **WHEN** the user opens the chat
- **THEN** only the most recent 50 messages are loaded and rendered
- **AND** the application is responsive immediately

#### Scenario: Load older messages from database
- **GIVEN** the user is viewing the chat
- **AND** there are older messages in the local database
- **WHEN** the user scrolls to the top of the message list
- **THEN** the next batch of older messages is loaded from the database
- **AND** inserted at the top of the list without disrupting the scroll position

## ADDED Requirements

### Requirement: Network History Pagination
The system SHALL fetch older messages from the network when local history is exhausted.

#### Scenario: Fetch from network on scroll
- **GIVEN** the user scrolls to the top of the message list
- **AND** all locally stored messages have been displayed
- **WHEN** the user triggers the "load more" action (by scrolling)
- **THEN** the system fetches a batch of older messages from the relays
- **AND** displays a loading indicator while fetching
- **AND** appends any newly found messages to the history view once decrypted
