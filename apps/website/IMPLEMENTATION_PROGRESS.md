# Pimolu Website — Suivi d'implémentation

## 22 octobre 2026 — Releases, palettes, blog et enrichissement des guides

### Réalisations

- **Releases** : `/releases` a une navigation dédiée, un aperçu des améliorations et des ancres actives. `/releases/unreleased` présente les notes complètes. Aucun tag local ni changelog publié n'étant présent, aucune version ni date de publication n'a été inventée.
- **Palettes** : cinq couleurs réelles par preset, description, sélection et valeur primaire active dans le header ; l'accent est représenté lorsqu'il existe. Le panneau utilise une hauteur bornée par le viewport et un bord logique stable dès son montage. Les ajustements restent dans le CSS du site ; Popover et les tokens publics sont conservés.
- **Explorateur** : `/docs/colors` compare huit rôles sémantiques sur les sept presets et les deux modes, indépendamment du site. Les variables CSS se copient avec retour de statut et message d'échec si le presse-papiers est indisponible. Les palettes partielles héritent des couleurs sémantiques de base, comme le CSS réel.
- **Blog** : `/blog`, trois articles originaux complets, recherche et filtres thématiques, illustrations vectorielles originales, lecture estimée, métadonnées, ancres et articles liés. La navigation des cartes utilise l'App Router avec Pimolu Link et conserve le comportement des clics modifiés. `/blog/feed.xml` fournit un flux RSS valide.
- **Documentation** : neuf nouveaux guides — démarrage rapide, principes, frameworks, couleurs, mode sombre, styles, animation, composition et outils IA — pour un total de quinze. Les frameworks et outils futurs sont signalés comme tels. `/llms.txt` fournit une carte des vraies références ; aucun serveur MCP ni CLI fictif n'est annoncé.
- **Intégration** : Blog dans le header et le footer, recherche globale enrichie et sitemap de **152 destinations**. Références HeroUI consultées pour le parcours et la hiérarchie ; textes, illustrations et implémentation propres à Pimolu.

### Sources créées ou modifiées

- `app/blog/`, `app/releases/`, `app/llms.txt/`, `app/editorial.css` : routes, feed, notes et présentation.
- `components/editorial/`, `components/color-reference.tsx`, `components/site-appearance.tsx` : compositions réutilisant Pimolu.
- `content/journal.ts`, `content/releases.ts`, `content/handbook.ts`, `content/docs.ts` : contenu éditorial et guides typés.
- `lib/palettes.ts`, `lib/text-resources.ts`, `lib/site.ts`, `scripts/build-docs.mjs` : résolution des couleurs, ressources textuelles, indexation et recherche.
- `app/layout.tsx`, `app/globals.css`, `app/docs/docs.css`, `components/site-header.tsx`, `components/site-search.tsx`, `components/docs/{doc-article,docs-search}.tsx` : navigation et intégration.
- `tests/{editorial,docs,catalog}.test.mjs`, `e2e/{editorial,reader-experience,catalog}.spec.ts` : couverture et attentes actualisées.
- `README.md`, ce suivi et `docs/ai/PROJECT_CONTEXT.md` : mémoire et fonctionnement.

### Validation réelle

| Vérification | Résultat |
| --- | --- |
| Tests Node du site | **21/21** ; les 516 exemples de composants et trois nouveaux exemples de guides compilent indépendamment |
| TypeScript | Typecheck explicite réussi au début ; le build final inclut une nouvelle vérification TypeScript réussie |
| ESLint du site | Réussi, sans erreur ni avertissement |
| Build Next.js final | Réussi, nouvelles routes, feed et carte de documentation compris |
| Navigateurs sur la version finale | **30/30**, Chromium, Firefox et WebKit : blog, notes, recherche, palettes, modes, responsive, RSS/XML, 404 et navigation clavier |
| Captures | **36 captures**, clair/sombre × 1440 × 900, 768 × 1024 et 390 × 844 × six vues ; dimensions et bornes du popover consignées |
| Revue visuelle | Six planches examinées couvrant les 36 vues : index blog, article, releases, notes, couleurs et panneau de palettes |

Les captures et leurs mesures sont dans `.artifacts/editorial-review/`, avec `results.json` et `contact-{light|dark}-{1440|768|390}.png`. Journaux : `.artifacts/editorial-{unit,lint,build,browser-final,captures}.log`. Aucun débordement horizontal, erreur JavaScript ou panneau hors fenêtre dans ces scénarios finaux.

Les premières passes ont découvert une vraie absence de valeurs héritées dans l'explorateur, corrigée dans le résolveur local ; un échec WebKit de raccourci après rechargement d'article, corrigé par navigation App Router ; et la limite de hauteur/position initiale du panneau, corrigée localement. Les tests n'ont pas été affaiblis : l'intégrité de toutes les palettes et la visibilité du dernier choix desktop sont vérifiées.

Limites : revue visuelle réalisée avec Default en clair/sombre ; la sélection des sept presets est exercée dans les trois moteurs. Cela ne constitue pas une certification WCAG, une revue exhaustive des 129 familles ni une vérification par lecteur d'écran. Aucun composant de bibliothèque, token ou preset n'est modifié dans cette itération. Aucune dépendance installée, aucun commit/push ; CI GitHub toujours désactivée. Les changements locaux antérieurs sont conservés.

## 22 octobre 2026 — Présentation du catalogue `/components`

Terminé pour cette demande : galerie aérée, composants isolés et nom sous l'illustration, description courte, un seul lien par famille, recherche et catégories conservées. Les actions ouvrent la collection ; ThemeBuilder reste accessible en dernière catégorie. Grille adaptative de trois, deux ou une colonne selon la largeur disponible. Focus visible, couleurs forcées et réduction des transitions pris en charge dans le CSS local au catalogue.

### Fichiers de cette itération

- `app/components/page.tsx`, `app/components/catalog.css`, `components/catalog/catalog-browser.tsx` : hiérarchie et nouvelle galerie.
- `scripts/capture-previews.mjs` : capture du composant complet au lieu d'une tranche de page, ouverture réelle des overlays, exemples courts existants pour les compositions longues, chargement des images après hydratation, isolation du contexte de démo.
- `public/component-previews/` : **258 illustrations produit remplacées volontairement**, avec `capture-manifest.json` pour la couverture et le cadrage. Aucun snapshot de test automatiquement accepté.
- `tests/catalog.test.mjs`, `e2e/catalog-gallery.spec.ts`, `e2e/site-polish.spec.ts` : intégrité des captures, grille, lien clavier, filtrage et ordre des catégories.
- `eslint.config.mjs` : exclusion des scripts et sorties temporaires `.artifacts/` du lint.
- `README.md`, ce suivi : pipeline et preuves de vérification.

### Vérifications exécutées

- Tests du site : **18/18**, dont compilation et formatage des 516 exemples, et couverture des 258 illustrations.
- ESLint du site : réussi, sans erreur ni avertissement.
- Build Next.js final : réussi, TypeScript inclus.
- Première passe navigateur : **399/399**, Chromium, Firefox, WebKit, incluant les 129 références, le catalogue et les ancres.
- Après le dernier ajustement de présentation et d'ordre : **12/12** ciblés sur ces trois moteurs, recherche/navigation, galerie responsive, mode système et ancres actives.
- Six captures réellement obtenues et examinées : **1440 × 900**, **768 × 1024**, **390 × 844**, chacune en clair et sombre. Aucun débordement horizontal ni erreur JavaScript relevé dans ces scénarios. Fichiers et dimensions mesurées : `.artifacts/catalog-gallery/results.json` ; captures `catalog-{light|dark}-{1440|768|390}.png`.
- Revue des 129 illustrations sombres par sept planches de contact ; contrôle des compositions grandes, des overlays ouverts et des images chargées. Les miniatures représentent le preset Default, les fiches gardent les exemples interactifs personnalisables.

Limites : cette revue de galerie ne vaut pas audit visuel exhaustif des composants dans tous les presets, ni audit d'accessibilité complet. Un constat existant hors de cette modification a été observé sur Transfer à une fenêtre de 640 px : ses panneaux empilés se réduisent à 2 px de hauteur ; son illustration utilise le rendu desktop. Ce défaut de bibliothèque reste à corriger séparément.

Aucune dépendance installée, aucun composant public ni token modifié dans cette itération, aucun commit ni push ; CI GitHub conservée désactivée. Les changements antérieurs du working tree sont conservés.

## Périmètre et état

Phases 1 à 4 terminées pour le périmètre convenu : fondations, homepage, documentation pilote, catalogue complet des familles, personnalisation des aperçus et finalisation technique. Le catalogue comprend 129 références ; 20 disposent de démonstrations guidées, les 109 autres d'une référence source/API.

- [x] Phase 1 — Fondations Next.js, workspace, layouts, thèmes, navigation.
- [x] Phase 2 — Site vitrine premium, compositions interactives, animations Motion.
- [x] Phase 3 — Documentation pilote, installation, guides, API, recherche.
- [x] Phase 4 — Catalogue, personnalisation, contrôles d'accessibilité et optimisation du chargement.

Date : 21 octobre 2026. Branche : `dev`. Aucun commit, push ni changement de CI.

## Architecture vérifiée et choix

