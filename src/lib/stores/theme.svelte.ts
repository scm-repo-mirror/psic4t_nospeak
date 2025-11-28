import { getStoredTheme, setTheme as baseSetTheme, applyTheme } from './theme';
import type { Theme } from './theme';

let currentTheme = $state<Theme>(getStoredTheme());

export function getCurrentTheme(): Theme {
	return currentTheme;
}

export function setTheme(theme: Theme) {
	currentTheme = theme;
	baseSetTheme(theme);
}

// Apply theme on initialization
if (typeof window !== 'undefined') {
	applyTheme(getCurrentTheme());
}