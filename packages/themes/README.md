# @pimolu/themes

**The visual language, separated from the components.**

Pimolu's colour themes, seven style presets and platform-neutral visual data. Use this package to give a custom interface the same rhythm, depth and personality as Pimolu components, or to consume the theme data in your own tooling.

[Theming guide](https://pimolu.com/docs/theming) · [Customization](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/packages/themes)

> **Beta:** `0.1.0-beta.5` is a preview. Preset and token names may change before `1.0.0`.

## Why Pimolu themes?

- **Two colour modes, one semantic contract.** Light and dark expose the same semantic keys, so a component does not need per-mode markup.
- **Seven distinct presets.** `default`, `adaptive`, `cartoon`, `glass`, `luxury`, `monochrome` and `neo-brutalism` share structure without looking the same.
- **Platform-neutral data.** Colour palettes and visual tokens are plain JSON/TypeScript data, ready for web CSS today and other platforms later.
- **Data and CSS from one source.** The same preset data generates the web stylesheet and the exported `pimoluPresets` / `pimoluPresetVisuals` objects.
- **No runtime required.** Themes are applied through attributes and CSS variables. There is no theme calculation in JavaScript.

## At a glance

| | |
| --- | --- |
| Colour themes | `light`, `dark` |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| CSS entries | `styles.css`, `presets.css` |
| Data entries | `presets`, `visuals`, `themes.json` |
| Visual tokens | borders, shadows, radii, typography, press effects |
| Distribution | ESM + TypeScript declarations, plain CSS, JSON |

## Install

```bash
pnpm add @pimolu/themes@beta
```

## Use in a web application

Import the semantic themes and preset styles once:

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
```

Choose a colour mode and preset on a containing element:

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Your interface -->
</div>
```

For a React application using Pimolu components, prefer `@pimolu/web-styles/styles.css` and set `defaultTheme` / `defaultStylePreset` on `PimoluProvider`. The Provider keeps DOM attributes, system preference and user choices in sync.

## Presets

| Preset | Character |
| --- | --- |
| `default` | The neutral Pimolu baseline |
| `adaptive` | A default-compatible palette with adaptive accents |
| `cartoon` | Bolder silhouettes and playful depth |
| `glass` | Translucent surfaces and soft elevation |
| `luxury` | Restrained contrast and refined detail |
| `monochrome` | A low-chroma, editorial system |
| `neo-brutalism` | Hard edges, offset shadows and direct contrast |

Preset names are public. Describe a preset by its tokens in your own product rather than relying on a fixed mood.

## Use as data

```ts
import { pimoluPresets } from "@pimolu/themes/presets";
import { pimoluPresetVisuals } from "@pimolu/themes/visuals";
import themes from "@pimolu/themes/themes.json";

pimoluPresets.glass;
pimoluPresetVisuals.glass;
themes.light.primary;
```

`pimoluPresets` contains the six generated preset palettes; `default` is represented by the resolved themes. `pimoluPresetVisuals` contains all seven visual token sets. Both JavaScript entries ship TypeScript declarations. `themes.json` contains the resolved light and dark semantic themes.

Each preset is defined by a colour palette in `src/presets/<name>.json` and a visual token set in `src/visual/<name>.json`. The web CSS is generated from those sources.

## The package family

| Package | Role |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | React components, hooks and layouts |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | Plain CSS bundle, layered entry and per-component CSS |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Light/dark themes, seven presets and visual data |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Primitive tokens in CSS and JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Framework-independent variant class utility |

## Documentation and status

- [Theming guide](https://pimolu.com/docs/theming)
- [Customization contract](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md)
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. Preset and token names may change before `1.0.0`. Native, Angular and web-component registries are future directions, not current packages.

MIT © Pimolu
