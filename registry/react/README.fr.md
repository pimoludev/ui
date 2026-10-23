# @pimolu/react

Composants React accessibles, hooks et layouts d'application fondés sur le design system commun de Pimolu. La bêta contient 129 familles, de Button et Form à DataGrid et DashboardLayout.

> **0.1.0-beta.2** est une version de prévisualisation. Les API des composants peuvent évoluer avant la version 1.0.

## Installation

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

React et React DOM 18 ou 19 sont des dépendances homologues. Le CSS est publié séparément pour être chargé une seule fois par l'application.

## Utilisation

Dans la feuille globale (par exemple `app/globals.css` avec Next.js) :

```css
@import "@pimolu/web-styles/styles.css";
```

Dans un composant client :

```tsx
"use client";

import { Button, PimoluProvider } from "@pimolu/react";

export function App() {
  return (
    <PimoluProvider defaultTheme="system" defaultStylePreset="default">
      <Button onClick={() => alert("Bienvenue dans Pimolu")}>
        Essayer Pimolu
      </Button>
    </PimoluProvider>
  );
}
```

`PimoluProvider` définit le mode de couleur et le preset visuel. Les composants utilisent les variables CSS Pimolu ; adaptez les préférences du provider ou les tokens sémantiques à votre produit. Le package est en ESM uniquement et son entrée inclut `"use client"` pour les environnements React Server Components.

Explorez le [catalogue des composants](https://pimolu.com/components) pour les exemples interactifs, les tableaux d'API et les notes d'accessibilité, ou suivez le [démarrage rapide](https://pimolu.com/docs/quick-start) pour configurer une application.

## Liens

[Tous les packages npm](https://www.npmjs.com/org/pimolu) · [Code source](https://github.com/pimoludev/ui/tree/main/registry/react) · [Signaler un problème](https://github.com/pimoludev/ui/issues)

MIT © Pimolu
