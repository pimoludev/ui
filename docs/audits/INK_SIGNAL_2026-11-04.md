# Ink & Signal review — 4 November 2026

Status: **review evidence and commit plan.** The design remains a candidate:
this document does not approve a stable release or a published Default change.

## Scope

Branch: `feat/ink-and-signal`, based on `f01aca8`.

Reviewed:

- Ink & Signal Default palette, typography, radii, elevation and motion;
- marketing, form and dashboard review surfaces built with real Pimolu
  components;
- light and dark modes, comfortable and compact density;
- the frozen beta.6 Default comparison;
- mobile and desktop rendering;
- the six non-Default presets and the optional `adaptive` palette.

The review surfaces live in the versioned Design Lab and in the local-only
`/design-preview` route. `/design-preview` is ignored by Git and is not part of
the published site.

## Evidence

Commands actually executed:

```text
pnpm check
→ 1,522 React tests, 31 CSS tests, typecheck, theme audit, playground build
→ 0 errors, 0 warnings

pnpm --dir apps/website lint
pnpm --dir apps/website typecheck
pnpm --dir apps/website test
pnpm --dir apps/website build
→ lint, typecheck, 45 tests, 313-page build: pass

pnpm --dir apps/website exec playwright test --workers=3
→ 1,668 passed, 18 skipped, 0 failed

Local design-preview Playwright spec
→ 3/3 passed

axe-core, WCAG 2 A/AA and 2.1 A/AA
→ 12 scenarios (390/1440 × light/dark × marketing/form/dashboard)
→ 0 violations
```

Manual captures reviewed at 1440 and 390 px:

- marketing, light;
- form, light and compact;
- dashboard, light and dark;
- beta.6 comparison, light;
- marketing, form and dashboard on mobile.

The axe run covers the three closed review surfaces. It does not cover open
overlays, screen-reader behavior or a complete WCAG conformance claim.

## Findings

### Blocking

None.

### Resolved during review

1. **Mobile dashboard table now exposes its horizontal scroll.**
   - Evidence before the fix: at 390 px, the table was intentionally wider than
     its container; Status and Updated columns were clipped and only
     pointer/touch users could discover the horizontal scroll.
   - Fix: `.ink-pilot-table` now has `role="region"`, `tabIndex={0}` and the
     accessible label “Recent projects table, scroll horizontally”, plus a
     visible `:focus-visible` outline.
   - Verification: the local design-preview spec was re-run at 390 and 1440 px
     after the change, including the focusable region assertion.
   - Scope: review composition, not the public component API.

### Minor

2. **Desktop form surface is visually underfilled.** At 1440 px, the 400 px form
   card leaves a large empty area in the review frame. This is a composition
   choice, not a component defect; consider supporting context or a narrower
   review frame before using it as a marketing recipe.

3. **Mobile review controls are dense.** Density, preset, comparison and the
   three surface tabs consume most of the first viewport at 390 px. This is
   acceptable for a local review route, but should not become a product
   pattern.

4. **Website chrome is only partially migrated.** The home display typography
   uses the new display role, while the rest of the site chrome keeps the
   existing surface treatment. This is intentional until the Default adoption
   decision; do not mix both identities in a production page.

### Positive

- The comparison with beta.6 is immediately legible: warm paper, ink and serif
  display versus the previous slate/indigo sans Default.
- Dark mode keeps the hierarchy and the iris signal without relying on color
  alone.
- Functional control borders are distinguishable from decorative separators.
- The form, dashboard and marketing surfaces use real Pimolu components and
  real local interactions, not static mockups.
- The non-Default presets preserve their published palettes; the new semantic
  roles are isolated.
- Fonts are self-hosted with their OFL licences and have system fallbacks.

## Decision status

| Criterion | Result |
| --- | --- |
| Technical checks | Pass |
| Contrast tests | Pass |
| axe-core closed surfaces | Pass, 12 scenarios |
| Chromium/Firefox/WebKit suite | Pass, 1,668 tests |
| Responsive page overflow | Pass in the reviewed scenarios |
| Keyboard, reduced motion, forced colors | Covered by the local spec; manual review remains |
| 5–8 person design review | **Not executed** |
| Screen-reader review | **Not executed** |
| Final Default adoption | **Open** |