- Le dossier contenait déjà un scaffold Next.js 16.4.2 non suivi : il a été intégré au workspace existant, sans recréer une application parallèle.
- App Router et TypeScript strict ; routes `/`, `/docs`, `/components`, `/themes` et page 404.
- Imports workspace de `@pimolu/react`, `@pimolu/themes`, `@pimolu/design-tokens`, `@pimolu/web-styles`.
- Transpilation Next des sources TypeScript React/Core. Les assets générés nécessitent `pnpm build:all`.
- `components/ui.tsx` fournit une frontière client pour les composants importés par les pages serveur. Aucun composant de la bibliothèque n'est dupliqué.
- Tailwind CSS 4 via PostCSS, avec utilitaires reliés aux variables Pimolu. Pas de Preflight pour éviter une remise à zéro des styles des composants.
- Motion installé et `MotionConfig reducedMotion="user"` en place ; les animations de présentation appartiennent à la phase 2.
- Réutilisation des vrais Navbar, Select, Footer, DocsLayout, PageHeader, Link, Badge, Card, Input et Button.
- Modes light/dark/system et sept presets, dont adaptive, conservés. La liste provient de l'export généré des thèmes.
- Préférences spécifiques au site conservées en cookies, validées et lues côté serveur ; mises à jour par les callbacks du PimoluProvider existant. Le choix explicite du thème/preset est disponible dès le rendu serveur. Le mode system est résolu par le Provider côté client.
- Le layout lit les cookies : les pages sont rendues dynamiquement. Pas de police distante imposée.
- Métadonnées de base, titres par page, icône originale, lien d'évitement et navigation mobile.

## Fichiers créés ou adaptés pendant la phase

Tous les chemins suivants sont relatifs à `apps/website/`, sauf indication contraire.

| Groupe | Fichiers |
| --- | --- |
| Configuration existante adaptée | `package.json`, `next.config.ts` |
| Compilation CSS | `postcss.config.mjs`, `app/globals.css` |
| Layout et navigation | `app/layout.tsx`, `components/site-header.tsx`, `components/site-provider.tsx`, `components/ui.tsx` |
| Routes de fondation | `app/page.tsx`, `app/docs/layout.tsx`, `app/docs/page.tsx`, `app/components/page.tsx`, `app/themes/page.tsx`, `app/not-found.tsx` |
| Thèmes et préférences | `components/theme-controls.tsx`, `lib/preferences.ts` |
| Identité | `app/icon.svg` |
| Tests | `tests/preferences.test.mjs` |
| Documentation | `README.md`, `IMPLEMENTATION_PROGRESS.md` |
| Dépendances workspace | `/pnpm-lock.yaml` à la racine du dépôt |

Le scaffold possédait un workspace et un lockfile imbriqués. Ils ont été conservés sous `pnpm-workspace.standalone.yaml` et `pnpm-lock.standalone.yaml`, sans être utilisés par pnpm. Le lockfile racine est l'autorité. Le favicon du scaffold est conservé dans `public/bootstrap-favicon.ico` ; le site utilise `app/icon.svg`. Les autres assets du scaffold restent présents, sans être utilisés.

Les configurations existantes `.gitignore`, `tsconfig.json`, `eslint.config.mjs` et `AGENTS.md` ont été conservées. Les nombreuses modifications de composants/Playground déjà présentes avant cette phase n'ont pas été réécrites ni mises en staging.

## Vérifications exécutées

| Commande | Résultat |
| --- | --- |
| `pnpm install --ignore-scripts` | Réussite ; intégration des dépendances obligatoires au workspace, sans bibliothèque UI tierce |
| `pnpm build:all` | Réussite |
| `pnpm verify` | Réussite : typecheck racine, audit thèmes, tests, lint Playground, skills et build Playground |
| `pnpm --filter @pimolu/website typecheck` | Réussite |
| `pnpm --filter @pimolu/website lint` | Réussite, aucun avertissement final |
| `pnpm --filter @pimolu/website test` | 3 tests réussis : cookies non fiables, presets générés, sérialisation des cookies |
| `pnpm --filter @pimolu/website build` | Réussite : compilation, TypeScript et génération des routes |
| `pnpm --filter @pimolu/website start` + contrôles HTTP | Serveur de production démarré sur 3001 ; quatre routes en 200, route inconnue en 404 ; cookies dark/adaptive appliqués dans le HTML serveur |

`pnpm verify` a exécuté 1 389 tests React dans 136 fichiers, 30 tests CSS, 8 tests de thèmes et 1 test de tokens : tous réussis. Audit des thèmes : 0 erreur / 0 avertissement. Le script racine ne comprend pas encore les commandes website : elles ont donc été exécutées séparément.

### Vérification réelle dans Chromium

Chrome via Argent/CDP, sans installation d'outil de test supplémentaire. Les dimensions ont été imposées par l'émulation CDP puis mesurées avec `innerWidth`/`innerHeight` :

- Desktop : **1440 × 900**.
- Mobile : **390 × 844**.
- Routes `/`, `/docs`, `/components`, `/themes` examinées à ces deux dimensions ; aucun débordement horizontal constaté.
- Menu mobile : ouverture et navigation vers Documentation ; menu refermé après navigation.
- Select de thème : passage de System sombre à Light au clavier ; cookie vérifié.
- Select de preset : passage de Default à Adaptive au clavier ; conservation après navigation/rechargement constatée.
- Formulaire de thèmes : saisie réelle puis clic sur le bouton ; message « Ready to build Pimolu studio. » confirmé.
- Un seul titre h1 et une seule région main sur les routes contrôlées.
- Captures examinées en clair et en sombre. Cela ne constitue pas un audit exhaustif de tous les presets, lecteurs d'écran ou navigateurs.

Captures locales de cette session (temporaires, hors dépôt) :

| Vue | Fichier dans `C:/Users/MEC/AppData/Local/Temp/argent-chromium-media/` |
| --- | --- |
| Accueil desktop 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792575267445-13024.png` |
| Accueil mobile 390 × 844 | `argent-screenshot-chromium-cdp-9222-1792575318180-13024.png` |
| Documentation mobile corrigée | `argent-screenshot-chromium-cdp-9222-1792575188310-13024.png` |
| Thèmes mobile sombre | `argent-screenshot-chromium-cdp-9222-1792575118259-13024.png` |
| Menu mobile ouvert | `argent-screenshot-chromium-cdp-9222-1792575123476-13024.png` |

## Problèmes rencontrés et limites

- **Corrigé dans le site :** les actions de navigation revenaient à la ligne sur desktop ; largeur du sélecteur et absence de wrap explicites.
- **Corrigé localement :** sans TOC, le DocsLayout public conserve une grille à deux colonnes sur mobile à cause de la spécificité des règles CSS. Une surcharge limitée à `.site-docs` rétablit une colonne et évite les doubles marges. Une correction de bibliothèque pourra être étudiée séparément avec ses tests.
- **Corrigé :** avertissements initiaux ESLint de PostCSS et Node sur le type de module.
- **Existant :** le bundle principal du Playground reste à 718,99 kB avec un avertissement Vite. Ce n'est pas le bundle du nouveau site.
- **Existant hors périmètre :** `git diff --check` signale un espace final à la ligne 12 du `package.json` racine ; ce changement préexistait et n'a pas été modifié.
- Les tests locaux du site utilisent la suppression native des types TypeScript et requièrent Node >= 22.6 ; validation réalisée sous Node 24.22.0. Ce prérequis est déclaré dans le package du site.
- Les captures proviennent d'un navigateur Chromium avec émulation de viewport, pas d'un téléphone physique. Pas d'audit WCAG exhaustif revendiqué.
- Le contenu et les contrôles sont en anglais, conformément à la base du site. Une localisation devra être décidée avant la documentation complète.

## Plan initial des phases

**Phase 2 terminée :** la homepage et ses compositions interactives sont implémentées. Voir le bilan ci-dessous.

**Phase 3 terminée :** documentation pilote et recherche implémentées. Voir le bilan ci-dessous. Ne pas annoncer de commande npm publique avant la préparation des packages.

**Phase 4 terminée :** catalogue complet connecté aux exports existants, personnalisation, contrôles clavier et responsive, sitemap/métadonnées et chargement différé. Voir le bilan final ci-dessous ; une certification WCAG et des tests de lecteurs d'écran complets ne sont pas revendiqués.

L'inspiration de HeroUI et shadcn porte sur la lisibilité de la navigation et l'expérience développeur. Aucune de ces bibliothèques n'est utilisée comme dépendance UI.

## Bilan de la phase 2 — Site vitrine

### Réalisation

- Nouvelle homepage sur `/`, avec grande typographie « One system. Your identity. », composition graphique originale construite en CSS, rythme vertical aéré, sections de présentation et CTA vers les routes existantes.
- Accès direct aux compositions : `/#live-demo` et `/#make-it-yours`.
- Workspace Orbit composé avec les vrais Card, Stat, Tabs, AreaChart, Sparkline, Checkbox, Progress, Dialog, Input, Button, Table, Select, Avatar et Badge.
- Création de projets en mémoire dans un Dialog, mise à jour des compteurs et de la liste ; filtrage par nom/type/statut avec état sans résultat. Les données de démonstration sont fictives ; aucune donnée n'est envoyée à un serveur et les projets sont réinitialisés au rechargement.
- Checklist contrôlée : les cases actualisent la progression et le compteur. Le choix 7/30 jours modifie réellement le revenu et les données du graphique.
- Aperçu d'identité indépendant des préférences du site : sept presets issus de l'export généré, mode clair/sombre, choix des coins, Switch et confirmation locale des préférences.
- Exemple de code TSX mis à jour avec les choix et copiable via le CodeBlock existant. L'exemple utilise uniquement Button et PimoluProvider, avec leurs imports réels.
- Motion anime discrètement l'arrivée de deux sections. Le contenu reste visible sans JavaScript ; la réduction des animations désactive les translations.
- Aucun ajout de dépendance, aucun changement des composants publics, des tokens, des presets ou de la CI. Aucun commit ni push.

### Fichiers de cette phase

