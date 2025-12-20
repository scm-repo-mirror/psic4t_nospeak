import { Capacitor, registerPlugin } from '@capacitor/core';

export type AndroidNotificationRouteKind = 'chat';

export interface AndroidNotificationRoutePayload {
    kind: AndroidNotificationRouteKind;
    partnerPubkeyHex: string;
}

export interface AndroidNotificationRouterPlugin {
    getInitialRoute(): Promise<AndroidNotificationRoutePayload | null>;
    addListener(
        eventName: 'routeReceived',
        listener: (payload: AndroidNotificationRoutePayload) => void
    ): Promise<{ remove: () => void }>;
}

export const AndroidNotificationRouter = Capacitor.getPlatform() === 'android'
    ? registerPlugin<AndroidNotificationRouterPlugin>('AndroidNotificationRouter')
    : (null as unknown as AndroidNotificationRouterPlugin);
