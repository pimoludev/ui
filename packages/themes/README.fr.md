# @pimolu/themes

Les thèmes de couleurs clairs et sombres de Pimolu, ses presets visuels et ses données de style indépendantes de la plateforme. Utilisez ce package pour créer des interfaces sur la même base visuelle que les composants Pimolu.

> **0.1.0-beta.2** est une version de prévisualisation. Les noms des presets et des tokens peuvent évoluer avant la version 1.0.

## Installation

```bash
pnpm add @pimolu/themes@beta
```

## Utilisation sur le Web

Importez les couleurs sémantiques et les styles des presets dans votre CSS global :

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
```

Choisissez ensuite un mode et un preset sur un élément parent :

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Votre contenu -->
</div>
```

Presets disponibles : `default`, `adaptive`, `cartoon`, `glass`, `luxury`, `monochrome` et `neo-brutalism`. `adaptive` est une option ; il ne remplace pas `default`. Dans une application React avec les composants Pimolu, importez plutôt `@pimolu/web-styles/styles.css` et définissez ces préférences avec `PimoluProvider`.

## Utilisation comme données

`@pimolu/themes/presets` exporte `pimoluPresets` (palettes générées, hors `default`). `@pimolu/themes/visuals` exporte `pimoluPresetVisuals` pour les bordures, ombres, rayons, typographies et effets d'appui. Ces deux entrées fournissent des déclarations TypeScript. `@pimolu/themes/themes.json` contient les thèmes sémantiques clairs et sombres résolus.

## Liens

[Guide des thèmes](https://pimolu.com/docs/theming) · [Tous les packages npm](https://www.npmjs.com/org/pimolu) · [Code source](https://github.com/pimoludev/ui/tree/main/packages/themes)

MIT © Pimolu
