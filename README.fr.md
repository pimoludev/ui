# Pimolu UI

**Un design system qui tient ses promesses.** Une source unique de vérité visuelle, des thèmes et des styles interchangeables à l'exécution, et des composants React accessibles — sans framework de style à apprendre.

[Documentation](https://pimolu.com/docs) · [Composants](https://pimolu.com/components) · [Showcase](https://pimolu.com/showcase) · [Dépôt](https://github.com/pimoludev/ui) · Licence MIT

[English](README.md) · **Français**

## Pourquoi Pimolu UI

La plupart des interfaces dérivent. Une couleur est ajustée ici, un rayon là, et quelques mois plus tard plus aucun écran ne semble appartenir au même produit. Pimolu UI fait de cette dérive le premier problème à résoudre : chaque décision visuelle vit derrière un token de design, de sorte que la cohérence devienne la valeur par défaut plutôt qu'un effort permanent.

La deuxième promesse est la liberté. Les thèmes et les styles visuels s'appliquent par attributs de données, pas par du code conditionnel. Passer d'une interface claire à une interface sombre, ou d'une allure sobre à une allure expressive, ne change rien dans les composants. On dessine l'interface une fois, puis on l'habille selon les besoins du produit, aujourd'hui comme demain.

La troisième est la sobriété. Ni runtime CSS-in-JS, ni framework de classes utilitaires, ni magie de build à décrypter. Le style est du CSS simple, construit à partir de classes `pimolu-*` et de variables `--pimolu-*`. On peut le lire, le surcharger, puis s'en aller — exactement ce qu'une fondation doit permettre.
## Ce que vous obtenez

| Atout | Ce que cela change pour vous |
| --- | --- |
| Une source unique de vérité | Les valeurs sont écrites une fois sous forme de tokens et compilées pour le web et pour JavaScript. Une modification se propage au lieu d'être répétée. |
| Des thèmes sans réécriture | Les modes clair, sombre et système, ainsi que sept presets visuels, se changent à l'exécution par attribut. Aucun composant n'est touché. |
| Des composants accessibles | Navigation clavier, focus visible, états occupé et désactivé, libellés lecteur d'écran et respect des préférences de mouvement sont intégrés, pas ajoutés après coup. |
| Aucun framework à apprendre | Des classes CSS et des variables CSS. Un rendu prévisible, des surcharges faciles, zéro enfermement. |
| Typé de bout en bout | Du TypeScript strict sur les composants et les API publiques : les erreurs sont attrapées avant l'exécution. |
| Des vérifications automatisées | `pnpm verify` contrôle la bibliothèque et le playground. Le site possède ses propres contrôles de build, de documentation et de navigation sur trois moteurs dans la CI. |

## Thèmes et presets

Le design system repose sur deux couches complémentaires. Un thème de couleurs donne un sens aux primitives et existe en variante claire et sombre. Un preset de style redéfinit le caractère visuel de l'interface, et les deux se combinent librement.

| Preset | Caractère |
| --- | --- |
| `default` | Ink & Signal : neutres chaleureux, accent iris et surfaces discrètes |
| `monochrome` | Une palette grise et retenue |
| `cartoon` | Des contours marqués et un rendu ludique |
| `glass` | Des surfaces translucides et une profondeur douce |
| `luxury` | Une typographie raffinée et des neutres chaleureux |
| `neo-brutalism` | Des bordures franches, des ombres plates et un fort contraste |
| `adaptive` | Une palette alternative disponible à la comparaison ; ce n'est pas le Default |

Le rayon (`sharp`, `medium`, `round`), la densité (`compact`, `comfortable`, `spacious`) et `brandColor` se configurent indépendamment avec `PimoluProvider`. La densité ajuste les dimensions des boîtes sans réduire le texte ni les icônes. Une couleur de marque personnalisée ne recalcule pas automatiquement le premier plan et ne garantit pas le contraste : vérifiez le texte obtenu, le survol et le focus.

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <button class="pimolu-button pimolu-button--primary pimolu-button--solid pimolu-button--md">
    Essayer Pimolu
  </button>
</div>
```

## Fondations

La couche primitive est rédigée au format du Design Tokens Community Group et vit à un seul endroit. La sémantique vient par-dessus : un composant ne fait jamais référence à `indigo-600`, seulement à `primary`. Cette indirection est ce qui permet à un thème sombre ou à un preset radical d'exister sans dupliquer un seul style de composant.

Les composants n'utilisent les tokens que par des variables CSS et des attributs de données. Un provider pose `data-pimolu-theme` et `data-pimolu-style` sur un conteneur, et le CSS réagit à ces attributs, ce qui garde la mise en forme déclarative et sans effet de bord JavaScript. Le résultat est un système court à apprendre et difficile à mal employer.

## Démarrage

Installez la bêta publiée dans une application React 18 ou React 19 existante :

```bash
npm install @pimolu/react@beta @pimolu/web-styles@beta
# Ou avec pnpm
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

La version actuelle est **0.1.0-beta.7**. Importez `@pimolu/web-styles/styles.css` une fois au point d'entrée et placez votre interface dans `PimoluProvider` (voir « L'utiliser » ci-dessous). Core, thèmes et tokens sont installés comme dépendances ; ajoutez-les directement seulement si vous importez leurs API. Les packages publiés contiennent les fichiers ESM compilés, les types et le CSS : aucun clonage, build Pimolu ou réglage Next.js `transpilePackages` n'est nécessaire. Tailwind CSS reste facultatif.

