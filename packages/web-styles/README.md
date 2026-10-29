# @pimolu/web-styles

**One visual language, expressed in plain CSS.**

The styling layer behind Pimolu UI. Load one complete stylesheet, opt into predictable cascade layers, or assemble only the component CSS your application uses. No Tailwind requirement and no CSS-in-JS runtime.

[Quick start](https://pimolu.com/docs/quick-start) · [Theming](https://pimolu.com/docs/theming) · [Customization](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/packages/web-styles)

> **Beta:** `0.1.0-beta.4` is a preview. Public CSS entry points and visual tokens may change before `1.0.0`.

## Why Pimolu styles?

- **One import, the complete system.** `styles.css` combines primitive tokens, semantic themes, all seven presets and every component stylesheet.
- **Overrides without `!important`.** `layered.css` places the library in a `pimolu` cascade layer so normal application rules and Tailwind utilities can win predictably.
- **Component-level CSS when you need it.** Every family has an exported CSS subpath, so a small application can load only the foundations and controls it uses.
- **Plain CSS, zero runtime.** No style calculations in JavaScript and no generated class names. Theme changes are attribute-driven.
- **Aligned releases.** The CSS and React packages ship at the same version. Keep them together.

## At a glance

| | |
| --- | --- |
| Entries | `styles.css`, `layered.css`, `pimolu.min.css` |
| Component styles | 129 exported CSS subpaths |
| Foundations | Tokens, semantic themes, seven visual presets |
| Themes | Light and dark, including system preference through the Provider |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Runtime | None — no Tailwind or CSS-in-JS required |

## Install

```bash
pnpm add @pimolu/web-styles@beta
```

Using React components as well?

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

## Complete stylesheet

Import it once in your application entry:

```css
@import "@pimolu/web-styles/styles.css";
```

Then set the colour mode and preset on a container, or let `PimoluProvider` do it:

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Your application -->
</div>
```

A pre-minified build is available as:

```css
@import "@pimolu/web-styles/pimolu.min.css";
```

## Predictable overrides

Use the layered entry when application CSS must override Pimolu without specificity escalation:

```css
@import "@pimolu/web-styles/layered.css";

.checkout-action:hover:enabled {
  background: var(--pimolu-success);
  color: var(--pimolu-success-foreground);
}
```

Import either `styles.css` or `layered.css`, not both. With Tailwind v4, declare the complete layer order before importing either entry:

```css
@layer theme, base, pimolu, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "@pimolu/web-styles/layered.css";
@import "tailwindcss/utilities.css" layer(utilities);
```

The customization contract covers panel hooks, portal scope and accessibility responsibilities.

## Assemble only what you use

Install the foundations package and import the component CSS you need:

```bash
pnpm add @pimolu/web-styles@beta @pimolu/themes@beta
```

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
@import "@pimolu/web-styles/button.css";
@import "@pimolu/web-styles/input.css";
@import "@pimolu/web-styles/card.css";
```

Each family has its own exported subpath, from `accordion.css` to `watermark.css`. Keep CSS and React versions aligned.

## The package family

| Package | Role |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | React components, hooks and layouts |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | Plain CSS bundle, layered entry and per-component CSS |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Light/dark themes, seven presets and visual data |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Primitive tokens in CSS and JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Framework-independent variant class utility |

## Documentation and status

- [Quick start](https://pimolu.com/docs/quick-start)
- [Theming and presets](https://pimolu.com/docs/theming)
- [Customization contract](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md)
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. The React registry is implemented; native, Angular and web-component registries are future directions. The full visual and assistive-technology audit remains open.

MIT © Pimolu