| Fichier | Changement |
| --- | --- |
| `app/page.tsx` | Homepage serveur, sections et CTA |
| `app/home.css` | Styles de présentation isolés par les classes `home-*`, responsive, forced-colors et reduced-motion |
| `components/home-demos.tsx` | Deux compositions interactives utilisant les composants Pimolu |
| `components/home-reveal.tsx` | Frontière client Motion pour les animations de section |
| `IMPLEMENTATION_PROGRESS.md` | Suivi et résultats |

### Validation de la phase 2

- `pnpm --filter @pimolu/website typecheck` : réussi.
- `pnpm --filter @pimolu/website lint` : réussi, aucun avertissement.
- `pnpm --filter @pimolu/website test` : 3 tests existants réussis. Ces tests couvrent les préférences ; les nouveaux parcours ont été vérifiés dans le navigateur, sans ajout de runner E2E.
- `pnpm --filter @pimolu/website build` : réussi après les corrections finales ; compilation, TypeScript et routes Next.js validés.
- Serveur de production : `/`, `/docs`, `/components`, `/themes` répondent en 200 ; une route inconnue répond en 404.
- `git diff --check` : réussi. Les avertissements Git sur la conversion LF/CRLF ne sont pas des erreurs de validation.
- Le pipeline `pnpm verify` racine n'a pas été relancé pendant cette phase limitée au site ; ses résultats de la phase 1 restent consignés plus haut.

### Contrôles dans Chromium

Viewports mesurés, via Argent/CDP : **1440 × 900**, **390 × 844**, **768 × 1024**. Clair et sombre examinés, sans débordement horizontal constaté.

Parcours réellement exécutés :

1. Ouvrir le Dialog, saisir « Pimolu launch », passer au bouton avec Tab et l'activer avec Espace : projet créé, Dialog fermé, focus rendu au déclencheur, compteur et liste mis à jour.
2. Cocher le dernier élément : progression et compteur passent de 2/3 à 3/3.
3. Ouvrir Projects et filtrer le projet créé ; tester une recherche sans résultat sur mobile.
4. Choisir 7 jours : le revenu passe à $8,240 et les données changent.
5. Choisir Cartoon puis le mode sombre dans l'aperçu : preset et thème du Provider imbriqué changent, celui du site reste indépendant.
6. Choisir les coins Sharp sur mobile : attribut de rayon et code mis à jour.
7. Copier le code : confirmation « Copied » observée ; enregistrer les préférences : confirmation locale observée.
8. Ouvrir le menu mobile puis Documentation : navigation correcte, page sans débordement.
9. Émuler `prefers-reduced-motion: reduce` : translations calculées à `none`. Rechargement de production contrôlé avec cette préférence ; aucun message d'erreur dans le journal de cette session Chromium.
10. Examiner le workspace en forced-colors : contrôles, bordures, graphique et progression restent visibles. Ce contrôle ne constitue pas un audit WCAG exhaustif.

Corrections issues du contrôle visuel :

- Les statistiques utilisent un padding de Card explicite, sans double marge intérieure.
- Sur mobile, une Sparkline et des valeurs lisibles remplacent les axes du graphique qui devenaient trop petits.
- Sur mobile, une liste verticale de projets remplace le tableau trop étroit ; le tableau reste disponible à partir du breakpoint `sm`.
- La checklist conserve une colonne même quand sa carte s'élargit sur tablette.
- Une surcharge CSS limitée au panneau de code évite les lignes visuelles vides supplémentaires du CodeBlock, sans modifier son texte ni le composant public.
- Un écart d'hydratation Motion, reproduit avec reduced-motion, a été corrigé en conservant le même état initial serveur/client et en appliquant la préférence via CSS et la durée de transition.

Captures examinées, dans `C:/Users/MEC/AppData/Local/Temp/argent-chromium-media/` :

| Vue | Fichier |
| --- | --- |
| Accueil desktop clair — production, 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792577128613-13024.png` |
| Accueil mobile clair — production, 390 × 844 | `argent-screenshot-chromium-cdp-9222-1792577149926-13024.png` |
| Workspace sombre interactif — 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792576457347-13024.png` |
| Graphique mobile avec valeurs lisibles | `argent-screenshot-chromium-cdp-9222-1792576699691-13024.png` |
| Liste de projets mobile | `argent-screenshot-chromium-cdp-9222-1792576750509-13024.png` |
| Aperçu Cartoon sombre | `argent-screenshot-chromium-cdp-9222-1792576582614-13024.png` |
| Workspace en forced-colors — 768 × 1024 | `argent-screenshot-chromium-cdp-9222-1792576884733-13024.png` |

Les captures sont temporaires et hors dépôt. Le rendu n'a pas été vérifié sur téléphone physique, dans tous les navigateurs, ni sur l'intégralité de la matrice des sept presets. À la fin de la phase 2, les phases 3 et 4 restaient en attente ; le bilan de la phase 3 suit.

## Bilan de la phase 3 — Documentation

### Réalisation

- `/docs` : introduction ; `/docs/installation`, `/docs/nextjs`, `/docs/theming`, `/docs/customization`, `/docs/accessibility` : cinq guides.
- Vingt références sous `/docs/components/<family>` : Button, Input, Select, Dialog, Tabs, Card, DataTable, DataGrid, Form, Navbar, Sidebar, DashboardLayout, Charts, DatePicker, Toast, Command, Table, Badge, Alert et Tooltip.
- Chaque référence comprend un vrai aperçu Pimolu, son code TSX copiable, des conseils d'utilisation, les API, les précautions d'accessibilité, les composants liés et la navigation précédente/suivante.
- API générées avec le compilateur TypeScript : unions de variantes résolues, types génériques, propriétés requises, documentation source et valeurs par défaut littérales non ambiguës. Les propriétés Pimolu héritées sont incluses ; seule une sélection d'attributs HTML courants est affichée. Une absence de valeur extraite ne prouve pas l'absence de défaut d'exécution.
- Le code affiché est extrait des fonctions réellement rendues, avec leurs imports utilisés. Il n'existe pas de deuxième version des exemples à synchroniser manuellement.
- Index de recherche généré pour les 26 documents, incluant les noms de propriétés publiques ; recherche via Dialog + Command, accessible par bouton ou Ctrl/Cmd K. Navigation documentaire en Drawer sur mobile, sidebar et sommaire sur desktop.
- Tables d'API sur desktop, descriptions verticales sur mobile ; code avec retour à la ligne pour préserver la lisibilité. Les tableaux de données conservent leur défilement local.
- DashboardLayout est présenté dans un document iframe dédié `/preview/dashboard-layout`, avec le thème/preset courants, afin de ne pas imbriquer deux régions `main`.
- Le catalogue `/components` renvoie désormais vers ces vingt références. Son extension aux 129 familles et sa personnalisation complète appartiennent à la phase 4.
- Contenu TypeScript structuré, sans ajout de moteur MDX ni dépendance de recherche : suffisant pour ce pilote, compatible avec une migration éditoriale ultérieure.
- Installation documentée dans le workspace réel ; aucune fausse commande de package npm public. Distinctions DataTable/DataGrid et DashboardLayout/AppShell explicitées.

### Fichiers de cette phase

Chemins relatifs à `apps/website/`, sauf indication contraire.

| Fichiers | Rôle |
| --- | --- |
| `content/docs.ts` | Guides, contenu des composants et navigation |
| `scripts/build-docs.mjs` | Génération des API, exemples et index de recherche |
| `content/generated/{api,examples,search}.json` | Sorties générées, ignorées par Git, jamais à modifier à la main |
| `components/docs/component-examples.tsx` | Vingt démonstrations réelles et aperçu Dashboard isolé |
| `components/docs/doc-article.tsx` | Article serveur, code, API responsive et sommaire |
| `components/docs/docs-shell.tsx`, `lib/docs-search.ts` | Navigation, recherche et priorité des références de composants |
| `app/docs/{layout.tsx,page.tsx,docs.css,not-found.tsx}` | Layout, introduction, styles limités à la documentation et 404 locale |
| `app/docs/[...slug]/page.tsx` | Routes documentaires, validation et métadonnées |
| `app/preview/[slug]/page.tsx`, `app/preview/preview.css` | Document d'aperçu Dashboard |
| `app/components/page.tsx`, `components/ui.tsx` | Accès aux références et frontière client |
| `tests/docs.test.mjs` | Cohérence des routes, exemples, génération et recherche |
| `package.json`, `.gitignore`, `README.md` | Génération automatique avant les commandes et guide de maintenance |
| `IMPLEMENTATION_PROGRESS.md`, `/docs/ai/PROJECT_CONTEXT.md` | Suivi et contexte technique durable |

### Vérifications exécutées

| Vérification | Résultat |
| --- | --- |
| `pnpm --filter @pimolu/website typecheck` | Réussi |
| `pnpm --filter @pimolu/website lint` | Réussi, aucun avertissement |
| `pnpm --filter @pimolu/website test` | 7 tests réussis : 4 documentation/génération/recherche et 3 préférences |
| `pnpm --filter @pimolu/website build` | Réussi : compilation et vérification TypeScript de production |
| Contrôle HTTP sur le serveur de production | 26/26 documents en 200 ; `/`, `/components`, `/themes` en 200 ; documents et previews inconnus en 404 |
| `git diff --check` | Réussi ; avertissements LF/CRLF uniquement |

Le générateur produit 20 groupes de références de familles, 20 exemples et 26 entrées de recherche. Le pipeline `pnpm verify` racine n'a pas été relancé dans cette phase limitée au site ; aucune source publique de la bibliothèque, token, preset ou configuration CI n'a été modifié. Aucun ajout de dépendance, commit ni push.

### Contrôles navigateur réellement effectués

Chromium via Argent/CDP. Dimensions mesurées : **1440 × 900**, **390 × 844**, **768 × 1024**. Examen d'un échantillon représentatif, pas un audit visuel exhaustif des vingt pages dans tous les presets.

