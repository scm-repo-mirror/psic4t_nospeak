## MODIFIED Requirements

### Requirement: Message Synchronization
The system SHALL synchronize message history efficiently by downloading only missing messages and processing them in batches. On first-time sync (empty local cache), the system SHALL fetch gift-wrap events with `created_at` timestamps approximately within the last 30 days (hardcoded). On subsequent syncs, the system SHALL fetch only recent messages to fill gaps. Messages older than the 30-day window remain available via explicit user action in a conversation.

**Note**: The 30-day boundary is approximate because NIP-59 gift-wrap `created_at` timestamps may be randomized by clients to obscure message timing. Contacts with no activity in the last ~30 days won't be auto-created during first sync; they'll be created when older history is backfilled.

#### Scenario: First-time sync fetches ~30-day window only
- **GIVEN** the user logs in for the first time (no messages in local cache)
- **WHEN** the application starts message synchronization
- **THEN** it fetches gift-wrap events from relays in batches, starting from now
- **AND** continues fetching backward until the `until` parameter would drop below now minus 30 days
- **AND** displays sync progress showing message count
- **AND** stops paging even if relays still have older events

#### Scenario: Returning user sync (existing cache) [unchanged]
- **GIVEN** the user has existing messages in local cache
- **WHEN** the application starts
- **THEN** it fetches only the most recent batch of messages (50)
- **AND** stops fetching when it encounters known messages

#### Scenario: Incremental history fetch [unchanged]
- **GIVEN** the user has existing messages up to timestamp T
- **WHEN** the application starts
- **THEN** it fetches history backwards from now
- **AND** it stops fetching automatically when it encounters messages older than T that are already stored locally

#### Scenario: Pipeline processing [unchanged]
- **WHEN** a batch of historical messages is received
- **THEN** the system decrypts and saves them immediately
- **AND** the UI updates to show them (if within view) before the next batch is requested
- **AND** any messages fetched via history sync that are later delivered again via the real-time subscription SHALL be identified by event ID and ignored to prevent duplication

#### Scenario: Older history available on-demand after first-sync
- **GIVEN** the user has completed first-time sync (local DB contains messages up to ~30 days)
- **AND** the user opens a specific conversation
- **WHEN** the user scrolls to the top of the message list and local cache is exhausted
- **THEN** the "Fetch older messages from relays" control is shown
- **AND** clicking it triggers `fetchOlderMessages` to request older history beyond the 30-day window
- **AND** newly fetched messages are saved into the local database and displayed
