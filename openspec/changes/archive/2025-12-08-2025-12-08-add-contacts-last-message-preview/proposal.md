# Change: Add mobile contact last-message previews

## Why
Mobile users currently see only contact names (and unread indicators) in the contacts list and cannot quickly scan what was last said in each conversation. Showing a single-line, truncated last-message preview under each contact name on mobile improves scannability and aligns the contacts sidebar with common messaging UI patterns.

## What Changes
- Add a messaging requirement for the mobile contacts list to display a single-line preview of the most recent message under each contact name on small-screen layouts only.
- Update the contacts data model and refresh logic to include the most recent message content per contact for use as a preview.
- Update the contacts UI to render a truncated, theme-consistent last-message line under the contact name on mobile layouts, while keeping desktop layouts unchanged.

## Impact
- Affected specs: `messaging`
- Affected code (planned):
  - `src/lib/components/ContactList.svelte`
  - `src/lib/stores/contacts.ts`
  - `src/lib/db/MessageRepository.ts` (read-path usage only)
  - Related tests for contacts list and messaging UI
