# Tasks: Add Contact Context Menu

## 1. Create Reusable Components
- [x] 1.1 Create `ConfirmDialog.svelte` component with glassmorphism styling
  - Props: isOpen, title, message, confirmText, cancelText, confirmVariant, onConfirm, onCancel
  - Support `danger` variant for destructive actions (red confirm button)
- [x] 1.2 Create `ContactContextMenu.svelte` component
  - Reuse portal and reposition actions from existing ContextMenu pattern
  - Props: x, y, isOpen, onClose, onDelete
  - Close on outside pointerdown (same as message context menu)

## 2. Update ManageContactsModal
- [x] 2.1 Add state variables for context menu and confirm dialog
  - contextMenuOpen, contextMenuX, contextMenuY, selectedContact
  - confirmDeleteOpen
- [x] 2.2 Add long-press handlers for mobile (touchstart/touchend/touchcancel, mousedown/mouseup)
  - 500ms threshold to trigger context menu
  - Cancel timer on touch move or early release
- [x] 2.3 Add 3-dot menu button for desktop
  - Hidden by default, visible on row hover
  - Position context menu near button on click
- [x] 2.4 Remove the existing delete Button from contact rows
- [x] 2.5 Wire up delete flow: context menu delete -> confirm dialog -> actual deletion
- [x] 2.6 Import and render ContactContextMenu and ConfirmDialog components

## 3. Add i18n Translations
- [x] 3.1 Add translations to `en.ts`
  - contextMenu.openMenu, contextMenu.delete
  - confirmDelete.title, confirmDelete.message, confirmDelete.confirm
- [x] 3.2 Add translations to `de.ts`
- [x] 3.3 Add translations to `es.ts`
- [x] 3.4 Add translations to `pt.ts`
- [x] 3.5 Add translations to `fr.ts`
- [x] 3.6 Add translations to `it.ts`

## 4. Validation
- [x] 4.1 Run `npm run check` and fix any TypeScript/Svelte errors
- [x] 4.2 Run `npx vitest run` and ensure all tests pass
- [ ] 4.3 Manual testing: verify long-press on mobile, 3-dot on desktop, confirm dialog flow
