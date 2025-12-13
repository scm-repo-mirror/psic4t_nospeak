import { init, register, locale, getLocaleFromNavigator, t } from 'svelte-i18n';

export type Language = 'en' | 'de';

const SUPPORTED_LOCALES: Language[] = ['en', 'de'];
const DEFAULT_LOCALE: Language = 'en';

register('en', () => import('./locales/en.ts'));
register('de', () => import('./locales/de.ts'));

export function initI18n(initial: Language = DEFAULT_LOCALE): void {
    init({
        fallbackLocale: DEFAULT_LOCALE,
        initialLocale: initial
    });
}

export function setLocaleSafe(lang: Language): void {
    if (!SUPPORTED_LOCALES.includes(lang)) {
        return;
    }

    locale.set(lang);
}

export function detectNavigatorLocale(): Language {
    const nav = getLocaleFromNavigator() ?? DEFAULT_LOCALE;
    const lower = nav.toLowerCase();

    if (lower.startsWith('de')) {
        return 'de';
    }

    return 'en';
}

export { t };
