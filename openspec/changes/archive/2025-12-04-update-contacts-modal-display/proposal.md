# Change: Show avatar and username in contacts modal before shortened npub

## Why
Users currently see only a shortened npub in the Manage Contacts modal, making it harder to visually recognize contacts compared to the main contact list, which already shows avatars and profile names.

## What Changes
- Display each contact's profile picture (or fallback avatar) and resolved username in the Manage Contacts modal contact list.
- Keep the shortened npub visible but visually secondary to the username.
- Reuse existing profile metadata and avatar behavior from the main contact list; do not introduce new profile fields or network calls.

## Impact
- Affected specs: messaging
- Affected code: src/lib/components/ManageContactsModal.svelte, src/lib/components/Avatar.svelte (usage only), src/lib/db/ProfileRepository.ts (read usage only)
