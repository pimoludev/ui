# @pimolu/design-tokens

**The raw material of the system.**

Pimolu's primitive design tokens as CSS variables and plain JSON. Use this package when you need the design data without React, themes or component styles.

[Theming guide](https://pimolu.com/docs/theming) · [Source](https://github.com/pimoludev/ui/tree/main/packages/design-tokens)

> **Beta:** `0.1.0-beta.5` is a preview. Public token names may change before `1.0.0`.

## Why Pimolu tokens?

- **A single source of truth.** Colour, spacing, radius and typography primitives feed the themes, presets and every component.
- **CSS and data.** Use the generated CSS variables in a stylesheet, or consume the same values as JSON in a build tool or design pipeline.
- **Semantic themes are separate.** This package defines the primitives. `@pimolu/themes` maps them to semantic light and dark roles.
- **Framework-independent.** No React, no component CSS, no runtime dependencies.
- **Stable naming.** CSS variables follow `--pimolu-<category>-<name>`; JSON mirrors the same tree.

## At a glance

| | |
| --- | --- |
| Categories | colour, spacing, radius, font size, font family |
| CSS entry | `tokens.css` |
| Data entry | `tokens.json` |
| CSS variables | `:root` primitives |
| Semantic themes | Provided by `@pimolu/themes` |
| Dependencies | None |

## Install

```bash
pnpm add @pimolu/design-tokens@beta
```

## Use in CSS

```css
@import "@pimolu/design-tokens/tokens.css";

.example {
  color: var(--pimolu-color-indigo-500);
  padding: var(--pimolu-spacing-4);
  border-radius: var(--pimolu-radius-md);
}
```

`tokens.css` defines primitives on `:root`. If you need semantic roles such as `background`, `primary` or `surface-foreground`, use `@pimolu/themes/styles.css` or the complete `@pimolu/web-styles/styles.css`.

## Use as data

`tokens.json` is a plain nested object with resolved values:

```ts
// With JSON imports enabled in your toolchain
import tokens from "@pimolu/design-tokens/tokens.json";

tokens.color.indigo["500"]; // "#6366F1"
tokens.spacing["4"];        // 16
tokens.radius.md;           // 10
```

The export is intentionally small and tool-friendly. It is not a component stylesheet and does not include semantic theme aliases.

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
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. Primitive token names may change before `1.0.0`. For product UI, pair these tokens with the semantic themes and Pimolu CSS rather than rebuilding the component layer.

MIT © Pimolu
