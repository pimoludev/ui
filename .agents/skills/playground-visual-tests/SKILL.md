---
name: playground-visual-tests
description: Detect visual and interaction problems in Pimolu UI components and the playground. Use for visual regressions, layout, overflow, states, themes and presets review.
---

# playground-visual-tests

## Activation
Use when checking visual rendering, regressions, layout/overflow, or interaction
behavior; and before/after visual changes to components or styles.

## Responsibilities
- Detect real visual/interaction defects, not subjective preference.
- Never silently overwrite a reference screenshot to make a diff disappear.

## Tooling reality (verify before promising anything)
- **No E2E/visual runner is installed** (no Playwright, no Puppeteer, no screenshot
  snapshots). Do not claim visual tests ran if they did not.
- Prefer what exists: component/behavior tests (vitest), the playground build,
  and manual inspection via `pnpm "playground dev"` in a browser.
- Playwright may be **proposed** as an addition (with justification) when repeated
  visual verification is valuable; do not install it without user approval.

## What to check (by relevance)
- Component rendering and each main variant (`variant`, `appearance`, `size`, `radius`).
- Themes: `light` and `dark`.
- Presets: `default`, `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`.
- States: hover, focus-visible, active, `disabled`, `loading`.
- Desktop and mobile widths; overflow and layout breaks (flex-wrap behavior).
- Real interactions: clicks, keyboard activation.

## Steps
1. State which tool is used (vitest behavior test vs manual browser). If none can
   run the requested scenario, say so plainly.
2. If adding visual snapshots: create baselines deliberately, review each image,
   and get approval before committing them.
3. Run the relevant checks (`pnpm verify` / playground build) alongside visual review.
4. For each finding: severity, component, theme/preset, viewport, evidence, fix suggestion.

## Skills used
`playground-sync`, `theme-integrity-audit`, `test-runner`.

## Failure conditions
- A visual regression is found → report and block the associated commit until triaged.
- Reference snapshots would need updating → require explicit approval; never auto-accept.

## Validation criteria
- Findings are reproducible and tied to a concrete state/theme/preset.
- Any snapshot change is reviewed and approved, not auto-approved.

## Report format
```
VISUAL
- tool: <vitest behavior | manual browser | playwright (proposed)>
- scenario: <component / theme / preset / viewport>
- issues: <severity → component → description → evidence>
- snapshots: <created/updated + approval, or n/a>
- verdict: ok | needs-fix
```
