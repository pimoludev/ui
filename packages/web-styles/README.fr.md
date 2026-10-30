# @pimolu/web-styles

**Un langage visuel, exprimé en CSS natif.**

La couche de style derrière Pimolu UI. Chargez une feuille complète, optez pour des couches CSS prévisibles, ou assemblez uniquement le CSS des composants utilisés. Aucune dépendance à Tailwind, aucun runtime CSS-in-JS.

[Démarrage rapide](https://pimolu.com/docs/quick-start) · [Thèmes](https://pimolu.com/docs/theming) · [Personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/packages/web-styles)

> **Bêta :** `0.1.0-beta.6` est une prévisualisation. Les entrées CSS publiques et les tokens visuels peuvent évoluer avant `1.0.0`.

## Pourquoi les styles Pimolu ?

- **Un import, le système complet.** `styles.css` combine les tokens primitifs, les thèmes sémantiques, les sept presets et chaque feuille de composant.
- **Des surcharges sans `!important`.** `layered.css` place la bibliothèque dans une couche `pimolu` pour que les règles applicatives et les utilitaires Tailwind gagnent de façon prévisible.
- **Le CSS par composant quand vous en avez besoin.** Chaque famille possède un sous-chemin CSS exporté : une petite application peut charger seulement les fondations et les contrôles utilisés.
- **CSS natif, zéro runtime.** Aucun calcul de style en JavaScript et aucun nom de classe généré. Les changements de thème passent par des attributs.
- **Des versions alignées.** Le CSS et React sont publiés à la même version. Gardez-les ensemble.

## En bref

| | |
| --- | --- |
| Entrées | `styles.css`, `layered.css`, `pimolu.min.css` |
| Styles de composants | 129 sous-chemins CSS exportés |
| Fondations | Tokens, thèmes sémantiques, sept presets visuels |
| Thèmes | Clair et sombre, y compris la préférence système via le Provider |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Runtime | Aucun — Tailwind ou CSS-in-JS non requis |

## Installation

```bash
pnpm add @pimolu/web-styles@beta
```

Vous utilisez aussi les composants React ?

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

## Feuille complète

Importez-la une fois au point d'entrée de l'application :

```css
@import "@pimolu/web-styles/styles.css";
```

Définissez ensuite le mode de couleur et le preset sur un conteneur, ou laissez `PimoluProvider` le faire :

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <!-- Votre application -->
</div>
```

Une version minifiée est disponible :

```css
@import "@pimolu/web-styles/pimolu.min.css";
```

## Des surcharges prévisibles

Utilisez l'entrée en couches quand le CSS applicatif doit surcharger Pimolu sans escalade de spécificité :

```css
@import "@pimolu/web-styles/layered.css";

.checkout-action:hover:enabled {
  background: var(--pimolu-success);
  color: var(--pimolu-success-foreground);
}
```

Importez `styles.css` ou `layered.css`, pas les deux. Avec Tailwind v4, déclarez l'ordre complet des couches avant l'un ou l'autre :

```css
@layer theme, base, pimolu, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "@pimolu/web-styles/layered.css";
@import "tailwindcss/utilities.css" layer(utilities);
```

Le contrat de personnalisation couvre les hooks de panneaux, le scope des portails et les responsabilités d'accessibilité.

## Assembler uniquement le nécessaire

Installez les fondations et importez le CSS des composants utilisés :

```bash
pnpm add @pimolu/web-styles@beta @pimolu/themes@beta
```

```css
@import "@pimolu/themes/styles.css";
@import "@pimolu/themes/presets.css";
@import "@pimolu/web-styles/button.css";
@import "@pimolu/web-styles/input.css";
@import "@pimolu/web-styles/card.css";
```

Chaque famille possède son sous-chemin, de `accordion.css` à `watermark.css`. Gardez les versions CSS et React alignées.

## La famille de packages

| Package | Rôle |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | Composants, hooks et layouts React |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | CSS complet, entrée en couches et CSS par composant |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Thèmes clair/sombre, sept presets et données visuelles |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Tokens primitifs en CSS et JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Utilitaire de classes de variantes indépendant du framework |

## Documentation et état

- [Démarrage rapide](https://pimolu.com/docs/quick-start)
- [Thèmes et presets](https://pimolu.com/docs/theming)
- [Contrat de personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md)
- [Source et issues](https://github.com/pimoludev/ui)

Pimolu UI est en bêta. Le registre React est implémenté ; les registres native, Angular et web components sont des directions futures. La revue visuelle et d'assistance technique complète reste ouverte.

MIT © Pimolu
