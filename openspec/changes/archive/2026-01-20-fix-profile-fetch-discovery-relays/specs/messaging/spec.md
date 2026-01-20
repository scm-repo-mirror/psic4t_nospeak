## MODIFIED Requirements

### Requirement: First-Time Sync Progress Indicator
The system SHALL display a blocking modal progress indicator during the ordered login and first-time message synchronization flow on both desktop and mobile devices. The indicator SHALL remain visible and blocking until the flow has completed all required steps, has timed out, or has been dismissed by the user, and SHALL show both the current step label and the number of fetched messages, updating in real time as history sync batches are processed.

The sync flow SHALL enforce a global timeout of 5 minutes. When the timeout is reached, the modal SHALL display an error state showing which relays encountered errors and during which step, along with options to retry or skip. After 2 minutes of sync progress, the modal SHALL offer a "Continue in background" option that dismisses the modal while allowing sync to complete silently; when background sync completes, the system SHALL display a toast notification.

#### Scenario: Ordered login and history sync steps
- **GIVEN** the user has successfully authenticated but the messaging environment has not yet completed initialization
- **WHEN** the application starts the login history synchronization flow
- **THEN** a blocking modal overlay appears and displays the following steps in order:
  1. Connect to discovery relays
  2. Fetch and cache the user's messaging relays
  3. Connect to the user's read relays
  4. Fetch and cache history items from relays
  5. Fetch and cache profile and relay information for created contacts
  6. Fetch and cache the current user profile
- **AND** the modal remains visible and prevents interaction with the underlying chat UI while any of these steps are in progress
- **AND** the modal highlights the current step as it runs and marks prior steps as completed before moving on
- **AND** the fetched message count displayed in the modal updates in real time during step 4 as history batches are processed.

#### Scenario: Discovery relays used for profile fetching steps
- **GIVEN** the login history synchronization flow has completed step 4 (fetch history)
- **AND** discovery relays have been cleaned up after step 3
- **WHEN** the system begins step 5 (fetch contact profiles) or step 6 (fetch user profile)
- **THEN** the system SHALL temporarily reconnect to discovery relays alongside the user's persistent messaging relays
- **AND** profile resolution queries SHALL be sent to both discovery relays and the user's messaging relays
- **AND** after both steps 5 and 6 complete, the system SHALL clean up the temporary discovery relay connections while keeping the user's persistent messaging relays connected.

#### Scenario: Profile fetching succeeds when user has blank messaging relay
- **GIVEN** the user has configured a single messaging relay that is new or does not have contact profiles cached
- **AND** the login history synchronization flow is executing steps 5 and 6
- **WHEN** the system attempts to fetch contact profiles and user profile
- **THEN** profile resolution SHALL query both the user's messaging relay and discovery relays
- **AND** profiles published to discovery relays (such as purplepag.es, relay.damus.io, nos.lol) SHALL be successfully fetched even when absent from the user's messaging relay.

#### Scenario: Modal dismissal and view refresh after flow completion
- **GIVEN** the blocking login history synchronization flow is in progress
- **AND** all six steps have completed successfully
- **WHEN** the flow reaches its terminal success state
- **THEN** the blocking modal overlay is dismissed
- **AND** the main chat interface is refreshed to reflect the newly synchronized history, contacts, and user profile (for example, by re-evaluating startup navigation and active conversation selection)
- **AND** normal background messaging behaviors (such as real-time subscriptions and non-blocking profile refreshes) MAY start or resume.

#### Scenario: Returning user with cached state still respects ordered flow
- **GIVEN** the user has previously logged in and some data (such as messaging relays, history, or profile) is cached locally
- **WHEN** the user logs in again and the application begins messaging initialization
- **THEN** the system SHALL still execute the ordered login history synchronization flow
- **AND** steps whose data is already fresh MAY complete quickly or be marked as skipped, but the modal SHALL remain visible until all required steps reach a completed or intentionally skipped state
- **AND** the user SHALL NOT be able to interact with the main messaging UI until the flow completes and the modal is dismissed.

#### Scenario: Global sync timeout triggers error state
- **GIVEN** the blocking login history synchronization flow is in progress
- **WHEN** 5 minutes have elapsed since the flow started without reaching completion
- **THEN** the sync flow SHALL be aborted
- **AND** the modal SHALL transition to an error state displaying:
  - An error title indicating sync failed
  - A message indicating the sync timed out after 5 minutes
  - A list of relay errors showing which relay URLs failed and during which step
- **AND** the modal SHALL display a "Retry" button and a "Skip and continue" button.

#### Scenario: Relay error tracking during sync
- **GIVEN** the login history synchronization flow is executing a step that involves relay communication
- **WHEN** a relay fails to connect, times out, or returns an error during that step
- **THEN** the system SHALL record the relay URL, error message, and current step identifier
- **AND** these errors SHALL be displayed in the error state UI when the sync fails or times out.

#### Scenario: Retry button restarts sync flow
- **GIVEN** the sync modal is displaying the error state with "Retry" and "Skip and continue" buttons
- **WHEN** the user clicks the "Retry" button
- **THEN** the system SHALL reset the sync state (clearing errors, progress, and step statuses)
- **AND** SHALL restart the login history synchronization flow from the beginning
- **AND** the modal SHALL return to the normal progress display.

#### Scenario: Skip button dismisses modal and continues in background
- **GIVEN** the sync modal is displaying the error state with "Retry" and "Skip and continue" buttons
- **WHEN** the user clicks the "Skip and continue" button
- **THEN** the blocking modal overlay SHALL be dismissed immediately
- **AND** the sync flow SHALL continue executing in the background (if not already terminated)
- **AND** the main chat interface SHALL become usable
- **AND** when the background sync completes (successfully or not), a toast notification SHALL be displayed.

#### Scenario: Continue in background option after 2 minutes
- **GIVEN** the blocking login history synchronization flow is in progress
- **AND** the modal is displaying normal progress (not error state)
- **WHEN** 2 minutes have elapsed since the flow started
- **THEN** the modal SHALL display a "Continue in background" button
- **AND** clicking this button SHALL dismiss the modal, allow the sync to continue in the background, and display a toast notification when sync completes.

#### Scenario: Toast notification on background sync completion
- **GIVEN** the user has dismissed the sync modal via "Skip and continue" or "Continue in background"
- **AND** the sync flow is continuing in the background
- **WHEN** the background sync flow completes (either successfully or by exhausting retries)
- **THEN** a toast notification SHALL be displayed indicating whether sync completed successfully or with errors.
