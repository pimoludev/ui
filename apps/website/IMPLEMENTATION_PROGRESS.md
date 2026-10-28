# Pimolu Website — Suivi d'implémentation

## 28 octobre 2026 — Showcase : retrait du site Pimolu

- Le site officiel ne figure plus parmi les projets de la galerie. Project
  Workspace reste la première réalisation présentée.

## 28 octobre 2026 — Cartes Showcase et Project Workspace

- Les cartes de la galerie sont des liens sur toute leur surface ; elles montrent
  uniquement la capture, le nom et la catégorie, dans une grille jusqu'à quatre
  colonnes. Les catégories sont filtrables au clavier et au pointeur.
- Ajout du site réel `https://saas-landing.pimolu.com/` sous le nom Project
  Workspace, avec des captures de son rendu clair et sombre.
- Build Next.js/TypeScript, lint, huit tests ciblés et neuf scénarios Playwright
  Chromium/Firefox/WebKit réussis. Ces scénarios couvrent le filtrage et le clic
  sur la carte vers sa destination ; le rendu a été examiné sur desktop sombre et
  mobile clair.

## 28 octobre 2026 — Galerie Showcase

- La collection présente les captures en grille responsive, avec un filtre par
  catégorie dérivé des projets existants. Les recherches menant à un projet
  réinitialisent le filtre afin de rendre sa carte accessible. Un seul projet réel
  est actuellement enregistré ; aucun projet fictif n'a été ajouté.
- Build Next.js/TypeScript, lint, 42 tests du site et 12 scénarios navigateur
  (Chromium, Firefox, WebKit) réussis. Captures examinées sur desktop sombre et
  mobile clair ; autres combinaisons vérifiées par les scénarios navigateur.

## 28 octobre 2026 — Showcase des projets Pimolu

- Nouvelle page `/showcase` : projets réels issus de `content/showcase.ts`, captures
  clair/sombre, description, technologies, lien vers le site et dépôt facultatif.
  Le site officiel constitue la première réalisation ; ses deux captures WebP
  proviennent du rendu réel. La présentation compose PageHeader, Card, Image,
  Badge et Link de Pimolu.
- Ajout au header, au footer, à la recherche globale (page et projets) et au
  sitemap. Métadonnées canoniques et données structurées CollectionPage/ItemList.
  Le README décrit comment ajouter une réalisation.
- Build Next.js/TypeScript, lint et 42 tests du site réussis. Douze scénarios
  navigateur sur Chromium, Firefox et WebKit vérifient la navigation, la recherche,
  le chargement des captures, le SEO et les largeurs 390/768/1440 px en clair/sombre.
  Captures de la page examinées sur desktop sombre et mobile clair.

## 28 octobre 2026 — Hiérarchie de lecture des guides

- Les quinze guides `/docs` mettent en évidence les concepts et les références
  techniques avec des styles basés sur les tokens du site. Les sélections sont
  éditées dans `lib/guide-emphasis.ts` ; les paragraphes source restent inchangés
  pour la recherche et le texte accessible.
- Vérifications : build Next.js/TypeScript, lint, 41 tests du site et 60 contrôles
  Chromium sur les quinze guides en clair/sombre à 390 et 1440 px. Le texte rendu
  a été comparé à sa source et les débordements de page contrôlés. Captures de
  l'introduction sur desktop en clair/sombre et du quick start sur mobile en
  clair examinées.

## 28 octobre 2026 — Articles du blog en MDX

- Les trois articles existants sont rédigés dans `content/blog/*.mdx` ; leurs
  URL, textes et ancres sont conservés. `scripts/build-blog.mjs` compile le MDX
  local et génère les métadonnées utilisées par le catalogue, la recherche, le
  sommaire, le RSS, le sitemap et le SEO. `content/journal.ts` reste l'adaptateur
  typé ; le guide de rédaction figure dans le README du site.
- Vérifications : génération et build Next.js/TypeScript, lint, 39 tests du site
  et 24 scénarios Playwright éditoriaux/SEO sur Chromium, Firefox et WebKit.
  Les textes et ancres migrés ont également été comparés aux sources précédentes.
- Les fichiers MDX sont compilés au lancement des scripts du site ; redémarrer
  le serveur de développement après une modification, comme pour les releases.

## 27 octobre 2026 — Redirection du guide providers et contrôle SEO

- `next.config.ts` : redirection permanente `/docs/providers` → `/docs/theming`.
  L’ancienne redirection d’installation est conservée.
- Contrôle sur le serveur de production local : les deux redirections retournent
  HTTP 308 avec la destination attendue. Build Next.js/TypeScript et lint de la
  configuration réussis.
- Contrôle du site public : `/docs`, `/components` et `/docs/theming` répondent
  directement 200, sans directive robots `noindex` détectée ; exploration
  Googlebot autorisée, URL canonique propre et présence dans le sitemap.
- La nouvelle redirection attend le déploiement. Aucun commit ou push effectué.

## 27 octobre 2026 — Correction de la visibilité des barres SegmentedControl

- Correction de l’itération ci-dessous : les options restent sur la même piste
  défilante, barre native visible ou masquée. Plus de bascule implicite vers
  plusieurs lignes quand la barre est masquée.
- `showScrollbar` est l’unique réglage de visibilité. Suppression de la prop
  `scrollable` non publiée et du contrôle « Enable scrolling » des deux démos.
  L’orientation verticale utilise toujours une hauteur bornée dans l’exemple.
- Le test navigateur compare les positions et largeurs des options avant/après
  activation de la barre et vérifie que le défilement masqué reste utilisable.
  Documentation, API et notes Unreleased alignées sur ce comportement.
- Vérifications : 41 tests React ciblés, 30 tests CSS, 36 tests documentation et
  33 scénarios navigateur (Chromium/Firefox/WebKit) réussis ; TypeScript, lint,
  builds des assets, du website et du Playground réussis. Contrôle visuel des
  sept presets × clair/sombre, deux orientations, barre visible/masquée.

## 27 octobre 2026 — SegmentedControl et présentation des onglets

- Géométrie de l’indicateur partagée dans le hook privé
  `registry/react/internal/use-sliding-indicator.ts` : Tabs et SegmentedControl
  gardent une animation CSS native sans nouvelle dépendance.
- SegmentedControl : `animated`, `scrollable`, `showScrollbar` et
  `classNames.indicator` ; durée/courbe via variables CSS. Options repliables
  par défaut, défilement horizontal ou vertical facultatif. Valeur de formulaire,
  sélection contrôlée, focus, disabled et réduction des animations conservés.
- TabsList : `showScrollbar` opt-in, axe vertical masqué en liste horizontale,
  sélection révélée après redimensionnement. Les règles de scrollbar du website
  passent dans `@layer base` pour respecter la politique des composants.
- Galerie Segmented des Tabs : cartes avec largeur minimale responsive de 420 px,
  deux colonnes à 1012 px et une sur mobile ; menu vertical et panneau lisibles.
  Contrôle réel de visibilité de la scrollbar ajouté à l’exemple défilant.
- Playground et website : démonstrations interactives, API générée et guide
  `docs/TABS_ANIMATION.md`. 667 exemples de composants + quatre guides compilés.
