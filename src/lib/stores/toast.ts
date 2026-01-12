import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

const { subscribe, update } = writable<Toast[]>([]);

export const toasts = { subscribe };

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000): void {
    const id = crypto.randomUUID();
    update(t => [...t, { id, message, type, duration }]);
    setTimeout(() => dismissToast(id), duration);
}

export function dismissToast(id: string): void {
    update(t => t.filter(toast => toast.id !== id));
}
