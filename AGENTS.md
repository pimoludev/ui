# AGENTS.md

Pimolu UI — a pnpm-workspace monorepo for a cross-platform design system. The READMEs are bilingual (`README.md` in English, `README.fr.md` in French); many comments and test names are in French.

Start with `docs/ai/PROJECT_CONTEXT.md`; follow its links to the verified architecture, design system, component inventory, development guide and roadmap. Recheck the source files relevant to each task because this reference is a snapshot.

## Permanent marketing video conventions

For every Pimolu component video, read and apply
[`docs/ai/MARKETING_VIDEO_RULES.md`](docs/ai/MARKETING_VIDEO_RULES.md).
These are standing project instructions, including for short requests:

- `[Component] — vidéo design`: a visual component advertisement, with no code
  on screen. Progress from the real component through variants, customization
  and interactions to realistic application contexts, then Pimolu branding.
- `[Component] — vidéo code + design`: a component advertisement with valid,
  animated React/TypeScript code synchronized with the real preview. Progress
  through prop edits, interactions and advanced customization to realistic
  application contexts, then Pimolu branding.

Both formats require premium motion design, responsive interactions, genuine
Pimolu components, and animated application examples with contextual interactions.
Reuse the existing Remotion project under `docs/marketing/`, prioritize vertical
9:16, and normally target 30–60 seconds with short English copy. Implement,
render, inspect and correct the actual video; a storyboard alone is incomplete.
Read the relevant installed Remotion skills. Keep video work isolated from public
components and applications; do not change them just to facilitate filming.
The linked rules preserve the complete narrative, technical, audio and quality
requirements and apply automatically to future component video requests.

## Setup & commands (run from repo root)

- Node >= 20; use `pnpm` (pinned via `packageManager`). `pnpm install` first.
- `pnpm build` — design-tokens build only. Writes `packages/design-tokens/dist/{tokens.json,tokens.css}` and `packages/themes/dist/{themes.json,styles.css}`.
- `pnpm build:all` — `build` + Default palette, five other preset palettes, six visual token sets, the shared web CSS bundle and the compiled `@pimolu/core` / `@pimolu/react` packages. Prefer this when unsure.
- `pnpm build:packages` — compile `@pimolu/core` and bundle `@pimolu/react` into `dist/` (JavaScript + declarations). Required after changing a React component before consuming the package exports.
- `pnpm build:website` — build all workspace assets, then the production Next.js website.
- `pnpm start:website` — serve the built website on the host's `PORT` (default 3000).
- `pnpm release:plan` — read-only release analysis: commit range, SemVer decision, package/site versions and tag.
- `pnpm release:pack-check` — builds every publishable package and validates its `npm pack --dry-run` contents, version and entry points.
- `pnpm test` — `node --test` on `packages/design-tokens/tests/*.test.mjs` ONLY (self-contained; re-runs the build).
- `pnpm test:themes` — `node --test` in `packages/themes` (preset validation + generated output).
- `pnpm test:react` — vitest (jsdom) in `registry/react`; `pnpm test:watch` to watch.
- `pnpm test:web-styles` — Node tests for generated component CSS bundles.
- Single React test file: `pnpm --dir registry/react exec vitest run button/button.test.tsx`.
- `pnpm typecheck` — repo-wide `tsc` over `tsconfig.json` (covers `registry/**` + `packages/**`).
- `pnpm lint` — ESLint, scoped to `apps/playground` (no root ESLint config).
- `pnpm audit:themes` — read-only theme/preset integrity check (add `--strict` to also fail on warnings).
- `pnpm skills:check` — validates the `.agents/skills` catalog (frontmatter, names, duplicates).
- `pnpm verify:quick` — `build:all → typecheck → audit:themes → test → test:themes → test:react → test:web-styles`.
- `pnpm verify` — `verify:quick + lint + skills:check + playground build`. The canonical full check.
- `pnpm check` — full repository verification (`pnpm verify`).
- `pnpm "playground dev"` — Vite dev server for `apps/playground` (the script name contains a space).

## Skills (`.agents/skills/<name>/SKILL.md`)

