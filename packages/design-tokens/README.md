# @pimolu/design-tokens

The raw materials of Pimolu UI: colour, spacing, radius and typography tokens in CSS and JSON. Use this package when you need the design data without React or component styles.

> **0.1.0-beta.3** is a preview release. Public token names may change before 1.0.

## Install

```bash
pnpm add @pimolu/design-tokens@beta
```

## Use in CSS

Import the stylesheet once in your global CSS entry:

```css
@import "@pimolu/design-tokens/tokens.css";

.example {
  color: var(--pimolu-color-indigo-500);
  padding: var(--pimolu-spacing-4);
}
```

`tokens.css` defines primitives on `:root`. The semantic light and dark colours live in `@pimolu/themes`; the complete React setup can instead import `@pimolu/web-styles/styles.css` once.

## Use as data

`@pimolu/design-tokens/tokens.json` exports the source token tree for build tools. For example, `tokens.color.indigo["500"].$value.hex` is `#6366F1`. The JSON follows the Design Tokens Community Group format; configure your toolchain's JSON import support before importing it from JavaScript.

## Links

[Documentation](https://pimolu.com/docs/theming) · [All npm packages](https://www.npmjs.com/org/pimolu) · [Source](https://github.com/pimoludev/ui/tree/main/packages/design-tokens)

MIT © Pimolu
