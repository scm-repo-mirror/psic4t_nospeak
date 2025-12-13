## 1. Localization Infrastructure
- [x] 1.1 Add a lightweight i18n dependency suitable for SvelteKit (for example, `svelte-i18n`).
- [x] 1.2 Create a core i18n module that configures supported locales (English, German) and exposes translation helpers.
- [x] 1.3 Implement a per-device language preference store backed by `localStorage`, including browser/OS language detection with German auto-preference.
- [x] 1.4 Wire the i18n initialization into the root layout so the effective language is applied on client startup without breaking SSR.

## 2. Settings UI and Behavior
- [x] 2.1 Add a language selector control under Settings → General, alongside the existing appearance and notification settings.
- [x] 2.2 Ensure language changes take effect immediately in visible UI chrome (at least the Settings modal and primary navigation labels).
- [x] 2.3 Persist the selected language per device and restore it on subsequent loads, independent of authentication state.

## 3. Translations and Coverage
- [x] 3.1 Define a translation key structure for common UI texts (e.g., settings titles, category labels, notifications copy).
- [x] 3.2 Provide English and German translations for the covered keys, ensuring that German is complete for the initial scope.
- [x] 3.3 Expand localization incrementally to other high-visibility components (such as login flows and chat chrome) while keeping keys consistent.

## 4. Validation
- [x] 4.1 Add or update unit tests for the language preference store and any critical localization behavior.
- [x] 4.2 Manually verify behavior on web and Android (Capacitor) shells, including German auto-selection for `de-*` environments and persistence across reloads.
- [x] 4.3 Run `npm run check` and `npx vitest run` to confirm type and test health after implementation.
