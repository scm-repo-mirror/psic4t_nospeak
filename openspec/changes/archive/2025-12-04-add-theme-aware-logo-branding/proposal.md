# Change: Theme-aware logo and favicon branding

## Why
Users expect the nospeak web app icon, favicon, and in-app logo to reflect the updated white-on-transparent logo and Catppuccin-based theming. Today, the favicons and notification icons are static assets that do not match the new logo color, and the in-app logo coloring is hard-coded via filters instead of clearly following the configured theme mode.

## What Changes
- Update browser favicons, PWA icons, and notification/badge icons to use a Latte Text-tinted version of the new nospeak logo.
- Apply theme-aware colorization to the in-app nospeak logo so that bright/light modes use Catppuccin Latte Lavender while dark modes use Catppuccin Frappe text ("Catppuccin white").
- Centralize logo styling so that color behavior is driven by the existing theme mode and Catppuccin palette rather than ad-hoc inline filters.

## Impact
- Affects the **settings** capability by extending how theme mode influences visible branding and appearance.
- Affects the **messaging** capability by updating the chat header logo and notification icons to align with theme and branding.
- Does not change authentication, messaging protocol behavior, or data storage; the change is limited to visual presentation and static assets.

## Open Questions
- None identified; the user explicitly specified Latte Lavender for bright mode and Frappe text for dark mode.
