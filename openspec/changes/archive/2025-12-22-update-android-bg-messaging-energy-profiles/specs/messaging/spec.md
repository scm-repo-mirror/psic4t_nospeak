## MODIFIED Requirements

### Requirement: Energy-Efficient Background Messaging on Android
The messaging implementation for Android background messaging SHALL minimize energy usage by limiting background work to maintaining relay subscriptions, processing incoming messages, and firing notifications, and SHALL apply conservative reconnection and backoff behavior when connections are lost.

To reduce unnecessary wakeups and background network work while preserving near-realtime message delivery, the Android-native foreground service responsible for background messaging SHOULD:
- Use adaptive heartbeat behavior (as defined by the `android-app-shell` background messaging connection reliability requirements) to reduce WebSocket keepalive frequency while the device is locked.
- Avoid non-essential network and CPU work that is not required to deliver message notifications (for example, avatar fetching and conversation shortcut publishing) while the device is locked.

#### Scenario: No extra polling beyond relay subscriptions
- **GIVEN** background messaging is active on Android
- **WHEN** the app is running in background mode
- **THEN** the messaging pipeline SHALL avoid scheduling additional periodic polling or history sync jobs solely for background operation
- **AND** it SHALL rely primarily on real-time subscriptions to receive new messages.

#### Scenario: Conservative reconnection and backoff in background
- **GIVEN** background messaging is active and one or more relay connections are lost due to network changes or OS behavior
- **WHEN** the messaging pipeline attempts to reconnect to read relays while the app is in the background
- **THEN** it SHALL use a conservative reconnection strategy (for example, exponential backoff with upper bounds) to limit repeated connection attempts
- **AND** it SHALL stop attempting reconnections entirely if the user signs out or disables background messaging.

#### Scenario: Locked background operation avoids non-essential enrichment
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled and the native foreground service is active
- **AND** the device is locked
- **WHEN** the foreground service emits Android OS message notifications for newly received messages
- **THEN** it SHOULD avoid non-essential enrichment work that would trigger additional background network usage (such as avatar downloads)
- **AND** it SHOULD avoid non-essential platform integration work that is not required for notification delivery (such as publishing conversation shortcuts) while locked.
