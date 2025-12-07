## 1. Implementation
- [x] 1.1 Review current contacts sidebar header implementation in `src/lib/components/ContactList.svelte` and confirm existing responsive breakpoints.
- [x] 1.2 Implement conditional rendering of the nospeak app name label next to the current user avatar for mobile layouts (native Android and mobile/PWA) while keeping desktop unchanged.
- [x] 1.3 Adjust spacing, typography, and alignment so the label fits comfortably in the header on small screens without overlapping the settings control.

## 2. Validation
- [x] 2.1 Run `npm run check` to verify type safety and Svelte compilation.
- [x] 2.2 Run `npx vitest run` to ensure existing tests still pass.
- [x] 2.3 Manually verify on a narrow viewport (browser devtools) that the contacts header shows avatar + "nospeak" on mobile widths and avatar-only on desktop.
- [x] 2.4 Manually verify in the Android build or emulator that the contacts header shows avatar + "nospeak" and remains visually consistent with the glassmorphism design.
