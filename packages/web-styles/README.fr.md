# @pimolu/web-styles

La couche CSS de Pimolu UI. Elle réunit les tokens, les thèmes de couleurs, les presets visuels et les styles des familles de composants React. Aucun runtime Tailwind ou CSS-in-JS n'est nécessaire.

> **0.1.0-beta.3** est une version de prévisualisation.

## Installation

```bash
pnpm add @pimolu/web-styles@beta
```

## Charger la feuille complète

Importez-la une fois dans le CSS global de votre application :

```css
@import "@pimolu/web-styles/styles.css";
```

Cette entrée inclut les tokens communs, les thèmes, les presets et toutes les feuilles des composants. C'est l'option la plus simple avec `@pimolu/react`. Une version minifiée est exportée sous `@pimolu/web-styles/pimolu.min.css`.

## Charger les styles par composant

Pour composer manuellement une feuille plus légère, installez aussi `@pimolu/themes@beta` et importez les fondations avant les composants utilisés :

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
@import "@pimolu/web-styles/button.css";
@import "@pimolu/web-styles/input.css";
```

Chaque feuille de composant est un sous-chemin exporté du package ; consultez les [exports du package](https://github.com/pimoludev/ui/blob/main/packages/web-styles/package.json) pour la liste complète. Conservez la même version pour le CSS et `@pimolu/react`.

## Liens

[Démarrage rapide](https://pimolu.com/docs/quick-start) · [Tous les packages npm](https://www.npmjs.com/org/pimolu) · [Code source](https://github.com/pimoludev/ui/tree/main/packages/web-styles)

MIT © Pimolu
