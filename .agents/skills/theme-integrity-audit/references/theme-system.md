# Pimolu theme system — reference

Ground truth for `theme-integrity-audit`. Verified against the code in this repo.

## Two layers (do not conflate)

### 1. Color themes (light / dark)
- **Source:** `packages/themes/src/themes.json` — one object with a `light` and a `dark`
  entry, each mapping a semantic name to a primitive alias, e.g.
  `"primary": "{color.indigo.600}"`.
- **Build:** `packages/design-tokens/scripts/build.mjs` flattens
  `packages/design-tokens/src/tokens.json`, resolves aliases, and emits
  `packages/themes/dist/themes.json` and `packages/themes/dist/styles.css`
  (primitive `:root` block plus `[data-pimolu-theme="light"|"dark"]` overrides).
- **Rules enforced by the build:** aliases must resolve to an existing `color.*` token;
  `light` and `dark` must have identical semantic keys.
- **Not file-per-theme.** Adding a colour theme means adding a key to `themes.json` **and**
  updating the hardcoded `PimoluTheme` union in `build-presets.mjs`.
- Semantic names are already kebab-case (`surface-foreground`, `focus-ring`), so the CSS
  variable is `--pimolu-<name>` verbatim.

### 2. Style presets — platform-neutral data
A preset is described by **two data sources**, never by CSS component rules:

- **Colour palette** — `packages/themes/src/presets/<name>.json`.
  Present for `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`.
  **Absent for `default`**, whose palette is generated from the resolved themes by
  `scripts/build-default.mjs` into `dist/default.css`.
  Keys are camelCase and become kebab CSS variables; colours must be `#rgb`/`#rrggbb`/
  `#rrggbbaa` or `rgba()`; the 14 required tokens are listed in `validate-presets.mjs`;
  extra component colour tokens (`glassBg`, `luxuryGold`, …) are allowed.
- **Visual tokens** — `packages/themes/src/visual/<name>.json`, validated by
  `scripts/validate-visuals.mjs`.
  Keys are the **exact `--pimolu-<key>` suffix** and are emitted verbatim.
  `light` carries the base declarations, `dark` only the theme overrides and must be a
  subset of `light`. Values are CSS value strings.

Builders: `build:presets` and `build:visuals` (both part of `build:all`).

## Generated outputs (never hand-edit)

| File | Content | Consumers |
| --- | --- | --- |
| `dist/styles.css` | primitives + light/dark semantic themes | web |
| `dist/default.css` | `default` palette from the themes | web |
| `dist/presets.css` | preset colour palettes | web |
| `dist/presets.js` / `.d.ts` | `pimoluPresets` (colours) | JS / native |
| `dist/visual.css` | visual tokens per preset, incl. dark and `prefers-color-scheme` blocks | web |
| `dist/visuals.js` / `.d.ts` | `pimoluPresetVisuals` (borders, shadows, radius, effects) | JS / native |

`style-presets.css` (the public `./presets.css` export) aggregates:
`style-base.css` → `dist/default.css` → `dist/presets.css` → `dist/visual.css` →
`style-glass.css` / `style-luxury.css`.

## Hand-written CSS that remains

- `style-base.css`: shared default tokens (`:where([data-pimolu-style])`), the semantic
  derivations (`--pimolu-secondary`, `--pimolu-neutral`), base radii, fonts,
  `color-scheme` per theme, and the component override hooks
  (`--pimolu-control-shadow`, `--pimolu-soft-border-color`,
  `--pimolu-button-active-transform`, …).
- `style-glass.css` / `style-luxury.css`: opt-in web helper classes only
  (`.pimolu-glass-surface`, `.pimolu-heading`).

Presets must **not** declare component internals (`.pimolu-button…`). Component styling
lives in the component CSS and is driven by tokens.

## Runtime application
Components never read theme state in JS for styling. `PimoluProvider` sets
`data-pimolu-theme` and `data-pimolu-style`, and CSS matches those attributes.
Selectors used: `[data-pimolu-theme="dark"]`, `[data-pimolu-style="<preset>"]`,
`[data-pimolu-theme="dark"][data-pimolu-style="<preset>"]`, and
`@media (prefers-color-scheme: dark) [data-pimolu-theme="system"][data-pimolu-style="<preset>"]`.

## Known integration gaps
- The `PimoluTheme` union in `build-presets.mjs` is hardcoded (colour themes are not
  discovered). The playground `const themes` list is explicit for the same reason.
- Visual token values may be CSS expressions (`var(--pimolu-shadow-raised)`,
  `color-mix(…)`). Web consumes them directly; a native renderer must resolve them.
- `--pimolu-glass-orb-1|2` are defined but unused by any component.

## Known token gaps (warnings, not breakage)
Components reference `--pimolu-success*`, `--pimolu-warning*`, `--pimolu-danger-hover`,
`--pimolu-danger-foreground` with hardcoded fallbacks; not defined by any theme or preset
(`--pimolu-danger` comes from `themes.json`). `--pimolu-info` does not exist.

## Planned direction
Visual tokens are now data. The remaining steps are to move the shared web component CSS
into a dedicated web layer (`packages/web-styles`) shared by React, Next, Electron, Angular
and CDN consumers, and to give `registry/native` its own components reading the same
generated data.