- Button : clic et compteur actualisé ; copie du code confirmée par « Copied ».
- Recherche : saisie, résultats, sélection au clavier vers DatePicker, sélection de Select au clic, message sans résultat et fermeture avec Échap. Recherche composée uniquement avec les composants publics.
- Drawer documentaire mobile : ouverture, navigation vers Installation et fermeture après navigation.
- Dialog : ouverture, titre/description visibles, Échap, fermeture et restitution du focus au déclencheur.
- Form : soumission vide, message et relation ARIA d'erreur ; saisie puis soumission réussie avec confirmation locale.
- Toast : clic sur Show notification et message « Your draft is ready. » observé en production.
- Sidebar du Dashboard : réduction réelle, bouton Expand sidebar disponible ; une seule région main dans le document dédié.
- Références Button, Select, Form, DataGrid et Dashboard examinées sur mobile ; API Select corrigée en liste verticale. DataGrid examiné sur tablette en sombre, avec reduced-motion. Pas de débordement horizontal de page dans ces contrôles.
- Aucun message console de niveau error capturé durant la session contrôlée. Deux avertissements Fast Refresh ont accompagné des changements de frontière client en développement ; aucune erreur d'hydratation constatée.

Captures de production examinées, dans `C:/Users/MEC/AppData/Local/Temp/argent-chromium-media/` :

| Vue | Fichier |
| --- | --- |
| Button desktop clair — 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792591594730-13024.png` |
| DatePicker desktop sombre — 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792591634830-13024.png` |
| DataGrid tablette sombre — 768 × 1024 | `argent-screenshot-chromium-cdp-9222-1792591673989-13024.png` |
| Button mobile clair — 390 × 844 | `argent-screenshot-chromium-cdp-9222-1792591683530-13024.png` |
| Recherche mobile avec fermeture visible | `argent-screenshot-chromium-cdp-9222-1792591693349-13024.png` |
| API Select verticale sur mobile | `argent-screenshot-chromium-cdp-9222-1792591712574-13024.png` |

### Limites et prochaine phase

- Les captures restent temporaires et hors dépôt ; ni téléphone physique, ni test multi-navigateurs ou lecteur d'écran complet.
- Les exemples sont typés avec le site ; le test de génération valide aussi la syntaxe des extraits copiés. Les interactions ont été contrôlées manuellement sur les parcours listés, sans runner E2E ajouté.
- Le générateur est lancé avant dev/build/typecheck/test. Pendant un serveur dev déjà actif, relancer `docs:generate` après une modification des sources documentaires, exemples ou types publics.
- La documentation reste en anglais ; la localisation n'est pas encore implémentée.
- À la fin de la phase 3, le catalogue, la personnalisation, les contrôles complémentaires, le sitemap et les optimisations attendaient la commande **« suivant »**. Le bilan de leur réalisation suit.

## Bilan de la phase 4 — Catalogue et finalisation

### Réalisation

- `/components` couvre les **129 familles exportées**, avec recherche par nom, rôle ou export (par exemple AvatarGroup), catégories, filtre de couverture, compteur et remise à zéro. Les filtres sont conservés dans l'URL et peuvent être partagés.
- Les **20 références guidées** conservent leurs aperçus fonctionnels ; les **109 autres références** sous `/components/<family>` présentent les imports publics, API générées et liens vers l'implémentation, les styles et les tests réellement présents. Aucun faux aperçu ou exemple vide n'est annoncé. Les routes `/components/<pilot>` redirigent vers la référence documentaire canonique.
- Le catalogue est construit en croisant le routeur du Playground, les exports du registre et l'inventaire source. Les chemins et types sont contrôlés par les tests. AlertDialog réutilise les styles de Dialog : aucune feuille `alert-dialog.css` inexistante n'est annoncée.
- Sur les pages guidées, **Customize preview** expose les sept presets, modes, coins, densité, couleur de marque, largeur et direction. Les réglages sont limités au Provider de l'exemple. Le panneau est fermé initialement pour laisser le composant visible, notamment sur mobile.
- **Copy preview link** produit une URL validée ; les choix sont restitués au chargement. Le code copiable contient le Provider correspondant. **Reset preview** rétablit l'apparence héritée et remonte l'exemple pour effacer son état local. Les plafonds de largeur tiennent compte de l'espace réel et affichent la mesure obtenue.
- Les axes radius/density sont extraits des types du Provider ; les presets viennent de l'export généré. Les options visuelles ne sont pas maintenues dans une deuxième liste indépendante.
- Les vingt fonctions d'exemple ont été déplacées, sans réécriture de leur comportement, dans `components/docs/examples/` et chargées par `next/dynamic`. L'exemple demandé est chargé séparément ; la recherche et son index ne sont chargés qu'à l'ouverture du Dialog.
- La recherche couvre **135 références** : 26 documents et 109 références source. L'autofocus de Command est différé pour laisser Dialog mémoriser le contrôle d'origine, même lorsque le module est déjà chargé. La fermeture restitue ainsi le focus au contrôle qui a ouvert la recherche, sans imposer le bouton du haut de page aux ouvertures clavier.
- `/sitemap.xml` contient **138 chemins canoniques uniques**. Métadonnées, URL canoniques, robots et image sociale PNG originale **1200 × 630** ajoutés. Les documents d'aperçu sont exclus du sitemap, interdits dans robots et marqués noindex. L'image de partage consomme la palette Pimolu générée.
- Aucun changement du registre public, du Provider, des tokens, des presets, du CSS partagé ou du Playground. Aucune dépendance ajoutée, aucun commit/push, CI GitHub maintenue désactivée.

### Fichiers de cette phase

Chemins relatifs à `apps/website/`, sauf indication contraire.

| Fichiers | Rôle |
| --- | --- |
| `app/components/page.tsx`, `app/components/catalog.css` | Catalogue responsive et métadonnées |
| `app/components/[family]/page.tsx` | 109 références source/API, validation des routes et redirections des pilotes |
| `components/catalog/catalog-browser.tsx`, `lib/catalog.ts` | Recherche, catégories, couverture et état des filtres dans l'URL |
| `components/docs/api-reference.tsx` | Rendu partagé des API, table desktop et descriptions verticales mobiles |
| `components/docs/preview-workbench.tsx`, `lib/preview-settings.ts` | Réglages isolés, validation des URL, largeur mesurée et code personnalisé |
| `components/docs/examples/*.tsx` | Vingt sources de démonstration déplacées dans leurs propres modules |
| `components/docs/component-examples.tsx` | Chargement à la demande et transmission des réglages au Dashboard iframe |
| `components/docs/docs-search.tsx`, `components/docs/docs-shell.tsx` | Recherche différée et restitution du focus |
| `components/docs/doc-article.tsx`, `app/docs/docs.css` | Intégration du workbench et des API |
| `app/docs/[...slug]/page.tsx`, `app/preview/[slug]/page.tsx` | Paramètres d'aperçu validés ; noindex des previews |
| `scripts/build-docs.mjs`, `content/docs.ts` | Catalogue, types publics, options et documentation actualisée |
| `app/{layout.tsx,page.tsx,docs/page.tsx,themes/page.tsx}` | Métadonnées et canoniques des routes existantes |
| `app/{sitemap.ts,robots.ts,opengraph-image.tsx}`, `lib/site.ts` | SEO et image de partage |
| `tests/catalog.test.mjs`, `tests/docs.test.mjs` | Couverture des chemins, filtres, types, paramètres, extraits et sitemap |
| `README.md`, `IMPLEMENTATION_PROGRESS.md`, `/docs/ai/PROJECT_CONTEXT.md` | Maintenance, bilan et mémoire technique |

Les sorties `content/generated/{api,catalog-api,catalog,examples,navigation,preview-options,search}.json` restent ignorées par Git. Elles ne sont pas à modifier à la main.

### Vérifications finales exécutées

| Vérification | Résultat |
| --- | --- |
| `pnpm --filter @pimolu/website typecheck` | Réussi |
| `pnpm --filter @pimolu/website lint` | Réussi, aucun avertissement |
| `pnpm --filter @pimolu/website test` | **12/12 réussis** |
| `pnpm --filter @pimolu/website build` | Réussi : compilation, TypeScript et génération Next.js |
| Contrôle HTTP de production | **138/138 routes canoniques en 200** ; inconnues en 404 ; pilote `/components/button` redirigé en 307 vers `/docs/components/button` |
| SEO | Sitemap/robots en 200 ; canonique MultiSelect correcte ; image en 200 `image/png`, dimensions décodées 1200 × 630 et rendu examiné |
| `git diff --check` | Réussi |

Les douze tests couvrent la cohérence du catalogue et des chemins, les exports groupés et filtres, la validation/normalisation des paramètres, les extraits personnalisés, l'unicité des canoniques, les APIs génériques/variantes, la recherche et les préférences. Ils ne remplacent pas les tests d'interaction navigateur. `pnpm verify` racine n'a pas été relancé, le code public étant inchangé ; les commandes du site ont été exécutées séparément.

### Contrôles navigateur et optimisation

Chromium réel via Argent/CDP, viewports mesurés **1440 × 900**, **390 × 844**, **768 × 1024**.

