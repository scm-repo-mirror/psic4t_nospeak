## 1. Database Schema Update
- [x] 1.1 Update `ContactItem` interface in `src/lib/db/db.ts` to include optional `lastReadAt: number`.
- [x] 1.2 Update `NospeakDB` version 5 schema in `src/lib/db/db.ts` to include `lastReadAt` in `contacts` table (no index needed unless we query by it).

## 2. Contact Repository Update
- [x] 2.1 Update `ContactRepository.addContact` to accept optional `lastReadAt`.
- [x] 2.2 Add `ContactRepository.markAsRead(npub: string)` method to update `lastReadAt` to current time.

## 3. Integration Logic
- [x] 3.1 Update `MessagingService.autoAddContact` to set `lastReadAt` to 0 (or undefined) for new incoming contacts, so they appear unread.
- [x] 3.2 Update `ContactList.svelte` to calculate `hasUnread` by comparing `contact.lastMessageTime > (contact.lastReadAt || 0)`.
- [x] 3.3 Update `src/routes/chat/[npub]/+page.svelte` to call `contactRepo.markAsRead(currentPartner)` when the component mounts or when new messages arrive.
