# Change: Add Unread Message Indicator

## Why
Users currently have no way of knowing if they have received new messages from contacts they are not currently chatting with. This leads to missed communications and forces users to manually check each contact.

## What Changes
- Add a visual indicator (green dot) to the contact list for contacts with unread messages.
- Track the last read timestamp for each contact.
- Automatically clear the indicator when the user views the conversation.

## Impact
- Affected specs: `messaging`
- Affected code: `src/lib/db/db.ts`, `src/lib/db/ContactRepository.ts`, `src/lib/components/ContactList.svelte`, `src/routes/chat/[npub]/+page.svelte`
