export type { RuntimeConfig } from './types';
export { DEFAULT_RUNTIME_CONFIG } from './defaults';
export {
    getBlasterRelayUrl,
    getDefaultBlossomServers,
    getDefaultMessagingRelays,
    getDiscoveryRelays,
    getRuntimeConfigSnapshot,
    getSearchRelayUrl,
    getWebAppBaseUrl,
    initRuntimeConfig,
    runtimeConfig
} from './store';