- Vérifications : `pnpm check` réussi (1 474 tests React, 30 CSS), 36 tests de
  documentation, build production/types/lint du site et build/lint Playground.
  63 tests navigateur ciblés passent sur Chromium, Firefox et WebKit.
  Firefox calcule les barres natives en `none` dans cet environnement même
  pour une déclaration inline explicite ; les tests utilisent un témoin natif
  indépendant pour respecter ce réglage, sans forcer un faux rendu.
- Revue : 448 contrôles de géométrie dans 28 configurations de SegmentedControl
  (sept presets × deux modes × mobile/desktop), orientations, RTL et défilement.
  Captures locales de 14 galeries desktop et deux mobiles, sans changer de
  snapshots de référence. Avertissement Vite de taille de chunk conservé.
- Aucun commit, push ou publication.

## 27 octobre 2026 — Indicateur Tabs en CSS natif

- `registry/react/tabs/` mesure un indicateur partagé par liste ; translation
  CSS, dimensions variables, redimensionnement, listes verticales/défilantes et
  RTL. Aucun moteur d’animation ajouté. Pas d’entrée depuis l’origine au montage.
- API additive : `animated` (actif par défaut), `classNames.indicator`, variables
  `--pimolu-tabs-indicator-duration` et `--pimolu-tabs-indicator-easing`.
  Réduction des animations prioritaire ; bordure statique en contraste forcé.
- `packages/web-styles/src/tabs.css` conserve les quatre traitements visuels et
  empêche les libellés segmented de se chevaucher dans une liste étroite.
- Playground : démonstration réglable et nouveau hook dans la personnalisation.
  Website : exemple supplémentaire autonome, API générée, explications, notes
  Unreleased ; 666 exemples de composants et quatre exemples de guides compilés.
  Guide détaillé : `docs/TABS_ANIMATION.md`.
- Vérifications : `pnpm check` réussi (1 470 tests React, 30 tests CSS) ;
  36 tests de documentation ; build production, types et lint du site réussis.
  Les 48 tests Playwright ciblés passent sur Chromium, Firefox et WebKit
  (indicateur, reader-experience et site-polish).
- Revue Playground : 896 contrôles de géométrie dans 28 configurations
  (sept presets × clair/sombre × 390/1440 px), avec quatre variants, deux
  orientations et deux directions. 28 captures responsive et 56 captures des
  variants ; artefacts locaux dans `.artifacts/tabs-indicator/`, sans modifier
  de snapshots de référence. Avertissement Vite de taille de chunk conservé.
- Aucun commit, push ou publication. Ces ajouts attendent la prochaine version npm.

## 23 octobre 2026 — Blog et navigation releases sur mobile

- Filtres du journal en grille de deux colonnes égales à 640 px et moins,
  avec cibles de 40 px minimum et rayons adaptés aux deux rangées. Le contrôle
  Pimolu conserve son état, son filtrage et sa navigation clavier.
- `ReleasesNavigation` conserve sa sidebar sticky sur desktop ; à 720 px et
  moins, un bouton ouvre un Drawer Pimolu gauche avec les mêmes liens et la
  page courante. Fermeture après navigation, Échap et retour au desktop.
  La liste ne se replie plus en liens dispersés au-dessus du contenu.
- Vérifications : lint, **26/26 tests Website**, build avec TypeScript réussis ;
  **24/24 tests Playwright** (editorial-mobile, editorial, release-mdx) sur
  Chromium, Firefox et WebKit. Grille à 320/390/640 px, desktop à 1440 px,
  filtrage réel et Home, focus du Drawer, Échap, navigation et resize.
- Revue visuelle Argent : blog desktop clair, blog et releases mobile sombre
  à 390 × 844, panneau ouvert. Aucun changement de l'API publique Pimolu.

## 23 octobre 2026 — Lien Discord

- GitHub et Discord utilisent désormais des icônes SVG communes au header et
  au footer. Noms accessibles conservés, liens externes sécurisés, zones de
  clic de 40 px et icônes du footer côte à côte. Lint et typecheck réussis.

- Invitation officielle ajoutée au header (actions desktop et menu mobile) et
  au footer, dans la rubrique Community avec GitHub :
  `https://discord.gg/b2UDyvKAcH`. Réutilisation de NavbarItem et Footer.
- Vérification : lint Website réussi. Aucun commit/push.

## 22 octobre 2026 — Titres SEO et données structurées

- Titre d'accueil : « Pimolu UI — Customizable React Component Library ».
  Titres des guides, du catalogue et des références orientés React, exemples
  et API ; titres blog/releases précisés. Slogan et titres visibles conservés.
- `lib/structured-data.ts` centralise WebSite/Organization (accueil),
  BlogPosting (articles) et BreadcrumbList (guides, catalogue/références,
  blog/articles, releases). URL absolues sur le domaine canonique.
- Les articles reprennent les données éditoriales réelles. Aucun faux avis,
  date de modification ou moteur de recherche déclaré. Sérialisation JSON
  échappant `<`, puis insertion côté serveur par `components/structured-data.tsx`.
- README documenté. Tests unitaires sur l'échappement et les faits éditoriaux ;
  test navigateur sur les titres, canoniques, hiérarchies, articles et previews.
- Vérifications : lint, **26/26 tests Website**, build Next.js avec TypeScript,
  **3/3 tests SEO Playwright** sur Chromium, Firefox et WebKit réussis.
  Aucun changement des composants publics, aucun commit/push ni déploiement.
  Rich Results Test et Search Console restent à vérifier sur le domaine déployé.

## 22 octobre 2026 — Préparation du déploiement

- Domaine canonique confirmé par le mainteneur : `https://pimolu.com`.
- `pnpm build:website` lance `build:all` avant le build Next.js ;
  `pnpm start:website` utilise le port de l'hébergeur (`PORT`, défaut 3000).
- `.github/workflows/ci.yml` remplace le workflow désactivé : deux jobs Node 24,
  `pnpm verify` pour la bibliothèque et build/lint/tests/Playwright pour le site.
  Chromium, Firefox et WebKit sont installés avec leurs dépendances Linux ;
  les rapports sont conservés sept jours. Aucun déploiement automatique ajouté.
- Textes de non-déploiement retirés des releases et de `llms.txt` ; le statut
  bêta reste explicite. Assertion navigateur mise à jour sur ce contrat.
- README du site : commandes depuis la racine, runtime SSR, configuration d'un
  hébergeur Next.js, étapes DNS/HTTPS et contrôles après déploiement. READMEs
  bilingues, AGENTS et contexte AI synchronisés avec la CI et les commandes.
- Vérifications locales : `pnpm build:website` réussi, démarrage réel avec
  `PORT=3002`, lint et **24/24 tests Website**, **18/18 tests navigateur**
  ciblés editorial/release-mdx sur les trois moteurs. `pnpm verify` réussi,
  dont **1 406 tests React**, 30 tests CSS et audit thèmes sans constat.
  Le build Playground conserve son avertissement de chunk supérieur à 500 kB.
- YAML parsé avec le parseur js-yaml déjà installé. Le workflow GitHub lui-même
  sera exécuté après push ; aucun commit/push ni changement DNS effectué.
  Le passage précédent de l'audit production couvrait 483 tests navigateur.

