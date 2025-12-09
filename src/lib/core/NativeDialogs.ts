import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { Share } from '@capacitor/share';

export interface AlertOptions {
    title?: string;
    message: string;
}

export interface ConfirmOptions {
    title?: string;
    message: string;
    okButtonTitle?: string;
    cancelButtonTitle?: string;
}

export interface ShareOptions {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
}

export interface NativeDialogService {
    isAndroidNative(): boolean;
    alert(options: AlertOptions): Promise<void>;
    confirm(options: ConfirmOptions): Promise<boolean>;
    share(options: ShareOptions): Promise<void>;
}

export function isAndroidNative(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
         return Capacitor.getPlatform() === 'android';
     } catch {
         return false;
     }
 }

export const nativeDialogService: NativeDialogService = {
    isAndroidNative,
    async alert(options: AlertOptions): Promise<void> {
        if (isAndroidNative()) {
            try {
                await Dialog.alert({
                    title: options.title,
                    message: options.message
                });
                return;
            } catch {
                // Fallback to web alert below
            }
        }

        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
            window.alert(options.message);
        }
    },
    async confirm(options: ConfirmOptions): Promise<boolean> {
        if (isAndroidNative()) {
            try {
                const result = await Dialog.confirm({
                    title: options.title,
                    message: options.message,
                    okButtonTitle: options.okButtonTitle,
                    cancelButtonTitle: options.cancelButtonTitle
                });

                return result.value;
            } catch {
                // Fallback to web confirm below
            }
        }

        if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
            return window.confirm(options.message);
        }

        return false;
    },
    async share(options: ShareOptions): Promise<void> {
        if (isAndroidNative()) {
            try {
                await Share.share({
                    title: options.title,
                    text: options.text,
                    url: options.url,
                    dialogTitle: options.dialogTitle
                });
                return;
            } catch {
                // Fallback to web share below
            }
        }

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
                await navigator.share({
                    title: options.title,
                    text: options.text,
                    url: options.url
                });
            } catch {
                // Ignore share cancellation or errors on web
            }
        }
    }
};
