## Context

The nospeak Android Capacitor shell already integrates several native capabilities (local notifications, background messaging, Amber/NIP-55, native dialogs, and native image sharing from the in-app viewer) via focused Capacitor plugins and lightweight TypeScript bridges. Outbound sharing (from nospeak to other apps) is covered by existing `android-app-shell` requirements, but inbound sharing (choosing nospeak as the target in the Android share sheet) is not yet specified.

The user request is to:
- Make nospeak appear in the Android share sheet.
- When selected, open nospeak, require the user to choose a contact, and then open the existing single-file media send preview with the shared media already loaded (or pre-fill the message input for text/URLs).
- If the user is not logged in, show a clear message and do not retain the shared content.

## Goals / Non-Goals

- Goals:
  - Define how the Android app shell SHOULD expose nospeak as an `ACTION_SEND` share target for media and text.
  - Specify the in-app navigation and state-handling behavior when a share is received, including when the app is already running.
  - Keep encryption, upload, and DM semantics within existing messaging flows (e.g., using the current file-message and caption logic) rather than introducing a parallel sending path.

- Non-Goals:
  - Multi-item (`ACTION_SEND_MULTIPLE`) support; the initial requirement focuses on a single shared item.
  - Changing existing outbound share behavior from nospeak (those flows remain as already specified).
  - Adding new media types beyond the existing image/video/audio envelope defined by messaging and android-app-shell specs.

## Decisions

- **Use a dedicated Android plugin for inbound share intents**
  - Decision: Model inbound shares using a small native Capacitor plugin (e.g. `AndroidShareTarget`) that reads `ACTION_SEND` intents, extracts either media bytes or text, and exposes them to the web client via a typed JS bridge and event listener.
  - Rationale: This matches existing patterns (e.g., `AndroidBackgroundMessaging`, `AndroidNip55Signer`), keeps OS-specific intent parsing out of the web bundle, and avoids overloading generic plugins.

- **Single-item, single-conversation flow**
  - Decision: Treat each inbound share as a single piece of content routed to a single DM conversation chosen by the user. The plugin only needs to support `ACTION_SEND` with one subject item; `ACTION_SEND_MULTIPLE` can be left unspecified/unsupported for now.
  - Rationale: The existing DM UI and file-message semantics center around a single attachment plus optional caption. Extending to multiple attachments would require new UX and messaging requirements that are outside the current request.

- **Always go through contact selection**
  - Decision: Even if the app is already focused on a particular conversation, an inbound share SHALL route the user to the contact list, and only after a contact is explicitly chosen will the media preview open or the text be injected into the input.
  - Rationale: This makes the destination explicit and avoids surprises when a user shares while nospeak happens to be on an old or unrelated DM.

- **Do not retain content for logged-out users**
  - Decision: If nospeak receives a share when the user is not authenticated, it SHALL show a clear, non-blocking message that sharing requires login and SHALL discard the share content without caching it for later use.
  - Rationale: This minimizes the risk of holding potentially sensitive media or text without a logged-in context, and keeps behavior simple and predictable. Users can retry the share after logging in.

- **Use existing DM media and text sending paths**
  - Decision: Once a contact is selected and the share is consumed, the client SHALL use the existing single-file DM preview and file-message flow for media (including encryption and upload) and the standard text message flow for text/URLs.
  - Rationale: Reusing these paths reduces surface area, ensures consistency with existing end-to-end behavior, and keeps the spec focused on shell- and navigation-level requirements.

## Risks / Trade-offs

- **Large shared files**
  - Risk: Very large media files shared into nospeak may be slow or impossible to load fully into memory on some devices.
  - Mitigation: The implementation can set practical upper bounds and surface a friendly error (e.g., treating oversized or unsupported shares as a validation failure before the preview).

- **User confusion about destination**
  - Risk: If inbound sharing sometimes goes straight into an already-open conversation and sometimes does not, users may be confused about where content is going.
  - Mitigation: The requirement to always route through contact selection makes behavior uniform and transparent.

- **Missed shares when logged out**
  - Risk: Users may expect content to be “queued” for sending after login.
  - Mitigation: The spec will clearly state that shares while logged out are not retained, and that the user must re-share after successfully logging in. This keeps state management simple.

## Migration Plan

- Add a new `android-app-shell` requirement describing the Android inbound share target behavior, including:
  - Appearance in the Android share sheet for supported media and text/URLs.
  - Behavior when nospeak is selected while logged in.
  - Behavior when nospeak is selected while logged out.

- Once the requirement is approved:
  - Implement a native Android plugin and web bridge that follow this specification.
  - Wire inbound shares into the existing DM contact list, media preview bottom sheet, and text input behaviors without altering core messaging semantics.

## Open Questions

- Should the spec constrain exact maximum media size or leave this to implementation guidance and error messaging?
- Should inbound text shares that look like URLs receive any special treatment beyond being inserted into the input (for example, hinting that URL previews may apply after send), or is text-only behavior sufficient?
