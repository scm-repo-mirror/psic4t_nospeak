## ADDED Requirements
### Requirement: Android Background Messaging Connection Reliability
The Android Capacitor app shell background messaging implementation SHALL maintain durable WebSocket connections to the user's configured read relays while the native foreground service is running by using explicit heartbeat behavior and conservative reconnection logic. The foreground service SHALL configure its WebSocket client with a periodic ping interval to keep NAT mappings alive and detect dead connections, SHALL track relay connections per URL, and SHALL schedule reconnection attempts with bounded exponential backoff when a relay connection closes or fails while background messaging remains enabled. Reconnection attempts SHALL stop when background messaging is disabled, the user signs out, or the foreground service is destroyed.

#### Scenario: Background connections survive common idle periods
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the user has enabled background messaging and the native foreground service is active
- **AND** WebSocket connections have been established to at least one configured read relay
- **WHEN** the device remains idle for tens of minutes with normal network conditions (for example, the device is locked but Wi-Fi or mobile data remains available)
- **THEN** the foreground service SHALL continue to maintain at least one active WebSocket connection to a read relay using its configured heartbeat behavior
- **AND** new gift-wrapped events for the user that are delivered by that relay during this period SHALL remain eligible to trigger generic encrypted-message notifications according to existing messaging and android-app-shell requirements.

#### Scenario: Background connections recover after network change
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell with background messaging enabled
- **AND** the native foreground service has active WebSocket connections to one or more read relays
- **WHEN** a network transition or transient error causes one or more relay WebSocket connections to close or fail (for example, switching from Wi-Fi to mobile data)
- **THEN** the foreground service SHALL detect the closure or failure
- **AND** it SHALL schedule reconnection attempts for the affected relays using a conservative exponential backoff strategy with an upper bound on retry interval
- **AND** once network connectivity is restored, at least one read relay connection SHALL be re-established while background messaging remains enabled, so that subsequent gift-wrapped events for the user can again trigger generic encrypted-message notifications.

#### Scenario: Reconnection stops when background messaging is disabled or user signs out
- **GIVEN** the native foreground service has previously established WebSocket connections and may have scheduled reconnection attempts
- **WHEN** the user signs out of nospeak, disables Android background messaging in Settings → General, or the app otherwise determines that background messaging is no longer allowed
- **THEN** the app SHALL stop the native background messaging foreground service
- **AND** the service SHALL close any active WebSocket connections and cancel any pending reconnection timers
- **AND** it SHALL NOT continue attempting to reconnect to relays once background messaging is disabled or the user is signed out.

### Requirement: Android Background Messaging Notification Health State
The Android Capacitor app shell foreground notification for background messaging SHALL reflect the current health of background relay connections instead of always claiming that nospeak is connected. While the native foreground service is running, the notification text SHALL indicate when at least one read relay connection is active, MAY indicate when the service is attempting to reconnect to relays after connection loss, and SHALL avoid implying an active connection when no relays are currently connected and no reconnection attempts are scheduled.

#### Scenario: Foreground notification shows connected state when relays are active
- **GIVEN** the Android foreground service for background messaging is running
- **AND** at least one WebSocket connection to a configured read relay is currently active
- **WHEN** the foreground notification is displayed in the Android notification shade
- **THEN** the notification SHALL indicate that nospeak is connected to read relays and MAY include a summary list of up to four connected read relay URLs, consistent with existing android-app-shell foreground notification requirements.

#### Scenario: Foreground notification reflects reconnecting state when all relays are down
- **GIVEN** the Android foreground service for background messaging is running
- **AND** all WebSocket connections to configured read relays are currently closed or have failed
- **AND** the service has scheduled one or more reconnection attempts using its backoff strategy
- **WHEN** the foreground notification is displayed in the Android notification shade
- **THEN** the notification SHALL indicate that nospeak is reconnecting to read relays or otherwise clearly communicate that it is attempting to restore connectivity rather than being fully connected.

#### Scenario: Foreground notification does not imply connection when background messaging is effectively disconnected
- **GIVEN** the Android foreground service for background messaging is running
- **AND** there are no active WebSocket connections to any configured read relays
- **AND** no reconnection attempts are currently scheduled (for example, because there are no valid relay URLs, permissions were revoked, or background messaging is in a stopped or error state)
- **WHEN** the foreground notification is displayed in the Android notification shade
- **THEN** the notification text SHALL avoid claiming that nospeak is connected to read relays
- **AND** it MAY indicate that background messaging is not currently connected so that users are not misled about connection state.
