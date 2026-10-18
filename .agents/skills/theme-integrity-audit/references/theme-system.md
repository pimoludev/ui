# Pimolu theme system — reference

Ground truth for `theme-integrity-audit`. Verified against the code in this repo.

## Two layers (do not conflate)

### 1. Color themes (light / dark)
- **Source:** `packages/themes/src/themes.json` — one object with a `light` and a `dark`
  entry, each mapping a semantic name to a primitive alias, e.g.
  `"primary": "{color.indigo.600}"`.
- **Build:** `packages/design-tokens/scripts/build.mjs` flattens
  `packages/design-tokens/src/tokens.json`, resolves aliases, and emits:
  - `packages/themes/dist/themes.json` (resolved JS/RN values),
  - `packages/themes/dist/styles.css` — a primitive `:root` block plus
    `[data-pimolu-theme="light"]` / `[data-pimolu-theme="dark"]` overrides.
- **Rules enforced by the build:** aliases must resolve to an existing `color.*` token;
  `light` and `dark` must have identical semantic keys.
- **Not file-per-theme.** Adding a color theme means adding a key to `themes.json` **and**
  updating the hardcoded `PimoluTheme` union in `build-presets.mjs` (see below).
- `themes.json` semantic names are already kebab-case (`surface-foreground`, `focus-ring`),
  so the CSS variable is `--pimolu-<name>` verbatim.

### 2. Style presets
Presets combine two artifacts:

- **Color palette** — `packages/themes/src/presets/<name>.json`.
  Present for `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`.
  **Absent for `default`** (default uses the light/dark theme colors as-is).
  - Keys are **camelCase** and become kebab CSS variables
    (`primaryHover` → `--pimolu-primary-hover`, `glassBg` → `--pimolu-glass-bg`).
  - Required tokens (validated): `background`, `foreground`, `surface`,
    `surfaceForeground`, `primary`, `primaryHover`, `primaryForeground`, `secondary`,
    `secondaryHover`, `secondaryForeground`, `muted`, `mutedForeground`, `border`,
    `focusRing`.
  - Extra tokens allowed for component theming: `glassBg`, `glassBgHover`, `glassBorder`,
    `luxuryGold`, `luxuryDivider` (any camelCase name with a valid color).
  - Colors must be `#rgb` / `#rrggbb` / `#rrggbbaa` or `rgba(r,g,b,a)` (a) — see
    `packages/themes/scripts/validate-presets.mjs`.
- **Visual CSS** — `packages/themes/style-<name>.css` (borders, radius, shadows, effects).
  Shared defaults live in `style-base.css`; the aggregator `style-presets.css`
  `@import`s base + each `style-<name>.css` + the generated `dist/presets.css`.
- **Build:** `packages/themes/scripts/build-presets.mjs` scans the presets dir and emits
  `dist/presets.css`, `dist/presets.js` (`pimoluPresets`), `dist/presets.d.ts`
  (`PimoluTheme`, `PimoluStylePreset`, `PimoluPresetColors`).

## Variable namespaces
- Primitives: `--pimolu-color-*`, `--pimolu-spacing-*`, `--pimolu-radius-*`,
  `--pimolu-font-size-*`, `--pimolu-font-family-*` (from `tokens.json`).
- Semantic colors: `--pimolu-primary`, `--pimolu-border`, `--pimolu-focus-ring`, … — from
  color themes **and** preset palettes.
- Visual: `--pimolu-control-border-width`, `--pimolu-solid-border-color`,
  `--pimolu-shadow-raised`, `--pimolu-button-font-weight`, `--pimolu-glass-*`,
  `--pimolu-font-heading|body` (from `style-*.css` and preset JSON).

## Runtime application
Components never read theme state in JS. `PimoluProvider` sets
`data-pimolu-theme` and `data-pimolu-style` on a wrapping `<div>`, and CSS matches those
attributes. Selectors used:
- `[data-pimolu-theme="dark"]`
- `[data-pimolu-style="<preset>"]`
- combined for dark overrides: `[data-pimolu-theme="dark"][data-pimolu-style="<preset>"]`

## Sources of truth (summary)
| Concern | Source | Generated |
| --- | --- | --- |
| primitives | `packages/design-tokens/src/tokens.json` | `design-tokens/dist/*` |
| color themes | `packages/themes/src/themes.json` | `themes/dist/themes.json`, `styles.css` |
| preset palettes | `packages/themes/src/presets/*.json` | `themes/dist/presets.{css,js,d.ts}` |
| preset visuals | `packages/themes/style-*.css` | (authored, not generated) |
| public types | (generated) | `themes/dist/presets.d.ts` |

## Known integration gaps (as of this audit)
These are **not automatically discovered** and must be updated by hand when adding a
theme/preset: the `PimoluTheme` union in `build-presets.mjs`; the `style-*.css` file and
`style-presets.css` import; the playground `const themes` / `const presets` arrays in
`apps/playground/src/App.tsx`; the preset/theme list in the provider test.

## Known token gaps (warnings, not breakage)
Components reference `--pimolu-success*`, `--pimolu-warning*`, `--pimolu-danger-hover`,
`--pimolu-danger-foreground` with hardcoded fallbacks; these tokens are not defined by any
theme or preset (`--pimolu-danger` itself does come from `themes.json`). `--pimolu-info`
does not exist. These are reported as warnings until the user decides to add the tokens.