- Recherche catalogue AvatarGroup → Avatar ; catégorie Forms + exemples guidés → 4 résultats ; changement au clavier vers références source → 30 résultats avec URL mise à jour.
- Préférence Cartoon/clair puis largeur 390 choisies avec les vrais Select : portée isolée constatée, site restant Default. Lien copié, configuration restituée à l'ouverture, code synchronisé.
- Clic sur Button → compteur 1 ; Reset preview → compteur 0, largeur disponible et preset hérité rétablis.
- Recherche documentaire différée : MultiSelect trouvé et navigation vers sa référence source ; Échap ferme le Dialog et le focus retourne au bouton Search docs.
- Raccourci Ctrl K depuis le bouton Copy au milieu de l'article, puis Échap : focus restitué au bouton Copy et défilement conservé à 309 px. Parcours répété avec le module de recherche déjà chargé, avec le même résultat. Le modificateur Ctrl, non exposé par l'outil clavier Argent, a été envoyé par CDP ; les autres interactions et observations passent par Argent.
- Contrôle DOM de Button dans les **14 combinaisons sept presets × clair/sombre** : valeurs attendues, une région main/un h1 et aucun débordement horizontal. Ce contrôle DOM n'est pas un audit visuel exhaustif de chaque combinaison.
- Examen visuel ciblé du catalogue desktop/mobile, de la référence MultiSelect mobile, de Cartoon clair, Glass sombre/RTL/compact/sharp sur mobile, Neo-Brutalism sombre et du Dashboard Luxury sombre/RTL. Les modes/couleurs choisis ne sont pas généralisés au site.
- Dashboard iframe : transmission effective du thème, preset, rayon, densité, marque et RTL ; une région main dans le document parent et une dans le document d'aperçu.
- Catalogue tablette en forced-colors et reduced-motion : filtres, bordures et liens visibles, aucun débordement de page. Pas de certification WCAG revendiquée.
- Chargement différé constaté dans les ressources réseau de production : le module Button est chargé sur sa page ; les modules des autres exemples ne sont pas tous chargés ensemble. Le chunk de recherche apparaît à l'ouverture du Dialog. Le bundle partagé Pimolu reste présent ; aucune baisse globale de performance ou score Lighthouse n'est inventé.
- Aucun message console de niveau warning/error capturé dans cette session de contrôle. Pas de runner E2E ou d'outil supplémentaire installé.

Captures examinées, dans `C:/Users/MEC/AppData/Local/Temp/argent-chromium-media/` :

| Vue | Fichier |
| --- | --- |
| Catalogue desktop clair final — 1440 × 900, production | `argent-screenshot-chromium-cdp-9222-1792596910043-13024.png` |
| Catalogue mobile filtré — 390 × 844, production | `argent-screenshot-chromium-cdp-9222-1792596084937-13024.png` |
| Référence MultiSelect mobile — production | `argent-screenshot-chromium-cdp-9222-1792596113967-13024.png` |
| Aperçu Glass sombre/RTL, coins sharp, densité compact — mobile | `argent-screenshot-chromium-cdp-9222-1792596193468-13024.png` |
| Catalogue tablette forced-colors/reduced-motion — 768 × 1024 | `argent-screenshot-chromium-cdp-9222-1792596263867-13024.png` |
| Aperçu Neo-Brutalism sombre — 1440 × 900 | `argent-screenshot-chromium-cdp-9222-1792596335952-13024.png` |
| Dashboard Luxury sombre/RTL avec réglages propagés — desktop | `argent-screenshot-chromium-cdp-9222-1792596396397-13024.png` |

L'image de partage examinée est aussi conservée temporairement dans `C:/Users/MEC/AppData/Local/Temp/pimolu-phase4-opengraph.png`.

### Limites et travail ultérieur

- Le catalogue est complet pour les familles actuelles ; les exemples guidés et conseils rédigés restent limités aux vingt pilotes. Les 109 autres pages sont explicitement des références source/API.
- L'accessibilité de l'ensemble des 129 familles, tous les états, lecteurs d'écran et navigateurs reste un travail distinct. Une couleur de marque personnalisée peut diminuer le contraste ; l'interface et le guide demandent de le contrôler dans les deux modes. Les dimensions mobiles sont émulées, sans téléphone physique.
- Le site n'est pas déployé. Les packages privés ne sont pas devenus des distributions npm. La localisation française, l'extension éditoriale et un audit de performance complet restent à décider avant publication.
- Les quatre phases autorisées sont réalisées. Aucune publication, réactivation de CI, nouvelle phase, modification des composants publics ni opération Git d'écriture ne sera engagée automatiquement.


## Extension — Docs, Components, Releases et exemples complets (21 octobre 2026)

Cette section remplace les chiffres du pilote décrits dans les phases historiques ci-dessus.

### Réalisé

- **Docs** réservé aux six guides : introduction, installation, Next.js, thèmes, personnalisation, accessibilité.
- **Components** regroupe le catalogue illustré et les **129 fiches** ; navigation complète par famille à gauche, catégories à droite sur grand écran, Drawer sur mobile.
- Les **109 anciennes références source** disposent maintenant d’une composition choisie, de code copiable, de conseils d’usage et de points d’accessibilité propres à la famille.
- Sélection éditoriale dans `content/extended-components.ts`. Extraction TypeScript des helpers/sections du Playground avec leurs dépendances lexicales, sans dupliquer les composants publics. Des modules autonomes locaux corrigent les cas nécessitant une adaptation au contexte documentaire.
- CSS des compositions isolé ; code CSS des helpers également proposé au lecteur. Médias réels copiés depuis les assets existants du Playground lors de la génération.
- 258 illustrations Default clair/sombre de vrais composants : viewport CSS 320 × 200, DPR 2, fichiers PNG 640 × 400. Chargement différé et bonne sélection Light/Dark/System. Aucun visuel HeroUI copié.
- Fiches canoniques `/components/<family>`. Anciennes adresses `/docs/components/<family>` en **308**, réglages de query conservés. Recherche de 135 références ; sitemap de 139 routes.
- **Releases** décrit l’état Unreleased/Development et renvoie à l’historique. Aucun tag/changelog publié trouvé localement : aucune version publique, date ou publication inventée.
- Playwright et les navigateurs Chromium, Firefox, WebKit ajoutés après accord explicite. Aucun autre kit UI ajouté ; CI GitHub toujours désactivée.

### Fichiers concernés

| Ensemble | Sources |
| --- | --- |
| Organisation des pages | `app/components/{layout.tsx,page.tsx,[family]/page.tsx,not-found.tsx}`, `app/docs/{[...slug]/page.tsx,not-found.tsx}`, `app/releases/{page.tsx,releases.css}` |
| Navigation et SEO | `components/site-header.tsx`, `app/layout.tsx`, `components/docs/{docs-shell.tsx,doc-article.tsx}`, `lib/site.ts` |
| Catalogue illustré | `components/catalog/catalog-browser.tsx`, `app/components/catalog.css`, `public/component-previews/*.png` |
| Contenu et génération | `content/{docs.ts,extended-components.ts}`, `scripts/{build-docs.mjs,extract-example.mjs}` |
| Exemples et isolation | `components/docs/{component-examples.tsx,example-ready.tsx,demo-compositions.css}`, `components/docs/examples/{anchor,context-menu,hero,spinner,table-of-contents,visually-hidden,tabs}.tsx`, `app/preview/[slug]/page.tsx`, `app/docs/docs.css`, `lib/preview-settings.ts` |
| Vérification | `playwright.config.ts`, `e2e/{catalog,accessibility}.spec.ts`, `scripts/{capture-previews,audit-accessibility}.mjs`, `tests/{catalog,docs}.test.mjs` |
| Configuration | `package.json`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `../../pnpm-lock.yaml` |
| Maintenance | `README.md`, `ACCESSIBILITY_AUDIT.md`, `IMPLEMENTATION_PROGRESS.md`, `../../docs/ai/PROJECT_CONTEXT.md` |

Les modules de démonstration/API/code/index sous `content/generated/`, la copie `public/demos/`, les rapports Playwright et `.artifacts/` sont ignorés par Git. Les 258 illustrations sont conservées comme assets du site, renouvelables explicitement par `previews:capture`.

### Vérifications exécutées

| Commande / contrôle | Résultat |
| --- | --- |
| Build Next.js de production | Réussi, compilation et TypeScript |
| `pnpm --filter @pimolu/website typecheck` | Réussi |
| `pnpm --filter @pimolu/website lint` | Réussi, aucun avertissement ESLint |
| `pnpm --filter @pimolu/website test` | **13/13 réussis**, dont les 258 signatures/dimensions PNG |
| `pnpm --filter @pimolu/website test:e2e` | **420/420 réussis**, trois moteurs, aucun retry |
| `pnpm --filter @pimolu/website audit:a11y` | **129 exemples inspectés, zéro constat structurel final** dans le périmètre limité |
| HTTP production | **139/139 routes canoniques en 200**, routes inconnues en 404, ancienne fiche en 308 avec query conservée |
| Git | Branche `dev`, aucune opération de commit/push ; `git diff --check` réussi |

La suite complète a été exécutée après les corrections fonctionnelles. Les dernières retouches de présentation (badge Releases, suppression d’un doublon d’icône externe, pluriel de catégorie) ont ensuite été recompilées et revérifiées par les scénarios catalogue/releases des trois moteurs. Les composants publics et leur CSS n’ayant pas changé, `pnpm verify` racine n’a pas été relancé.

Les premiers essais ont révélé des sélecteurs de tests inexacts et un clic avant hydratation sous WebKit. Les tests ont été corrigés d’après le DOM ; le montage réel est maintenant attendu explicitement. L’attente de `load` d’une page média a été remplacée par DOMContentLoaded puis montage interactif, sans masquer les exceptions JavaScript.

### Audit et limites

`ACCESSIBILITY_AUDIT.md` contient les preuves, parcours et propositions. Deux constats de bibliothèque restent ouverts :

1. **P1 Kanban** : une colonne pleine applique aria-disabled à ses descendants pourtant encore opérables.
2. **P2 Scheduler** : le rôle grid ne fournit pas encore le déplacement fléché attendu ; la navigation Tab/Entrée fonctionne.

