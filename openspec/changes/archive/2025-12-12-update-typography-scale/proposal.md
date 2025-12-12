# Change: Standardize typography scale across primary messaging UI

## Why
The current messaging UI uses a mix of ad-hoc font sizes and weights for titles, section headings, timestamps, relay labels, and small explanatory text. This makes the interface feel slightly inconsistent and raises the cost of future UI work. A small, semantic typography scale will keep the glassmorphism visual language cohesive and easier to maintain.

## What Changes
- Introduce a semantic typography scale with 3–4 shared text styles (Title, Section, Body, Meta) in the visual-design spec.
- Define how these text styles apply to chat message metadata (timestamps, date separators, relay delivery summaries).
- Define how these text styles apply to relay management UI (Relay Connections modal labels and status chips).
- Define how these text styles apply to modal titles and small explanatory copy (sync progress, empty profile setup, login, and settings).

## Impact
- Affects specs: `visual-design` (new typography scale requirement referencing messaging, relay-management, and settings surfaces).
- Affects code: Svelte components that render chat message lists, Relay Connections modal, settings, login, and first-time setup modals.
- No behavioral changes to messaging, relays, or settings; this is a visual/typographic refinement to make future UI work more consistent.