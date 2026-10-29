# @pimolu/core

**Des noms de classes prévisibles, sans runtime.**

Un petit utilitaire indépendant du framework pour composer des noms de classes à partir de variantes nommées. `createVariants` renvoie une chaîne. Il ne génère pas de CSS, n'injecte pas de styles et ne nécessite pas React.

[Source](https://github.com/pimoludev/ui/tree/main/packages/core) · [Composants](https://pimolu.com/components)

> **Bêta :** `0.1.0-beta.4` est une prévisualisation.

## Pourquoi @pimolu/core ?

- **Zéro dépendance.** Un petit utilitaire sans runtime, sans CSS-in-JS et sans couplage au build.
- **Variantes typées.** Déduisez un type `VariantProps` directement depuis la définition des variantes.
- **Sortie déterministe.** L'ordre des classes est prévisible et une classe supplémentaire est ajoutée en dernier.
- **Utilisable au-delà de Pimolu.** Employez-le avec n'importe quelle architecture CSS qui veut des variantes nommées sans runtime de style.
- **La base des composants Pimolu.** Le même utilitaire alimente les variantes React de Pimolu.

## En bref

| | |
| --- | --- |
| Export | `createVariants` |
| Types | `VariantProps` |
| Dépendances runtime | Aucune |
| Génération CSS | Aucune |
| React requis | Non |
| Distribution | ESM + déclarations TypeScript |

## Installation

```bash
pnpm add @pimolu/core@beta
```

## Utilisation

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

`createVariants` accepte :

| Option | Rôle |
| --- | --- |
| `base` | Classes toujours appliquées |
| `variants` | Groupes nommés de classes conditionnelles |
| `defaultVariants` | Valeurs de repli quand une variante est omise |
| second argument | Classes supplémentaires ajoutées au résultat |

L'utilitaire ne connaît pas le CSS. Fournissez les sélecteurs correspondants dans votre feuille, ou utilisez-le avec les styles publiés de Pimolu.

## La famille de packages

| Package | Rôle |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | Composants, hooks et layouts React |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | CSS complet, entrée en couches et CSS par composant |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Thèmes clair/sombre, sept presets et données visuelles |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Tokens primitifs en CSS et JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Utilitaire de classes de variantes indépendant du framework |

## Documentation et état

- [Catalogue de composants](https://pimolu.com/components)
- [Source et issues](https://github.com/pimoludev/ui)

Pimolu UI est en bêta. Le registre React est implémenté ; les registres native, Angular et web components sont des directions futures. L'utilitaire core est volontairement petit et sans comportement runtime spécifique à Pimolu.

MIT © Pimolu