Aucune correction publique n’a été appliquée pendant cet audit. Le contrôle structurel initial, les parcours clavier et les trois moteurs ne constituent pas une certification WCAG. Aucun lecteur d’écran natif ni appareil physique exécuté ; pas de revue exhaustive des contrastes, presets, overlays et codecs. WebKit Windows ne remplace pas Safari macOS/iOS.

L’installation pnpm a ajouté Playwright mais a signalé le script déjà bloqué de `unrs-resolver`. Aucune règle de scripts n’a été approuvée ou assouplie. Playwright et ses trois navigateurs ont ensuite fonctionné et les validations ci-dessus ont été exécutées.


### Captures finales réellement examinées

Captures natives Chrome via Argent/CDP, dimensions du viewport confirmées dans le navigateur puis fichiers PNG conservés dans `.artifacts/` :

| Capture | Dimensions CSS / PNG | Fichier |
| --- | --- | --- |
| Catalogue Actions sombre, cartes et navigation | 1440 × 900 | `.artifacts/catalog-desktop-dark.png` |
| Catalogue Actions clair, cartes empilées | 390 × 844 | `.artifacts/catalog-mobile-light.png` |
| Releases sombre, statut développement | 1440 × 900 | `.artifacts/releases-desktop-dark.png` |
| Guide Accessibility, forced-colors et reduced-motion actifs | 768 × 1024 | `.artifacts/docs-tablet-forced-colors.png` |

Ces quatre rendus ont été regardés. Aucun débordement horizontal constaté sur les vues catalogue mesurées ni sur le guide tablette. Les 258 miniatures ont été produites automatiquement et vérifiées en dimensions ; seules des vues représentatives du catalogue ont reçu une revue visuelle humaine par l’agent, pas une prétendue revue exhaustive des 258 images.

Les réglages de viewport et de media non exposés par Argent ont été transmis par CDP. Navigation, mesures DOM et captures de la revue manuelle passent par Argent. Les scénarios automatisés des trois moteurs utilisent Playwright, autorisé par le mainteneur.

Le journal de la suite complète de 420 tests est conservé dans `.artifacts/e2e-final.log`. Le rapport HTML Playwright courant correspond à la dernière exécution ciblée : **6/6 réussis** après les retouches de présentation. Le serveur de production du site reste accessible sur `http://localhost:3001` ; il ne s’agit pas d’un déploiement.


## Itération — corrections d’accessibilité, surfaces et exemples multiples

### Réalisé

- Kanban : les listes pleines utilisent `data-full` sans `aria-disabled` hérité par des cartes encore opérables. Les limites d’ajout et de déplacement sont conservées.
- Scheduler : une cellule constitue l’entrée Tab de la grille ; flèches avec RTL, Home/End, Control+Home/End, Entrée/Espace, F2/Échap et retour par Shift+Tab. Les événements horaires restent des contrôles séparés. Instructions associées, noms des cellules et focus visible en forced-colors.
- Navbar et Footer : `appearance="surface" | "transparent" | "floating"`, types et maps exportés, défaut surface préservé. Footer ajoute `bordered` (true par défaut). Le séparateur horizontal est indépendant du cadre flottant. Les ombres flottantes utilisent `--pimolu-shadow-raised`, sans nouveau token.
- Site : chrome transparent sur des régions pleine largeur, contenu centré. Plus de fonds rectangulaires limités au conteneur central dans la barre et le pied de page.
- **129 familles × quatre exemples = 516 compositions.** Aperçu principal conservé, trois exemples supplémentaires par fiche avec titres, explications, code TSX chargeable/copiable et styles de composition fournis. Présentation verticale aérée.
- Exemples supplémentaires extraits des vraies sections du Playground, ou rédigés dans 35 modules locaux pour les familles peu fournies. Aucun composant public réimplémenté. Les iframes évitent les collisions d’ids, landmarks, overlays et stores ; messages de hauteur filtrés par origine et fenêtre source.
- API de source limitée aux clés générées ; références inconnues en 404. Imports dynamiques et chargement différé des aperçus/code.
- Input avec label associé dans la composition FocusScope du Playground et du site.

### Fichiers de cette itération

| Partie | Fichiers |
| --- | --- |
| Bibliothèque | `registry/react/{navbar,footer}/*`, nouveaux `navbar.variants.ts` et `footer.variants.ts`, `registry/react/index.ts`, `registry/react/{kanban,scheduler}/*.tsx`, leurs tests |
| CSS public | `packages/web-styles/src/{navbar,footer,scheduler}.css` |
| Playground | `apps/playground/src/pages/{navbar,footer,kanban,scheduler,focus-scope}-page.tsx` |
| Génération | `scripts/{build-docs,build-additional-examples,extract-example}.mjs`, `content/additional/*.json`, `components/docs/additional/*.tsx` |
| Documentation et aperçus | `components/docs/{additional-examples,component-examples,doc-article}.tsx`, `app/preview/[slug]/page.tsx`, `app/api/examples/[family]/[example]/route.ts`, `app/{docs/docs,preview/preview}.css`, `content/{docs,extended-components}.ts` |
| Chrome du site | `app/{layout.tsx,globals.css}`, `components/site-header.tsx` |
| Vérification | `tests/docs.test.mjs`, `e2e/{additional-examples,accessibility}.spec.ts`, `scripts/audit-accessibility.mjs` |
| Références | READMEs anglais/français à la racine, README du site, `ACCESSIBILITY_AUDIT.md`, `docs/ai/{PROJECT_CONTEXT,COMPONENT_INVENTORY}.md` |

Les changements des phases précédentes restent présents et non commités. Les sorties `content/generated/`, bundles et captures sont générées et ignorées ; aucun de ces fichiers n’a été retouché manuellement.

### Vérifications réellement exécutées

| Commande ou contrôle | Résultat |
| --- | --- |
| `pnpm verify` | Réussi : typecheck, 1 test tokens, 8 thèmes, **1 394 tests React**, **30 tests CSS**, lint Playground, skills, build Playground |
| `pnpm audit:themes --strict` | **0 erreur, 0 avertissement**, après remplacement d’une référence d’ombre inexistante repérée lors du premier passage |
| `pnpm --dir apps/website build` | Réussi, Next.js production et TypeScript ; reconstruction après les dernières retouches clavier/FocusScope |
| Website `typecheck`, `lint`, `test` | Réussis ; **14 tests Node**, lint sans avertissement |
| Suite Playwright complète | **813/813** réussis sur Chromium/Firefox/WebKit, en 6,5 min |
| Après la dernière retouche Shift+Tab | **38/38** tests React ciblés et **9/9** tests navigateur Scheduler/Kanban sur les trois moteurs ; typecheck et lint racine relancés avec succès |
| `audit:a11y --all-examples` | **516 états initiaux, zéro constat structurel**, Chromium, Default clair à 1440 × 900 |
| Contrôles ciblés finaux | Input FocusScope nommé et focusé après ouverture ; menu du site fonctionnel à 390 × 844 sans débordement ; focus Scheduler visible à 768 × 1024 avec RTL, forced-colors et reduced-motion |
| `git diff --check` | Réussi |

Le rapport de la suite complète est conservé dans `.artifacts/e2e-813-report.html`. Le rapport Playwright courant correspond à la dernière exécution ciblée de neuf tests. Le contrôle structurel est `.artifacts/accessibility-all-examples.json`.

La suite complète précède la dernière retouche de sortie d’action par Shift+Tab et le remplacement du champ FocusScope. La reconstruction, les tests ciblés et les contrôles finaux ci-dessus portent sur ces dernières sources. Le scan structurel vérifie les états initiaux : il ne vérifie pas tous les overlays ouverts, contrastes ou annonces.

### Captures et revue visuelle

- **56 captures** Navbar/Footer : sept presets × clair/sombre × deux familles × viewports **1440 × 900** et **390 × 844**. Images examinées via quatre planches de contact, plus vues représentatives à taille lisible. Pas de débordement horizontal détecté dans cette matrice ; les trois apparences sont présentes.
- Quatre vues du guide : clair/sombre sur desktop/mobile ; navigation et captures de revue manuelle via Argent/CDP à 1440 × 900, dimensions confirmées dans le navigateur.
- Deux captures ciblées supplémentaires : menu mobile ouvert à 390 × 844 ; Scheduler RTL/forced-colors/reduced-motion à 768 × 1024.
- Dossier : `.artifacts/appearance-review/`, dont `results.json`, `navbar-1440-contact.png`, `footer-1440-contact.png`, `navbar-390-contact.png`, `footer-390-contact.png`.
- Ce sont des preuves de revue, pas une mise à jour de snapshots de référence. Les illustrations du catalogue existantes sont conservées.

### Limites et état final

Pas de lecteur d’écran natif exécuté, de certification WCAG ni de validation sur appareil physique. Les tests de montage ne remplacent pas un audit de chaque interaction des 516 compositions. Le chunk principal du Playground reste à **721,63 kB** avec l’avertissement Vite déjà connu ; aucune refonte du découpage dans cette demande.

Branche `dev`, aucun commit, push ou changement de branche. CI GitHub toujours désactivée (`ci.yml.disabled`). Aucun preset ni token officiel remplacé, aucune dépendance ajoutée dans cette itération. Serveur de production local laissé sur `http://localhost:3001`.

## Itération — identité, recherche globale et lecture des exemples

### Réalisé

