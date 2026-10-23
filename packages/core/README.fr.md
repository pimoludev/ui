# @pimolu/core

Un petit utilitaire indépendant du framework pour composer des classes CSS à partir de variantes nommées. Il permet d'obtenir des noms de classes prévisibles sans runtime CSS-in-JS.

> **0.1.0-beta.2** est une version de prévisualisation.

## Installation

```bash
pnpm add @pimolu/core@beta
```

## Utilisation

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

`createVariants` renvoie une chaîne de classes. Le package n'a aucune dépendance d'exécution et ne génère pas de CSS : fournissez les styles correspondants ou utilisez les styles publiés avec les composants Pimolu.

## Liens

[Documentation des composants](https://pimolu.com/components) · [Tous les packages npm](https://www.npmjs.com/org/pimolu) · [Code source](https://github.com/pimoludev/ui/tree/main/packages/core)

MIT © Pimolu
