# Change: Update mobile and Android settings layout

## Why
The current Settings experience reuses a desktop-style sidebar with a persistent "active" highlight on mobile web and inside the Android app. On small screens this feels like a tabbed panel rather than a simple list of sections, and it does not match the desired interaction pattern: a tappable list of sections on mobile PWA and a bottom sheet presentation on Android.

## What Changes
- Introduce a card-based navigation layout for Settings categories on mobile PWA and inside the Android app, using monochrome SVG icons and the existing glassmorphism visual language.
- Present Settings as a full-screen, route-like overlay on mobile web (PWA) with a card list of categories that navigates into per-category detail views.
- Present Settings as a bottom sheet on Android, anchored to the bottom of the screen above the chat UI, reusing the same card-based navigation and detail views.
- Keep the existing desktop Settings layout (two-column glass dialog with sidebar categories) functionally intact while clarifying its relationship to the new mobile layouts in the specification.

## Impact
- **Affected specs**: `settings`, `visual-design`.
- **Affected code (indicative)**:
  - `src/lib/components/SettingsModal.svelte` (layout modes and navigation behavior).
  - `src/routes/+layout.svelte` (modal container behavior and Android/mobile presentation details).
  - Tailwind / CSS utilities referenced by the visual design spec for cards, icons, and bottom sheet surfaces.

## Out of Scope
- Changing which settings options exist or how they behave semantically (notification toggles, background messaging, language, messaging relays, etc.).
- Introducing additional settings categories beyond those already defined (General, Profile, Messaging Relays, Security, About).
- Non-Android native shell changes (iOS, desktop wrappers) or changes to messaging behavior itself.