## 22 octobre 2026 — Releases en MDX

- Contenu migré vers `content/releases/0.1.0-beta.1.mdx` et `unreleased.mdx` :
  métadonnées littérales, Markdown et sections MDX. Les URL et ancres existantes restent
  identiques. `content/releases.ts` ne contient plus les textes, seulement l'adaptateur typé.
- `scripts/build-releases.mjs` compile les fichiers locaux avec `@mdx-js/mdx` avant
  `build-docs.mjs`. L'index, les highlights, la recherche et le sommaire dérivent des mêmes
  sections. Métadonnées, dates, slug et unicité des ancres sont vérifiés ; sorties ignorées
  sous `content/generated/releases/`. Aucun compilateur MDX livré au navigateur.
- Les pages rendent le MDX côté serveur avec des composants Pimolu ; les blocs de code
  utilisent un composant client CodeBlock pour la coloration et la copie. Un bloc npm
  copiable illustre ce rendu dans la release publiée.
- Documentation de rédaction ajoutée au README du site. Nouveau fichier MDX découvert
  automatiquement par génération ; régénérer/re démarrer le dev après modification.
- Fichiers : `content/releases/`, `content/releases.ts`, `scripts/build-releases.mjs`,
  `components/editorial/release-mdx.tsx`, `release-code-block.tsx`, la page release,
  `package.json`/lockfile, README, contexte AI et tests `releases-mdx.test.mjs` /
  `e2e/release-mdx.spec.ts`.
- Vérifications : **24/24 tests Website**, dont compilation et rendu MDX et rejet des
  métadonnées invalides ; **519 exemples** TypeScript ; typecheck, lint et build réussis.
  **3/3 tests navigateur** sur Chromium, Firefox et WebKit : rendu, copie réelle via le
  bouton avec presse-papiers simulé, navigation et route inconnue 404 ; largeurs 1440,
  768 et 390 px sans débordement. Rendu clair/sombre mobile/desktop inspecté, revue Argent.
- `@mdx-js/mdx` ajouté comme dépendance de développement du site ; aucune modification
  des packages publics. Aucun commit ni push.

## 22 octobre 2026 — Contribution dédiée et retrait d'Installation

- Nouvelle page `/docs/contributing`, intitulée Contribution sous Community : clonage,
  préparation du workspace, applications locales et vérifications des contributions.
- Page Installation supprimée du contenu, de la navigation, de la recherche et du
  sitemap. Son ancienne URL redirige en **308** vers `/docs/quick-start`.
- Quick start conserve le parcours npm complet et les informations utiles sur les
  packages et les versions. Les commandes de clonage figurent uniquement dans Contribution.
- Liens des releases et des exemples DocsLayout/HoverCard/NavigationMenu mis à jour.
  README du site et contexte de développement synchronisés ; sources générées régénérées.
- Vérifications : **21/21 tests Website**, lint et build (TypeScript inclus) réussis.
  Contrôle des données de navigation/recherche, des routes de production (200/308), du
  contenu Quick start sans clonage et du sitemap effectué. `git diff --check` passe.
- Aucun commit ni push.

## 22 octobre 2026 — Documentation après publication npm

- Vérification en lecture seule du registre npm : les cinq packages sont publiés en
  `0.1.0-beta.1`, avec `latest` et `beta` sur cette version ; React/React DOM 18 et 19
  figurent dans les peer dependencies.
- Installation et Quick start commencent par les packages npm, puis le CSS et le
  Provider. L'exemple de première interface est complet. Les commandes du dépôt sont
  identifiées comme réservées aux contributeurs ; aucun build Pimolu n'est demandé
  aux consommateurs npm.
- Rôle des cinq packages, dépendances transitives, version exacte et lockfile expliqués.
  Guide Frameworks corrigé : les packages publiés sont compilés et ne nécessitent pas
  `transpilePackages`. README anglais/français, notes de release, README du site et
  contexte/roadmap/guide de développement synchronisés.
- Vérifications : installation isolée depuis npm, sans lien workspace, de React 19
  et des packages publiés ; compilation TypeScript du Quick start, bundle CSS et rendu
  serveur réussis. La commande avec version exacte a aussi été exécutée.
  Tests Website **21/21** (dont les **519 exemples** TypeScript), lint et build réussis.
  Les quatre guides concernés et la release répondent 200 avec leur contenu actualisé
  dans le build de production. `git diff --check` passe.
- Fichiers : `content/docs.ts`, `content/handbook.ts`, `content/releases.ts`, les trois
  README, `docs/ai/PROJECT_CONTEXT.md`, `ROADMAP.md`, `DEVELOPMENT_GUIDE.md` et ce suivi.
  Les données de documentation et de recherche ont été régénérées par les scripts usuels.
- Aucun package republié, aucune dépendance du workspace modifiée, aucun commit ni push.

## 22 octobre 2026 — Correction du zoom Gantt

- Les flèches de navigation et les icônes moins/plus utilisent le slot `startIcon` de
  `Button` : elles ne sont plus masquées dans le libellé des boutons `iconOnly`.
- Le zoom s'applique après le calcul de la largeur de base. La largeur du canevas est
  explicite : les échelles jour, semaine et mois changent réellement de dimensions,
  y compris sous la largeur du conteneur et entre 50 % et 100 %.
- API inchangée, mode contrôlé et autonome conservés, limites 50–200 %, pas de 25 %,
  boutons désactivés aux limites et annonce du pourcentage conservés.
- Exemple Playground précisé, vignettes Gantt clair/sombre du catalogue actualisées.
- Fichiers : `registry/react/gantt/gantt.tsx`, `gantt.test.tsx`,
  `packages/web-styles/src/gantt.css`, `apps/playground/src/pages/gantt-page.tsx`,
  `e2e/gantt-zoom.spec.ts` et les vignettes/manifeste du catalogue.
- Vérifications : 12 tests Gantt, suite React complète **1 406/1 406**, CSS **30/30**,
  TypeScript racine, builds Website/Playground et lint Website/Playground réussis.
  **6/6 tests navigateur** sur Chromium, Firefox et WebKit : dimensions réelles des
  barres/canevas, clavier, trois échelles, limites, desktop 1440 px et mobile 390 px.
  Revue visuelle des sept presets en clair/sombre et clic manuel via Argent effectués.
- Premier passage : un timeout de chargement du test Overview sous exécutions concurrentes
  et un arrêt du serveur de développement pendant WebKit. Suite React relancée seule et
  tests navigateur relancés sur le build de production : tous passent sans modifier ces
  tests existants. Avertissement Vite existant : chunk principal d'environ 722 kB.
- Aucun commit ni push. Pas de nouvelle dépendance.

## 22 octobre 2026 ? Corrections de cadrage, visuels Pimolu et musiques locales

### R?alisations

- Champs de connexion : surface uniforme sous `:autofill` / `:-webkit-autofill`, texte lisible,
  goutti?res sym?triques et ?il centr? dans son bouton et verticalement dans le champ. CSS limit?
  ? la composition de connexion ; le contour de focus reste visible.
- Calendrier centr? horizontalement dans la composition. Les deux ?tudes cr?atives utilisent le
  vrai embl?me p, centr? et enti?rement contenu dans un cercle stable.
