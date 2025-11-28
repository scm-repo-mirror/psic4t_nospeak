<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Agent Guidelines

## Commands
- **Build**: `npm run build`
- **Lint/Type Check**: `npm run check` (runs svelte-check against tsconfig)
- **Test**: `npx vitest` (runs all tests; use `--run` for single pass)
- **Single Test**: `npx vitest src/path/to/test.ts` or `npx vitest -t "pattern"`

## Code Style & Conventions
- **Indentation**: Use 4 spaces for indentation.
- **TypeScript**: Strict mode enabled. Define explicit interfaces/types for all data structures.
- **Naming**: PascalCase for Classes/Components/Interfaces. camelCase for functions/vars.
- **Imports**: Group external libraries first, then internal modules.
- **Error Handling**: Use `try/catch` for async operations.
- **Testing**: Write unit tests for logic in `src/lib/core`. Use `vi.mock` for dependencies.
- **Components**: Follow Svelte 5 syntax. Place components in `src/lib/components`.
- **State**: Use Svelte 5 runes or stores in `src/lib/stores`.
- **Validation**: ALWAYS run `npm run check` and `npx vitest run` before finishing a task.
