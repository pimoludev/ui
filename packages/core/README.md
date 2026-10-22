# @pimolu/core

Framework-agnostic class variant utilities used by Pimolu UI.

> **0.1.0-beta.1** — preview release.

```bash
pnpm add @pimolu/core
```

```ts
import { createVariants, type VariantProps } from "@pimolu/core";

const button = createVariants({
  base: "pimolu-button",
  variants: {
    size: { sm: "pimolu-button--sm", md: "pimolu-button--md" },
  },
  defaultVariants: { size: "md" },
});

button({ size: "sm" }); // "pimolu-button pimolu-button--sm"
```

The package is ESM-only and has no runtime dependency.

Documentation: <https://github.com/pimoludev/ui>

MIT © Pimolu