- Photo produit en plein cadre, ratio 3:2 et `fit="cover"`, sans bandes lat?rales ; le produit
  illustr? est d?sormais le casque Pimolu Studio, avec son embl?me.
- Deux nouveaux visuels originaux cr??s avec imagegen et optimis?s en WebP : casque (**74 Ko**) et
  ?tude de marque architecturale (**environ 100 Ko**). Avatar SVG d?riv? de l?embl?me officiel.
  Embl?me ajout? aux couvertures ?ditoriales existantes. Sources dans `public/images/`.
- Les sources g?n?r?es de d?monstration utilisent ces assets : Image, ImageCropper, Lightbox,
  Carousel, AspectRatio, Avatar, Flex/Grid, Prose, poster VideoPlayer et image Watermark. Les sources
  du Playground conservent leurs fixtures ind?pendantes ; les exemples de fichiers absents destin?s
  ? d?montrer les erreurs restent volontairement absents.
- Audio de l?accueil et des quatre exemples AudioPlayer : `/sounds/action-game.mp3` et
  `/sounds/pixel-art-game.mp3`, sans modification des fichiers fournis par le mainteneur.
- `scripts/website-demo-assets.mjs` centralise le remplacement dans les deux g?n?rateurs ; les fichiers
  g?n?r?s ne sont pas ?dit?s ? la main. Vingt-cinq modules g?n?r?s utilisent les nouveaux visuels,
  quatre utilisent les musiques. Aucune r?f?rence g?n?r?e restante vers l?ancien produit ou les WAV.

### Correctif Image n?cessaire ? l?int?gration

`registry/react/image/image.tsx` v?rifie ?galement `complete` et `naturalWidth` sur l??l?ment r?el apr?s
montage/changement de source. Une image termin?e avant hydratation quitte ainsi l??tat de chargement,
sans fabriquer de callback `onLoad`. Ref transf?r?e conserv?e, API et CSS publics inchang?s.
Deux tests de r?gression ajout?s ; une section ? Cached images ? permet de d?montrer le comportement
sur la page Image du Playground. Le contournement local de montage diff?r? de l?accueil a ?t? retir?.

### V?rifications r?ellement ex?cut?es

- Tests React complets : **1 403/1 403**, **136 fichiers** ; Image seul : **10/10**.
- Typecheck racine **r?ussi**. Builds Next.js et Playground **r?ussis**, TypeScript inclus.
  Avertissement Vite de chunk pr?existant maintenu : **722,03 Ko**.
- ESLint site et Playground **r?ussis**, z?ro erreur/warning ESLint.
- Tests Node du site finaux : **21/21**, compilation des **519 extraits** incluse.
- Tests navigateur finaux : **51/51** sur Chromium, Firefox et WebKit : accueil, g?om?trie des champs,
  calendrier, cercle et photo aux trois tailles, m?dia propri?taire, vraie lecture MP3, hydratation
  retard?e jusqu?apr?s le t?l?chargement des images, blog et palettes. Autofill simul? via le pseudo-?tat
  Chromium ; pas de manipulation du gestionnaire de mots de passe ni de vraies identifiants.
- **36 captures du site** Default clair/sombre, tailles r?elles **1440 ? 900**, **768 ? 1024**,
  **390 ? 844** ; six planches examin?es, aucun d?bordement. **14 captures** de l?image en cache dans
  le Playground : sept presets ? clair/sombre, planche examin?e.
- **24 vignettes catalogue** r?g?n?r?es pour douze familles, planche examin?e. Le s?lecteur de capture
  est d?sormais attach? au n?ud choisi avant de masquer les voisins : cela corrige le timeout observ?
  du s?lecteur vivant `:visible/nth` sur Grid. Deuxi?me passe compl?te r?ussie.
- Revue manuelle Argent ? 1440 ? 900, dont le cadre produit E-commerce.
- Captures / mesures dans `.artifacts/brand-polish-review/` ; journaux
  `.artifacts/brand-polish-{build,react,root-types,playground-build,playground-lint,lint,unit-final,browser-final,catalog-captures}.log`.

### Fichiers principaux

`components/home-discovery.tsx`, `app/home-discovery.css`, `components/editorial/artwork.tsx`,
`app/editorial.css`, `components/docs/examples/audio-player.tsx`, override Lightbox, deux g?n?rateurs
et leur nouveau normaliseur, script de capture, `public/images/`, 24 vignettes et leur manifeste,
Image React + tests, page Image Playground, `e2e/brand-polish.spec.ts`, test audio de l?accueil.
Les fichiers audio fournis restent dans `public/sounds/`. Aucun commit, push, ajout de d?pendance ou
changement de CI. Serveur de d?veloppement utilisateur 3001 conserv? ; serveurs temporaires arr?t?s.


## 22 octobre 2026 ? Illustrations interactives ajout?es ? l?accueil

### R?alisations

- **Ajouts uniquement dans la page** : une bande sous le Hero, une galerie apr?s le workspace,
  quatre univers avant le CTA final. Le Hero et son ? p ?, WorkspaceDemo, IdentityDemo, les principes,
  leurs textes et leurs styles restent pr?sents. `app/page.tsx` comporte seulement huit lignes ajout?es.
- **Bande interactive** : AvatarGroup, Badge, Button, DatePicker et Alert ; participation locale,
  choix de date, notification masquable/r?affichable.
- **Six compositions** : connexion locale (Input, PasswordInput, Checkbox), produit (Image, Rating,
  SegmentedControl et panier), calendrier, recherche Command dans Dialog, NotificationCenter avec
  compteur et pr?f?rences, AudioPlayer avec trois vrais fichiers WAV du d?p?t. Liens vers les r?f?rences.
- **Quatre univers** : Enterprise/SaaS avec approbation et progression, e-commerce avec option cadeau
  et panier, gaming sombre avec r?compense, studio cr?atif avec deux projets s?lectionnables.
- Styles limit?s aux nouveaux s?lecteurs `discovery-*`, en consommant les tokens Pimolu.
  Composants publics, tokens, presets, anciennes d?monstrations et CSS d?accueil existant non modifi?s.
  Motion r?utilise `HomeReveal` et son traitement de `prefers-reduced-motion`.

### Fichiers

- Cr??s : `components/home-discovery.tsx`, `app/home-discovery.css`, `e2e/home-discovery.spec.ts`.
- Int?gration additive : `app/page.tsx` ; suivi mis ? jour ici et dans le README.
- Assets r?utilis?s : `/demos/product.svg` et les trois WAV de `/demos/media/`.

### V?rifications r?ellement ex?cut?es

- Build Next.js final **r?ussi**, TypeScript inclus ; ESLint **r?ussi**, z?ro erreur / warning.
- Tests Node du site : **21/21**, incluant la compilation ind?pendante des 519 extraits de documentation.
- Tests navigateur finaux : **24/24**, huit sc?narios ? Chromium, Firefox, WebKit : formulaire,
  panier/?valuation, dates, commandes au clavier, notifications, lecture/pause audio r?elle et changement
  de piste, univers et onglets au clavier, conservation du workspace et personnalisation existants,
  absence de d?filement au chargement, responsive clair/sombre.
