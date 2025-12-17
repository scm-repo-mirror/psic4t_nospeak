# Change: Add notifications and unread indicators for message reactions

## Why
Kind 7 NIP-25 reactions on NIP-17 encrypted direct messages are currently stored and rendered under messages, but they do not trigger any unread contact indicator or browser/Android notification. Users expect reactions from their contacts to behave as attention-worthy conversation activity, similar to new messages, especially when the app is not in the foreground or when a different conversation is open.

## What Changes
- Treat incoming reactions from other participants in a NIP-17 DM as conversation "activity" that can drive unread state and local notifications without promoting reactions to standalone chat messages.
- Extend the messaging requirements so that contacts with only new reactions (no new messages) can show the unread indicator (green dot) until the user views the conversation.
- Add messaging requirements for local web and Android notifications that explicitly cover reactions, including suppression when the active conversation is visible and mapping to the existing notification settings.
- Clarify how Android background messaging behavior interacts with reactions, ensuring the native foreground service continues to raise generic encrypted-message notifications for gift-wrapped reaction events without decrypting content.

## Impact
- Affected specs: `messaging` (NIP-25 reactions, unread indicator, local notifications, Android background messaging).
- Affected code (expected):
  - Reaction processing and storage in the messaging pipeline (`src/lib/core/Messaging.ts`, `src/lib/db/ReactionRepository.ts`, `src/lib/stores/reactions.ts`).
  - Contact unread and last-activity logic and UI (`src/lib/db/ContactRepository.ts`, `src/lib/db/db.ts`, `src/lib/components/ContactList.svelte`).
  - Notification behavior in the foreground pipeline (`src/lib/core/NotificationService.ts`, `src/lib/core/Messaging.ts`).
  - Android background messaging service integration and validation (native foreground service behavior and how it surfaces generic encrypted-message notifications).
