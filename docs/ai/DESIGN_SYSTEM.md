# Pimolu design system

Positioning, identity grammar, preset direction and the Identity Kit are defined
in [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md). This document remains the source
of truth for the token and preset architecture.

## Sources of truth

- Primitives: `packages/design-tokens/src/tokens.json` (colours, spacing,
  radii, sizes and font family).
- Light/dark semantic aliases: `packages/themes/src/themes.json`. Keys must be
  identical in both modes and every `{color.*}` reference must resolve to a
  primitive.
- Default preset: palette derived from the aliases by
  `packages/themes/scripts/build-default.mjs`; visual tokens in
  `packages/themes/src/visual/default.json`.
- Other presets: palettes in `packages/themes/src/presets/<name>.json` and
  visual values in `packages/themes/src/visual/<name>.json`.
- Shared CSS defaults and web exceptions: `packages/themes/style-base.css`,
  `style-glass.css`, `style-luxury.css`. Component internals stay in
  `packages/web-styles/src/`.

`build:presets` validates the name, the required keys, light/dark parity and the
palette colours. `build:visuals` produces CSS and JavaScript exports
(`pimoluPresetVisuals`), usable as data on a future native platform.
`pnpm audit:themes` checks the integration points and the missing variables.
`system` follows `prefers-color-scheme` in the generated CSS. The provider can
persist preferences when `persist` is enabled; read
`registry/react/provider/pimolu-provider.tsx` before changing that logic.

## Dimensions independent of the preset

- **Radius**: `packages/themes/radius.css` redefines the three radius tokens
  under `data-pimolu-radius="sharp" | "medium" | "round"`. Imported after the
  generated visuals, so an explicit choice wins over the preset.
- **Density**: `packages/themes/density.css` multiplies box metrics by
  `0.875 / 1 / 1.125` under `data-pimolu-density`. It never changes the font,
  the icons or the radii: density makes a form denser, not smaller to read.
  Contract and variable map in [Density](DENSITY.md).
- **Brand colour**: `PimoluProvider` accepts a `#RRGGBB` value and overrides
  only `primary`, its derived hover and the focus ring. Foregrounds, surfaces
  and semantic colours stay with the palette. The provider does not recalculate
  the foreground: a custom brand colour requires its own text, hover and focus
  contrast checks.

## Default: restored colors, current design

Npm beta.8 ships the restored slate/indigo Default, after the beta.7 Ink & Signal
preview. Default uses the palette from commit
`f01aca89fddeae45df523d90996ff492da3e0abb` in both modes, retaining the newer
shape, typography, spacing, motion and layouts.
Dark background is `#020617`, surface `#0F172A`, muted `#1E293B` and primary
`#818CF8`; light background is white, surface `#F8FAFC` and primary `#4F46E5`.
This palette is published in beta.8.

The original semantic aliases are restored in `themes.json`, with one contrast
correction: light muted text uses the additive `slate.550` (`#607087`) rather than
historical `slate.500` (`#64748B`), which fell below 4.5:1 on the muted surface.
Existing primitives remain available. Newer functional borders use slate.500;
soft accent roles pair muted surfaces with the matching primary foreground.
Shape/type roles remain in `src/visual/default.json`. The other named palettes
keep their values. The website, standalone previews, palette explorer and
Playground all read shared generated tokens, with no website-only palette.

`border` is decorative. `control-border` identifies necessary field boundaries;
`primary-soft` / `primary-soft-foreground` form a paired accent surface. Controls
consume the strong border with a fallback to `border`. Default uses 10px/16px
control/surface radii; the radius dimension still wins when explicitly set.
Font roles have system fallbacks; only the apps load optional self-hosted fonts.

See the versioned Playground Design Lab for real, interactive comparisons.
The optional local `/design-preview` route, its adapter and its route-specific
browser checks are grouped in `apps/website/app/design-preview/`, ignored by Git.
A fresh clone does not contain this page. Git ignore is not a Next.js build
exclusion: local builds include the route while its folder is present.
Implementation is not a claim that the full quality audit is complete. Production
catalogue illustrations are regenerated when their theme changes; they are not
golden regression baselines. The release baseline stays at beta.7, and references
affected by the shared palette carry Updated until a later release.

## Adding a preset

Create the palette and the visual JSON, keep light/dark in sync, register the
manual points (notably the theme type if a theme is added, and the playground
list), then run `pnpm build:all`, `pnpm audit:themes:strict`, the tests and a
visual review. Never edit `dist` by hand.
