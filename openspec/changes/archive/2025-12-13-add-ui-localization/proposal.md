# Change: Add UI Localization with German Support

## Why
Users should be able to use nospeak in their preferred language. Today the UI is English-only, which is a barrier for German-speaking users and does not scale well as we add more locales.

## What Changes
- Add a UI-wide localization mechanism for static text (labels, headings, helper copy) using a minimal, dependency-backed i18n layer.
- Introduce a per-device language preference stored locally (not synced to profile/relays) so each browser or Android install can choose its own language.
- Add a language selector in Settings → General that lets users switch between English and German.
- Automatically prefer German when the browser or OS language is `de-*`, falling back to English when detection fails.
- Keep user-generated content (messages, names, NIP-05 identifiers, URLs) language-agnostic and unmodified.

## Impact
- Affected specs: `settings` (new requirement for language selection and behavior).
- Affected code: root layout initialization, settings modal UI/state, a new i18n configuration layer, and local storage for language preference.
- Non-goals: server-side account-level language settings, translation of message content, or large-scale content localization beyond UI chrome.
