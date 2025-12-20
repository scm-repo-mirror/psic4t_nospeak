## Context
The Android background messaging implementation uses a native foreground service (`NativeBackgroundMessagingService`) to maintain relay connections and emit OS notifications while the WebView UI is suspended. Conversation notifications currently use a generic notification layout, optionally attaching the cached sender avatar as a large icon.

Android provides a messaging-optimized notification presentation via `NotificationCompat.MessagingStyle` which can render a conversation-style notification, including sender `Person` identity and icon.

## Goals / Non-Goals

- Goals:
  - Emit conversation notifications using `NotificationCompat.MessagingStyle`.
  - Represent only the latest incoming activity (one message line) per conversation notification.
  - Use cached sender identity (username and avatar) to build the sender `Person` with an icon on a best-effort basis.
  - Preserve existing tap-to-chat routing behavior.

- Non-Goals:
  - Do not add multi-message history to notifications.
  - Do not change the generic encrypted-message notification.
  - Do not change the persistent foreground-service status notification.
  - Do not introduce new metadata subscriptions (the service must not fetch kind `0` events itself).

## Decisions

- Decision: Use `NotificationCompat.MessagingStyle` for conversation notifications only.
  - Rationale: The conversation notification already has the sender pubkey context and is the place where sender identity and previews are available.

- Decision: Render exactly one `MessagingStyle.Message` containing the latest preview text.
  - Rationale: Matches requested UX (latest-only) and avoids maintaining notification history state.

- Decision: Use `Person` icons derived from the cached avatar bitmap when available.
  - Rationale: Reuses existing on-device cached data populated by the web runtime, stays best-effort, and avoids any new network fetch beyond the existing avatar cache path.

- Decision: Preserve `setContentTitle`/`setContentText` and (when available) `setLargeIcon` as fallbacks.
  - Rationale: Some notification renderers and older Android skins may not fully honor `MessagingStyle` or person icons.

## Risks / Trade-offs

- `MessagingStyle` rendering differences across OEM variants may affect visual consistency.
- Converting bitmaps to icons may add minor overhead; we rely on cached bitmaps and keep the payload to one message.
- If the avatar is not yet cached when the notification first fires, a later refresh may re-issue the notification with the icon.

## Migration Plan

- Implement the `MessagingStyle` notification construction in the native service while keeping routing and channels unchanged.
- Verify behavior on at least one Android 13+ device/emulator and one older supported version.
- Keep the generic encrypted-message notification unchanged as the fallback path.
