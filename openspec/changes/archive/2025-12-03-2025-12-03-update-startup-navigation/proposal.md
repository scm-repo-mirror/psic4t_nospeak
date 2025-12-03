# Change: Update Startup Navigation

## Why
Current application behavior forces all users to jump to the most recent conversation on startup. While convenient for desktop users, this is disruptive for mobile users who expect to see their contact list first due to limited screen space. Additionally, reloading the page should respect the user's current location rather than forcing a redirect logic.

## What Changes
- **Startup Behavior**: 
    - **Desktop**: Continues to redirect to the most recent conversation if visiting the root chat path.
    - **Mobile**: stays on the contact list view when visiting the root chat path.
- **Reload Behavior**: Ensures that reloading a specific chat URL (e.g., `/chat/npub...`) stays on that URL for all devices.

## Impact
- **Affected Specs**: `messaging`
- **Affected Code**: Navigation logic in `src/routes/chat/+layout.svelte` or `+page.svelte`.
