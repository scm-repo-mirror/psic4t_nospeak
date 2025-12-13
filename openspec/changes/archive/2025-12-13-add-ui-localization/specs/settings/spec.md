## ADDED Requirements
### Requirement: Language Selection in Settings
The Settings interface SHALL provide a language selection control under Settings → General that determines the language used for static UI text (including labels, headings, helper text, and button copy) across the nospeak web client. The language preference SHALL be stored per device, independent of the authenticated account, and SHALL default to English when no preference can be inferred.

#### Scenario: Default language follows environment with German preference
- **GIVEN** a user opens nospeak on a device where no `nospeak` language preference has been stored
- **AND** the browser or operating system language is reported as a `de-*` locale (for example, `de-DE` or `de-AT`)
- **WHEN** the Settings → General view is rendered
- **THEN** the language selector SHALL show German as the current value
- **AND** static UI text covered by localization (including the Settings labels and descriptions) SHALL be rendered in German
- **AND** the effective language preference SHALL be stored on that device for future sessions.

#### Scenario: Default language falls back to English
- **GIVEN** a user opens nospeak on a device where no `nospeak` language preference has been stored
- **AND** the browser or operating system language is not a `de-*` locale
- **WHEN** the Settings → General view is rendered
- **THEN** the language selector SHALL show English as the current value
- **AND** static UI text covered by localization SHALL be rendered in English
- **AND** the effective language preference SHALL be stored on that device for future sessions.

#### Scenario: User changes language from English to German
- **GIVEN** nospeak is currently displaying static UI text in English
- **AND** the user has opened Settings → General
- **WHEN** the user changes the language selector from English to German
- **THEN** the Settings modal and other covered UI chrome SHALL update to German without requiring a full page reload
- **AND** the new language preference SHALL be stored so that subsequent visits on that device continue to use German.

#### Scenario: User changes language from German to English
- **GIVEN** nospeak is currently displaying static UI text in German
- **AND** the user has opened Settings → General
- **WHEN** the user changes the language selector from German to English
- **THEN** the Settings modal and other covered UI chrome SHALL update to English without requiring a full page reload
- **AND** the new language preference SHALL be stored so that subsequent visits on that device continue to use English.

#### Scenario: Language preference is per-device
- **GIVEN** a user has selected German as the language on one device
- **AND** the same user signs in to nospeak on a different device where no language preference has been stored
- **WHEN** the Settings → General view is rendered on the second device
- **THEN** the language selector and UI texts on the second device SHALL follow the default language selection logic for that environment (including German auto-selection for `de-*` locales)
- **AND** the language preference on the first device SHALL remain unchanged.
