# Change: Fix Android background messaging connection restarts causing battery drain

## Why
The 2025-12-22 energy profiles implementation causes battery drain worse than before the change. Energy profile changes (screen on/off, charging) trigger full WebSocket connection restarts with TLS handshakes, which is more expensive than keeping stable connections with longer ping intervals.

The spec correctly prevents connection restarts during the 60-second grace period, but allows them afterwards, which causes excessive battery drain.

## What Changes
- **BREAKING**: Energy profile changes will no longer trigger full WebSocket connection restarts
- Energy profile switches will apply lazily: the `OkHttpClient` instance will be rebuilt with the new ping interval, but existing connections will remain active until they naturally reconnect
- New connections will automatically use the updated ping interval from the new client
- Background messaging service will maintain stable connections across profile transitions

## Impact
- Affected specs:
  - `android-app-shell`: "Android Background Messaging Connection Reliability" requirement modification
- Affected code:
  - `android/app/src/main/java/com/nospeak/app/NativeBackgroundMessagingService.java` (remove `startRelayConnections()` call from `evaluateAndApplyEnergyProfile()`)
- User impact:
  - Battery drain should be significantly reduced
  - Energy profile changes happen gradually (on next natural reconnect) rather than immediately
  - Ping interval transitions become lazy application rather than forced restart
