import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AndroidTapSoundPlugin {
    tap(): Promise<void>;
}

export const AndroidTapSound = Capacitor.getPlatform() === 'android'
    ? registerPlugin<AndroidTapSoundPlugin>('AndroidTapSound')
    : (null as unknown as AndroidTapSoundPlugin);
