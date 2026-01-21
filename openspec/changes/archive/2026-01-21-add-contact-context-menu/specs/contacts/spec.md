## ADDED Requirements

### Requirement: Android Contacts Route
On the Android native app, contacts management SHALL be accessible via a dedicated `/contacts` route instead of a modal overlay. When the user navigates to `/contacts` on Android, the system SHALL display a full-screen contacts view with the same functionality as the Manage Contacts modal. On desktop and mobile web, navigating to `/contacts` SHALL redirect to `/chat` and open the Manage Contacts modal instead.

#### Scenario: Android app shows dedicated contacts route
- **GIVEN** the user is using the Android native app
- **WHEN** the user navigates to `/contacts`
- **THEN** the system SHALL display a full-screen contacts view
- **AND** the view SHALL include a header with back button and title "Contacts"
- **AND** the view SHALL include a search/add input field
- **AND** the view SHALL display the list of contacts with pull-to-refresh support

#### Scenario: Desktop redirects contacts route to modal
- **GIVEN** the user is using a desktop browser
- **WHEN** the user navigates to `/contacts`
- **THEN** the system SHALL redirect to `/chat`
- **AND** the Manage Contacts modal SHALL open automatically

#### Scenario: Android contacts route supports long-press context menu
- **GIVEN** the user is viewing the `/contacts` route on Android
- **WHEN** the user presses and holds on a contact row for at least 500ms
- **THEN** the context menu SHALL appear at the press location
- **AND** the menu SHALL display a "Delete" option

### Requirement: Contact Context Menu Interaction
The Manage Contacts modal and Android `/contacts` route SHALL provide a context menu for each contact row that allows users to perform actions such as deleting the contact. On mobile/PWA and Android, the context menu SHALL open via a long-press gesture (500ms threshold). On desktop (within the modal), the context menu SHALL also open via a 3-dot menu button that appears on hover in the lower-right area of the contact row. The menu SHALL appear at the location of the long-press or near the 3-dot button.

#### Scenario: Long-press opens context menu on mobile
- **GIVEN** the user is viewing the Manage Contacts modal on a mobile device or PWA
- **AND** the viewport width is less than 768px
- **WHEN** the user presses and holds on a contact row for at least 500ms
- **THEN** the context menu SHALL appear at the press location
- **AND** the menu SHALL display a "Delete" option
- **AND** the context menu SHALL close if the user taps outside of it

#### Scenario: Long-press opens context menu on Android contacts route
- **GIVEN** the user is viewing the `/contacts` route on Android native app
- **WHEN** the user presses and holds on a contact row for at least 500ms
- **THEN** the context menu SHALL appear at the press location
- **AND** the menu SHALL display a "Delete" option
- **AND** the context menu SHALL close if the user taps outside of it

#### Scenario: 3-dot button opens context menu on desktop
- **GIVEN** the user is viewing the Manage Contacts modal on a desktop device
- **AND** the viewport width is 768px or greater
- **WHEN** the user hovers over a contact row
- **THEN** a 3-dot menu button SHALL appear in the lower-right area of the row
- **AND** clicking the 3-dot button SHALL open the context menu near the button
- **AND** the context menu SHALL display a "Delete" option

#### Scenario: Context menu closes on outside click
- **GIVEN** the contact context menu is open
- **WHEN** the user clicks or taps outside the context menu
- **THEN** the context menu SHALL close immediately
- **AND** no action SHALL be performed

#### Scenario: Long-press cancelled by touch move
- **GIVEN** the user begins a long-press on a contact row on mobile or Android
- **WHEN** the user moves their finger more than 10 pixels before 500ms elapses
- **THEN** the long-press SHALL be cancelled
- **AND** the context menu SHALL NOT open

### Requirement: Contact Delete Confirmation Dialog
When the user selects "Delete" from the contact context menu, the system SHALL display a confirmation dialog asking "Are you sure you want to delete {contact name}?" with Cancel and Delete buttons. The contact SHALL only be removed if the user explicitly confirms the deletion.

#### Scenario: Delete option shows confirmation dialog
- **GIVEN** the contact context menu is open for a contact named "Alice"
- **WHEN** the user clicks/taps the "Delete" option
- **THEN** the context menu SHALL close
- **AND** a confirmation dialog SHALL appear with title "Delete Contact"
- **AND** the message SHALL read "Are you sure you want to delete Alice?"
- **AND** the dialog SHALL display Cancel and Delete buttons

#### Scenario: User confirms contact deletion
- **GIVEN** the delete confirmation dialog is open for contact "Alice"
- **WHEN** the user clicks/taps the "Delete" button
- **THEN** the contact SHALL be removed from local storage
- **AND** an updated Kind 30000 event SHALL be published to sync the removal
- **AND** the confirmation dialog SHALL close

#### Scenario: User cancels contact deletion
- **GIVEN** the delete confirmation dialog is open
- **WHEN** the user clicks/taps the "Cancel" button or clicks outside the dialog
- **THEN** the confirmation dialog SHALL close
- **AND** the contact SHALL NOT be removed

### Requirement: Reusable Confirm Dialog Component
The application SHALL provide a reusable ConfirmDialog component for confirmation prompts throughout the app. The component SHALL support customizable title, message, button labels, and a danger variant for destructive actions. The dialog SHALL follow the glassmorphism visual design system.

#### Scenario: ConfirmDialog renders with custom props
- **GIVEN** a ConfirmDialog is rendered with title="Delete Item", message="Are you sure?", confirmText="Delete", cancelText="Cancel", confirmVariant="danger"
- **WHEN** the dialog is displayed
- **THEN** the dialog SHALL show the custom title and message
- **AND** the confirm button SHALL use danger styling (red)
- **AND** the cancel button SHALL use secondary styling

#### Scenario: ConfirmDialog follows glassmorphism styling
- **GIVEN** a ConfirmDialog is displayed
- **WHEN** rendered in light or dark theme
- **THEN** the dialog SHALL use semi-transparent glass backgrounds with blur
- **AND** the dialog SHALL have rounded corners consistent with other modals
- **AND** text colors SHALL respect the active Catppuccin theme

## MODIFIED Requirements

### Requirement: Manage Contacts Modal Navigation
The Manage Contacts modal SHALL allow users to navigate directly to a chat with a contact by clicking on that contact's row. Clicking a contact SHALL close the modal and navigate to the chat view for that contact. The modal SHALL NOT display a direct delete button on each contact row; instead, contact deletion SHALL be accessible via the contact context menu.

#### Scenario: Contact click opens chat
- **GIVEN** the user has opened the Manage Contacts modal
- **AND** the modal displays a list of existing contacts
- **WHEN** the user clicks on a contact row (not on the 3-dot menu button)
- **THEN** the modal SHALL close
- **AND** the system SHALL navigate to the chat view for that contact at `/chat/<npub>`
- **AND** if no prior conversation exists, an empty chat SHALL be displayed

#### Scenario: Delete button not shown on contact rows
- **GIVEN** the user has opened the Manage Contacts modal
- **WHEN** the contact list is rendered
- **THEN** there SHALL NOT be a visible delete button (trash icon) directly on each contact row
- **AND** the delete action SHALL only be accessible via the context menu
