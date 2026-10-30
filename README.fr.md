# Pimolu UI

**Un design system qui tient ses promesses.** Une source unique de vérité visuelle, des thèmes et des styles interchangeables à l'exécution, et des composants React accessibles — sans framework de style à apprendre.

[Dépôt](https://github.com/pimoludev/ui) · Licence MIT · Node.js 20+

[English](README.md) · **Français**

## Pourquoi Pimolu UI

La plupart des interfaces dérivent. Une couleur est ajustée ici, un rayon là, et quelques mois plus tard plus aucun écran ne semble appartenir au même produit. Pimolu UI fait de cette dérive le premier problème à résoudre : chaque décision visuelle vit derrière un token de design, de sorte que la cohérence devienne la valeur par défaut plutôt qu'un effort permanent.

La deuxième promesse est la liberté. Les thèmes et les styles visuels s'appliquent par attributs de données, pas par du code conditionnel. Passer d'une interface claire à une interface sombre, ou d'une allure sobre à une allure expressive, ne change rien dans les composants. On dessine l'interface une fois, puis on l'habille selon les besoins du produit, aujourd'hui comme demain.

La troisième est la sobriété. Ni runtime CSS-in-JS, ni framework de classes utilitaires, ni magie de build à décrypter. Le style est du CSS simple, construit à partir de classes `pimolu-*` et de variables `--pimolu-*`. On peut le lire, le surcharger, puis s'en aller — exactement ce qu'une fondation doit permettre.
## Ce que vous obtenez

| Atout | Ce que cela change pour vous |
| --- | --- |
| Une source unique de vérité | Les valeurs sont écrites une fois sous forme de tokens et compilées pour le web et pour JavaScript. Une modification se propage au lieu d'être répétée. |
| Des thèmes sans réécriture | Les thèmes clair et sombre, ainsi que six presets visuels, se changent à l'exécution par attribut. Aucun composant n'est touché. |
| Des composants accessibles | Navigation clavier, focus visible, états occupé et désactivé, libellés lecteur d'écran et respect des préférences de mouvement sont intégrés, pas ajoutés après coup. |
| Aucun framework à apprendre | Des classes CSS et des variables CSS. Un rendu prévisible, des surcharges faciles, zéro enfermement. |
| Typé de bout en bout | Du TypeScript strict sur les composants et les API publiques : les erreurs sont attrapées avant l'exécution. |
| Une qualité dont vous n'avez pas à vous souvenir | Une seule commande vérifie le build, les types, le système de thèmes, toutes les suites de tests, le lint et le playground. |

## Thèmes et presets

Le design system repose sur deux couches complémentaires. Un thème de couleurs donne un sens aux primitives et existe en variante claire et sombre. Un preset de style redéfinit le caractère visuel de l'interface, et les deux se combinent librement.

| Preset | Caractère |
| --- | --- |
| `default` | L'apparence de référence, fondée sur le thème actif |
| `monochrome` | Une palette grise et retenue |
| `cartoon` | Des contours marqués et un rendu ludique |
| `glass` | Des surfaces translucides et une profondeur douce |
| `luxury` | Une typographie raffinée et des neutres chaleureux |
| `neo-brutalism` | Des bordures franches, des ombres plates et un fort contraste |

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

La version actuelle est **0.1.0-beta.6**. Importez `@pimolu/web-styles/styles.css` une fois au point d'entrée et placez votre interface dans `PimoluProvider` (voir « L'utiliser » ci-dessous). Core, thèmes et tokens sont installés comme dépendances ; ajoutez-les directement seulement si vous importez leurs API. Les packages publiés contiennent les fichiers ESM compilés, les types et le CSS : aucun clonage, build Pimolu ou réglage Next.js `transpilePackages` n'est nécessaire. Tailwind CSS reste facultatif.

### Contribuer et lancer le Playground

Le dépôt source requiert Node.js 20 ou supérieur et la version de pnpm indiquée dans `packageManager`. Les tests du site nécessitent Node.js 22.6 ou supérieur. Clonez le dépôt pour contribuer ou explorer le Playground local :

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

## L'utiliser

Sur le web, importez la feuille de style générée et appliquez un thème et un style par attributs. Les styles personnalisés s'écrivent à partir des variables sémantiques telles que `var(--pimolu-primary)` et `var(--pimolu-radius-md)`.

```tsx
import "@pimolu/web-styles/styles.css";
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

Les tokens sont également disponibles au format JSON : React Native et les autres consommateurs JavaScript alimentent ainsi les mêmes valeurs dans des objets de style natifs. Sur le natif, la priorité est la cohérence visuelle par des tokens partagés plutôt que le partage du code des composants.

Les guides d’intégration expliquent comment utiliser Pimolu UI avec Next.js. Un starter Next.js autonome sera maintenu dans un dépôt séparé.

## Personnalisation (prochaine release)

Le workspace ajoute une entrée optionnelle `@pimolu/web-styles/layered.css` et des hooks de parties typés `classNames` sur les 129 familles, leurs sous-composants composés et leurs surfaces en portail. Les anciennes entrées CSS et cibles de classes restent compatibles. Ces ajouts sont inclus dans la version npm 0.1.0-beta.6. Voir [le contrat de personnalisation](docs/CUSTOMIZATION.md) pour les recettes CSS/Tailwind, les portails et les cibles stables.



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

## Qualité, automatisée

La justesse ne doit pas reposer sur la mémoire. Une seule commande, `pnpm verify`, génère les ressources, vérifie les types, audite le système de thèmes, exécute toutes les suites de tests, analyse l'application et construit le playground. La CI GitHub exécute cette vérification et un contrôle distinct du site : build de production, lint, tests de documentation et suite Chromium/Firefox/WebKit. Construisez le site depuis la racine avec `pnpm build:website`, puis lancez `pnpm start:website`.

Un auditeur dédié, en lecture seule, protège spécifiquement le système de thèmes. Il confirme la parité clair/sombre, valide chaque preset, vérifie que les palettes et leurs styles restent cohérents, contrôle les types générés, et signale tout emplacement où un thème ou un preset doit encore être déclaré. Des hooks Git lancent une vérification rapide avant chaque commit et le pipeline complet avant chaque push, pour que le dépôt reste sain sans que personne n'ait à y penser.

## État du projet

Pimolu UI est en développement actif et a publié sa dernière prévisualisation publique, **`0.1.0-beta.6`**. La chaîne de tokens, deux thèmes de couleur, sept presets visuels et 129 familles de composants React sont présents, avec des tests et des pages de démonstration. Le registre React est la priorité actuelle ; les autres registres de plateforme ne sont pas encore implémentés. Les cinq packages de la bibliothèque sont disponibles sur npm en `0.1.0-beta.6`, avec les tags `latest` et `beta` :

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

Retrouvez les cinq packages dans l'[organisation Pimolu sur npm](https://www.npmjs.com/org/pimolu).

Le code source du site de documentation se trouve dans `apps/website`. Consultez le [contexte technique](docs/ai/PROJECT_CONTEXT.md) et le [CHANGELOG](CHANGELOG.md) pour l'architecture vérifiée et les limites actuelles.

## Contribution

Le composant de référence pour découvrir les conventions est `registry/react/button`. Les workflows de développement sont documentés dans `AGENTS.md`, avec des skills spécialisés sous `.agents/skills`. Avant de proposer une modification, exécutez `pnpm verify` et gardez alignés les tests de composants, les thèmes, la documentation et le playground.

## Licence

Publié sous licence MIT. Voir [LICENSE](LICENSE) pour les détails.
