import { writable } from 'svelte/store';
import { get } from 'svelte/store';

let id = 0;

export interface Toast {
	message: string;
	type: 'error' | 'warn' | 'success';
	id: number;
	life?: number;
}

export const toasts = writable<Toast[]>();

export const resetToast = async () => {
	toasts.set([]);
};

export const addToast = async (toast: Omit<Toast, 'id'>) => {
	const currentToasts = get(toasts);
	toasts.set([{ ...toast, id: id++ }, ...currentToasts]);
};

export const removeToast = async (id: Toast['id']) => {
	const currentToasts = get(toasts);

	for (let i = 0; i < currentToasts.length; i++) {
		if (currentToasts[i].id == id) {
			currentToasts.splice(i, 1);
			toasts.set(currentToasts);
			return;
		}
	}
	toasts.set(currentToasts);
};
