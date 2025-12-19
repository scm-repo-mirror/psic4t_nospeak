# Change: Show robohash avatars in notifications when missing profile pics

## Why
Notifications currently fall back to the default nospeak app icon when a sender has no `metadata.picture`. This makes it hard to quickly recognize who the notification is from, especially for contacts who have not set a profile image.

The UI already displays a deterministic robohash avatar when `metadata.picture` is missing, so notifications should match that behavior for visual consistency and better sender recognition.

## What Changes
- Web/PWA (browser notifications)
  - Use the sender’s profile picture (`metadata.picture`) as the notification `icon` when available.
  - Otherwise, use the sender’s deterministic robohash avatar (seeded exactly the same way as the UI).
  - Keep the notification `badge` as the nospeak branded icon.
- Android (Capacitor local notifications)
  - Keep the small status-bar icon as the branded nospeak icon.
  - Add a per-notification large icon showing the sender’s profile picture when available, otherwise the deterministic robohash avatar.
  - Implement this as best-effort; if the large icon cannot be resolved, notifications still fire with the branded small icon.
- Android background messaging foreground service
  - No change. Background notifications remain generic and do not include sender identity or avatars.

## Non-Goals
- Changing the robohash service or its URL format.
- Adding a user-facing setting to disable robohash fallbacks.
- Showing sender avatars for Android background messaging notifications (those are intentionally generic).

## Impact
- Affected specs
  - `messaging` (notification icon behavior, branding clarification)
- Affected implementation areas (apply stage)
  - `src/lib/core/NotificationService.ts` (web + Android local notifications)
  - `src/lib/components/Avatar.svelte` (reference behavior; no changes expected)
  - Android native shell: no changes expected for background service notifications
- Validation (apply stage)
  - Update/add unit tests around notification icon selection
  - `npm run check`
  - `npx vitest run`
  - Manual verification on Android device/emulator + web/PWA
