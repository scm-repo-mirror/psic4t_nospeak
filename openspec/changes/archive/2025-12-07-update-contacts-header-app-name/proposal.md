# Change: Update contacts header to show app name on mobile

## Why
Users on mobile (native Android and PWA) currently see only their profile avatar in the contacts sidebar header, which can make the app brand and context less obvious, especially when the PWA is installed or opened from shortcuts. Adding the nospeak app name next to the avatar in mobile layouts will improve recognition without impacting the desktop layout.

## What Changes
- Add a textual "nospeak" app name label next to the current user avatar in the contacts sidebar header when viewed on mobile-sized layouts.
- Ensure the label appears for both native Android and mobile/PWA usage while remaining hidden on standard desktop layouts.
- Keep the change visually consistent with the existing glassmorphism, typography, and responsive layout patterns.

## Impact
- Affected specs: `messaging`, `visual-design`.
- Affected code (planned): `src/lib/components/ContactList.svelte` (contacts sidebar header), and any helper used for platform or viewport detection as needed.
