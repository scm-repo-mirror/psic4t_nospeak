## ADDED Requirements
### Requirement: Semantic Typography Scale for Primary Surfaces
The messaging UI SHALL use a small, semantic typography scale instead of ad-hoc font sizes for common text elements across primary surfaces. The scale SHALL define at least the following semantic styles: Title (primary headings such as modal and panel titles), Section (secondary headings such as section titles within a view), Body (standard paragraph content), and Meta (small, secondary information such as timestamps, chips, and helper labels). Implementations MAY express these styles using Tailwind utility composition or an equivalent mechanism, but the semantics and visual hierarchy SHALL remain consistent across chat, settings, and relay-management views.

#### Scenario: Chat timestamps and message metadata share Meta style
- **GIVEN** the user is viewing any chat conversation
- **AND** the interface renders per-message timestamps, date separators, or a short summary of relay delivery status (for example, "sent to X/Y relays")
- **WHEN** these message metadata elements are displayed under or between message bubbles
- **THEN** they SHALL use the shared Meta typography style (small size, reduced emphasis relative to Body text, and consistent letter-spacing)
- **AND** the chosen Meta style SHALL remain readable on both Catppuccin Latte and Frappe themes.

#### Scenario: Relay Connections modal labels and status chips use Section and Meta styles
- **GIVEN** the user opens the Relay Connections modal from the messaging UI
- **WHEN** the modal displays its primary title, per-relay URL row, and status indicators (for example, Connected / Disconnected chips and small numeric stats)
- **THEN** the modal title SHALL use the shared Title typography style
- **AND** field labels and small statistics (such as "Type", "Last Connected", counts, and status chips) SHALL use the shared Meta typography style
- **AND** any descriptive copy within the modal SHALL use the shared Body typography style when present.

#### Scenario: Modal titles and explanatory copy use Title, Section, and Body styles
- **GIVEN** the user sees blocking or prominent modals in the messaging experience (including first-time sync progress, empty profile setup, login with Amber, Manage Contacts, and Settings)
- **WHEN** each modal renders its main heading, internal section titles, and explanatory paragraphs
- **THEN** the main modal heading SHALL use the shared Title typography style
- **AND** any internal section headings (for example, category headers inside Settings) SHALL use the shared Section typography style
- **AND** explanatory paragraphs and helper text SHALL use the shared Body typography style, with only truly small, secondary labels (such as field labels or short hints) using the Meta style.
