# Change: Add location message preview labels for notifications and chat list

## Why
When a location message is received, notifications and the chat list preview display the raw `geo:lat,lng` string instead of a user-friendly label. File messages already show localized labels like "Voice Message" or "Image" with icons; location messages should receive the same treatment.

## What Changes
- Notification body for location messages shows `📍 Location` (localized) instead of raw `geo:` content
- Chat list last-message preview for location messages shows `📍 Location` (localized) instead of raw `geo:` content
- Android native background messaging service shows `📍 Location` for location messages instead of the raw `geo:` string
- New localization key `contacts.mediaPreview.location` added across all supported locales

## Impact
- Affected specs: `messaging` (Mobile contacts last message preview, Local Message Notifications, Android Background Message Delivery, Android Conversation Notifications)
- Affected code:
  - `src/lib/utils/mediaPreview.ts` — new `getLocationPreviewLabel()` helper
  - `src/lib/core/Messaging.ts` — notification body construction
  - `src/lib/components/ChatList.svelte` — chat list preview (2 places)
  - `src/lib/i18n/locales/{en,de,es,fr,it,pt}.ts` — new localization key
  - `android/.../NativeBackgroundMessagingService.java` — `resolveRumorPreview()` for kind 14 location messages
