---
name: theme-integrity-audit
description: Read-only auditor of Pimolu UI themes and presets (files, tokens, CSS/TS, scripts, tests, playground). Use when creating, modifying, renaming or deleting a theme or preset, changing colors/tokens/CSS variables, or when asked to verify all themes.
---

# theme-integrity-audit

Read-only auditor for the Pimolu theme system. It **detects** problems and **proposes**
fixes; it never modifies files without explicit authorization.

> Supersedes the former `theme-preset-validation` skill (merged here) so that a single
> skill owns theme work. The deterministic, build-driven checks it used to describe are
> now automated by `scripts/theme-integrity.mjs` below.

## Activation
Use when the user:
- creates, modifies, renames or deletes a theme or a preset;
- changes colors, tokens, or CSS variables;
- edits theme schemas, registries, or generated-style scripts;
- asks to "verify/audit all themes" (global audit);
- is about to commit changes touching `packages/design-tokens`, `packages/themes`, or theme-related CSS.

Do not use for pure component logic changes with no token/theme impact.

## Sources of truth (never assume a single model)
Pimolu has **two distinct layers** — see `references/theme-system.md` for the full map:
1. **Color themes** — `light` / `dark`, defined once as semantic aliases in
   `packages/themes/src/themes.json`. Not one file per theme.
2. **Style presets** — `default`, `monochrome`, `cartoon`, `glass`, `luxury`,
   `neo-brutalism`, expressed by **two** artifacts:
   - a color palette `packages/themes/src/presets/<name>.json` (all except `default`),
   - a visual CSS file `packages/themes/style-<name>.css`.

Component-specific preset tokens (`glassBg`, `luxuryGold`, …) live in the preset JSON,
not in the global token file. Distinguish an intentional stylistic difference from a
missing token — they are not the same.

## Deterministic check (run first, always)
```bash
pnpm audit:themes          # non-destructive; exit 1 only on structural ERRORs
pnpm audit:themes:strict   # also exit 1 on warnings
node .agents/skills/theme-integrity-audit/scripts/theme-integrity.mjs --json
```
It checks: light/dark key parity; preset validation (via the project validator);
preset JSON ↔ `style-*.css` parity; generated `PimoluTheme` / `PimoluStylePreset`
unions vs sources; playground selector lists; CSS variable definition/fallbacks.
It never writes. If it reports errors, treat them as blocking for the commit/push.

Then run the project checks via `test-runner`: `pnpm build:all`, `pnpm test`,
`pnpm test:themes`, `pnpm test:react`. `build:all` is itself an invariant gate
(unknown alias, light/dark mismatch, invalid preset all throw).

## Integration points to verify for any new/changed theme or preset
| Artifact | Where | Auto-discovered? |
| --- | --- | --- |
| semantic aliases | `packages/themes/src/themes.json` | read by `build.mjs` |
| color-theme TS union | `PimoluTheme` in `packages/themes/scripts/build-presets.mjs` | **NO — hardcoded** |
| preset palette | `packages/themes/src/presets/<name>.json` | yes (dir scan) |
| preset visual CSS | `packages/themes/style-<name>.css` | **NO — by convention** |
| preset aggregator | `packages/themes/style-presets.css` (`@import`) | **NO — manual** |
| preset TS union | generated `dist/presets.d.ts` | yes (from dir scan) |
| playground selectors | `apps/playground/src/App.tsx` (`const themes`/`const presets`) | **NO — hardcoded** |
| provider tests | `registry/react/provider/pimolu-provider.test.tsx` | **NO — hardcoded list** |
| docs | `README.md`, `AGENTS.md` | **NO — manual** |

A theme/preset is only "fully integrated" when every non-auto-discovered row is updated.

## Steps (audit = read-only)
1. Run the deterministic check; capture output.
2. Discover themes/presets and confirm the expected structure for each (table above).
3. Verify JSON: `themes.json` (parity), preset files (required tokens + valid colors +
   identical light/dark keys + camelCase names), tokens.json (DTCG `$type`/`$value`,
   `$schema` references). A dedicated `schema.json` per theme is **not** the project's
   model — do not impose one; the shared validator + build are the schema.
