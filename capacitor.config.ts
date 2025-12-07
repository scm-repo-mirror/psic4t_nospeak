import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.nospeak.app',
    appName: 'nospeak',
    webDir: 'build/android',
    bundledWebRuntime: false,
    server: {
        androidScheme: 'https'
    }
};

export default config;
