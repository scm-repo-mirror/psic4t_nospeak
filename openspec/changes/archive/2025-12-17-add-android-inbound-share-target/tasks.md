## 1. Specification and design
- [x] 1.1 Confirm android-app-shell inbound share requirements with maintainers and refine scenarios if needed
- [x] 1.2 Align inbound share flows with existing messaging DM media and text semantics

## 2. Android shell and plugin implementation
- [x] 2.1 Update `android/app/src/main/AndroidManifest.xml` to register nospeak as an `ACTION_SEND` share target for supported media and text/URL MIME types
- [x] 2.2 Implement a dedicated `AndroidShareTarget` Capacitor plugin that reads single-item `ACTION_SEND` intents and exposes a typed payload (media bytes or text) to the web client
- [x] 2.3 Wire `MainActivity` to forward new share intents to the Capacitor bridge and ensure the plugin correctly handles both cold-start and already-running cases
- [x] 2.4 Add defensive handling for unsupported or oversized share payloads so they fail gracefully without crashing the app

## 3. Web client integration
- [x] 3.1 Add a small TypeScript bridge for the `AndroidShareTarget` plugin and Svelte stores to hold pending inbound media and text shares
- [x] 3.2 Update the root layout/bootstrap to consume inbound shares on Android, enforce the login requirement (showing a "Please log in to share" message when unauthenticated), and always navigate to the contact list (`/chat`) rather than directly into a DM
- [x] 3.3 Update the per-contact chat route to consume pending shares after a contact is selected, opening the existing single-file media send preview for media or pre-filling the message input for text/URLs

## 4. Validation and UX polish
- [x] 4.1 Exercise inbound sharing flows on an Android device/emulator for images, video, audio, and text/URLs while logged in and logged out
- [x] 4.2 Verify that sending from the media preview and pre-filled text input uses the existing DM file-message and text message flows (including encryption and upload for media)
- [x] 4.3 Validate behavior when sharing unsupported content types or very large files and ensure the UI remains responsive and consistent
- [x] 4.4 Run `npm run check` and `npx vitest run` from the repository root and fix any new type or test failures
