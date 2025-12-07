import { describe, it, expect, vi, beforeEach } from 'vitest';

const isAndroidNativeMock = vi.fn();
const scheduleMock = vi.fn().mockResolvedValue(undefined);
const createChannelMock = vi.fn().mockResolvedValue(undefined);
const checkPermissionsMock = vi.fn().mockResolvedValue({ display: 'granted' });
const requestPermissionsMock = vi.fn().mockResolvedValue({ display: 'granted' });
const addListenerMock = vi.fn().mockResolvedValue({ remove: vi.fn() });
const getProfileIgnoreTTLMock = vi.fn();

vi.mock('./NativeDialogs', () => ({
    isAndroidNative: isAndroidNativeMock
}));

vi.mock('@capacitor/local-notifications', () => ({
    LocalNotifications: {
        schedule: scheduleMock,
        createChannel: createChannelMock,
        checkPermissions: checkPermissionsMock,
        requestPermissions: requestPermissionsMock,
        addListener: addListenerMock
    }
}));

vi.mock('$lib/db/ProfileRepository', () => ({
    profileRepo: {
        getProfileIgnoreTTL: getProfileIgnoreTTLMock
    }
}));

describe('NotificationService (Android local notifications)', () => {
    beforeEach(() => {
        vi.resetModules();
        scheduleMock.mockClear();
        createChannelMock.mockClear();
        checkPermissionsMock.mockClear();
        requestPermissionsMock.mockClear();
        addListenerMock.mockClear();
        getProfileIgnoreTTLMock.mockClear();
        isAndroidNativeMock.mockReset();

        if (typeof window !== 'undefined') {
            (window as any).localStorage = {
                store: {} as Record<string, string>,
                getItem(key: string) {
                    return (this.store as Record<string, string>)[key] ?? null;
                },
                setItem(key: string, value: string) {
                    (this.store as Record<string, string>)[key] = value;
                },
                removeItem(key: string) {
                    delete (this.store as Record<string, string>)[key];
                }
            };
        }
    });

    it('schedules an Android local notification when enabled and permission granted', async () => {
        isAndroidNativeMock.mockReturnValue(true);
        getProfileIgnoreTTLMock.mockResolvedValue({ metadata: { name: 'Alice' } });

        if (typeof document !== 'undefined') {
            Object.defineProperty(document, 'visibilityState', {
                value: 'hidden',
                configurable: true
            });
        }

        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('nospeak-settings', JSON.stringify({ notificationsEnabled: true }));
        }

        const { notificationService } = await import('./NotificationService');

        await notificationService.showNewMessageNotification('npub1alice', 'Hello from Alice');

        expect(createChannelMock).toHaveBeenCalledTimes(1);
        expect(scheduleMock).toHaveBeenCalledTimes(1);
        const args = scheduleMock.mock.calls[0][0];
        expect(args.notifications[0].title).toContain('Alice');
        expect(args.notifications[0].channelId).toBe('messages');
    });

    it('does not schedule when notifications are disabled in settings', async () => {
        isAndroidNativeMock.mockReturnValue(true);
        getProfileIgnoreTTLMock.mockResolvedValue({ metadata: { name: 'Bob' } });

        // Explicitly store disabled state
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('nospeak-settings', JSON.stringify({ notificationsEnabled: false }));
        }

        const { notificationService } = await import('./NotificationService');

        await notificationService.showNewMessageNotification('npub1bob', 'Hi');

        expect(scheduleMock).not.toHaveBeenCalled();
    });

    it('does not schedule when Android permission is denied', async () => {
        isAndroidNativeMock.mockReturnValue(true);
        getProfileIgnoreTTLMock.mockResolvedValue({ metadata: { name: 'Carol' } });

        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('nospeak-settings', JSON.stringify({ notificationsEnabled: true }));
        }

        checkPermissionsMock.mockResolvedValueOnce({ display: 'denied' });

        const { notificationService } = await import('./NotificationService');

        await notificationService.showNewMessageNotification('npub1carol', 'Hi');

        expect(scheduleMock).not.toHaveBeenCalled();
    });
});
