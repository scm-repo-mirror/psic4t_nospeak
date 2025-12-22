## MODIFIED Requirements

### Requirement: Android Background Messaging Connection Reliability
The Android Capacitor app shell background messaging implementation SHALL maintain durable WebSocket connections to the user's configured read relays while the native foreground service is running by using explicit heartbeat behavior and conservative reconnection logic.

The foreground service SHALL configure its WebSocket client with a periodic ping interval to keep NAT mappings alive and detect dead connections, SHALL track relay connections per URL, and SHALL schedule reconnection attempts with bounded exponential backoff when a relay connection closes or fails while background messaging remains enabled. Reconnection attempts SHALL stop when background messaging is disabled, the user signs out, or the foreground service is destroyed.

The foreground service SHALL use an adaptive heartbeat profile to reduce wakeups while the device is locked:
- In the **active profile**, the service SHALL use a WebSocket ping interval of **120 seconds**.
- In the **locked profile**, the service SHALL use a WebSocket ping interval of **300 seconds**.

The locked profile SHALL be entered only after a **60 second grace period** following a screen-off event, and SHALL NOT be used while the device is charging.

#### Scenario: Screen-off grace period prevents immediate profile change
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled and the native foreground service is active
- **WHEN** the device transitions to screen-off state
- **THEN** the service SHALL remain in the active profile for at least 60 seconds
- **AND** it SHALL NOT restart relay connections solely to switch ping intervals during this grace period.

#### Scenario: Locked profile uses longer ping interval when not charging
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled and the native foreground service is active
- **AND** the device has been screen-off for more than 60 seconds
- **AND** the device is not charging
- **WHEN** background messaging connections are maintained during this locked period
- **THEN** the service SHALL use the locked profile ping interval of 300 seconds.

#### Scenario: Charging forces active profile heartbeat behavior
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled and the native foreground service is active
- **AND** the device is in a locked state
- **WHEN** the device begins charging
- **THEN** the service SHALL switch to the active profile
- **AND** it SHALL use the active profile ping interval of 120 seconds.

#### Scenario: Unlock switches back to active profile
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled and the native foreground service is active
- **AND** the device is in a locked state
- **WHEN** the user unlocks the device and the OS indicates the user is present
- **THEN** the service SHALL use the active profile ping interval of 120 seconds.
