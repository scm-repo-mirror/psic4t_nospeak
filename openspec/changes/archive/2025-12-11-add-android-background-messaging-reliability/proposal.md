# Change: Improve Android background messaging reliability and notification accuracy

## Why
Android background messaging currently starts a native foreground service that connects to read relays and raises generic "new encrypted message" notifications. On some devices (for example, a Pixel), relay connections silently drop after tens of minutes while the persistent foreground notification continues to claim that nospeak is connected to read relays. This leads to missed background notifications even though the user believes background messaging is active.

## What Changes
- Define explicit reliability requirements for Android background messaging connections, including heartbeat behavior and reconnection with backoff when relay WebSocket connections are lost.
- Define requirements for foreground notification health state so that the persistent Android notification accurately reflects whether background messaging is connected, reconnecting, or disconnected.
- Align the Android native background messaging implementation (foreground service and Capacitor plugin) with these requirements while keeping behavior generic across nsec and Amber sessions.
- Preserve the existing energy-efficiency goals by specifying conservative heartbeat intervals and reconnection strategies that avoid aggressive polling.

## Impact
- Affected specs: `android-app-shell` (background messaging foreground service and notification behavior). The new requirements clarify and extend existing background messaging and energy-efficiency behavior without changing core messaging semantics.
- Affected code: Android native service and plugin used for background messaging (for example, `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java` and `android/app/src/main/java/com/nospeak/app/AndroidBackgroundMessagingPlugin.java`), and the TypeScript bridge responsible for enabling/disabling Android background messaging (`src/lib/core/BackgroundMessaging.ts`).
- User impact: Android users who enable background messaging can rely on more durable background delivery of generic encrypted-message notifications and clearer indication of the actual background connection state.
