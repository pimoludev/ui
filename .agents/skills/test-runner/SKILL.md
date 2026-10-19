---
name: test-runner
description: Run the relevant Pimolu UI test, typecheck, lint and build checks and report reliable pass/fail results. Use before committing, before pushing, or whenever code changes need verification.
---

# test-runner

## Activation
Use whenever a change must be verified: before commit/push, after editing a
component/package, or when the user asks whether something works.

## Responsibilities
- Run the most relevant checks for the change (not blindly everything).
- Never claim success for a check that was not executed.
- Separate pre-existing failures from regressions caused by the change.

## Scope selection
| Change touches | Run |
| --- | --- |
| `packages/design-tokens`, `packages/themes` | `pnpm build:all` + `pnpm test` + `pnpm test:themes` + `pnpm audit:themes` |
| `packages/web-styles` | `pnpm build:all` + `pnpm test:web-styles` |
| `registry/react/**` | `pnpm test:react` + `pnpm typecheck` |
| `apps/playground/**` | `pnpm lint` + `pnpm --dir apps/playground run build` |
| Anything (safe default) | `pnpm verify` |
| Fast pre-commit scope | `pnpm verify:quick` |

## Exact commands
- Tokens/themes unit tests: `pnpm test` (Node `--test`, self-contained: it re-runs the token build).
- React tests: `pnpm test:react` (vitest, jsdom). Single file:
  `pnpm --dir registry/react exec vitest run button/button.test.tsx`.
  Filter: `pnpm --dir registry/react test <name-substring>`.
- TypeScript (whole repo, tokens + components + core): `pnpm typecheck`.
- Lint (currently `apps/playground` only — ESLint is configured there): `pnpm lint`.
- Build generated assets (tokens, themes, presets, visual tokens and web CSS): `pnpm build:all`.
- Theme audit: `pnpm audit:themes` (or `pnpm audit:themes:strict`).
- Web styles tests: `pnpm test:web-styles`.
- Playground production build (`tsc -b && vite build`): `pnpm --dir apps/playground run build`.
- Full pipeline: `pnpm verify` = `build:all → typecheck → audit:themes → test → test:themes → test:react → test:web-styles → lint → skills:check → playground build`. `pnpm check` also builds `examples/nextjs`.

## Steps
1. Identify what changed (paths) and pick the scope above.
2. Run the checks; capture exit codes and summaries.
3. For any failure, decide: pre-existing or regression? If unsure, verify on the
   untouched baseline (e.g. `git stash` with care, or run the same command on `HEAD`).
4. Report every check with its real status.

## No E2E today
There is no E2E or visual runner installed. Functional/visual coverage is handled
by `test-coverage-audit` and `playground-visual-tests`. Do not invent a runner.

## Never
- Skip/mask a failing test to go green, or delete a test to fix CI.
- Declare a component "works" only because the build succeeded.

## Failure conditions
- A mandatory check fails → report it and stop; do not proceed to commit/push.
- A check cannot run → state the exact reason (missing dependency, no runner, etc.).

## Validation criteria
- Every reported check was actually executed, with its true result.
- Regressions are attributed to the change; pre-existing issues are labeled as such.

## Report format
```
TESTS
- scope: <what was selected and why>
- passed: <command → ok>
- failed: <command → error, first lines>
- skipped/not-run: <command → reason>
- pre-existing vs regression: <assessment>
- verdict: green | red (blocking)
```
