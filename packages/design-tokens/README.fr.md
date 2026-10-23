# @pimolu/design-tokens

Les éléments de base de Pimolu UI : couleurs, espacements, rayons et typographie sous forme de CSS et de JSON. Utilisez ce package pour accéder aux données du design sans React ni styles de composants.

> **0.1.0-beta.2** est une version de prévisualisation. Les noms publics des tokens peuvent évoluer avant la version 1.0.

## Installation

```bash
pnpm add @pimolu/design-tokens@beta
```

## Utilisation en CSS

Importez la feuille une fois dans votre CSS global :

```css
@import "@pimolu/design-tokens/tokens.css";

.exemple {
  color: var(--pimolu-color-indigo-500);
  padding: var(--pimolu-spacing-4);
}
```

`tokens.css` définit les primitives sur `:root`. Les couleurs sémantiques claires et sombres se trouvent dans `@pimolu/themes` ; une application React complète peut simplement importer `@pimolu/web-styles/styles.css` une fois.

## Utilisation comme données

`@pimolu/design-tokens/tokens.json` expose l'arbre des tokens pour les outils de build. Par exemple, `tokens.color.indigo["500"].$value.hex` vaut `#6366F1`. Le JSON suit le format du Design Tokens Community Group ; configurez la prise en charge des imports JSON dans votre outillage avant de l'importer en JavaScript.

## Liens

[Documentation](https://pimolu.com/docs/theming) · [Tous les packages npm](https://www.npmjs.com/org/pimolu) · [Code source](https://github.com/pimoludev/ui/tree/main/packages/design-tokens)

MIT © Pimolu
