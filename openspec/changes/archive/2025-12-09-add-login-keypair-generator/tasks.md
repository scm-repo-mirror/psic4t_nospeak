## 1. Specification
- [x] 1.1 Align with existing messaging and visual-design specs for unauthenticated login UI
- [x] 1.2 Define `messaging` spec delta for login keypair generator behavior

## 2. Implementation
- [x] 2.1 Add an `AuthService` helper to generate an `npub`/`nsec` keypair client-side using `nostr-tools`
- [x] 2.2 Implement `KeypairLoginModal` Svelte component that displays the generated keypair, supports regeneration, and exposes a callback when the user chooses to login with the current `nsec`
- [x] 2.3 Add a "Generate new keypair" link below the local `nsec` login button on the root login screen and wire it to open/close the new modal
- [x] 2.4 Wire the modal "Use this keypair and login" action to call the existing local login flow so that the generated `nsec` is persisted the same way as manual nsec entry

## 3. Testing & Validation
- [x] 3.1 Extend `AuthService` unit tests to cover the new keypair-generation helper behavior
- [x] 3.2 Add or update UI tests (if present) to verify the login page renders the new link and that the modal opens and closes as expected (no dedicated login-route UI tests existed; confirmed existing layout tests remain valid)
- [x] 3.3 Run `npm run check` to ensure type safety and Svelte checks pass
- [x] 3.4 Run `npx vitest run` (or targeted suites) to ensure tests pass
- [x] 3.5 Run `openspec validate add-login-keypair-generator --strict` and address any remaining spec issues