Verdict: **technically ready for review, not ready for a stable release.** Fix
the mobile table affordance, complete the human design review and the
assistive-technology review, then record the decision.

## Commit plan

Do not commit or push this plan without an explicit request. The commits below
are ordered so generated previews land last.

### 1. Design direction and review

```bash
git add docs/ai/DESIGN_DIRECTION.md docs/ai/PLATFORM_ROADMAP.md \
  docs/ai/pimolu-design-spec-v0.1.md docs/ai/DESIGN_SYSTEM.md \
  docs/ai/DENSITY.md docs/ai/PROJECT_CONTEXT.md docs/ai/ROADMAP.md \
  docs/audits/INK_SIGNAL_2026-11-04.md
```

Suggested subject: `docs(design): add Ink & Signal direction and review`

### 2. Tokens, themes and presets

```bash
git add packages/design-tokens/src/tokens.json \
  packages/design-tokens/tests/build.test.mjs \
  packages/themes/src/themes.json \
  packages/themes/src/visual/default.json \
  packages/themes/src/presets/adaptive.json \
  packages/themes/src/presets/cartoon.json \
  packages/themes/src/presets/glass.json \
  packages/themes/src/presets/luxury.json \
  packages/themes/src/presets/monochrome.json \
  packages/themes/src/presets/neo-brutalism.json \
  packages/themes/style-base.css \
  packages/themes/tests/ink-signal.test.mjs
```

Suggested subject: `feat(themes): implement Ink & Signal Default`

### 3. Shared control surfaces

```bash
git add packages/web-styles/src/button.css \
  packages/web-styles/src/cascader.css \
  packages/web-styles/src/checkbox.css \
  packages/web-styles/src/color-picker.css \
  packages/web-styles/src/combobox.css \
  packages/web-styles/src/currency-input.css \
  packages/web-styles/src/date-picker.css \
  packages/web-styles/src/input-group.css \
  packages/web-styles/src/input.css \
  packages/web-styles/src/masked-input.css \
  packages/web-styles/src/mentions.css \
  packages/web-styles/src/multi-select.css \
  packages/web-styles/src/number-input.css \
  packages/web-styles/src/phone-input.css \
  packages/web-styles/src/pin-input.css \
  packages/web-styles/src/radio.css \
  packages/web-styles/src/select.css \
  packages/web-styles/src/switch.css \
  packages/web-styles/src/tags-input.css \
  packages/web-styles/src/textarea.css \
  packages/web-styles/src/time-picker.css \
  packages/web-styles/src/tree-select.css
```

Suggested subject: `feat(web-styles): apply Ink & Signal control surfaces`

### 4. Review surfaces, fonts and website integration

```bash
git add .gitignore \
  apps/playground/src/pages/design-lab-page.tsx \
  apps/playground/src/pages/ink-signal-baseline.json \
  apps/playground/src/pages/ink-signal-demo.css \
  apps/playground/src/pages/ink-signal-demo.tsx \
  apps/website/app/fonts.css \
  apps/website/public/fonts \
  apps/website/app/home.css \
  apps/website/app/layout.tsx \
  apps/website/content/docs.ts \
  apps/website/content/handbook.ts \
  apps/website/content/releases/unreleased.mdx \
  apps/website/README.md \
  apps/website/IMPLEMENTATION_PROGRESS.md
```

Suggested subject: `feat(playground,website): add Ink & Signal review surfaces`

Do not add `apps/website/app/design-preview/`: it is intentionally ignored.
Do not add `docs/local/` or `docs/marketing/`.

### 5. Public READMEs and changelog

```bash
git add README.md README.fr.md CHANGELOG.md
```

Suggested subject: `docs: refresh public READMEs and changelog`

### 6. Generated previews and component status

```bash
git add apps/website/content/component-status-overrides.json \
  apps/website/public/component-previews
```

Suggested subject: `chore(website): refresh component previews and badges`

This commit must be last because the captures and status overrides describe the
final source state.

## Final verification before push

```bash
pnpm check
pnpm --dir apps/website lint
pnpm --dir apps/website typecheck
pnpm --dir apps/website test
pnpm --dir apps/website build
pnpm --dir apps/website exec playwright test --workers=3
```

Then run the `git-commit` and `github-push` skills. No commit or push was
performed by this review.
