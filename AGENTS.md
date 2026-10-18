# AGENTS.md

Pimolu UI — a pnpm-workspace monorepo for a cross-platform design system. The READMEs are bilingual (`README.md` in English, `README.fr.md` in French); many comments and test names are in French.

## Setup & commands (run from repo root)

- Node >= 20; use `pnpm` (pinned via `packageManager`). `pnpm install` first.
- `pnpm build` — design-tokens build only. Writes `packages/design-tokens/dist/{tokens.json,tokens.css}` and `packages/themes/dist/{themes.json,styles.css}`.
- `pnpm build:all` — `build` + `packages/themes build:presets`. Also writes `packages/themes/dist/{presets.css,presets.js,presets.d.ts}`. Prefer this when unsure.
- `pnpm test` — `node --test` on `packages/design-tokens/tests/*.test.mjs` ONLY (self-contained; re-runs the build).
- `pnpm test:themes` — `node --test` in `packages/themes` (preset validation + generated output).
- `pnpm test:react` — vitest (jsdom) in `registry/react`; `pnpm test:watch` to watch.
- Single React test file: `pnpm --dir registry/react exec vitest run button/button.test.tsx`.
- `pnpm typecheck` — repo-wide `tsc` over `tsconfig.json` (covers `registry/**` + `packages/**`).
- `pnpm lint` — ESLint, scoped to `apps/playground` (no root ESLint config).
- `pnpm audit:themes` — read-only theme/preset integrity check (add `--strict` to also fail on warnings).
- `pnpm skills:check` — validates the `.agents/skills` catalog (frontmatter, names, duplicates).
- `pnpm verify:quick` — `build:all → typecheck → audit:themes → test → test:themes → test:react`.
- `pnpm verify` — `verify:quick + lint + skills:check + playground build`. The canonical full check.
- `pnpm "playground dev"` — Vite dev server for `apps/playground` (the script name contains a space).

## Skills (`.agents/skills/<name>/SKILL.md`)

Auto-discovered skills. `pimolu-orchestrator` is the central router: for multi-step or
cross-cutting requests, start there — it selects and sequences the specialized skills.
Activate the **smallest sufficient set**; never run every skill for a minor change.
Validate the catalog with `pnpm skills:check`.

| Task | Skills |
| --- | --- |
| Add/change a component | `component-development` → `test-runner` → `test-coverage-audit` → `playground-sync` |
| Add/change a theme or preset | `theme-integrity-audit` → `test-runner` → `test-coverage-audit` → `playground-sync` |
| Change tokens / CSS variables | `theme-integrity-audit` → `test-runner` → `playground-visual-tests` |
| Change a public API | `public-api-review` → `documentation-sync` |
| Interactive component | `accessibility-audit` |
| Commit | `git-commit` (which invokes the needed validations) |
| Push | `github-push` (runs the full pre-push checks) |
| Release | `release-manager` |
| Multi-step / unclear routing | `pimolu-orchestrator` |

Theme triggers — `theme-integrity-audit` runs (read-only, then requests approval) when a
theme/preset is created, modified, renamed or deleted; when colors/tokens/CSS variables
change; or when "verify all themes" is requested. Audits are read-only: never edit inside
an audit without an explicit go-ahead.

Hard rules (see the skills for detail): never claim unexecuted tests passed; never delete/weaken a failing test; never update visual snapshots silently; never commit, push or publish without an explicit request from the user.

## Automated validation (not agent-dependent)

- Git hooks in `.githooks/` (no dependency; enabled by `pnpm install` via the `prepare` script, which sets `core.hooksPath`):
  - `pre-commit` → blocks conflict markers / staged secrets, then `pnpm verify:quick`.
  - `pre-push` → `pnpm verify`.
- CI: `.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile` + `pnpm verify` on push to `main`/`dev` and on PRs.
- Branch protection (required status check on `verify`) is a **manual GitHub setting** — see `release-manager`/`github-push`. Local tooling cannot configure it.

## Generated code — do not hand-edit

- `packages/design-tokens/dist/*` and `packages/themes/dist/*` are generated and gitignored.
- Packages export from `dist/`, so a fresh clone must run `pnpm build:all` before `apps/playground` (or anything importing `@pimolu/themes/styles.css`, `@pimolu/themes/presets.css`, or `@pimolu/themes/presets`) can resolve.
- `pnpm build` alone does NOT regenerate the preset or visual assets; use `build:all` (or `pnpm --dir packages/themes build:presets` / `build:visuals`).

