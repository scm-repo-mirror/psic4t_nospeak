# Change: Update Android background messaging energy profiles

## Why
Android background messaging currently maintains WebSocket connections using frequent heartbeats that can cause unnecessary background wakeups, especially while the device is locked and not charging. This project needs near-realtime message delivery, so we want to reduce energy usage without switching to polling or reducing relay coverage.

## What Changes
- Update the Android native background messaging foreground service to use **adaptive WebSocket heartbeat intervals** based on device state.
- Treat lock-screen-visible devices as locked until the user unlocks ("user present").
- Add a 60-second grace period after screen-off before switching to the locked/low-wakeup profile.
- While locked, reduce non-essential background work (such as avatar fetch and conversation shortcut publishing) without changing notification semantics for messages.
- Add debug-only logging for profile transitions to support tuning and field diagnostics.

## Impact
- Affected specs:
  - `android-app-shell`: background messaging foreground service connection behavior.
  - `messaging`: energy-efficiency requirements for Android background messaging.
- Affected code (implementation stage):
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java`
  - `android/app/src/main/java/com/nospeak/app/AndroidBackgroundMessagingPlugin.java` (only if new config wiring is needed)
- User impact:
  - Background message delivery remains near-realtime.
  - Reduced background battery drain while locked by lowering heartbeat frequency and skipping non-essential enrichment work.

## Non-Goals
- Introducing polling (WorkManager / AlarmManager) for message delivery.
- Reducing relay coverage while background messaging is enabled (the service continues to connect to all configured messaging relays).
- Adding new user-visible settings for heartbeat intervals.