- **58 captures** Default clair/sombre ? **1440 ? 900**, **768 ? 1024**, **390 ? 844** : Hero, bande,
  galerie et quatre univers. Les six planches ont ?t? examin?es.
- **14 captures suppl?mentaires** de la fiche produit : sept presets ? clair/sombre ? 390 ? 844,
  deux planches examin?es. Mesure des contr?les des six compositions : aucun d?passement horizontal.
- Une capture Chromium suppl?mentaire en `forced-colors` ? 390 ? 844 examin?e. Ce contr?le cibl? ne
  constitue pas un audit complet avec technologies d?assistance.
- Revue manuelle Argent desktop : navigation et passage de SaaS ? Gaming.
- Captures et mesures : `.artifacts/home-discovery-review/` ; journaux `home-discovery-{build,unit,browser-final}.log`.

### Probl?mes rencontr?s et trait?s

- `Command` appelle `scrollIntoView` sur son option initiale, m?me avec `autoFocus=false` : l?affichage
  direct faisait quitter le Hero d?s l?arriv?e. La nouvelle composition ouvre maintenant Command dans
  Dialog, sur action de l?utilisateur. Aucun changement du composant public.
- Un SVG d?j? charg? avant hydratation pouvait rester dans l??tat `loading` du composant Image.
  `ProductIllustration` r?serve sa bo?te c?t? serveur et monte le vrai Image apr?s hydratation ; les
  tests v?rifient d?sormais `data-loaded=true`, pas seulement le chargement r?seau de l?image.
- La premi?re passe navigateur avait des attentes de tests trop larges et des clics avant hydratation
  sur WebKit. S?lecteurs et attente de montage corrig?s ; aucune assertion fonctionnelle supprim?e.
- Le premier lint a signal? une apostrophe JSX non ?chapp?e, corrig?e avant la validation finale.

Aucune d?pendance ajout?e ; pas de commit, push ou activation de CI. Serveur utilisateur 3001 conserv?.


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

## 2026-10-23 — Charts : rendu et exploration des données

- `registry/react/chart/` : infobulles pour BarChart, LineChart, AreaChart et DonutChart, avec pointeur, toucher et une seule entrée Tab. Flèches, Home/End et Échap ; une infobulle fermée ne revient pas sur un simple mouvement au même endroit. `showTooltip` permet de désactiver cette exploration ; `interactionLabel` localise les instructions.
- Les graphiques cartésiens mesurent leur conteneur avec ResizeObserver pour conserver des textes lisibles. `responsive={false}` préserve le viewBox fixe. Espacement des catégories et marge de l’axe adaptés ; références DOM conservées.
- `curve="smooth"` ajoute des courbes bornées entre les observations. `areaFill="gradient" | "solid"` choisit le remplissage. Les valeurs manquantes interrompent les chemins ; LineChart ne dessine plus de remplissage d’aire. Identifiants de dégradés uniques.
- `packages/web-styles/src/chart.css` : grille discrète, infobulles, curseur, anneaux et légendes ; focus visible, pan vertical tactile, réduction des animations et couleurs forcées conservés. La table sémantique reste accessible dans un conteneur masqué qui ne provoque plus de débordement mobile.
- Playground : tableau de bord fictif 2025, période trimestre/année, revenus par catégorie et comparaison 2024 ; totaux et pourcentages calculés depuis les séries affichées. Contrôles réels de courbe, remplissage et exploration ; exemple de viewBox fixe.
- Site : exemple principal autonome et copiable, documentation/API mises à jour, deux vignettes du catalogue régénérées et examinées. Aucun ajout de dépendance.

Vérifications exécutées :

- `pnpm verify` réussi pendant l’implémentation (1 411 tests React, 30 tests CSS), puis contrôles ciblés après les corrections finales.
- Version finale : 16 tests Chart ; TypeScript du dépôt ; audit thèmes strict avec 0 erreur / 0 warning ; 30 tests CSS ; builds des packages, du playground et du site réussis.
- Site : 26 tests documentaires, lint et typecheck réussis ; les 519 exemples copiables se compilent indépendamment.
- 12 parcours Playwright sur Chromium/Firefox/WebKit : page complète, trois exemples supplémentaires, filtres, clavier, responsive, RTL et couleurs forcées lorsque le moteur les expose.
- Revue du reporting sous sept presets × clair/sombre, mobile 390 × 844, RTL et contraste forcé. Captures et rapport ignorés dans `.artifacts/charts-review/`. Contrôle complémentaire pointeur tactile/clavier/filtre et absence de débordement dans les trois moteurs.

Limites : données de démonstration fictives ; pas de zoom/pan temporel, de test de gros volumes ni de revue avec lecteur d’écran. Aucune publication npm, aucun commit ou push pour cette modification.
## 2026-10-23 — Finition des composants et corrections des captures

Corrections :

- TagsInput : la règle du site qui espaçait tous les `li + li` est limitée aux listes rédactionnelles. Les tags ont une marge nulle, une hauteur cohérente par taille et restent contenus sur mobile.
- TreeTable : `selectionMode="cascade"` sélectionne les descendants, même repliés, et calcule les parents partiellement sélectionnés. Le mode indépendant reste le défaut compatible. Les lignes désactivées sont exclues des nouveaux choix. Le caption devient un bandeau au-dessus des colonnes ; l’exemple propose sélection en cascade/indépendante et archivage/restauration de données locales.
- DocsLayout : quand le sommaire passe sous l’article, la sidebar cesse d’être sticky et ne le recouvre plus. Le lien d’évitement reste masqué jusqu’au focus.

Améliorations des neuf familles demandées :

- Kanban : en-têtes plus aérés, compteurs et jauges de capacité calculées depuis `limit`, cartes plus confortables.
- Scheduler : `maxHeight`, en-têtes persistants pendant le défilement et rendu compact des événements courts ; dates/heures complètes conservées dans les noms accessibles et titres.
- Gantt : pourcentage visible dans la colonne des tâches, nom tronqué séparément du pourcentage.
- Navbar : cibles tactiles et liens plus confortables, marque contenue sur mobile et maintien du contrat clavier/Échap.
- Sidebar : contrôle placé en premier dans l’ordre DOM, retour du focus lors d’un repli contrôlé, espacements logiques RTL, état actif lisible et en-tête conservé en mode replié mobile/tablette. Exemple de navigation avec icônes et contenu piloté par la sélection.
- DashboardLayout / AppShell : piste de sidebar dérivée séparément des largeurs utilisateur, détection limitée au slot de navigation, une colonne sur petits écrans/conteneurs et correction des priorités CSS. DashboardLayout présente projets, responsables, états et progression ; le tableau défile dans sa carte sur mobile.
- PageHeader : tailles sm/md/lg, `pageHeaderVariantMap` et typographie ajustée au conteneur ; exemples compact et marketing.
- CircularProgress : petite valeur à côté du cercle, valeurs centrées mieux contenues en md/lg, états vide/complet et bornes ARIA finies en cas de max invalide.

Principaux fichiers : `registry/react/{tree-table,scheduler,gantt,kanban,sidebar,page-header,circular-progress}/`, leurs feuilles dans `packages/web-styles/src/`, les exemples et pages playground associés, `components/docs/examples/{sidebar,dashboard-layout}.tsx`, `content/extended-components.ts`, `app/docs/docs.css` et `e2e/component-polish.spec.ts`.

