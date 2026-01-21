# Change: Add Contact Context Menu with Delete Confirmation

## Why
The current contact delete experience is suboptimal: a direct delete button next to each contact allows accidental deletions with no confirmation. This change replaces the delete button with a context menu pattern (consistent with the existing message context menu) and adds a confirmation dialog to prevent accidental contact deletion.

## What Changes
- Remove the direct delete button from contact rows in ManageContactsModal
- Add a context menu for contacts with:
  - Long-press trigger on mobile/PWA (500ms threshold)
  - 3-dot menu button on desktop (visible on hover)
- Add a reusable ConfirmDialog component for delete confirmation
- Show confirmation modal: "Are you sure you want to delete {contact name}?"
- Add i18n translations for context menu and confirmation dialog text

## Impact
- Affected specs: `contacts`
- Affected components:
  - `ManageContactsModal.svelte` (modify contact row, add context menu integration)
  - New: `ContactContextMenu.svelte` (portal-based context menu)
  - New: `ConfirmDialog.svelte` (reusable confirmation modal)
- Affected i18n: All 6 locale files (en, de, es, pt, fr, it)
