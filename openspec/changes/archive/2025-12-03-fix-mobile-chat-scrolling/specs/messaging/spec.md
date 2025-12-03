# Messaging Specification Deltas

## ADDED Requirements

### Requirement: Message Interface Layout
The chat interface SHALL maintain a fixed layout on all screen sizes.

#### Scenario: Mobile Scroll Behavior
- **GIVEN** a user is on a mobile device
- **AND** the chat history is longer than the screen
- **WHEN** the user scrolls the messages
- **THEN** the contact header remains fixed at the top
- **AND** the message input bar remains fixed at the bottom
- **AND** only the message list area scrolls