## Token pipeline

- Single source of truth: primitives in `packages/design-tokens/src/tokens.json`, semantic aliases in `packages/themes/src/themes.json`. Aliases use `{color.indigo.600}` syntax and must resolve to an existing `color.*` token, else the build throws.
- `light` and `dark` must have identical semantic keys (build fails otherwise).
- CSS var naming: `--pimolu-<key>` with camelCase→kebab and dots→dashes. Semantic vars are already hyphenated (e.g. `--pimolu-primary`, `--pimolu-surface-foreground`).
- Output is a primitive `:root` block plus `[data-pimolu-theme="light"|"dark"]` overrides.

## Style presets & themes

- Add a preset by creating `packages/themes/src/presets/<name>.json`, then run `pnpm --dir packages/themes build:presets`.
- `packages/themes/scripts/validate-presets.mjs` enforces kebab-case names, `light` + `dark` with identical keys, a required token set, and hex/named `rgba()` colors only. `pnpm test:themes` and `pnpm build:all` both exercise it.
- `"default"` is special: it has no `src/presets/default.json`. Its palette is generated from the resolved light/dark themes by `scripts/build-default.mjs` into `dist/default.css`, and its visual tokens live in `src/visual/default.json`. The generated `PimoluStylePreset` union = `"default"` + discovered presets; palette keys are camelCase in JSON but emitted as kebab CSS vars.
- Current presets: `default`, `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`. Themes: `light`, `dark`.
- A preset is defined by two platform-neutral data sources: a colour palette in `packages/themes/src/presets/<name>.json` and a visual token set in `packages/themes/src/visual/<name>.json`. Visual keys are the exact `--pimolu-<key>` suffix and are used verbatim; `dark` only carries theme overrides and must be a subset of `light`.
- `pnpm --dir packages/themes build:visuals` generates `dist/visual.css` (web CSS variables) and `dist/visuals.{js,d.ts}` (`pimoluPresetVisuals`) from that data. This is the cross-platform source of truth for borders, shadows, radius, typography and press effects — components consume it on web and read it as data on native.
- `packages/themes/style-presets.css` @imports `./dist/default.css`, `./dist/presets.css` and `./dist/visual.css`. Only `style-base.css` (shared defaults) and the `style-glass.css` / `style-luxury.css` web helpers remain hand-written. Presets must NOT declare component internals (`.pimolu-button`, …); they only declare tokens.
- Integration points NOT auto-discovered (update by hand when adding a theme/preset): the `PimoluTheme` union in `build-presets.mjs` and the playground colour-theme list. `pnpm audit:themes` flags any of these left behind; full map in `.agents/skills/theme-integrity-audit/references/theme-system.md`.

## Architecture

- `packages/design-tokens`, `packages/themes`: build-driven CSS/JSON outputs.
- `packages/core`: `createVariants()` returns a className string (no `cn`/Tailwind helper).
- `registry/react`: source-only package (private; exports `./index.ts`, no build step). A component lives in `registry/react/<name>/` with `<name>.tsx`, `<name>.variants.ts`, `<name>.css`, `<name>.test.tsx`, and is re-exported from `registry/react/index.ts`. `Button` is the reference implementation.
- `@pimolu/react` and `@pimolu/core` expose raw TS source (no build); `@pimolu/themes` exports generated files and needs `build:all`.
- Styling is plain CSS classes (`pimolu-*`) + CSS variables. No Tailwind / CSS-in-JS. Theming is attribute-driven: `PimoluProvider` sets `data-pimolu-theme` and `data-pimolu-style` on a wrapping `<div>`.
- Packages are `private: true` except `@pimolu/design-tokens`, so nothing is publishable as-is today.
- `apps/playground` is the manual verification app. `examples/nextjs` is a working Next.js App Router integration example (`pnpm --dir examples/nextjs build`). `apps/website`, the remaining `examples/*` and non-`react` `registry/*` are empty placeholders. `apps/playground/src/App.css` is unused Vite template CSS.

## Tests

- Vitest + Testing Library, jsdom; setup file is `registry/react/test/setup.ts` (auto-cleanup).
- CSS imports are transformed by Vite; `registry/react/css.d.ts` declares `*.css` for TS.
- Follow the existing style in tests (mixed EN/FR `it(...)` descriptions are normal).
- No E2E or visual runner is installed. `playground-visual-tests` handles visual review via manual inspection and may *propose* Playwright — do not install it without approval.
