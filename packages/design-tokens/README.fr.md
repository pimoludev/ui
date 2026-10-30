# @pimolu/design-tokens

**La matière première du système.**

Les tokens de design primitifs de Pimolu en variables CSS et JSON simple. Utilisez ce package quand vous avez besoin des données de design sans React, sans thèmes et sans styles de composants.

[Guide des thèmes](https://pimolu.com/docs/theming) · [Source](https://github.com/pimoludev/ui/tree/main/packages/design-tokens)

> **Bêta :** `0.1.0-beta.5` est une prévisualisation. Les noms publics des tokens peuvent évoluer avant `1.0.0`.

## Pourquoi les tokens Pimolu ?

- **Une source de vérité unique.** Les primitives de couleur, espacement, radius et typographie alimentent les thèmes, les presets et chaque composant.
- **CSS et données.** Utilisez les variables CSS générées dans une feuille, ou consommez les mêmes valeurs en JSON dans un build tool ou un pipeline de design.
- **Les thèmes sémantiques sont séparés.** Ce package définit les primitives. `@pimolu/themes` les associe aux rôles sémantiques clair et sombre.
- **Indépendant du framework.** Pas de React, pas de CSS de composant, aucune dépendance runtime.
- **Nommage stable.** Les variables CSS suivent `--pimolu-<catégorie>-<nom>` ; le JSON reprend la même arborescence.

## En bref

| | |
| --- | --- |
| Catégories | couleur, espacement, radius, taille de police, famille de police |
| Entrée CSS | `tokens.css` |
| Entrée de données | `tokens.json` |
| Variables CSS | primitives sur `:root` |
| Thèmes sémantiques | Fournis par `@pimolu/themes` |
| Dépendances | Aucune |

## Installation

```bash
pnpm add @pimolu/design-tokens@beta
```

## Utilisation en CSS

```css
@import "@pimolu/design-tokens/tokens.css";

.example {
  color: var(--pimolu-color-indigo-500);
  padding: var(--pimolu-spacing-4);
  border-radius: var(--pimolu-radius-md);
}
```

`tokens.css` définit les primitives sur `:root`. Pour les rôles sémantiques comme `background`, `primary` ou `surface-foreground`, utilisez `@pimolu/themes/styles.css` ou le CSS complet `@pimolu/web-styles/styles.css`.

## Utilisation comme données

`tokens.json` est un objet imbriqué simple avec des valeurs résolues :

```ts
// Avec les imports JSON activés dans votre toolchain
import tokens from "@pimolu/design-tokens/tokens.json";

tokens.color.indigo["500"]; // "#6366F1"
tokens.spacing["4"];        // 16
tokens.radius.md;           // 10
```

L'export est volontairement petit et facile à consommer. Ce n'est pas une feuille de composant et il ne contient pas les alias sémantiques des thèmes.

## La famille de packages

| Package | Rôle |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | Composants, hooks et layouts React |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | CSS complet, entrée en couches et CSS par composant |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Thèmes clair/sombre, sept presets et données visuelles |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Tokens primitifs en CSS et JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Utilitaire de classes de variantes indépendant du framework |

## Documentation et état

- [Guide des thèmes](https://pimolu.com/docs/theming)
- [Source et issues](https://github.com/pimoludev/ui)

Pimolu UI est en bêta. Les noms des tokens primitifs peuvent évoluer avant `1.0.0`. Pour une interface produit, associez ces tokens aux thèmes sémantiques et au CSS Pimolu plutôt que de reconstruire la couche composants.

MIT © Pimolu
