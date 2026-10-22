# @pimolu/react

Composants React accessibles pour Pimolu UI, construits sur du CSS simple et des tokens sémantiques.

> **0.1.0-beta.1** — version de prévisualisation. L'API publique des composants peut encore évoluer.

## Installation

```bash
pnpm add @pimolu/react @pimolu/web-styles
```

`react` et `react-dom` 18 ou 19 sont des dépendances homologues.

## Utilisation

```tsx
import { Button, PimoluProvider } from "@pimolu/react";
import "@pimolu/web-styles/styles.css";

export function App() {
  return (
    <PimoluProvider theme="light" stylePreset="default">
      <Button>Essayer Pimolu</Button>
    </PimoluProvider>
  );
}
```

Le package est ESM uniquement, fournit un bundle unique tree-shakeable avec ses
déclarations et inclut la directive `"use client"` pour les React Server
Components. La feuille de style complète s'importe séparément depuis
`@pimolu/web-styles`.

La bêta 0.1 contient 129 familles de composants. Consultez le site de
documentation pour les props, les exemples live et les notes d'accessibilité.

Documentation : <https://github.com/pimoludev/ui>

MIT © Pimolu
