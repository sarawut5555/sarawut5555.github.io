import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		show(message: string, type: ToastType = 'info') {
			const id = crypto.randomUUID();
			update((t) => [...t, { id, message, type }]);
			setTimeout(() => {
				update((t) => t.filter((x) => x.id !== id));
			}, 3500);
		},
		dismiss(id: string) {
			update((t) => t.filter((x) => x.id !== id));
		}
	};
}

export const toasts = createToastStore();