Vérifications exécutées :

- `pnpm verify` réussi : 136 fichiers React / 1 420 tests, 30 tests CSS, compilation des packages/playground, TypeScript, lint et validation des skills. Contrôles ciblés relancés après les derniers ajustements CSS.
- Audit des thèmes strict : 0 erreur / 0 warning. Builds website/playground réussis ; lint et typecheck du site réussis.
- 26 tests du site, dont compilation indépendante des 519 exemples copiables.
- 99 parcours Playwright dans Chromium, Firefox et WebKit : références, exemples complémentaires, régressions ciblées et zoom Gantt. Après les derniers ajustements : 21 parcours de régression supplémentaires réussis, dont tablette 800px et mobile 390px.
- Revue visuelle : 12 familles × sept presets × clair/sombre, plus mobile LTR/RTL ; 168 captures desktop et 24 mobiles, sans débordement du document mesuré. Planches et captures dans `.artifacts/component-polish/` (ignorées). Les trois familles de navigation/layout ont été recapturées après les derniers changements.
- 24 illustrations du catalogue régénérées depuis les vrais composants. Les images Charts de l’itération précédente sont conservées.

Limites : navigation mobile émulée, sans appareil physique ni lecteur d’écran exécuté ; cette revue ne constitue pas une certification WCAG exhaustive. Aucun ajout de dépendance, commit, push, merge ou publication npm. Modifications conservées sur `dev`.

## 2026-10-24 - Navigation, chart references and layout corrections

Implemented:

- Stronger category headings, dividers and more spacing in both documentation
  sidebars; the desktop navigation is 14rem wide. Component status badges preserve
  the accessible link name and supply an explanation through aria-describedby.
- Source/CSS fingerprints against a tracked beta.2 baseline automatically classify
  new families/exports and updated components/references. Deprecation is explicit
  in component-status-overrides.json. Normal builds never reset the baseline.
  Optional absent stylesheets and Windows line endings do not cause false updates.
- Five dedicated chart references: BarChart, LineChart, AreaChart, DonutChart and
  Sparkline, each with four distinct, independently compilable examples and a
  targeted API. The shared source remains registry/react/chart. The library still
  has 129 families; the site has 133 references and 532 component examples.
- /components/chart remains a selection guide with light/dark illustrations.
  Old chart preview links redirect to a dedicated preview and retain appearance
  parameters. Missing chart types are recorded in docs/COMPONENT_ROADMAP.md.
- SidebarHeader/Footer accept optional collapsedContent for a compact logo/profile.
  Collapsed item icons show focus/hover tooltips. Existing focus-return behavior
  is retained, and the mobile folded header keeps its brand and profile visible.
- DashboardLayout/AppShell keep the contextual rail beside content at 1012px and
  stack all regions on mobile. A specificity defect causing implicit columns
  when DashboardLayout had a right rail was corrected. Activity previews now use
  compact cards and real workspace content. The dashboard table scrolls inside
  its card on mobile instead of splitting names and badges into narrow fragments.
- Centered PageHeader actions sit below the content and are centered on desktop
  and mobile. Stack alignment examples now use three separated, labelled stages;
  the original align/justify behavior was correct and its API is unchanged.

Main files: registry/react/sidebar/, packages/web-styles/src/{sidebar,page-header,
app-shell,dashboard-layout}.css, the matching playground pages and Stack page,
components/docs/{docs-shell,component-examples,examples}/, chart-references.ts,
the chart supplemental examples, scripts/{build-docs,component-status,
snapshot-component-status}.mjs, catalog styles/captures, tests and README.

Validation performed:

- pnpm verify passed: 136 React files / 1,420 tests, 30 CSS tests, package and
  playground builds, TypeScript, lint, skills validation and theme integrity
  (0 errors / 0 warnings). Playground lint/build were checked again after the
  final demo adjustment. The package build includes the new Sidebar prop types.
- Website production build, TypeScript and lint passed; 29 website tests passed,
  including independent compilation of all 532 component and 3 guide examples.
  Generation/build/test commands are serialized: parallel generation can race
  while copying assets on Windows.
- Chromium, Firefox and WebKit: 48 regression/navigation/chart runs, 60 affected
  reference and supplementary-example runs, and 3 catalogue-gallery runs passed.
  Final navigation checks passed in 21 runs; the mobile-table correction was
  rechecked in 9 DashboardLayout runs. These totals include repeated scenarios.
- Visual review: 70 desktop captures (5 compositions x 7 presets x light/dark),
  10 mobile LTR/RTL captures and four full-site captures. No document overflow or
  page errors were measured in that review. Contact sheets/screenshots are in
  ignored .artifacts/navigation-review/. The final dashboard table measures 560px
  inside a 390px document with no page-level horizontal overflow.
- Twenty catalogue captures processed, including the ten new chart illustrations.
  git diff --check passed.

Remaining limits: no physical-device or screen-reader certification. Chart zoom,
pan, time aggregation and the roadmap chart types are not implemented. Shared or
transitive implementation changes need an editorial status override. A release
maintainer deliberately refreshes the status baseline; it is not time-expiring.
No dependency added, commit, push, merge, package release or deployment performed.


## 2026-10-25 - Touch scrolling and floating-control audit

Implemented:

- Select commits on a completed click/tap, not pointerdown. Mouse-down only
  retains combobox focus, and touch movement does not update the active option
  or invoke scrollIntoView. Cancelled pans leave the filter/value unchanged.
  The fix also applies to country selection in PhoneInput and to ThemeBuilder.
- Opening the styled Select explicitly focuses its trigger without scrolling;
  Safari/WebKit can therefore receive arrow keys and Escape after pointer use.
  Mouse hover, right-click, disabled choices, form submission and reset remain
  covered. Existing tests that intentionally selected on pointerdown now perform
  a completed click, retaining all their value/callback/focus assertions.
- Cascader expands on mouse hover or completed touch tap, not initial touch
  contact. TreeSelect likewise ignores touch hover and allows native panning
  when a gesture starts on a branch arrow.
- Floating placement caps width to the available viewport and reserves that cap
  before the portalled element has been measured. This prevents an initial
  Cascader overflow on a 320px screen and benefits the shared floating controls.
- Select's listbox uses border-box sizing and scroll padding, keeping the final
  keyboard-highlighted row fully inside the scrollport in short landscape views.
- Three long-list examples demonstrate the fixes in both the playground and the
  website supplements. Select/Cascader/TreeSelect usage notes describe touch
  behavior. Shared consumers receive explicit Updated metadata because their
  direct-source fingerprints do not include internal shared dependencies.

Evidence and verification:

- Three new interaction tests reproduced the Select/Cascader/TreeSelect failures
  before correction. A further narrow-viewport Cascader test failed before the
  shared-position fix. Final focused suite: 45 passed; ThemeBuilder integration
  tests also passed after adapting activation to completed clicks.
- Final React suite: 136 files / 1,426 tests passed. Root TypeScript, 30 CSS tests,
  playground lint/build and workspace assets/package builds passed. The earlier
  pnpm verify run passed; checks affected by the subsequent positioning/CSS
  refinement were rerun on the final implementation.