- Icône SVG autonome dessinée depuis le « p » Georgia Italic de la composition d’accueil ; le header réutilise ce même tracé par masque CSS. Adaptation clair/sombre sans dépendance à une police côté navigateur.
- Recherche globale dans le header : composants, propriétés d’API, guides, thèmes et releases, soit **139 destinations**. Un seul dialogue et gestionnaire Ctrl/Cmd+K ; bouton accessible même lorsque le menu mobile est fermé. Retour du focus corrigé pour l’activation au pointeur dans WebKit.
- Onglets **Preview / Code** pour les aperçus principaux et supplémentaires. Les démonstrations restent montées pendant le changement d’onglet ; les sources supplémentaires sont chargées à la demande, avec reprise après erreur.
- L’aperçu du composant Tabs est isolé dans une iframe, comme les autres démonstrations nécessitant une isolation. Cela évite que les onglets segmentés de présentation changent les styles de ses propres onglets linéaires.
- Suppression des panneaux « Application layout styles used in this example » dans les fiches. Les sources de composition restent internes ; le vrai code d’utilisation reste consultable et copiable.
- Nouveau badge Pimolu « Live preview » discret, avec un point statique. Scrollbars accordées aux tokens existants, avec respect des réglages natifs et de forced-colors.
- Sommaires des catégories et des fiches synchronisés avec le défilement, y compris après filtrage ou navigation entre fiches. Header adapté aux largeurs intermédiaires, tablette et mobile.

### Fichiers créés ou modifiés

Chemins ci-dessous relatifs à `apps/website/`, sauf indication contraire.

| Partie | Fichiers |
| --- | --- |
| Identité et styles | `app/icon.svg`, `app/globals.css`, `app/docs/docs.css` |
| Recherche | nouveau `components/site-search.tsx`, `components/{site-header,site-provider}.tsx`, `components/docs/{docs-search,docs-shell}.tsx` |
| Exemples | `components/docs/{preview-workbench,additional-examples,component-examples,doc-article}.tsx`, `components/docs/demo-compositions.css` |
| Ancres | nouveau `components/scroll-outline.tsx`, `components/catalog/catalog-browser.tsx`, `components/docs/doc-article.tsx` |
| Vérification | nouveau `e2e/site-polish.spec.ts`, `e2e/{accessibility,additional-examples}.spec.ts`, `playwright.config.ts` |
| Références | `README.md`, ce journal, `docs/ai/PROJECT_CONTEXT.md` à la racine |

### Vérifications réellement exécutées

| Contrôle | Résultat |
| --- | --- |
| Build Next.js final, incluant TypeScript | Réussi après la correction de l’isolation Tabs |
| Typecheck explicite du site | Réussi avant la dernière isolation ; la compilation TypeScript du build couvre les sources finales |
| Lint du site | Réussi sur les sources finales |
| Tests Node du site | **14/14** réussis |
| Premier passage navigateur étendu | **430/435** réussis : les 129 fiches passent leurs contrôles initiaux sur les trois moteurs ; cinq échecs ciblés analysés ci-dessous |
| Passage ciblé final Chromium / Firefox / WebKit | **24/24**, aucun ignoré ni flaky : recherche, focus, onglets imbriqués, conservation des valeurs, code supplémentaire, ancres, header, logo, scrollbars et Menubar |
| Recherche avec le serveur de développement normal | **1/1** Chromium, avec la configuration Playwright standard sur `localhost:3001` |
| `git diff --check` | Réussi |

Les cinq échecs du premier passage étaient : retour du focus WebKit après clic (corrigé), trois attentes Menubar supposant assez de place sous le déclencheur (mise en place du test corrigée par défilement avant ouverture), et Firefox qui calcule `scrollbar-width: thin` comme `none` selon le réglage natif (comparaison avec un témoin indépendant portant la même déclaration). Une fermeture de contexte Firefox a ensuite échoué au nettoyage ; le passage séquentiel suivant a réussi, puis le passage final ci-dessus a confirmé les 24 scénarios.

Le serveur Next bloquait HMR avec l’ancienne origine de test `127.0.0.1`. La configuration Playwright utilise désormais `localhost`, comme le serveur ; aucune extension des origines autorisées dans Next. Le rapport Playwright courant correspond aux **24 contrôles ciblés**, pas à un nouveau passage complet des 435 tests. Aucun audit exhaustif lecteurs d’écran ou de tous les états/presets n’est revendiqué.

### Captures et limites

- **10 PNG** dans `.artifacts/site-polish/`, dimensions consignées dans `viewports.json` : desktop **1440 × 900**, mobile **390 × 844**, tablette **768 × 1024**. Aucun débordement horizontal dans ces captures.
- Vues obtenues : aperçu et code clair/sombre sur desktop ; aperçu et recherche clair/sombre sur mobile ; documentation sombre tablette ; catalogue avec catégorie active. Revue visuelle de vues représentatives en complément des mesures automatisées.
- Argent a permis la revue desktop, mais conservait son viewport 1440 × 900 lors des essais de redimensionnement. Les captures mobile/tablette représentatives ont donc été réalisées avec Playwright déjà installé, avec dimensions réellement vérifiées.
- Aucun snapshot de référence remplacé, aucun fichier public de la bibliothèque, preset ou token modifié. Aucune dépendance ajoutée ; CI GitHub toujours désactivée ; aucun commit ni push.
- Le serveur de développement normal reste accessible à **http://localhost:3001**. Les serveurs de revue temporaires sont arrêtés en fin de session.


## Itération — apparence dans le header et exemples lisibles

### Changements

- Le lien Themes et sa page de personnalisation disparaissent de la navigation. L’ancienne URL `/themes` redirige en 308 vers le guide existant `/docs/theming`, sans casser les favoris. Le sitemap contient désormais **138** routes canoniques ; la recherche couvre 135 références et trois destinations générales.
- Nouvelle icône palette dans le header : sept presets existants présentés avec des pastilles dérivées de leurs vraies couleurs. Le choix s’applique au site et conserve les cookies existants. Toggle icône soleil/lune pour clair/sombre ; retour au mode système dans le panneau. Les deux contrôles restent accessibles lorsque le menu mobile est fermé.
- Popconfirm : **24 px** entre les actions et la carte explicative. La correction se fait dans la génération des compositions : les blocs frères extraits retrouvent un conteneur avec espacement, sans modifier le composant public.
- Tabs : quatre choix de style visibles via SegmentedControl, distincts du composant démontré. Son code documenté n’inclut pas le sélecteur du site. L’isolation du rendu des Tabs est conservée.
- **516 snippets**, couvrant les 129 familles, passent par le nouveau compilateur `scripts/simplify-example.mjs`. Les galeries de variantes deviennent des composants explicites avec des props littérales. Les imports et fonctions d’énumération inutiles disparaissent ; aucun `VariantMap`, `optionsOf` ou classe `pg-*` n’est exposé dans les codes copiables. Les données métier, hooks et événements nécessaires restent présents.
- Les exemples supplémentaires exécutent ces mêmes modules simplifiés : le code affiché correspond au rendu. Tailwind scanne explicitement les modules générés ignorés par Git. Les exemples principaux Button, Card, Badge et Alert présentent des usages directs, sans sélecteurs techniques.
- La normalisation a révélé deux compositions Scheduler identiques après retrait du bruit. Un exemple court de demi-journée avec un vrai événement remplace le doublon ; le test d’unicité est conservé.
- Les liens de trois compositions vers l’ancien chemin inexistant `/docs/themes` pointent maintenant vers `/docs/theming`.

### Fichiers de cette itération

Chemins relatifs à `apps/website/`, sauf le contexte partagé.

| Partie | Fichiers |
| --- | --- |
| Header et navigation | nouveau `components/site-appearance.tsx`, `components/site-header.tsx`, `app/globals.css`, `app/layout.tsx`, `app/themes/page.tsx`, `lib/site.ts`, `components/docs/docs-search.tsx` |
| Sources copiables | nouveau `scripts/simplify-example.mjs`, `scripts/{build-docs,build-additional-examples}.mjs`, `components/docs/examples/{button,card,badge,alert,tabs}.tsx`, `components/docs/component-examples.tsx` |
| Compositions | nouveaux `components/docs/additional/scheduler-compact.tsx` et `content/additional/scheduler.json`, `components/docs/additional/{docs-layout-narrow,docs-layout-toc,navigation-menu-resources}.tsx` |
| Vérification | nouveau `e2e/reader-experience.spec.ts`, `e2e/site-polish.spec.ts`, `tests/{docs,catalog}.test.mjs` |
| Références | `README.md`, ce journal, `docs/ai/PROJECT_CONTEXT.md` à la racine |

Les modules/JSON de `content/generated/` ont été régénérés par le script et restent ignorés. Aucun de ces fichiers n’a été modifié manuellement.

### Vérifications

| Contrôle | Résultat |
| --- | --- |
| Build Next.js final, incluant TypeScript | Réussi sur les dernières sources |
| ESLint du site | Réussi |
| Tests Node du site | **15/15** ; dont compilation stricte des **516 snippets indépendants**, contrôles de dépendances, syntaxe et unicité |
| Suite navigateur complète | **843/843** réussis sur Chromium / Firefox / WebKit en 5,8 min : montage des 129 fiches et 387 suppléments, clavier/focus, navigation, responsive et expérience de lecture |
| Revue visuelle | 10 captures réellement obtenues ; détail ci-dessous |
| `git diff --check` | Réussi |

Les premiers essais ont révélé un bouton palette dont le SVG était placé dans le label masqué d’un Button `iconOnly` : corrigé avec sa prop publique `startIcon`. Les attentes de tests ont aussi été alignées sur le vrai comportement : le mode système garde l’attribut `system` et suit les media queries ; Firefox attend que l’iframe lazy soit défilée dans la zone visible avant de la tester. Les tests vérifient les quatre signatures visuelles de Tabs, son clavier, les sept presets, la persistance, le retour du focus, le toggle mobile, la redirection et l’écart entre boutons et carte.

### Captures et portée

