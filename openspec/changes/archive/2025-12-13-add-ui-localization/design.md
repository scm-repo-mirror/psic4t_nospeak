## Context
The current nospeak web client renders all UI chrome in English with literal strings embedded in Svelte components. There is no dedicated localization layer, and the Settings spec currently covers appearance, notifications, URL previews, and Android-specific options, but not language.

The goal of this change is to introduce a minimal, scalable localization mechanism that starts with German in addition to English. The behavior must remain per-device, work consistently for both the web client and the Android Capacitor shell, and avoid changing how user-generated content is stored or rendered.

## Goals / Non-Goals
- Goals:
  - Provide a structured way to localize static UI text across the Svelte app.
  - Support English and German as selectable languages, with German preferred when the environment language is `de-*`.
  - Store language preference per device using local storage, independent of user account or relay data.
  - Surface language choice in Settings → General and make changes visible immediately.
- Non-Goals:
  - Server-side or account-level language preferences synced via relays or profiles.
  - Translating user-generated content (messages, names, NIP-05 values, URLs).
  - Introducing complex pluralization or formatting rules beyond what the chosen i18n library already provides.

## Decisions
- Use a small, Svelte-friendly i18n library (such as `svelte-i18n`) instead of a custom implementation, to handle locale management and translation lookup.
- Represent translation resources as structured locale files (e.g., `en`, `de`) keyed by logical domains such as `settings` and `common`.
- Keep localization state per-device via `localStorage` (for example, under a key like `nospeak-language`), not tied to the authenticated user.
- Detect a sensible default locale on the client by inspecting the browser/OS language, preferring German when `de-*` is reported and otherwise defaulting to English.
- Integrate locale initialization into the existing root layout mount sequence so that initial SSR remains stable while the client applies the preferred language after hydration.

## Alternatives Considered
- **Custom i18n store only:** Implementing a bespoke translation store with manual message lookup and locale switching. This was rejected for now because it would require recreating features (lazy loading, message formatting) that `svelte-i18n` already provides, with little benefit.
- **Account-level language preference:** Persisting language on the user profile or via Nostr events. This was rejected because the current requirement is explicitly per-device, and adding cross-device state introduces additional UX and data-model questions.
- **New standalone `localization` spec:** Defining a separate capability for localization. For the initial scope, we instead attach requirements to the existing `settings` spec, since the primary user-facing touchpoint for language selection is the Settings UI.

## Risks / Trade-offs
- **Partial translation coverage:** If only parts of the UI are localized at first, some English strings may remain. The tasks explicitly call for focusing on high-visibility surfaces and a consistent key structure so coverage can expand safely over time.
- **Hydration flash in non-English locales:** Because SSR will likely render English, there may be a brief period where the UI shows English before the client applies German. This is acceptable for the initial implementation and can be refined later (for example, by deriving the locale earlier via routing or headers).
- **Locale drift across devices:** Because the language preference is per-device, users may see different languages on different devices. This matches the requirement but should be documented in user-facing help if needed.

## Migration Plan
- Introduce the localization layer and Settings language control in a backwards-compatible way that defaults to English when no preference is stored.
- Roll out German translations for the agreed initial scope (Settings and primary chrome), leaving other strings in English until additional keys are localized.
- Once stable, incrementally add more translation keys and locales without changing the underlying storage or selection behavior.

## Open Questions
- Should the HTML document `lang` attribute be updated dynamically based on the selected language for accessibility and SEO, or is it acceptable to leave this as `en` in the first iteration?
- Are there any future target locales we should anticipate (for example, additional European languages) when designing the translation key structure?
