## Context
Android background messaging currently uses a native foreground service and Capacitor plugin to connect to the user's read relays and raise generic "new encrypted message" notifications while the app UI is not visible. The service connects to the configured read relays once using OkHttp WebSockets and subscribes to gift-wrapped events but does not send periodic heartbeats, does not implement explicit reconnection behavior, and keeps the persistent foreground notification visible regardless of actual socket health.

On some devices (for example, a Pixel), relay WebSocket connections silently drop after tens of minutes of idle time due to NAT, carrier policies, or OS behavior. Because there is no heartbeat or reconnection logic, the service stops receiving events but continues to show a stable foreground notification claiming that nospeak is connected to read relays, leading to missed notifications and misleading UX.

## Goals
- Keep Android background messaging connections alive across common idle and network-change scenarios using explicit heartbeats and reconnection.
- Detect and recover from dropped WebSocket connections while the foreground service is running, without relying on OS restarts of the service.
- Reflect the actual background messaging health in the persistent foreground notification text so users are less likely to be misled about connection state.
- Preserve the existing security model, continuing to treat gift-wrapped events as opaque envelopes and raising only generic encrypted-message notifications.
- Maintain energy-efficient behavior by using conservative heartbeat intervals and reconnection backoff to avoid aggressive polling.

## Non-Goals
- Changing the semantics of foreground messaging, decryption, or how messages are stored and displayed once the app is in the foreground.
- Introducing delivery guarantees stronger than best-effort push via relays (for example, end-to-end acknowledgement or retry semantics beyond what relays already provide).
- Altering the existing user-facing settings model for background messaging or notifications beyond what is already specified in `settings`.

## Decisions
- Use OkHttp's built-in WebSocket ping facility with a moderate interval (for example, 30–60 seconds) and an infinite read timeout to keep NAT mappings alive and reliably detect dead connections in background mode.
- Manage relay connections per-URL inside the foreground service, tracking active sockets and scheduling reconnection attempts with exponential backoff (for example, 1s, 2s, 4s, up to a bounded maximum such as 5 minutes) when a socket closes or fails while background messaging is still enabled.
- Ensure reconnection attempts stop when the service is destroyed or when the app signals that background messaging has been disabled or the user has signed out, so the service does not continue to run indefinitely.
- Derive the persistent foreground notification text from current connection health, showing a connected summary when at least one relay socket is active, a reconnecting message when all sockets are down but backoff timers are scheduled, and a not-connected message when no relays are active and no reconnects are pending.
- Continue using the existing Android notification channels and icon assets, keeping background notifications generic and not attempting to decrypt or expose sender identity in the native layer.

## Alternatives Considered
- Relying solely on OS-level restart behavior or a periodic JobScheduler/WorkManager job to recreate relay connections. This was rejected because it adds additional moving parts, is less predictable across OEMs, and can still leave connections dead for long periods between jobs.
- Implementing a full-fledged relay connection manager in native code parallel to the TypeScript `ConnectionManager`. This was rejected as unnecessary complexity; the foreground service only needs a minimal, focused subset of behaviors (subscribe to gift-wraps, maintain connectivity, and raise generic notifications).
- Using very short ping intervals (for example, < 15 seconds) to aggressively detect disconnects. This was rejected as potentially too expensive for battery usage in background, especially on mobile networks. Conservative intervals and bounded backoff are preferred.

## Risks and Trade-offs
- Some OEMs may still apply aggressive background restrictions even to foreground services, so background messaging remains best-effort and cannot guarantee delivery in all device configurations.
- Heartbeats and reconnection attempts introduce additional background network traffic and CPU wakeups. Using conservative intervals and backoff helps mitigate this but does not eliminate energy impact entirely.
- Making the foreground notification text reflect connection health may expose brief periods where the status flips between connected and reconnecting during transient network changes; this is acceptable in exchange for more truthful UX.

## Implementation Sketch
- Extend the native foreground service to construct the OkHttp WebSocket client with a non-zero ping interval and infinite read timeout.
- Track active WebSockets and retry state by relay URL, and implement a helper that schedules reconnect attempts on `onClosed` and `onFailure` callbacks while the service is running and background messaging remains enabled.
- Add a small notification helper that recomputes the foreground notification text from connection health and updates the existing notification ID when sockets connect or disconnect.
- Ensure that service teardown (including user sign-out or disabling background messaging) cancels any pending reconnect callbacks, closes all sockets, clears state sets/maps, and removes the persistent foreground notification.
