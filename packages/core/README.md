# @pimolu/core

**Predictable class names, without a runtime.**

A tiny, framework-independent utility for composing class names from named variants. `createVariants` returns a string. It does not generate CSS, inject styles or require React.

[Source](https://github.com/pimoludev/ui/tree/main/packages/core) · [Component docs](https://pimolu.com/components)

> **Beta:** `0.1.0-beta.6` is a preview.

## Why @pimolu/core?

- **Zero dependencies.** A small utility with no runtime, no CSS-in-JS and no build-time coupling.
- **Typed variants.** Infer a `VariantProps` type directly from the variant definition.
- **Deterministic output.** Class order is predictable, and an optional extra class is appended last.
- **Works beyond Pimolu.** Use it for any CSS architecture that wants named variants without a styling runtime.
- **The base of Pimolu components.** The same utility powers Pimolu's React variants.

## At a glance

| | |
| --- | --- |
| Export | `createVariants` |
| Types | `VariantProps` |
| Runtime dependencies | None |
| CSS generation | None |
| React required | No |
| Distribution | ESM + TypeScript declarations |

## Install

```bash
pnpm add @pimolu/core@beta
```

## Use

```ts
import { createVariants, type VariantProps } from "@pimolu/core";

const button = createVariants({
  base: "button",
  variants: {
    size: {
      sm: "button--sm",
      md: "button--md",
    },
    tone: {
      neutral: "button--neutral",
      primary: "button--primary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "neutral",
  },
});

type ButtonVariants = VariantProps<typeof button>;

const options: ButtonVariants = { size: "sm", tone: "primary" };

button(options);
// "button button--sm button--primary"

button({}, "checkout-button");
// "button button--md button--neutral checkout-button"
```

`createVariants` accepts:

| Option | Purpose |
| --- | --- |
| `base` | Always-applied class names |
| `variants` | Named groups of conditional classes |
| `defaultVariants` | Fallbacks when a variant is omitted |
| second argument | Extra class names appended to the result |

The utility does not know about CSS. Provide matching selectors in your own stylesheet, or use it alongside Pimolu's published styles.

## The package family

| Package | Role |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | React components, hooks and layouts |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | Plain CSS bundle, layered entry and per-component CSS |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Light/dark themes, seven presets and visual data |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Primitive tokens in CSS and JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Framework-independent variant class utility |

## Documentation and status

- [Component catalogue](https://pimolu.com/components)
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. The React registry is implemented; native, Angular and web-component registries are future directions. The core utility is intentionally small and has no Pimolu-specific runtime behavior.

MIT © Pimolu
