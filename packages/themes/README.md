# @pimolu/themes

Pimolu's light and dark colour themes, visual presets and platform-neutral style data. Use this package to build custom interfaces with the same visual language as Pimolu components.

> **0.1.0-beta.3** is a preview release. Preset and token names may change before 1.0.

## Install

```bash
pnpm add @pimolu/themes@beta
```

## Use in a web app

Import both the semantic colours and the preset styles in your global CSS:

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
```

Then choose a colour mode and style preset on a containing element:

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Your content -->
</div>
```

Available presets: `default`, `adaptive`, `cartoon`, `glass`, `luxury`, `monochrome` and `neo-brutalism`. `adaptive` is available as an option; it does not replace `default`. For a React application using Pimolu components, import `@pimolu/web-styles/styles.css` and set these preferences through `PimoluProvider` instead.

## Use as data

`@pimolu/themes/presets` exports `pimoluPresets` (generated colour palettes except `default`). `@pimolu/themes/visuals` exports `pimoluPresetVisuals` for borders, shadows, radii, typography and press effects. Both entries include TypeScript declarations. `@pimolu/themes/themes.json` provides the resolved light and dark semantic themes.

## Links

[Theming guide](https://pimolu.com/docs/theming) · [All npm packages](https://www.npmjs.com/org/pimolu) · [Source](https://github.com/pimoludev/ui/tree/main/packages/themes)

MIT © Pimolu
