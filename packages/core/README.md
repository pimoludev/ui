# @pimolu/core

A small, framework-independent utility for composing CSS classes from named variants. It is useful when your components need predictable class names without a CSS-in-JS runtime.

> **0.1.0-beta.3** is a preview release.

## Install

```bash
pnpm add @pimolu/core@beta
```

## Use

```ts
import { createVariants, type VariantProps } from "@pimolu/core";

const buttonClass = createVariants({
  base: "pimolu-button",
  variants: {
    size: {
      sm: "pimolu-button--sm",
      md: "pimolu-button--md",
    },
  },
  defaultVariants: { size: "md" },
});

type ButtonVariants = VariantProps<typeof buttonClass>;

const options: ButtonVariants = { size: "sm" };
buttonClass(options); // "pimolu-button pimolu-button--sm"
buttonClass({}, "my-class"); // "pimolu-button pimolu-button--md my-class"
```

`createVariants` returns a class-name string. It has no runtime dependencies and does not generate CSS: provide the matching styles yourself, or use Pimolu's published styles with Pimolu components.

## Links

[Component documentation](https://pimolu.com/components) · [All npm packages](https://www.npmjs.com/org/pimolu) · [Source](https://github.com/pimoludev/ui/tree/main/packages/core)

MIT © Pimolu
