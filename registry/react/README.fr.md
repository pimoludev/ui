# @pimolu/react

**Un système. Votre signature.**

Une bibliothèque de composants React pilotée par les tokens, pensée pour les interfaces qui doivent sembler intentionnelles. Pimolu fournit 129 familles de composants, sept presets visuels, des thèmes clair et sombre et une personnalisation typée par parties, sans runtime CSS-in-JS.

[Documentation](https://pimolu.com/components) · [Démarrage rapide](https://pimolu.com/docs/quick-start) · [Personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/registry/react)

> **Bêta :** `0.1.0-beta.5` est une prévisualisation. Les API des composants et les tokens visuels peuvent évoluer avant `1.0.0`.

## Pourquoi Pimolu ?

- **Un système, pas une collection de contrôles.** Toutes les familles partagent le même langage de tokens, thèmes et presets. Changez le preset, toute l'interface suit.
- **CSS-first par conception.** Des classes CSS et des variables CSS, sans dépendance à Tailwind et sans runtime CSS-in-JS. L'entrée optionnelle `layered.css` rend les surcharges prévisibles.
- **Une personnalisation qui survit aux refactors.** Les maps `classNames` typées couvrent chaque famille et chaque partie composée. Vous ciblez des clés publiques, pas la structure DOM interne.
- **Pensé pour de vrais produits.** Formulaires, overlays, navigation, tableaux de données, graphiques, planificateurs, outils fichiers et shells d'application complets.
- **L'accessibilité fait partie du travail.** Les composants utilisent des motifs clavier, focus et ARIA avec des régressions navigateur. C'est un soin d'ingénierie, pas une certification WCAG globale.
- **Documentation bilingue.** Guides anglais et français, exemples live, API générées et une carte [llms.txt](https://pimolu.com/llms.txt) pour les workflows assistés par IA.

## En bref

| | |
| --- | --- |
| Composants | 129 familles React |
| Thèmes | Clair, sombre et système |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Style | CSS natif, variables CSS, couches optionnelles |
| Personnalisation | `classNames` typées sur chaque famille et partie composée |
| Framework | React 18 et 19, Next.js App Router |
| Distribution | ESM, déclarations TypeScript, entrée `"use client"` |
| Taille | Un bundle React compilé et le CSS partagé |

## Installation

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

React et React DOM 18 ou 19 sont des peer dependencies. Chargez la feuille de styles partagée une fois au point d'entrée de l'application.

## Démarrage rapide

Dans votre CSS global — par exemple `app/globals.css` dans Next.js :

```css
@import "@pimolu/web-styles/styles.css";
```

Enveloppez l'interface une seule fois. `PimoluProvider` gère le mode de couleur, le preset, le radius, la densité et la couleur de marque.

```tsx
"use client";

import { Button, PimoluProvider } from "@pimolu/react";

export function App() {
  return (
    <PimoluProvider defaultTheme="system" defaultStylePreset="default">
      <Button>Créer un espace</Button>
    </PimoluProvider>
  );
}
```

Le package est ESM uniquement. Son entrée inclut `"use client"` pour être importée depuis une frontière client Next.js sans configuration supplémentaire.

## Ce qui est inclus

| Domaine | Exemples |
| --- | --- |
| Saisie et formulaires | Button, Input, Select, Combobox, MultiSelect, DatePicker, Calendar, FileUpload, Form |
| Surfaces et overlays | Card, Dialog, Drawer, Popover, Tooltip, Toast, Alert, Banner |
| Navigation et layout | Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, DashboardLayout, AppShell |
| Données et productivité | Table, DataTable, DataGrid, TreeTable, Chart, Scheduler, Gantt, Kanban, FileManager |
| Contenu et médias | Typography, Prose, CodeBlock, Carousel, VideoPlayer, AudioPlayer, PDFViewer, Lightbox |

## Personnaliser une partie, pas un sélecteur

```tsx
import { Button } from "@pimolu/react";

export function CheckoutAction() {
  return (
    <Button
      classNames={{
        root: "checkout-action",
        label: "checkout-action__label",
      }}
    >
      Payer en sécurité
    </Button>
  );
}
```

```css
.checkout-action {
  border-radius: 999px;
}

.checkout-action__label {
  letter-spacing: 0.01em;
}
```

Chaque famille expose des clés de parties stables. Les composants composés héritent du scope de leur famille à travers les wrappers et les portails, tandis qu'un root imbriqué indépendant le réinitialise. Voir le [contrat de personnalisation](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) pour la référence complète, les recettes de couches et les responsabilités d'accessibilité.

## La famille de packages

| Package | Rôle |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | Composants, hooks et layouts React |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | CSS complet, entrée en couches et CSS par composant |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Thèmes clair/sombre, sept presets et données visuelles |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Tokens primitifs en CSS et JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Utilitaire de classes de variantes indépendant du framework |

## Documentation et état

- [Catalogue de composants](https://pimolu.com/components) avec exemples live, API et notes d'usage
- [Démarrage rapide](https://pimolu.com/docs/quick-start)
- [Guide des thèmes](https://pimolu.com/docs/theming)
- [Source et issues](https://github.com/pimoludev/ui)

Pimolu UI est en bêta. Le registre React est implémenté ; les registres native, Angular et web components sont des directions futures, pas des packages actuels. La revue visuelle et d'assistance technique complète reste ouverte : cette version est une prévisualisation, pas une stable `1.0.0`.

MIT © Pimolu
