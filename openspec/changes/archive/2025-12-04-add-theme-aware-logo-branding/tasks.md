## 1. Specification and Design
- [x] Review existing settings and messaging specs for theme and UI branding requirements.
- [x] Finalize exact color mappings for Latte Text (bright) and Frappe text (dark) based on the Catppuccin palette already defined in code.
- [x] Define how theme mode and Catppuccin palette drive logo appearance in different contexts (chat header, settings About, favicons, notifications).

## 2. Asset Preparation
- [ ] Create a Latte Text-tinted version of the nospeak logo starting from the white-on-transparent root `nospeak.png`.
- [ ] Regenerate favicon and PWA icons (`apple-touch-icon`, `favicon-16x16`, `favicon-32x32`, `favicon-192x192`, `favicon-512x512`, `favicon.ico`) in Latte Lavender and place them under `static/favicons/`.
- [ ] Create a notification/badge icon asset (SVG or PNG) using the Latte Lavender logo and store it under `static/` or `static/favicons/`.

## 3. Theme-Aware Logo Styling
- [x] Introduce a shared CSS class (e.g., `.app-logo`) that controls logo colorization using CSS variables from the active Catppuccin theme and the current theme mode.
- [x] Ensure bright/light modes map the in-app logo to Latte Lavender and dark modes map the logo to a white appearance that visually matches Frappe `text` color.
- [x] Apply the shared logo styling to all in-app logo usages, including the chat header and Settings → About logo.

## 4. Notification and PWA Integration
- [x] Update notification icon and badge references in `NotificationService` to use the new violet logo asset.
- [x] Confirm PWA manifest icon entries continue to point at the regenerated violet favicon assets.

## 5. Validation
- [x] Run `npm run check` to ensure type and Svelte checks pass.
- [x] Run `npx vitest run` to confirm tests still pass.
- [ ] Manually verify in the browser that:
  - [ ] Favicons, PWA install icon, and notification icons use the Latte Text logo.
  - [ ] In-app logo appears in Latte Text when theme mode is Light (Latte effective theme).
  - [ ] In-app logo appears white when theme mode is Dark (Frappe effective theme).
  - [ ] System mode correctly reflects OS-level light/dark changes for logo appearance.
