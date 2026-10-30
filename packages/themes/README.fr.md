# @pimolu/themes

**Le langage visuel, séparé des composants.**

Les thèmes de couleur, sept presets de style et les données visuelles neutres de Pimolu. Utilisez ce package pour donner à une interface personnalisée le même rythme, la même profondeur et la même personnalité que les composants Pimolu, ou pour consommer les données de thème dans vos propres outils.

[Guide des thèmes](https://pimolu.com/docs/theming) · [Personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/packages/themes)

> **Bêta :** `0.1.0-beta.6` est une prévisualisation. Les noms des presets et des tokens peuvent évoluer avant `1.0.0`.

## Pourquoi les thèmes Pimolu ?

- **Deux modes de couleur, un contrat sémantique.** Clair et sombre exposent les mêmes clés sémantiques : un composant n'a pas besoin de markup spécifique par mode.
- **Sept presets distincts.** `default`, `adaptive`, `cartoon`, `glass`, `luxury`, `monochrome` et `neo-brutalism` partagent une structure sans se ressembler.
- **Des données neutres.** Les palettes et tokens visuels sont des données JSON/TypeScript, prêtes pour le CSS web aujourd'hui et d'autres plateformes plus tard.
- **Données et CSS depuis une source unique.** Les mêmes presets génèrent la feuille web et les objets `pimoluPresets` / `pimoluPresetVisuals`.
- **Aucun runtime requis.** Les thèmes s'appliquent par attributs et variables CSS. Aucun calcul de thème en JavaScript.

## En bref

| | |
| --- | --- |
| Thèmes de couleur | `light`, `dark` |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Entrées CSS | `styles.css`, `presets.css` |
| Entrées de données | `presets`, `visuals`, `themes.json` |
| Tokens visuels | bordures, ombres, radius, typographie, effets de pression |
| Distribution | ESM + déclarations TypeScript, CSS natif, JSON |

## Installation

```bash
pnpm add @pimolu/themes@beta
```

## Utilisation dans une application web

Importez les thèmes sémantiques et les styles de presets une fois :

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
```

Choisissez un mode de couleur et un preset sur un élément conteneur :

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Votre interface -->
</div>
```

Pour une application React avec les composants Pimolu, préférez `@pimolu/web-styles/styles.css` et réglez `defaultTheme` / `defaultStylePreset` sur `PimoluProvider`. Le Provider synchronise les attributs DOM, la préférence système et les choix utilisateur.

## Presets

| Preset | Caractère |
| --- | --- |
| `default` | La base neutre de Pimolu |
| `adaptive` | Une palette compatible avec les accents adaptatifs |
| `cartoon` | Des silhouettes plus franches et une profondeur ludique |
| `glass` | Des surfaces translucides et une élévation douce |
| `luxury` | Un contraste retenu et un détail raffiné |
| `monochrome` | Un système éditorial à faible chroma |
| `neo-brutalism` | Des angles durs, des ombres décalées et un contraste direct |

Les noms des presets sont publics. Décrivez un preset par ses tokens dans votre produit plutôt que par une humeur figée.

## Utilisation comme données

```ts
import { pimoluPresets } from "@pimolu/themes/presets";
import { pimoluPresetVisuals } from "@pimolu/themes/visuals";
import themes from "@pimolu/themes/themes.json";

pimoluPresets.glass;
pimoluPresetVisuals.glass;
themes.light.primary;
```

`pimoluPresets` contient les six palettes de presets générées ; `default` est représenté par les thèmes résolus. `pimoluPresetVisuals` contient les sept ensembles de tokens visuels. Les deux entrées JavaScript incluent les déclarations TypeScript. `themes.json` contient les thèmes sémantiques clair et sombre résolus.

Chaque preset est défini par une palette dans `src/presets/<name>.json` et un ensemble de tokens visuels dans `src/visual/<name>.json`. Le CSS web est généré depuis ces sources.

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
- [Contrat de personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md)
- [Source et issues](https://github.com/pimoludev/ui)

Pimolu UI est en bêta. Les noms des presets et des tokens peuvent évoluer avant `1.0.0`. Les registres native, Angular et web components sont des directions futures, pas des packages actuels.

MIT © Pimolu