- Website production build, TypeScript, lint and 29 documentation tests passed,
  including independent compilation of 532 component + 3 guide examples.
- Expanded responsive review: 441 browser runs passed, including all 133 live
  references at desktop/mobile widths and the existing site/component regressions.
  After the positioning refinement, 170 targeted interaction/accessibility runs
  passed across Chromium, Firefox and WebKit. The matrix includes 320px portrait,
  844x390 landscape and 1920px desktop, plus last-option reachability.
- Five native browser touch-pan flows passed with Chromium CDP: catalogue category
  filtering, long Select, long TreeSelect, long Cascader and PhoneInput. The same
  ten project entries are deliberately skipped in Firefox/WebKit because CDP
  native touch input is Chromium-only. Those engines have separate keyboard,
  click, bounds and dismissal checks; no native iOS/Android device was tested.
- Visual review: 42 mobile open-panel captures (3 components x 7 presets x
  light/dark), without document overflow. Screenshots wait for rendering to settle
  before inspection. Contact sheets/report: ignored .artifacts/mobile-options-review/.
- git diff --check passed. No golden visual snapshots were changed.

Scope limits: responsive containment is not an exhaustive interaction audit of
all 129 families. No screen-reader or physical-device certification is claimed.
No dependencies added, commit, push, package publication or deployment performed.

## 2026-10-25 - Extended mobile interaction review

Additional defects reproduced and corrected:

- RangeSlider changed its closest bound on initial touch contact while the user
  was beginning to scroll the page. Track activation now waits for a completed
  click/tap; native input thumb dragging is retained.
- Carousel interpreted negative RTL scrollLeft as a negative slide index and
  could desynchronize its indicators. Relative slide offsets, normalized scroll
  positions, mirrored controls and RTL arrow-key navigation keep the state aligned.
- Slider and RangeSlider fills now follow the native input's direction. Explicit
  inherited dir values survive the website CSS optimizer, whose :dir() rewrite
  otherwise ignored an English-language subtree with dir="rtl".
- FileManager depended on double-tap to open a folder, which did not work in the
  Firefox/WebKit touch checks. A visible Open action works for one selected entry;
  folders navigate internally and files require the application's onOpen handler.
- Signature could ignore Clear after a captured touch stroke suppressed the
  browser's compatibility click. Clear/Undo now accept a completed touch release,
  ignore cancelled/moved gestures and avoid duplicate actions if click also fires.
- Playground demonstrations and website usage notes describe the behavior. A
  literal escape in the RangeSlider demo badge was also corrected. FileManager's
  two catalogue illustrations were refreshed to show its actual toolbar.

Verification:

- pnpm verify passed: 136 React files / 1,439 tests, 30 CSS tests, root TypeScript,
  theme/token tests and audit, playground lint/build and skill catalogue checks.
  The existing playground main-chunk size warning remains (about 731 kB).
- Website production build, TypeScript, lint and 29 documentation tests passed.
- New mobile-surfaces suite: 28 passed / 8 intentionally skipped across Chromium,
  Firefox and WebKit. It covers narrow portrait and landscape layouts, touch Open
  and Kanban move actions, RTL carousel controls/keyboard, RTL fills, native pans,
  thumb dragging, crop dragging, signature drawing and a single Clear tap.
- Final combined mobile-surfaces, touch-options and accessibility suites:
  198 passed / 18 intentionally skipped in the three browser engines. This also
  rechecks the previous selector fixes and floating bounds through 1920px.
- Native gestures use Chromium CDP only; Firefox/WebKit cover their supported
  touch taps, keyboard and layout checks. This is browser emulation, not a run on
  physical iOS/Android hardware or a screen-reader certification.
- Visual inspection: 70 mobile captures (5 families x 7 presets x light/dark),
  with RTL for sliders/carousel and no document overflow. Reviewed contact sheets
  and report are ignored under .artifacts/mobile-surfaces-review/.

No dependencies, public props or exports added. No commit, push, publication or
deployment performed. Existing unrelated docs/marketing files were left untouched.

## 2026-10-26 - Predictable customization contract

Implemented in the workspace, for the next package release:

- Optional `@pimolu/web-styles/layered.css` bundles all styles in the `pimolu`
  cascade layer. The existing unlayered entry remains unchanged. The website
  consumes the new entry with explicit theme/base/pimolu/components/utilities order.
- Typed additive `classNames` maps on Button, Input, Select, Combobox, MultiSelect,
  DialogContent and DrawerContent. Existing className, inputClassName and
  containerClassName targets remain. Named parts include the floating panels,
  options, modal overlay and close controls without ancestor-selector dependence.
- Dialog/Drawer content accepts panel `style`; styled Select now honors its
  existing control style. Default portal placement is unchanged: wrapper variables
  do not automatically cross the portal, so use the direct panel hook/style or
  a nested Provider for a theme scope.
- Input's focus ring uses an outline independent of box-shadow. This fixes the
  invalid shadow-list combination with `none` and preserves preset elevation.
- Seven Playground sections and seven standalone website supplements demonstrate
  the additions. Supplements append without renumbering existing examples:
  539 component examples plus four standalone guide examples. Their CSS stays
  readable in copied code instead of being split into concatenated strings.
- `docs/CUSTOMIZATION.md` defines stable keys, supported variables, legacy targets,
  layer recipes, portal behavior and accessibility responsibilities. English/French
  READMEs, Styling/Customization guides, context and unreleased notes are updated.
  The documentation explicitly distinguishes these changes from npm 0.1.0-beta.2.

Verification:

- `pnpm check` passed: workspace builds, 137 React test files / 1,447 tests,
  30 CSS tests, root TypeScript, token/theme checks, zero theme-audit warnings,
  Playground lint/build, skill validation and the Next.js integration example build.
- Final Playground lint/build rerun after demo refinements. The existing roughly
  731 kB Playground main-chunk warning remains; no dependency was added.
- Website production build, TypeScript and lint passed; 30 documentation tests
  passed, including independent compilation of all 543 component/guide snippets.
- Public-export browser contract: 1,974 / 1,974 observations, 47 goals across
  Chromium, Firefox, WebKit, seven presets, light/1440px and dark/390px. It reads
  the actual layered package export and verifies direct part hooks, local panel
  variables, state guards, instance isolation, focus and retained preset shadows.
- Final website customization/accessibility/touch/mobile/reader suites: 237 passed,
  18 explicitly skipped native-CDP cases in non-Chromium engines. The initial
  disabled-option test waited on Playwright's enabled-state gate; the final test
  asserts aria-disabled and deliberately attempts input with force, retaining the
  assertions that selection is ignored and a valid option remains selectable.
- Visual review: 98 real Playground component captures, seven families x seven
  presets x light/dark, desktop/light and mobile/dark, without document overflow.
  Contact sheets are ignored under `.artifacts/customization-visual/`. Select's
  custom semantic background/foreground pair was checked again after refinement.
- No golden snapshots changed. `git diff --check` passed.

Limits: classNames is implemented for these initial seven families, not every
component. Arbitrary CSS can still override essential layout, contrast or focus;
the contract documents supported recipes rather than certifying every stylesheet.
No physical-device or screen-reader certification. No npm publication, commit,
push or deployment. Unrelated docs/marketing files were left untouched.

