## 1. Implementation
- [x] 1.1 Update messaging data model to track per-contact last activity that can be driven by both new messages and reactions, without changing how messages themselves are stored or rendered.
- [x] 1.2 Extend the reaction processing pipeline for NIP-17 DMs so that incoming NIP-25 kind 7 reactions from other participants are associated with the correct conversation partner and update per-contact last activity.
- [x] 1.3 Update the contacts list unread indicator logic so that contacts with only new reactions (no new messages) can still show the green dot until the conversation is opened and marked as read.
- [x] 1.4 Add foreground notification behavior for reactions in the web and Android runtimes, mirroring existing message notification suppression rules when the relevant conversation is active and visible.
- [x] 1.5 Confirm that the Android background messaging foreground service continues to raise generic encrypted-message notifications for gift-wrapped reaction events in accordance with the updated messaging requirements.

## 2. Validation
- [x] 2.1 Add or update unit tests around the messaging service, contact repository, reaction handling, and notification service to cover unread indicator and foreground notification behavior for reactions.
- [x] 2.2 Manually validate on web that reactions from another contact trigger the unread indicator and browser notifications when appropriate, and are suppressed when viewing the same conversation.
- [x] 2.3 Manually validate on Android that reactions from another contact trigger foreground local notifications when the app is not viewing that conversation, and that background messaging continues to surface generic encrypted-message notifications for reaction gift-wraps while the app UI is suspended.
