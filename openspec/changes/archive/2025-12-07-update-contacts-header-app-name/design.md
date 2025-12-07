## Context
The contacts sidebar header currently displays only the current user's avatar and a settings icon. On mobile-sized layouts (native Android and PWA), we want to improve app recognition by adding the nospeak app name label next to the avatar without disrupting the existing layout or desktop experience.

## Goals / Non-Goals
- Goals:
  - Show the nospeak app name text next to the current user avatar in the contacts header on mobile-sized layouts.
  - Ensure the label appears for both native Android and mobile/PWA usage.
  - Preserve existing glassmorphism and responsive layout behavior.
- Non-Goals:
  - Redesigning the entire contacts header or sidebar.
  - Changing navigation behavior or contact list structure.

## Decisions
- Decision: Use viewport-based responsive classes as the primary mechanism, showing the label on small widths and hiding it on desktop, optionally combined with platform detection if tablet behavior needs refinement.
- Decision: Style the label using existing typography and color tokens (e.g., small, bold text that respects light/dark themes) to align with the current visual language.

## Risks / Trade-offs
- Risk: On very narrow devices, adding text next to the avatar could cause crowding with the settings icon; this will be mitigated by using compact text styles and ensuring the layout wraps or truncates gracefully.

## Migration Plan
- Implement the header label behind responsive conditions.
- Verify behavior on mobile and desktop layouts.
- No data or API migrations are required.

## Open Questions
- Should the label copy always be the literal string "nospeak", or should it eventually be driven by a configurable app name setting? (For this change, we assume a fixed "nospeak" label.)