Auto-discovered skills. `pimolu-orchestrator` is the central router: for multi-step or
cross-cutting requests, start there — it selects and sequences the specialized skills.
Activate the **smallest sufficient set**; never run every skill for a minor change.
Validate the catalog with `pnpm skills:check`.

| Task | Skills |
| --- | --- |
| Starting a non-trivial task / direction check | `pimolu-vision` (then `pimolu-orchestrator` if multi-step) |
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

Hard rules (see the skills for detail): never claim unexecuted tests passed; never delete/weaken a failing test; never update visual snapshots silently; never commit, push or publish without an explicit request from the user; a component change is not complete until its playground page demonstrates it — every new prop, variant, state, placement or behaviour lands in `apps/playground` in the same commit, not in a follow-up; and it has been looked at in the six presets × light and dark, because automated tests secure behaviour, not visual quality.

## Automated validation (not agent-dependent)

- Git hooks in `.githooks/` (no dependency; enabled by `pnpm install` via the `prepare` script, which sets `core.hooksPath`):
  - `pre-commit` → blocks conflict markers / staged secrets, then `pnpm verify:quick`.
  - `pre-push` → `pnpm verify`.
- CI is enabled in `.github/workflows/ci.yml` for pushes to `main`/`dev`, PRs and manual runs. Node 24 jobs run `pnpm verify` and, separately, the website production build, lint, documentation tests and Playwright in three engines. Do **not** pass an explicit `version` to `pnpm/action-setup`: the root `packageManager` pins pnpm.
- Branch protection (required status check on `verify`) is a **manual GitHub setting** — see `release-manager`/`github-push`. Local tooling cannot configure it.

## Generated code — do not hand-edit

- `packages/design-tokens/dist/*` and `packages/themes/dist/*` are generated and gitignored.
- All public packages export generated assets from `dist/`; `@pimolu/react` is bundled to a single ESM entry with declarations, and `@pimolu/core` compiles its source. A fresh clone must run `pnpm build:all` before the playground, website, examples or package exports can resolve.
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
- `registry/react`: source package compiled by `scripts/build.mjs` into `dist/index.js` (single ESM bundle, `"use client"`) plus declarations. A component lives in `registry/react/<name>/` with `<name>.tsx`, `<name>.types.ts`, `<name>.variants.ts` and `<name>.test.tsx`; its CSS lives in `packages/web-styles/src/<name>.css`. Re-export from `registry/react/index.ts`, include the stylesheet in the web-styles build and add a playground page. `Button` is the reference implementation.
- `@pimolu/core` compiles to `dist/`; `@pimolu/themes`, `@pimolu/web-styles` and `@pimolu/design-tokens` export generated files and need `build:all`.
- Styling is plain CSS classes (`pimolu-*`) + CSS variables. No Tailwind / CSS-in-JS. Theming is attribute-driven: `PimoluProvider` sets `data-pimolu-theme` and `data-pimolu-style` on a wrapping `<div>`.
- `@pimolu/design-tokens`, `@pimolu/themes`, `@pimolu/core`, `@pimolu/react` and `@pimolu/web-styles` are publishable at the same version; the website stays private. `release-manager` owns version sync, pack checks, changelog and tagging. Never run `npm publish` without a separate explicit request.
- `apps/playground` is the manual verification app: one hash-routed page per component (`src/pages/*`, registered in `src/router.ts`), shared demo data in `src/demo-data.ts`, and styles imported from `@pimolu/web-styles/styles.css` (so `pnpm build:all` must run first). Each component page ends with real-world examples, not just prop permutations. `apps/website` is the public Next.js documentation site (303 generated pages, Playwright suite). Framework starters are maintained in separate repositories. Other platform registries are not implemented yet.

## Tests

- Vitest + Testing Library, jsdom; setup file is `registry/react/test/setup.ts` (auto-cleanup).
- Component CSS is loaded through `@pimolu/web-styles`; `registry/react/css.d.ts` remains a CSS module declaration but React sources do not currently import component CSS.
- Follow the existing style in tests (mixed EN/FR `it(...)` descriptions are normal).
- Playwright is installed only for `apps/website`; its e2e suite runs against a production build. The playground still relies on manual visual review. `playground-visual-tests` handles that review and may *propose* a playground runner — do not install one without approval.
