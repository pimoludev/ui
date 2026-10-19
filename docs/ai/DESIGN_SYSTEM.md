# Pimolu design system

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
  and semantic colours stay with the palette, so a brand colour cannot make text
  unreadable.

## Proposed art direction for Default

Default should be the calm and precise reference: readable slate neutrals,
indigo concentrated on primary actions, semantic success/warning/danger signals,
a sans-serif typeface, spacing rhythms drawn from the primitives and radii
consistent between controls and surfaces. Borders should be crisp, the shadow
discreet and reserved for hierarchy; hover, focus, pressed, disabled and invalid
states must stay recognisable in light, dark, keyboard and forced colors. Keep
the other presets expressive through their tokens rather than through component
branches.

The direction is a design proposal, not a complete visual validation. Before
freezing new values, compare the seven presets on the playground pages on desktop
and mobile, check the contrasts and keep reference captures. The project has no
automated visual tests today.

## Adding a preset

Create the palette and the visual JSON, keep light/dark in sync, register the
manual points (notably the theme type if a theme is added, and the playground
list), then run `pnpm build:all`, `pnpm audit:themes:strict`, the tests and a
visual review. Never edit `dist` by hand.