- `.artifacts/reader-experience/` : panneau d’apparence clair/sombre sur desktop **1440 × 900** et mobile **390 × 844** ; code de variantes Button ; espacement Popconfirm ; quatre styles Tabs. Les quatre captures du panneau ont leurs dimensions et absence de débordement consignées dans `viewports.json`.
- Vues représentatives examinées : panneau sombre mobile, code Button, Popconfirm sombre et les quatre styles Tabs ; revue du header/panneau desktop via Argent et inspection des styles distincts dans les tests des trois moteurs. Aucune référence de snapshot remplacée.
- Aucun composant public, CSS partagé, source de tokens ou preset modifié. Aucun ajout de dépendance, commit ou push. CI GitHub toujours désactivée.
- La vérification navigateur couvre les états et scénarios effectivement testés ; elle ne constitue pas une certification WCAG ni une revue visuelle exhaustive des 516 exemples dans tous les presets. Le serveur de développement normal reste sur **http://localhost:3001**.

Rapport HTML Playwright courant : suite complète **843/843**, aucun test ignoré ni flaky. Journal conservé dans `.artifacts/reader-experience-e2e.log`. Les captures Tabs attendent la variante choisie et sa mise en style avant capture ; une image prise au milieu d’un changement d’état n’est pas retenue comme preuve finale. Le serveur de production temporaire sur 3002 et le navigateur de revue sont arrêtés ; le serveur de développement sur 3001 est conservé.


## Itération — SplitButton visible et formatage intégral des codes

### Réalisé

- Correction commune DropdownMenu/SplitButton : l’alignement start/end est appliqué **avant** le bornage à la fenêtre dans `use-anchored-position`. Le décalage supplémentaire, qui pouvait envoyer le menu à gauche hors écran, est supprimé. Alignement logique compatible RTL ; alignement centré par défaut inchangé pour les autres utilisateurs internes du hook.
- Les contrôles navigateur ont révélé que l’effet de focus se déclenchait avant la création du portail. Le focus est désormais posé sur la première commande **activée** à l’attachement du menu réel, avec `preventScroll`. Échap restaure le déclencheur ; les commandes désactivées restent ignorées.
- Exemple « Viewport edges » ajouté à `apps/playground/src/pages/split-button-page.tsx`.
- Nouveau `scripts/format-example.mjs`, sans dépendance supplémentaire : retours à la ligne par analyse syntaxique, cible 88 colonnes, indentation de deux espaces, séparation des imports/déclarations, props JSX, enfants, objets, tableaux, appels, paramètres déstructurés et ternaires. Les descriptions et assets textuels longs sont découpés sans changer leur valeur. Les valeurs atomiques de classe ne sont pas cassées arbitrairement.
- **Les 516 exemples**, couvrant les 129 familles, ont été régénérés. Le formatage atteint un résultat stable ; un test vérifie chaque sortie et refuse toute ligne de plus de **140 caractères**. Le test de compilation indépendante des 516 codes reste actif. Aucun fichier généré modifié à la main.
- Les réglages Provider ajoutés aux codes personnalisés s’affichent également un par ligne.

### Fichiers

- Bibliothèque : `registry/react/internal/use-anchored-position.ts`, `registry/react/dropdown-menu/dropdown-menu.tsx` et son test. Aucun export ni prop publique ajouté, aucun token/preset/CSS partagé modifié.
- Playground : `apps/playground/src/pages/split-button-page.tsx`.
- Site : nouveau `apps/website/scripts/format-example.mjs`, `scripts/simplify-example.mjs`, `lib/preview-settings.ts`, `tests/docs.test.mjs`, `e2e/reader-experience.spec.ts`, README et ce journal.
- Référence durable : `docs/ai/PROJECT_CONTEXT.md`.

### Contrôles réellement exécutés

| Contrôle | Résultat |
| --- | --- |
| Tests du site | **17/17**, dont les 516 sorties formatées/stables, leur compilation stricte et la conservation exacte des chaînes longues |
| React ciblé final | **19/19** DropdownMenu/SplitButton : géométrie, RTL, bord gauche/droit, montage du portail, commandes désactivées, focus et Échap |
| Suite React complète | **1 401/1 401** réussis, 136 fichiers, sur les sources finales |
| Typecheck racine | Réussi après la dernière correction des tests |
| ESLint site et Playground | Réussis |
| Build Next.js final | Réussi, compilation TypeScript incluse |
| Build Playground final | Réussi ; avertissement Vite de chunk déjà connu (**721,77 kB**), sans changement de découpage dans cette demande |
| Navigateurs ciblés finaux | **54/54** sur Chromium, Firefox et WebKit : SplitButton, DropdownMenu, overlays, exemples contenant des chaînes SVG, Spinner/ternaires, code copiable, recherche et Menubar |
| `git diff --check` | Vérifié en fin d’itération |

Les premières passes ont identifié deux erreurs de typage dans les nouveaux tests (annotation de `this` dans un mock ; option `exact` de Playwright utilisée à tort avec Testing Library), corrigées avant le typecheck final. Trois échecs navigateur initiaux ont révélé le vrai défaut de focus du portail, corrigé et couvert par le passage final de 54 tests. La suite complète de 843 tests documentée plus haut appartient à l’itération précédente ; elle n’est pas revendiquée comme relancée ici.

### Revue visuelle

- **16 captures** dans `.artifacts/split-button-format/` : sept presets × clair/sombre à **390 × 844**, plus code SplitButton et code Button à **1440 × 900**.
- Les 14 vues mobile ont été examinées via `light-contact.png` et `dark-contact.png`, avec la capture desktop du code et une ouverture réelle du menu via Argent. Le menu reste dans la fenêtre et le texte est entièrement visible ; les dimensions et bornes sont dans `results.json`.
- Aucun snapshot de référence remplacé. Les planches ont été assemblées avec Sharp déjà installé ; aucune dépendance ajoutée. Journal navigateur : `.artifacts/code-format-split-button-e2e.log`.
- CI GitHub maintenue désactivée, aucun commit ni push. Le serveur de développement utilisateur sur **http://localhost:3001** est conservé ; serveur temporaire et navigateur de revue arrêtés après les contrôles.


## 2026-10-22 ? S?lecteur compact, header persistant et navigation des d?mos

### R?alis?

- S?lecteur r?duit ? sept pastilles issues des palettes existantes et leurs noms : trois colonnes,
  s?lection visible et annonc?e par `aria-pressed`, focus clavier, persistance, clair/sombre et mode
  syst?me conserv?s. Les cartes, descriptions, bandes de couleurs et HEX ont ?t? retir?s du popup.
- Header du site sticky ; marges de d?filement et positions des sommaires/sidebar adapt?es dans
  globals.css, docs/docs.css, components/catalog.css, editorial.css, home.css et releases/releases.css.
- `components/docs/example-ready.tsx` prot?ge la navigation des 516 exemples : annulation du
  comportement de navigation des liens sans arr?ter leurs gestionnaires, y compris liens de portails
  React et `target="_top"`. Les v?ritables fragments locaux et t?l?chargements restent fonctionnels.
  Les liens de documentation et ? Open preview ? hors de cette fronti?re restent utilisables.
- Aucun changement des composants publics, tokens, presets ou du code d?exemple copiable.
- `/blog/feed.xml` reste le flux RSS pour lecteurs de flux, pas une page ?ditoriale ? lire sur le site.

### Fichiers et v?rifications

Sources : les six CSS de page ci-dessus, `components/site-appearance.tsx`, `components/docs/example-ready.tsx`.
Tests : nouveau `e2e/demo-navigation.spec.ts`, assertion visuelle de `e2e/editorial.spec.ts` adapt?e aux
sept pastilles. README et `docs/ai/PROJECT_CONTEXT.md` mis ? jour.

- Tests Node du site : **21/21**, avec compilation des **519 extraits** (516 composants et trois guides).
- Build Next.js final : **r?ussi**, v?rification TypeScript incluse.
- ESLint du site : **r?ussi**, z?ro erreur et z?ro warning ; `git diff --check` r?ussi.
- Tests navigateur finaux : **60/60** sur Chromium, Firefox, WebKit (quatre fichiers cibl?s :
  demo-navigation, reader-experience, editorial et site-polish). Navigation de Navbar surface/basic,
  liens externes, Footer, Breadcrumbs, Sidebar, Drawer en portail, interactions contr?l?es, fragments,
  t?l?chargement blob, header au scroll, persistance, responsive et recherche.
- Contr?le Chromium ?tendu : **46 compositions contenant `href`**, **147 clics** sur liens visibles
  non locaux, aucune navigation impr?vue ni nouvel onglet. 29 liens locaux exclus de ce contr?le
  (le comportement des fragments est test? s?par?ment), un t?l?chargement exclu. Les liens dans les
  panneaux ferm?s ne sont pas tous exerc?s par ce balayage ; le Drawer est couvert par les trois moteurs.
- Captures : **18** dans `.artifacts/navigation-review/`, tailles r?ellement obtenues **1440 ? 900**,
  **768 ? 1024**, **390 ? 844** ; Default clair/sombre aux trois tailles, sept presets clair/sombre sur
  mobile. Planches `contact-light.png` / `contact-dark.png` et desktop sombre examin?es ; revue manuelle
  Argent ? 1440 ? 900. Aucun d?bordement mesur?, header ? y=0 apr?s d?filement.
- Journaux : `.artifacts/navigation-{unit,lint,build,browser-final}.log` ; mesure des captures dans
  `navigation-review/visual-results.json`, d?tail des liens dans `navigation-review/link-audit.json`.
- Pas de nouvelle d?pendance, commit, push ou activation de CI.

Serveur de d?veloppement existant sur **http://localhost:3001** conserv?. Serveur de production temporaire et navigateur de revue arr?t?s apr?s les v?rifications.
