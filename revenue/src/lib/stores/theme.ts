import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getInitialTheme(): boolean {
	if (!browser) return false;
	return (
		localStorage.getItem('theme') === 'dark' ||
		(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);
}

export const darkMode = writable(getInitialTheme());

export function toggleTheme() {
	darkMode.update((v) => {
		const next = !v;
		if (browser) {
			localStorage.setItem('theme', next ? 'dark' : 'light');
			document.documentElement.classList.toggle('dark', next);
		}
		return next;
	});
}

/** Apply theme class and return unsubscribe for onMount cleanup. */
export function initTheme() {
	if (!browser) return () => {};
	const apply = (isDark: boolean) => document.documentElement.classList.toggle('dark', isDark);
	return darkMode.subscribe(apply);
}