## 2026-10-27 - Named parts across all component families

Implemented in the workspace for the next package release. This supersedes the
seven-family limitation recorded at the previous checkpoint.

- All 129 families expose optional typed `classNames` on their rendered surfaces.
  The source API audit covers 236 styled public exports and 18 explicit headless
  controls. Headless controls use their Content or child surface; no fictitious
  DOM prop is added. PimoluProvider additionally supports its own root.
- `PimoluClassNames<Family>` and `PimoluComponentParts` are exported public types.
  Unknown families and unknown part keys fail TypeScript. Built-in structural,
  variant and state classes remain alongside the supplied classes.
- A private, DOM-free context distributes compound part maps through wrappers
  and portals. Independent nested roots reset their family's map; a local part
  override replaces the inherited value for that key. Scope structure stays
  stable when maps are added or removed, retaining focus and uncontrolled input
  state. Primitive-only families do not add unnecessary context providers.
- VirtualList preserves its generic item type. Toaster supports shared card
  parts and toast() supports individual notification maps; region classes do not
  leak onto cards. FormField forwards label/message hooks to its composed parts.
- All 129 Playground pages demonstrate customization. There are 122 new isolated
  demo modules in addition to the original seven sections. Their state is local,
  static IDs are namespaced and hash links stay inside the Playground route.
- Each of the 133 website references has an appended standalone customization
  example. Existing example IDs remain stable. The site now provides 665
  component snippets plus four standalone guide snippets, all independently
  compiled. Copied examples keep embedded CSS and conditional layout classes
  readable and portable; variant callback expansion preserves object shorthand.
- The API generator documents the accepted part keys. Source checks cover styled
  exports, rendered/delegated part keys, stable compound scopes and every
  reference's customization example. The existing layered CSS contract remains
  opt-in; the default CSS entry and legacy class targets remain compatible.

Main files/directories:

- registry/react/customization/customization.types.ts; internal/use-part-classes.tsx;
  internal/merge-classes.ts; registry/react/index.ts; family source and type files.
- registry/react/test/all-parts.test.tsx and test/customization.test.tsx.
- apps/playground/src/pages/*-page.tsx and *-customization-demo.tsx.
- apps/website/components/docs/additional/*-customization.tsx;
  content/additional/*.json; scripts/build-docs.mjs, build-additional-examples.mjs
  and simplify-example.mjs; tests/customization.test.mjs and docs.test.mjs;
  e2e/customization.spec.ts, additional-examples.spec.ts and navigation-layouts.spec.ts.
- docs/CUSTOMIZATION.md, docs/COMPONENT_CUSTOMIZATION.md, the customization audit,
  project context, website guides, READMEs, CHANGELOG and unreleased notes.

Verification:

- Final pnpm check passed: 138 React files / 1,465 tests, 30 CSS tests, workspace
  TypeScript/builds, token/theme tests and audit, Playground lint/build, skills
  validation and the Next.js integration example build. The existing Playground
  main-chunk warning remains: about 760 kB (213 kB gzip).
- Website production build, TypeScript and lint passed. All 36 documentation
  tests pass, including independent compilation of the 669 snippets and the
  family-wide public API/part-target coverage checks.
- Final public-package customization runner: 1,974 / 1,974 computed-style and
  interaction observations across Chromium, Firefox and WebKit, seven presets,
  light/1440px and dark/390px; no harness/runtime errors.
- Default-markup comparison: 122 / 122 new compositions match the pre-generalization
  source copies when customization is omitted, after normalizing automatic IDs
  and duplicate class tokens. CodeBlock's plain tokens retain absent class
  attributes; an explicit regression guards against introducing class="".
- Visual smoke review: 1,806 real Playground captures (129 families x seven
  presets x light/dark), plus refreshed captures after refinements. Contact
  sheets and detailed Default crops were reviewed. No runtime errors. These
  are temporary review artifacts, not new or updated golden snapshots.
- Final customization/additional-examples/navigation-layouts/chart/demo-navigation
  campaign: 840 / 840 tests passed in Chromium, Firefox and WebKit. This includes
  all 133 customization references at 390px and 1440px and every supplemental
  example. The existing seven detailed CSS/focus contracts remain in the suite.
- Final accessibility/touch-options/mobile-surfaces/reader-experience campaign:
  216 passed / 18 explicitly skipped CDP-only native gesture cases in non-Chromium
  engines. Across both final campaigns: 1,056 passed, 18 skipped, zero failures.
  No physical-device or screen-reader certification is implied.
- Final `git diff --check` passed. Owned review servers were stopped.

Remaining limits/findings:

- The full mobile Playground pages for Calendar and TreeTable have pre-existing
  horizontal overflow at 390px in all seven dark profiles. Hiding the new
  customization section leaves the same overflow (549px / 419px respectively);
  the new sections do not cause it. The standalone website examples are checked
  independently at narrow and wide widths. This is a follow-up for the existing
  Playground compositions, not a claim that every old page/state is certified.
- A large browser run initially passed 614 cases, skipped 18 Chromium-CDP-only
  gesture cases and timed out in WebKit waiting for VideoPlayer's load event.
  The customization test now waits for DOMContentLoaded plus its real hydration
  signal, preserving every assertion. Media-network completion is not the named
  parts readiness contract. The final 840-case rerun passed, including VideoPlayer
  in all three engines.
- Arbitrary application CSS can still break layout, focus or contrast. Use the
  documented layer order and preserve accessibility states. Browser emulation
  and DOM comparisons are not physical-device or screen-reader certification.
- No package publication, commit, push or deployment. These APIs are not part
  of the published npm 0.1.0-beta.2. Unrelated docs/marketing files are untouched.

## 2026-10-27 - Calendar and TreeTable mobile Playground overflow resolved

- Root cause: the shared `.pg-stack` used an implicit grid column with an
  automatic minimum size. It grew to the minimum content width of two Calendar
  months or TreeTable's explorer instead of constraining its children. At 390px,
  the original pages reached 549px and 419px respectively, even with the new
  customization sections hidden.
- Fix: `apps/playground/src/playground.css` now gives `.pg-stack` an explicit
  `minmax(0, 1fr)` column and `min-width: 0`. Calendar's existing month wrapping
  and TreeTable's existing local scroll wrapper can now operate within the
  available width. No page-wide overflow hiding, library API or token changes.
- Playground lint and production build pass. The existing approximately 760 kB
  main-chunk warning remains.
- Targeted browser matrix: 336 / 336 checks passed in Chromium, Firefox and
  WebKit, covering Calendar/TreeTable, seven presets, light/dark and 320, 390,
  768 and 1440px widths. Month stacking on phones and side-by-side months on
  desktop, Calendar keyboard selection, TreeTable local horizontal scrolling,
  focus and keyboard selection were verified; no runtime errors.
- Broader smoke check: all 129 component families at 390px and 1440px in
  Chromium/default/dark, 258 / 258 pages without document overflow.
- 56 targeted Chromium captures and all seven contact sheets were reviewed;
  temporary artifacts are under `.artifacts/mobile-overflow-fix/`. No golden
  snapshots changed. These are browser checks, not physical-device certification.
- This resolves the two remaining Playground overflow findings in the previous
  entry. No commit, push or publication performed.
