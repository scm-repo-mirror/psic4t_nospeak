# Change: Add login keypair generator modal

## Why
Users currently must bring an existing `nsec` or external signer (Amber, NIP-07 extension) to log into nospeak. For newcomers exploring Nostr through nospeak, it is helpful to provide an in-app way to generate a standard keypair and immediately start using the app without leaving the login screen or installing other tools.

## What Changes
- Add a small "Generate new keypair" link below the existing local `nsec` login button on the unauthenticated login screen.
- When clicked, open a new glassmorphism-style modal that generates and displays a new Nostr keypair (`npub` and `nsec`) entirely on the client.
- Provide a recycle-style control in the modal to discard the current pair and generate another keypair in place.
- Provide a primary action button in the modal labeled "Use this keypair and login" that logs the user into nospeak using the generated `nsec` and the existing local signer flow.
- Scope the behavior so that the generated keypair is only persisted via the existing login mechanism (local auth) and is not stored anywhere until the user explicitly chooses to log in.
- After login, if the current user has no messaging relays and no username-like metadata, show a blocking setup modal that guides the user through an initial configuration: it explains that messaging relays are required, sets a small default set of read/write relays (nostr.data.haus, nos.lol, relay.damus.io) for them, and requires the user to provide a simple name that is published as part of their profile.

## Impact
- Affected specs: `messaging` (unauthenticated/login experience, available login methods, initial post-login setup for empty profiles), `visual-design` (login and setup modal visual treatment and placement).
- Affected code: root login page UI (`src/routes/+page.svelte`), authentication service (`src/lib/core/AuthService.ts`), login-related modal components (`src/lib/components/KeypairLoginModal.svelte`, `src/lib/components/EmptyProfileModal.svelte`), relay settings service (`src/lib/core/RelaySettingsService.ts`), and profile service (`src/lib/core/ProfileService.ts`).
- User impact: New users can create and immediately use a fresh Nostr keypair from the login screen, and if their account is otherwise empty, they are proactively guided through setting up default relays and a basic username so that messaging works reliably.
