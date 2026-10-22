# @pimolu/core

Utilitaires de variantes de classes, indépendants du framework, utilisés par Pimolu UI.

> **0.1.0-beta.1** — version de prévisualisation.

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

Le package est ESM uniquement et n'a aucune dépendance d'exécution.

Documentation : <https://github.com/pimoludev/ui>

MIT © Pimolu
