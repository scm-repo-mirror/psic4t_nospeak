## MODIFIED Requirements

### Requirement: Android Background Messaging Connection Reliability
The Android Capacitor app shell background messaging implementation SHALL maintain durable WebSocket connections to user's configured read relays while native foreground service is running by using explicit heartbeat behavior and conservative reconnection logic.

The foreground service SHALL configure its WebSocket client with a periodic ping interval to keep NAT mappings alive and detect dead connections, SHALL track relay connections per URL, and SHALL schedule reconnection attempts with bounded exponential backoff when a relay connection closes or fails while background messaging remains enabled. Reconnection attempts SHALL stop when background messaging is disabled, user signs out, or foreground service is destroyed.

The foreground service SHALL use an adaptive heartbeat profile to reduce wakeups while device is locked:
- In **active profile**, service SHALL use a WebSocket ping interval of **120 seconds**.
- In **locked profile**, service SHALL use a WebSocket ping interval of **300 seconds**.

The locked profile SHALL be entered only after a **60 second grace period** following a screen-off event, and SHALL NOT be used while device is charging.

Energy profile changes SHALL NOT trigger WebSocket connection restarts. When energy profile changes, the service SHALL rebuild its `OkHttpClient` instance with the new ping interval, and new connections SHALL use the updated interval. Existing WebSocket connections SHALL remain active until they naturally disconnect and reconnect.

#### Scenario: Energy profile changes do not restart connections
- **GIVEN** user is running nospeak inside Android Capacitor app shell
- **AND** background messaging is enabled and native foreground service is active
- **AND** device transitions between active and locked profiles (for example, screen-off after grace period, screen-on, charging state change)
- **WHEN** energy profile evaluation determines a profile change
- **THEN** service SHALL NOT close or restart existing WebSocket connections to apply new ping interval
- **AND** it SHALL rebuild the `OkHttpClient` instance with the updated ping interval
- **AND** new connections created during reconnection attempts SHALL use the new ping interval.

#### Scenario: Screen-off grace period prevents immediate profile change
- **GIVEN** user is running nospeak inside Android Capacitor app shell
- **AND** background messaging is enabled and native foreground service is active
- **WHEN** device transitions to screen-off state
- **THEN** service SHALL remain in active profile for at least 60 seconds
- **AND** it SHALL NOT restart relay connections to switch ping intervals during this grace period.

#### Scenario: Locked profile uses longer ping interval when not charging
- **GIVEN** user is running nospeak inside Android Capacitor app shell
- **AND** background messaging is enabled and native foreground service is active
- **AND** device has been screen-off for more than 60 seconds
- **AND** device is not charging
- **WHEN** new WebSocket connections are established to relays during natural reconnection cycles
- **THEN** service SHALL use locked profile ping interval of 300 seconds for those connections.

#### Scenario: Charging forces active profile heartbeat behavior
- **GIVEN** user is running nospeak inside Android Capacitor app shell
- **AND** background messaging is enabled and native foreground service is active
- **AND** device is in a locked state
- **WHEN** device begins charging and profile evaluates to active
- **THEN** service SHALL rebuild `OkHttpClient` with active profile ping interval of 120 seconds
- **AND** new connections SHALL use the active profile ping interval
- **AND** existing connections SHALL remain active until they naturally disconnect.

#### Scenario: Unlock switches back to active profile
- **GIVEN** user is running nospeak inside Android Capacitor app shell
- **AND** background messaging is enabled and native foreground service is active
- **AND** device is in a locked state
- **WHEN** user unlocks device and OS indicates user is present
- **THEN** service SHALL evaluate and apply active profile without restarting existing connections
- **AND** new connections SHALL use active profile ping interval of 120 seconds.
