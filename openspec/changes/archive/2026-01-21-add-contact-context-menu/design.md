# Design: Contact Context Menu

## Context
The message context menu in ChatView provides a pattern for contextual actions via long-press on mobile and a 3-dot menu on desktop. This design extends that pattern to contacts in ManageContactsModal, adding a confirmation step for destructive actions.

## Goals
- Consistent UX: Match the existing message context menu interaction patterns
- Prevent accidental deletion: Require explicit confirmation before deleting contacts
- Extensibility: Design the context menu to accommodate future options (View Profile, Block, Copy npub)
- Reusability: Create a generic ConfirmDialog component usable throughout the app

## Non-Goals
- Adding additional context menu options beyond "Delete" (future scope)
- Native platform dialog integration (uses custom modal for consistent styling)

## Decisions

### Decision: Portal-based context menu positioning
The context menu will use the same `portal` and `reposition` Svelte actions as the existing message ContextMenu. This ensures the menu appears at the interaction point (long-press location or near the 3-dot button) and stays within viewport bounds.

**Alternatives considered:**
- Dropdown anchored to the row: Would require different positioning logic and wouldn't match the mobile long-press UX
- Native context menu API: Inconsistent across platforms and can't be styled

### Decision: Separate ContactContextMenu component
Rather than extending the existing ContextMenu.svelte (which has message-specific actions like Cite, React, Copy), create a new ContactContextMenu.svelte with contact-specific actions.

**Rationale:**
- Keeps components focused on single responsibility
- Avoids conditional logic for different entity types
- Menu items will differ (contacts: Delete, View Profile, Block vs messages: Cite, React, Copy)

### Decision: New lightweight ConfirmDialog component
Create a new ConfirmDialog.svelte rather than using nativeDialogService or adapting AttachmentPreviewModal.

**Rationale:**
- nativeDialogService uses OS dialogs which can't be styled and look inconsistent
- AttachmentPreviewModal is designed for preview scenarios with different layout needs
- A dedicated ConfirmDialog is more reusable and follows the glassmorphism visual language

### Decision: Desktop 3-dot button visible on hover only
The 3-dot menu button will be hidden by default and appear on hover (`opacity-0 group-hover:opacity-100`). This keeps the UI clean while providing discoverability.

**Alternatives considered:**
- Always visible: Clutters the contact list
- Right-click only: Not discoverable, many users don't right-click

## Component Structure

```
ManageContactsModal.svelte
├── Contact row (each contact)
│   ├── Avatar + name (unchanged)
│   ├── 3-dot button (desktop, hover-visible)
│   ├── Long-press handlers (mobile)
│   └── ...
├── ContactContextMenu (portal)
│   └── Delete option
└── ConfirmDialog (portal/modal)
    └── "Are you sure you want to delete {name}?"
```

## State Flow

```
1. User interaction (long-press or 3-dot click)
   → Set selectedContact, contextMenuX/Y, contextMenuOpen=true

2. User clicks "Delete" in context menu
   → contextMenuOpen=false, confirmDeleteOpen=true

3. User confirms deletion
   → Call remove(selectedContact.npub)
   → confirmDeleteOpen=false, selectedContact=null

4. User cancels deletion
   → confirmDeleteOpen=false, selectedContact=null
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Long-press conflicts with scroll | Use 500ms threshold matching existing message context menu; cancel on touch move |
| Context menu outside viewport | Reuse proven `reposition` action with viewport clamping |
| Delete confirmation adds friction | Acceptable trade-off for preventing accidental data loss |

## Open Questions
- None; design follows established patterns from message context menu
