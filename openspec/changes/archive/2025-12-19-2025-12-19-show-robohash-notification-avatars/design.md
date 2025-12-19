# Design: Notification avatar fallback (profile pic → robohash)

## Context
The nospeak UI already uses a deterministic robohash avatar for contacts when `metadata.picture` is missing. Notifications currently do not match this behavior:
- Web/PWA notifications fall back to a default nospeak icon.
- Android local notifications always show the app icon (small icon), with no sender-specific large icon.

This change aligns notification visuals with the existing avatar fallback behavior.

## Goals
- Match existing avatar fallback logic used in the UI.
- Preserve nospeak branding for notification badge and Android small icon.
- Keep notification delivery reliable: avatar work must be best-effort and must not block notifications.

## Current Behavior (Observed)
- Web notifications set `icon` to `senderPicture || DEFAULT_NOTIFICATION_ICON`.
- UI avatars use robohash:
  - `https://robohash.org/${npub.slice(-10)}.png?set=set1&bgset=bg2`
- Android local notifications use `smallIcon: ic_stat_nospeak` and do not set a sender avatar.
- Android background messaging service notifications are intentionally generic and do not reveal sender identity.

## Proposed Behavior
### Deterministic robohash URL
Use the same robohash URL format as `src/lib/components/Avatar.svelte`:
- Seed: `npub.slice(-10)`
- URL:
  - `https://robohash.org/<seed>.png?set=set1&bgset=bg2`

### Web/PWA notifications
- If `metadata.picture` is a non-empty string, use it as the notification `icon`.
- Otherwise, use the robohash URL as the notification `icon`.
- Keep `badge` as the branded nospeak icon.

### Android (Capacitor local notifications)
Android requires two distinct icon concepts:
- **Small icon**: status-bar icon, must be an Android drawable resource. Keep using `ic_stat_nospeak`.
- **Large icon**: main notification image, can be used to display sender avatar.

Approach:
1. Choose avatar URL:
   - Prefer `metadata.picture` when present.
   - Otherwise use robohash URL.
2. Attempt to resolve a local file URI for that avatar:
   - Download the avatar (HTTP(S)) with a short timeout.
   - Write it to the Capacitor Filesystem cache directory under a deterministic path (for example `nospeak-notification-icons/<npub>.png`).
   - Use the returned file `uri` as `largeIcon` in the scheduled notification.
3. If any step fails (no plugin, fetch error, write error, timeout), schedule the notification without `largeIcon`.

### Android background messaging
No changes. The native foreground service continues to emit generic encrypted-message notifications without sender identity.

## Trade-offs and Risks
- **Network and privacy**: robohash requires network access and reveals a stable seed to `robohash.org`. This is already true for in-app avatars when no picture is set; this change does not introduce a new data class, but it may increase requests.
- **Latency**: downloading an image before scheduling could delay the notification. Mitigation: short timeout and best-effort fallback.
- **Plugin/platform variability**: Capacitor local notifications support for `largeIcon` with file URIs may vary. Implementation must be defensive and treat large icon as optional.

## Compatibility and Rollout
- Web/PWA: should work anywhere `Notification` or `ServiceWorkerRegistration.showNotification` supports `icon`.
- Android: large icon is an enhancement only; if unsupported, behavior gracefully falls back to branded app icon.

## Testing Strategy (Apply Stage)
- Unit tests:
  - Web notification options: verify `icon` selection for (a) picture present (b) picture missing.
  - Android local notification payload: verify `largeIcon` is included when caching succeeds and omitted when it fails.
- Manual:
  - Confirm browser/PWA notification shows robohash avatar for contacts without pictures.
  - Confirm Android notification shows sender avatar as large icon when possible, without breaking delivery.