Pour mettre à jour une installation existante vers la bêta actuelle :

```bash
npm install @pimolu/react@beta @pimolu/web-styles@beta
# Ou avec pnpm
pnpm update @pimolu/react@beta @pimolu/web-styles@beta
```

Mettez les autres packages `@pimolu/*` installés directement à la même version et consultez les [notes de version](https://pimolu.com/releases) avant la mise à jour.

### Contribuer et lancer le Playground

Le dépôt source déclare Node.js 20 ou supérieur et fixe pnpm dans `packageManager`. Utilisez **Node.js 24**, comme la CI, pour l'ensemble du workspace ; le site déclare un minimum de Node.js 22.6. Clonez le dépôt pour contribuer ou explorer le Playground local :

```bash
git clone https://github.com/pimoludev/ui.git
cd ui
pnpm install
pnpm build:all
pnpm "playground dev"
```

| Commande | Rôle |
| --- | --- |
| `pnpm build:all` | Générer les tokens, thèmes, presets, tokens visuels, CSS des composants et packages compilés |
| `pnpm build:packages` | Compiler `@pimolu/core` et bundler `@pimolu/react` avec ses déclarations |
| `pnpm release:plan` | Analyse SemVer en lecture seule depuis la plage de commits et l'état des audits |
| `pnpm release:pack-check` | Builder chaque package publiable et valider la sortie de `npm pack --dry-run` |
| `pnpm verify` | Pipeline complet : build, types, audit des thèmes, tests, lint, build du playground |
| `pnpm test:react` | Exécuter les tests de composants |
| `pnpm audit:themes` | Contrôle d'intégrité des thèmes et presets, en lecture seule |
| `pnpm "playground dev"` | Démarrer le serveur de développement du playground |
| `pnpm dev:website` | Compiler les packages, générer la documentation et lancer le site sur le port 3001 ; lancer `build:all` au préalable sur un clone neuf |
| `pnpm build:website` | Construire toutes les ressources du workspace et le site Next.js de production |
| `pnpm start:website` | Servir le site de production (`PORT`, 3000 par défaut) |

## L'utiliser

Sur le web, importez la feuille de style générée et appliquez un thème et un style par attributs. Les styles personnalisés s'écrivent à partir des variables sémantiques telles que `var(--pimolu-primary)` et `var(--pimolu-radius-md)`.

```css
/* globals.css, ou la feuille globale de votre application */
@import "@pimolu/web-styles/styles.css";
```

En React, le provider et les composants s'appuient sur les mêmes fondations : le balisage reste stable tandis que le design évolue autour de lui.

```tsx
import { Button, PimoluProvider } from "@pimolu/react";
import "@pimolu/web-styles/styles.css";

export function App() {
  return (
    <PimoluProvider theme="dark" stylePreset="luxury">
      <Button appearance="outline">Explorer</Button>
    </PimoluProvider>
  );
}
```

L'import CSS de l'exemple React est une alternative à `@import` dans la feuille globale ; choisissez un seul point d'intégration. Avec Next.js App Router, placez `@import` dans `app/globals.css`, importez ce fichier depuis le layout racine et placez `PimoluProvider` dans un Client Component. Consultez le [guide Next.js](https://pimolu.com/docs/nextjs).

Les tokens sont également disponibles en JSON et les données visuelles en JavaScript. Ces fondations préparent un futur rendu React Native ; Pimolu ne fournit pas encore de composants React Native. Le natif partagera les données de design avec son propre rendu, plutôt que les composants React DOM.

Les guides d’intégration expliquent comment utiliser Pimolu UI avec Next.js. Un starter Next.js autonome sera maintenu dans un dépôt séparé.

## Personnalisation

La bêta publiée comprend une entrée optionnelle `@pimolu/web-styles/layered.css` et des hooks de parties typés `classNames` sur les 129 familles, leurs sous-composants composés et leurs surfaces en portail. Les props publiques, les variables CSS sémantiques et les parties nommées permettent d'adapter les composants sans copier leur implémentation. Les anciennes entrées CSS et cibles de classes restent compatibles.

Choisissez `styles.css` ou `layered.css`, plutôt que de charger les deux. Avec Tailwind v4, placez Preflight dans la couche `base` avant `pimolu` ; avec l'entrée sans couche, chargez Pimolu après Preflight. Un portail peut se trouver hors du wrapper de votre application : utilisez les parties nommées pour styler le panneau réel. Consultez le [guide de personnalisation](https://pimolu.com/docs/customization) et le [contrat de personnalisation](docs/CUSTOMIZATION.md) pour les recettes testées et leurs limites.

## Animations CSS natives

La bêta publiée comprend les indicateurs glissants de Tabs et SegmentedControl, les transitions à hauteur naturelle d'Accordion, les panneaux directionnels de NavbarMenu et l'apparition discrète des erreurs de formulaire. Ces interactions utilisent du CSS natif sans imposer Motion. Les composants concernés exposent `animated={false}` ; `prefers-reduced-motion` est respecté. Pour désactiver les animations CSS d'un sous-arbre, placez `data-pimolu-motion="off"` sur un wrapper extérieur à `PimoluProvider` afin d'inclure son hôte de portails. Ce réglage CSS ne remplace pas le cycle de présence propre à chaque overlay. Consultez le [guide des animations](https://pimolu.com/docs/animation) et les [notes sur les animations natives](docs/NATIVE_MOTION.md).



## Navigation adaptative

Ajoutez `collapsible` et `NavbarToggle` pour placer les liens et les actions dans un menu lorsque la barre est étroite. Le bouton affiche un hamburger par défaut ; `icon` et `closeIcon` acceptent des icônes personnalisées. `itemsPosition` accepte `"center"` ou `"right"` pour déplacer le groupe de navigation tandis que la marque reste au début et les actions à la fin ; la valeur par défaut est `"left"`.

```tsx
import { Navbar, NavbarBrand, NavbarToggle, NavbarContent, NavbarItem } from "@pimolu/react";

<Navbar collapsible>
  <NavbarBrand href="/">Pimolu</NavbarBrand>
  <NavbarToggle />
  <NavbarContent aria-label="Navigation principale">
    <NavbarItem href="/docs">Documentation</NavbarItem>
  </NavbarContent>
</Navbar>
```

Navbar et Footer acceptent `appearance="surface"` (le défaut existant), `"transparent"` (sans fond de surface) ou `"floating"` (surface encadrée utilisant le rayon et l’ombre du preset). `bordered={false}` retire le séparateur horizontal ; l’apparence flottante conserve son cadre. Pour un site continu, placez une Navbar ou un Footer transparent dans une section pleine largeur et limitez uniquement son contenu.

Pour un menu mobile modal, composez `NavbarMenu` autour du contenu et des actions. Il prend en charge les quatre côtés, un panneau partiel ou plein écran et une animation facultative. Le menu inline d'origine reste disponible. La [référence Navbar](https://pimolu.com/components/navbar) présente des exemples fonctionnels et le comportement du focus.

## Qualité, automatisée

La justesse ne doit pas reposer sur la mémoire. `pnpm verify` génère les ressources, vérifie les types, audite le système de thèmes, exécute les suites de tests de la bibliothèque, analyse le playground et le construit. La CI GitHub exécute cette vérification et un contrôle distinct du site : build de production, lint, tests de documentation et suite Chromium/Firefox/WebKit. Construisez le site depuis la racine avec `pnpm build:website`, puis lancez `pnpm start:website`.

Un auditeur dédié, en lecture seule, protège spécifiquement le système de thèmes. Il confirme la parité clair/sombre, valide chaque preset, vérifie que les palettes et leurs styles restent cohérents, contrôle les types générés, et signale tout emplacement où un thème ou un preset doit encore être déclaré. Des hooks Git lancent une vérification rapide avant chaque commit et le pipeline complet avant chaque push, pour que le dépôt reste sain sans que personne n'ait à y penser.

## État du projet

Pimolu UI est en développement actif et a publié sa dernière prévisualisation publique, **`0.1.0-beta.7`**. La chaîne de tokens, deux thèmes de couleur, sept presets visuels et 129 familles de composants React sont présents, avec des tests et des pages de démonstration. Le registre React est la priorité actuelle ; les autres registres de plateforme ne sont pas encore implémentés. Les cinq packages de la bibliothèque sont disponibles sur npm en `0.1.0-beta.7`, avec les tags `latest` et `beta` :

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

Retrouvez les cinq packages dans l'[organisation Pimolu sur npm](https://www.npmjs.com/org/pimolu).

Le [site public](https://pimolu.com) comprend des guides, 135 références de composants interactives, un catalogue illustré avec recherche, des articles et releases en MDX et un showcase de projets réels. Son code Next.js App Router se trouve dans `apps/website`.

Le projet reste en bêta. Les API et tokens visuels peuvent évoluer ; les revues avec technologies d'assistance des composants complexes et l'audit visuel complet restent ouverts. Les contrôles navigateur automatisés ne constituent pas une garantie complète de conformité d'accessibilité. Consultez l'[audit qualité](docs/ai/QUALITY_AUDIT.md), l'[audit d'accessibilité du site](apps/website/ACCESSIBILITY_AUDIT.md) et le [changelog](CHANGELOG.md) pour la couverture et les limites.

## Direction visuelle et prochaines étapes

Depuis **0.1.0-beta.7**, le Default publié utilise **Ink & Signal** : neutres chauds, accent iris, contours fonctionnels distincts et rôles DM Sans / Newsreader / IBM Plex Mono facultatifs avec polices de secours. Le site auto-héberge les polices ; la bibliothèque ne les télécharge pas. Cette évolution remplace le Default existant sans ajouter de huitième preset. Lors d'une mise à jour depuis beta.6, vérifiez la nouvelle palette, les rayons et la typographie dans votre application ; les autres presets nommés conservent leurs palettes. Le futur **Identity Kit** reste une proposition pour prolonger ThemeBuilder avec prévisualisation et export d'identité.

Le Design Lab du playground propose de vraies compositions marketing, formulaire local avec validation et dashboard filtrable, accompagnées d'une référence beta.6 figée pour comparaison. La route locale facultative `/design-preview` est ignorée par Git et n'est pas nécessaire au build du site. Utilisez `--pimolu-control-border` pour les limites essentielles des champs et `--pimolu-border` pour les séparateurs décoratifs ; `--pimolu-primary-soft` et `--pimolu-primary-soft-foreground` définissent une surface d'accent discrète et sa couleur de texte. Ces rôles sont disponibles dans beta.7. Les revues humaines du design et avec technologies d'assistance restent ouvertes avant une version stable.

Voir la [spécification de design](docs/ai/pimolu-design-spec-v0.1.md), la [direction visuelle](docs/ai/DESIGN_DIRECTION.md) et la [roadmap des plateformes](docs/ai/PLATFORM_ROADMAP.md). React, Next.js et Vite sont la priorité actuelle ; les Blocks et l'intégration Electron viennent ensuite. React Native/Expo, Angular et une couche HTML/JavaScript autonome restent à venir. Les bundles CSS partagés existent déjà ; ils ne constituent pas une bibliothèque d'interactions complète indépendante des frameworks.

## Contribution

Le composant de référence pour découvrir les conventions est `registry/react/button`. Les workflows de développement sont documentés dans `AGENTS.md`, avec des skills spécialisés sous `.agents/skills`. Avant de proposer une modification, exécutez `pnpm verify` et gardez alignés les tests de composants, les thèmes, la documentation et le playground.

## Licence

Publié sous licence MIT. Voir [LICENSE](LICENSE) pour les détails.
