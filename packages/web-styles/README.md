# @pimolu/web-styles

The plain CSS layer for Pimolu UI. It combines design tokens, colour themes, visual presets and styles for the React component families. No Tailwind or CSS-in-JS runtime is required.

> **0.1.0-beta.3** is a preview release.

## Install

```bash
pnpm add @pimolu/web-styles@beta
```

## Load the complete stylesheet

Import it once in your application's global CSS:

```css
@import "@pimolu/web-styles/styles.css";
```

This entry includes the shared tokens, themes, presets and every component stylesheet. It is the simplest option with `@pimolu/react`. A minified alternative is exported as `@pimolu/web-styles/pimolu.min.css`.

## Load individual component styles

For a smaller, manually assembled stylesheet, install `@pimolu/themes@beta` too and import the foundations before the components you use:

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
@import "@pimolu/web-styles/button.css";
@import "@pimolu/web-styles/input.css";
```

Each component CSS file is an exported package subpath; check the [package exports](https://github.com/pimoludev/ui/blob/main/packages/web-styles/package.json) for the complete list. Keep the CSS and `@pimolu/react` versions aligned.

## Links

[Quick start](https://pimolu.com/docs/quick-start) · [All npm packages](https://www.npmjs.com/org/pimolu) · [Source](https://github.com/pimoludev/ui/tree/main/packages/web-styles)

MIT © Pimolu
