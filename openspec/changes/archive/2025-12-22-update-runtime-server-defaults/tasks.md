## 1. Implementation
- [x] 1.1 Define a single runtime config interface for default relays/servers
- [x] 1.2 Implement server-side env parsing with strict scheme validation (`wss://`, `https://`)
- [x] 1.3 Add same-origin `GET /api/runtime-config` returning full config
- [x] 1.4 Add client runtime-config store + `initRuntimeConfig()` bootstrap
- [x] 1.5 Refactor relay discovery defaults to runtime config
- [x] 1.6 Refactor empty-profile default relays to runtime config
- [x] 1.7 Refactor NIP-50 search relay to runtime config
- [x] 1.8 Refactor blaster relay usage to runtime config
- [x] 1.9 Refactor default Blossom server list to runtime config
- [x] 1.10 Refactor Android URL preview base URL to runtime config
- [x] 1.11 Refactor Robohash base URL to runtime config
- [x] 1.12 Update README with Docker Compose runtime env example

## 2. Tests
- [x] 2.1 Add unit tests for env parsing and validation
- [x] 2.2 Update existing tests that assume hardcoded URLs (URL preview, etc.)

## 3. Validation
- [x] 3.1 Run `npm run check`
- [x] 3.2 Run `npx vitest run`