4. Audit tokens per theme/preset: colors (primary/secondary/accent), background/
   foreground, text, border, `hover/focus/active/disabled`, `success/warning/error/info`
   when they exist, spacing, typography, sizing/heights, radius, shadows, opacity,
   transitions, component-specific tokens. Compare across themes; flag omissions.
5. CSS/TS: enumerate declared vs consumed `--pimolu-*` variables, missing fallbacks,
   syntax/import/export errors, theme-name types, registries/mappings, stale references,
   cross-theme conflicts, and whether a theme breaks shared styles.
6. Scripts: confirm generation/validation/build/exports handle the change. If a script
   auto-discovers (preset dir), **do not** add redundant declarations; if a list is
   hardcoded (theme union, playground), point to the exact missing line.
7. Tests: delegate to `test-runner` + `test-coverage-audit`. Check token resolution,
   main component variants, interactive states, light/dark coverage, regressions.
   Propose missing tests as code — do not write them.
8. Playground: delegate to `playground-sync`. Verify presence in selectors, application
   to components, dynamic switching and back, preset compatibility, no broken styles,
   main states, desktop/mobile.
9. Design suggestions (optional): for a new theme (e.g. `ocean`), propose complementary
   colors, hover/active variants, readable foregrounds, borders, focus styles, shadows,
   and contrast fixes — respecting the theme's character. Present in the project's real
   color format (HEX as used in presets, `rgba()` for translucency). Mark every
   stylistic proposal as **optional**; never alter existing colors for aesthetics alone.
10. Produce the report below. Stop. Ask for confirmation (see next section).

## Authorizations (critical)
Auditing is **read-only**. Producing a report is not permission to edit.
After the report, ask exactly:
> « J'ai terminé l'audit des thèmes. J'ai identifié les corrections suivantes.
>   Souhaites-tu que je les applique ? »

Offer the answers: **tout corriger** · **corriger uniquement les problèmes critiques** ·
**choisir les corrections individuellement** · **afficher le code/les diffs avant de décider** ·
**ne rien modifier**. Apply only what is authorized. `pnpm audit:themes` and any explicitly
requested audit command must stay non-destructive.

## Post-correction validation (only if authorized)
Re-run `pnpm audit:themes`, `pnpm build:all`, `pnpm test`, `pnpm test:themes`,
`pnpm test:react`, `pnpm typecheck`, and the playground build (`playground-sync`).
Re-check registries/types/playground. Present a before/after report and any remaining
issues. Do not commit or push without an explicit request.

## Skills used
`test-runner`, `test-coverage-audit`, `playground-sync`, `playground-visual-tests`
(rendering), `documentation-sync` (docs), `component-development` (if components consume
new tokens). Orchestrated by `pimolu-orchestrator`.

## Failure conditions
- A structural ERROR from the deterministic check.
- A new/changed theme or preset is missing a mandatory integration point (hardcoded union,
  playground, `style-*.css`).
- `build:all` / theme tests fail.
- A required CSS variable is missing without a fallback and without justification.
- An audit would require edits: stop and request authorization.

## Validation criteria
- Every claim in the report comes from an executed command, not from reading alone.
- Not-executed checks are explicitly labeled as such.
- Stylistic differences are never reported as errors.
- Proposed fixes include file path, cause, rationale, code/diff, and the test to verify.

## Report format
```
THEME INTEGRITY AUDIT — <scope: one theme | global>
- command(s): audit:themes → result ; build:all → result ; tests → result
- themes/presets discovered: <...>
- passed checks: <...>
- CRITICAL (blocking): <issue → file → cause → proposed fix → consequences → test>
- IMPORTANT: <...>
- WARNINGS: <...>
- OPTIONAL suggestions (design): <...>
- not executed: <check → reason>
- verdict: conform | non-conform
Then: request authorization (exact wording above) and wait.
```
