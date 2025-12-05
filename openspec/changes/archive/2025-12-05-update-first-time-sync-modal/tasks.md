## 1. Implementation
- [x] 1.1 Update desktop chat layout to always use the first-time sync modal overlay instead of an inline status view.
- [x] 1.2 Remove or simplify the desktop inline sync status in the `/chat` root view so it no longer duplicates the modal UI.
- [x] 1.3 Ensure the modal remains blocking on both desktop and mobile during first-time sync and that the fetched message count updates in real time.
- [x] 1.4 Confirm that the existing first-time sync completion behavior (auto-navigation to the newest conversation on desktop) still works with the unified modal.

## 2. Validation
- [x] 2.1 Manually test first-time sync on desktop to verify the blocking modal appears, updates counts, and disappears when sync completes.
- [x] 2.2 Manually test first-time sync on mobile to verify the same modal UI and blocking behavior remains correct.
- [x] 2.3 Run `npm run check` to ensure type and Svelte checks pass.
- [x] 2.4 Run `npx vitest run` to ensure tests pass.
