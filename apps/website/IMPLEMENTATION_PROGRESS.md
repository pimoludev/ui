# Pimolu Website — État et vérifications

## Robustesse du montage tardif et coût des parcours — 7 novembre 2026

- La routine `measure` est déclarée avant la création du ResizeObserver. Les refs
  sont lues au moment de la mesure : une ancre assignée après l'ouverture est
  récupérée sans exiger un re-render du propriétaire du hook. Tant qu'elle est
  absente, l'attente n'effectue aucune lecture de layout ; elle est annulée à la
  fermeture et au démontage.
- La passe de préparation masquée a des dépendances explicites. Un re-render sans
  changement de placement ne relance pas la mesure. Les frames devenues inutiles
  sont annulées dès que le panneau est prêt. Le suivi resize/scroll reste actif.
- `getFocusable` mutualise les lectures de styles des ancêtres pour un seul
  parcours. Le cache est recréé à chaque appel : une modification de visibilité
  est immédiatement prise en compte lors de l'interaction suivante.
- Les tests couvrent l'ancre tardive sans re-render, l'annulation, les rendus sans
  mesure et 100 contrôles partageant un ancêtre. `pnpm verify` réussit : 1 544
  tests React dans 142 fichiers, TypeScript, thèmes, CSS, lint et build playground.
- Site : lint complet et 50 tests documentation réussis ; build production avec
  456 pages. Les 24 tests de `floating-placement.spec.ts` passent dans Chromium,
  Firefox et WebKit aux largeurs 390 et 1440px.
- Un harnais temporaire utilisant les vrais Button, Portal et hook, sans mock DOM
  ni mock ResizeObserver, passe 12 cas dans ces trois moteurs : attente sans
  lecture de layout, récupération tardive, fermeture et mise à jour de contenu
  sans nouvelle mesure. Preuves : `.artifacts/review-hardening-browser-results.json`.
- La matrice Chromium de 84 cas (sept presets × deux modes × deux largeurs × trois
  composants) est relancée. Documentation publique, notes Unreleased, démonstration
  contrôlée Popover et 29 badges Updated synchronisés. Aucun nouveau prop/export ;
  correctifs dans les sources après beta.7, non publiés sur npm.

## Régressions clavier et placement, récupération locale — 7 novembre 2026

- `internal/focusable.ts` exclut les contrôles masqués, les ancêtres `hidden` ou
  `inert`, les fieldsets désactivés et les contenus de details fermés. Dialog ne
  laisse plus Maj+Tab sortir quand une action initiale est masquée. ContextMenu
  conserve explicitement ses éléments à tabIndex négatif pour les flèches.
- Le positionnement observe l'ancre et le panneau ; une liste Select ouverte
  suit un changement de largeur local. Les panneaux latéraux limitent leur
  hauteur, et Popover peut réduire sa largeur minimale dans un espace étroit.
- Trois compositions réelles sont ajoutées au playground et à la documentation
  Preview/Code : conteneur Select redimensionné, checklist latérale défilante,
  actions Dialog conditionnelles. Les 29 références concernées restent Updated.
  Aucun nouvel export ni prop publique ; sources après beta.7, non publiées npm.
- Les fichiers locaux endommagés ont été sauvegardés dans `.artifacts/recovery-backup`
  puis récupérés par empreinte depuis les objets indexés : 24 fichiers TS/JS,
  la feuille Tabs, le lockfile et 94 captures WebP. Le cache Vitest et le cache
  Next.js ont été écartés ; les dépendances sont réinstallées depuis un store neuf.
- 170 objets Git altérés ont été récupérés avec vérification SHA-1 et les packs
  distants ont complété les objets absents. Les branches, tags et remotes sont
  parcourables et le travail non commité est conservé. Limite : un ancien checkpoint
  interne `refs/codex/turn-diffs/checkpoints/.../1793912335208/...` référence encore
  le blob README `927849b1246839892a881fb1bf5950832ac4f88a`, vide avant récupération
  et absent du distant. Il n'a pas été inventé ni la référence supprimée ; `git fsck`
  signale ce seul objet manquant. Les branches du projet ne le référencent pas.
- Vérification du dépôt exécutée : `pnpm verify` réussit, dont 1 539 tests React
  dans 142 fichiers, les tests CSS/thèmes, TypeScript, lint et build playground.
  Tests du site : 50 réussis, y compris les sources de tous les blocks et les
  exemples copiables. Le build Next.js de production est de nouveau possible.
- Les contrôles navigateur et visuels de cette correction sont consignés dans
  le complément d'accessibilité ci-dessous et dans `.artifacts/bugfix-*`.
- Résultats finaux : 75 tests Playwright réussis dans Chromium, Firefox et WebKit
  (24 sur le placement/focus, 51 sur les captures, formulaires, filtres et la
  navigation des Blocks), 84 cas visuels sur sept presets × clair/sombre × deux
  largeurs × trois composants, captures examinées. Build production : 456 pages,
  TypeScript réussi ; lint complet du site et 50 tests documentation réussis.
  Après le dernier ajustement de largeur latérale, les 33 tests CSS repassent.
- Les 24 118 fichiers de contenu du store propre ont été vérifiés par SHA-512 ;
  cinq entrées altérées du store pnpm habituel ont été remplacées après sauvegarde.
  Le dossier temporaire de récupération reste ignoré par Git.
- Réinstallation finale réussie avec le store habituel `F:\.pnpm-store\v11`, sans
  configuration locale ajoutée. `pnpm dev:website` démarre correctement ; la page
  `/components/select` et ses feuilles CSS Pimolu répondent HTTP 200. Les serveurs
  lancés pour ces vérifications ont été arrêtés après le contrôle.

Les blocages de génération décrits dans l'entrée précédente sont résolus ; son
historique de vérification reste conservé pour expliquer la récupération.

## Positionnement des surfaces flottantes — 7 novembre 2026

- Correction dans `registry/react/internal/use-anchored-position.ts` : contraintes
  de taille appliquées pendant que le panneau est masqué, notification interne
  du montage Portal, mesure terminée avant affichage et ResizeObserver attaché
  au vrai nœud. Un RAF annulable reste disponible pour une ref retardée.
- Les douze consommateurs placés autour d'un Portal transmettent la notification ;
  Menubar mesure depuis sa surface déjà montée dans le portail. Aucun nouvel
  export, prop publique, moteur d'animation ou dépendance.
- DropdownMenu, Menubar, Popover et les deux DatePickers attendent la visibilité
  avant de prendre le focus, sans déplacer la page. Popover reprend aussi le
  focus lors d'une réouverture avant la fin de son animation de sortie.
- Playground Select : composition avec zone défilante pour vérifier l'ouverture
  près d'un bord. Site : usage des 21 références directes/composées concernées,
  supplément Select Preview/Code ajouté à la fin de la liste, overrides Updated
  rafraîchis, release Unreleased et `docs/FLOATING_PLACEMENT.md` actualisés.
  Le correctif est **local, après beta.7, non publié sur npm**.
- Vérifications exécutées : 266 tests ciblés / 22 fichiers réussis, dont cinq
  tests du hook et la réouverture rapide Popover ; TypeScript racine et playground réussis ;
  lint des fichiers site modifiés réussi. Bundle ESM et déclarations régénérés
  avec les outils locaux, assets CSS/thèmes reconstruits. Vite playground
  production réussi (avertissement de taille de chunk existant).
- Navigateurs réels via Playwright sur le playground compilé : 84 cas Select
  (Chromium, Firefox, WebKit × 7 presets × clair/sombre × 1440/390 px), position
  mesurée dès la première frame visible, réouverture, clavier et retour du focus.
  30 cas supplémentaires vérifient entrée/retour du focus et réouverture de
  DropdownMenu, Menubar, Popover et des deux DatePickers dans les trois moteurs
  aux deux largeurs. Captures des sept presets examinées. Pas de test de lecteur
  d'écran ni de geste tactile sur appareil physique dans cette vérification.
- Limites **non masquées** : la suite React complète échoue encore sur le
  chargement DataGrid (JSON invalide) et le smoke Dropzone (timeout/token invalide),
  également en exécution isolée. `pnpm` rencontre une erreur de contenu non UTF-8
  dans sa résolution de gestionnaire ; les validations ciblées ont donc utilisé
  les exécutables déjà installés. Un objet Git corrompu empêche `git status`.
- La génération complète du site est bloquée par
  `content/blocks/categories.ts`, qui contient du JSON de tsconfig à la place du
  TypeScript attendu. Cette configuration n'a pas été réinventée. Le nouveau
  test `e2e/floating-placement.spec.ts` est prêt pour CI mais n'a pas pu être
  exécuté contre le site. Les 21 statuts Updated sont confirmés dans le catalogue
  existant et par calcul avec les overrides rafraîchis ; leur nouveau texte et
  le supplément doivent être régénérés une fois le fichier réparé.
- Le fichier `content/releases/unreleased.mdx` était lui aussi endommagé : restauré
  à partir de son arbre React généré, en vérifiant l'égalité exacte des métadonnées
  et de toutes les sections avec l'index généré avant ajout de la correction.
  Copie des octets abîmés conservée sous `.artifacts/`. Génération des neuf
  releases MDX réussie ensuite. Aucun objet Git ni cache de dépendances modifié.
- Traces : `.artifacts/floating-*.log`, résultats navigateurs JSON et captures.
  Aucun commit, push, déploiement ni publication.

## Accessibilité du catalogue Blocks — 6 novembre 2026

- Contraste : navigation active/hover/focus, classifications des cartes et
  onglets Preview/Code utilisent foreground/muted-foreground ; les liens
  d'intégration et de téléchargement héritent d'une couleur de texte lisible.
  L'eyebrow des fiches utilise le slot PageHeader existant. Aucune palette,
  aucun token ni composant de la bibliothèque modifié.
- Barre du catalogue placée dans une région nommée. Le lien de saut redondant de
  DocsLayout est masqué avec classNames.skipLink, le lien global reste unique
  et le main demeure un landmark de premier niveau. tabIndex=0 sur le lien
  global assure aussi sa découverte par Tab dans WebKit.
- Le block sign-in utilise CardTitle as="h2" et un eyebrow lisible. Son code
  copiable et ses deux vignettes Default clair/sombre sont à jour.
- Ajout de @axe-core/playwright 4.14.0 en devDependency et de la suite
  e2e/blocks-accessibility.spec.ts : 21 cas par preset et six cas clavier/sign-in
  validés dans Chromium, Firefox et WebKit. 168 analyses axe sur les parcours
  catalogue, Commerce, Drawer mobile et sign-in, sept presets en clair/sombre,
  sans violation détectée. Le découpage par preset conserve les vérifications
  tout en évitant le délai dépassé par l'ancienne boucle unique Firefox.
- Build Next (456 pages locales), lint, TypeScript, 50 tests site et audit des
  thèmes (0 erreur / 0 warning) réussis. Captures inspectées. Documentation
  auteur, notes Unreleased et audit d'accessibilité actualisés.
- Preuves : .artifacts/blocks-a11y-presets.log et blocks-a11y-verified.log,
  plus les logs build/lint/types/site-tests et les captures blocks-a11y-*.png.
  Cette validation automatisée ciblée ne certifie pas l'ensemble du site WCAG.
- Aucun commit, push, déploiement ou publication npm.

## Showcase Pimolu Headset ? 6 novembre 2026

- Ajout de Pimolu Headset en t?te du showcase, cat?gorie E-commerce, lien direct
  https://pimolu-headset.pimolu.com/ (HTTP 200 confirm?).
- Capture fournie par le mainteneur convertie en WebP 1600 x 851, 74 694 octets
  contre 1 277 869 octets pour le PNG. M?me capture en clair/sombre, texte
  alternatif descriptif, carte et filtre issus de la galerie existante.
- M?tadonn?es et donn?es structur?es aliment?es par le manifeste commun.
- V?rifications : test showcase, build Next et neuf tests Playwright showcase
  r?ussis dans Chromium, Firefox et WebKit (390/768/1440, clair/sombre).
- Aucun commit, push ou d?ploiement.

## Blocks : tableaux, code lisible et previews utiles ? 6 novembre 2026

- Six compositions de tableaux utilisent maintenant TableHeader, TableRow,
  TableHead, TableBody et TableCell : historique/gestion des commandes,
  inventaire, classement, comparaison de plans et comparaison compacte.
  Les cellules et en-t?tes partagent alignement/padding ; les captions de
  pr?sentation sont remplac?es par des noms accessibles sur les tables.
- Les 141 modules sources sont format?s avec Prettier (devDependency uniquement),
  cible 88 colonnes, une d?claration de variable par instruction, handlers et
  JSX lisibles. Le g?n?rateur et les commandes blocks:format / :check partagent
  le m?me formateur. Test de parit? exacte module/Preview/Code et de s?paration
  des instructions sur tout le catalogue.
- Suppression des badges de classification r?p?t?s, paragraphes g?n?riques
  et messages techniques au repos. Les r?gions status restent mont?es et
  visuellement masqu?es tant qu'elles sont vides. Les retours apr?s action et
  instructions n?cessaires sont conserv?s. Onboarding magasin/joueur recentr?s
  sur les champs, avec un seul titre utile par preview.
- Testimonials retir? de Marketing (collection vide ; toujours 141 blocks et
  46 collections disponibles). M?tadonn?es des imports et documentation align?es.
- 282 vignettes r?g?n?r?es ; le header du site est masqu? pendant la capture pour
  ne pas recouvrir les longs blocks. Revue visuelle des six tables et des deux
  onboardings, plus contr?le responsive de tous les nouveaux blocks.
- V?rifications : blocks:format:check, 50 tests site, typecheck, lint et build
  Next (456 pages locales) r?ussis. 123 sc?narios navigateur finalement valid?s
  dans Chromium/Firefox/WebKit : 116 r?ussites dans la passe g?n?rale ; 6 reprises
  pour les mesures incluant les en-t?tes de lignes et le formulaire de correction
  e-mail, puis 1 reprise WebKit isol?e apr?s collision de dossiers de traces.
  Les reprises passent (6/6 et 1/1) sans changer les composants pour les tests.
  Logs : .artifacts/block-refinement-*.log.
- Aucun changement d'API de la biblioth?que ; aucun commit, push ou publication.

## Tabs imbriques et blocks centres sur leur usage - 6 novembre 2026

- Cause du rendu hybride corrigee dans le CSS partage Tabs : les selecteurs de
  variante/orientation ciblent leurs propres slots, sans affecter les Tabs enfants.
  Specificite preservee avec :where ; indicateur CSS, clavier, RTL et mouvement
  reduit conserves. Exemple imbrique ajoute au playground et badge Updated Tabs
  confirme dans le catalogue genere (changement source apres beta.7).
- Badge Free block espace de 16px du PageHeader sur toutes les fiches.
- Quatre compositions reset/verification recomposees en ecrans cibles : demande
  de lien + confirmation, nouveau mot de passe, attente de verification par lien,
  verification par code. Correction d'adresse, renvoi et validations locales
  conserves ; simulation distincte des actions de production.
- Market product detail devient une fiche produit image/achat/informations,
  sans hero generique. References Auth0, Clerk et Atlassian documentees dans
  docs/BLOCKS_CATALOG.md. Aucune dependance UI ajoutee.
- 20 captures clair/sombre regenerees (5 blocks refaits et autres blocks utilisant
  Tabs). Revue visuelle desktop/mobile et sept presets clair/sombre.
- Verifications : build:all, 33 tests CSS, 27 tests React Tabs, 49 tests site,
  typecheck/lint site, lint/build playground, build Next (456 pages locales).
  24 tests navigateur Tabs/blocks passes dans Chromium, Firefox et WebKit.
  Une seconde passe a rencontre une erreur interne Firefox lors de la fermeture
  du contexte ; les assertions avaient termine. Reverification en serie : 9 tests passes
  (dont 3 controles supplementaires verification/invitations), voir
  .artifacts/block-polish-browser-final-serial.log. Avertissement Vite preexistant
  sur des chunks superieurs a 500 kB ; aucun echec de build.
- Tests, docs publiques et release unreleased synchronises. Aucun commit/push.

## Collections à trois variantes et commerce — 6 novembre 2026

- 91 nouvelles compositions autonomes : 141 blocks dans 46 collections
  disponibles, chacune avec au moins trois variantes. Les collections vides
  restent Planned. Répartition : Application 18, Authentication 17, Commerce 54,
  Content 15, Marketing 31, Navigation 6.
- Commerce organisé en 18 sous-catégories : product cards/detail/gallery/list,
  search, quick view, inventory, wishlist, cart, checkout, orders, order history,
  order management, tracking, payment methods, promo, reviews, live purchase.
  Launch, Leaderboard et Verify email sont identifiés dans leur catégorie.
- Variantes avec structures et interactions différentes : formulaires, photos,
  grilles, listes, tableaux, colonnes de gestion et résumés. Les handlers restent
  locaux, les achats live sont explicitement simulés et les moyens de paiement
  montrent uniquement des données masquées. Les téléchargements créent des
  fichiers réels. Aucune dépendance UI supplémentaire ni nouvelle API npm.
- 282 captures Default clair/sombre des vrais blocks. Sources et compteurs
  générés depuis les manifests, import séparé par preview. URL studio-headphones
  conservée ; ancien filtre commerce/products résolu vers product-detail.
- Vérifications exécutées : 49 tests website, compilation indépendante des
  141 sources copiables, lint sans erreur ni warning, TypeScript et build Next.js
  (456 pages locales) réussis. 105 tests navigateur de parcours/navigation/layout
  passent dans Chromium, Firefox et WebKit, plus six tests ciblés après les derniers
  ajustements de recherche et de navbar et trois tests de chargement des captures,
  soit 114 tests navigateur réussis. Largeurs 320/390/768/1440 ; galerie dans
  les presets et modes. Cela ne remplace pas un audit lecteur d'écran exhaustif.
- Documentation publique, README et catalogue de contribution actualisés.
  Aucun commit, push, déploiement ou publication npm effectué.

## Cache de développement Windows — 6 novembre 2026

- Diagnostic du journal utilisateur : le build CSS termine correctement ;
  Turbopack échoue en ouvrant une base persistante avec un fichier `.meta`
  tronqué (`Failed to open database`, `failed to fill whole buffer`).
- Cache `apps/website/.next/dev/cache/turbopack` déplacé dans `.artifacts`
  pour conservation. Cache disque de développement désactivé sous Windows
  dans `next.config.ts` ; cache en mémoire disponible, premier chargement
  après redémarrage potentiellement plus long. Configuration production distincte.
- Guide Contribution et README actualisés. Commande réelle `pnpm dev:website`
  exécutée : démarrage réussi et HTTP 200 sur `/`, `/blocks` et
  `/docs/contributing`. Second démarrage réussi avec HTTP 200 sur
  `/blocks/shop-login`. Serveur de vérification arrêté ensuite pour libérer
  le port 3001. Tests website : 48 réussis ; lint et TypeScript réussis.

## Catalogue étendu et récupération — 6 novembre 2026

- 30 compositions supplémentaires : 50 blocks, six catégories, 100 captures
  Default clair/sombre. Variantes boutique, gaming, studio, SaaS et éditoriales.
  Login/register, pricing, footer, contact, About, blog/article, FAQ, Hero,
  Compare, CTA, Features, Help/Help center, downloads et invitations sont couverts.
- Sources autonomes sous `components/blocks/<category>/<subcategory>`, manifests
  dans `content/blocks/`, imports paresseux et code copiable généré. Les pages
  indiquent les assets nécessaires et les limites des handlers locaux.
- Restauration de 22 sources absentes depuis les exemples générés ; page détail,
  test catalogue et README récupérés après corruption. Aucun fichier source texte
  vide ou contenant des octets NUL détecté lors du contrôle final. Toutes les
  sources et captures attendues par les 50 entrées sont présentes.
- Build CSS : sorties identiques conservées, fichiers temporaires uniques,
  remplacement atomique avec huit tentatives bornées sur EPERM/EACCES/EBUSY.
  En cas de verrou permanent, la sortie précédente reste intacte et le build
  échoue avec une instruction de reprise. Guide Contribution actualisé.
- Vérifications : `pnpm build:all`, 33 tests CSS, 48 tests website, lint et build
  Next.js réussis (365 pages locales, dont le design-preview local ignoré).
  63 tests Playwright (60 interaction/navigation/responsive et trois contrôles
  des captures) passent sur Chromium, Firefox et WebKit. Contrôle des layouts
  à 320, 390, 768 et 1440 px ; galerie
  vérifiée dans les presets. Les captures ne constituent pas un audit exhaustif
  de chaque block dans chaque preset ou avec un lecteur d'écran.
- Aucun commit, push, déploiement ou publication npm effectué.

Mis à jour le 5 novembre 2026. Résumé pour les contributeurs : les résultats
ci-dessous sont datés et ne garantissent pas qu'une modification ultérieure passe
les mêmes contrôles. Le journal détaillé est archivé dans `.artifacts/notes/`,
ignoré par Git et absent d'un clone neuf.

## Galerie fidèle aux compositions — 5 novembre 2026

- Présentation simplifiée selon le retour utilisateur : grille de trois colonnes
  sur grand écran, titres et compteurs sous les aperçus ; une colonne sur mobile.
  Le décor éditorial précédent et les miniatures recréées à la main sont remplacés.
- 40 WebP locaux montrent les 20 vrais blocks en Default clair/sombre. Commande
  `blocks:capture`, captures au ratio 4/3 sans recadrage du contenu, chargement différé.
  Les autres presets restent disponibles dans les previews interactives.
- Photo Unsplash de Caroline Badran intégrée au hero et au formulaire split ;
  visuel original Pimolu réutilisé pour le casque. Crédits, téléchargements et
  instructions pour les assets ajoutés aux pages concernées et au code copiable.
- Modifications dans le catalogue privé, le CSS Blocks, trois compositions,
  leurs manifests, le script de capture, les assets, les tests et la documentation.
  Aucun changement de composant public ni de thème.
- Build (TypeScript inclus), lint et 48 tests site réussis. Captures du catalogue
  desktop sombre et mobile clair inspectées. 51 tests navigateur réussis sur
  Chromium, Firefox et WebKit, dont le chargement des 40 images, les filtres,
  les formulaires, le responsive et les sept presets en clair/sombre.
- Aucun commit, push ou déploiement.

## Présentation des collections Blocks — 5 novembre 2026

- Nouvelle introduction éditoriale et compteurs calculés depuis les manifests.
- Cartes de collections en deux colonnes : décors basés sur les tokens existants,
  fenêtres illustrées, descriptions et usages disponibles ; une colonne sur mobile.
- Survol discret, focus visible, animations réduites respectées. Les miniatures
  restent décoratives et inertes. Navigation, recherche et liens de retour conservés.
- Fichiers : `_catalog/block-gallery.tsx`, `app/blocks/blocks.css`,
  `docs/BLOCKS_CATALOG.md` et ce suivi. Aucun composant public ni preset modifié.
- Vérifications : build Next.js (TypeScript inclus), lint et 48 tests site OK ;
  12 tests navigateur ciblés OK sur Chromium, Firefox et WebKit (filtres, retour,
  Drawer, confinement des miniatures sur sept presets en clair/sombre).
- Captures desktop sombre et mobile clair inspectées. Aucun commit ni push.

## Catalogue enrichi : 20 Blocks — 5 novembre 2026

- Douze nouvelles compositions : hero de lancement, bento, FAQ, contact,
  connexion par lien, onboarding en deux étapes, projets, préférences,
  fiche produit, panier, newsletter et navigation d'espace de travail.
  Répartition : Authentication 7, Marketing 6, Application 3, Commerce 2,
  Content 1, Navigation 1. Sources autonomes, imports de previews différés,
  illustrations dédiées, recherche et compteurs réels synchronisés.
- Les handlers restent locaux : validation, création/archivage de projets,
  progression, préférences, consentement, quantités et totaux sont interactifs.
  Aucun compte, email, abonnement, paiement ou commande n'est créé sur un serveur.
- Correction observée sous WebKit : les previews interactives se montent après
  l'hydratation ; la recherche et les boutons de catégories attendent leurs
  handlers. Des tests avec JavaScript retardé vérifient l'absence de saisie perdue.
- Vérifications finales : TypeScript, lint, build Next.js (335 pages locales),
  48 tests site et 48 tests navigateur Chromium/Firefox/WebKit réussis.
  Les 20 sources copiables compilent indépendamment. Les nouveaux blocs sont
  contrôlés de 320 à 1440 px ; captures mobile/desktop inspectées, catalogue
  contrôlé sur sept presets et deux modes. Documentation et notes Unreleased
  mises à jour. Aucun package UI supplémentaire, commit ou push.

## Navigation des Blocks par catégorie — 5 novembre 2026

- All blocks affiche les six catégories illustrées et leurs compteurs réels.
  Les catégories vides restent Planned, sans lien vers un faux catalogue.
  La sélection d'une catégorie ou sous-catégorie affiche ses compositions.
- Les liens des blocs conservent recherche, catégorie et sous-catégorie dans
  `from`. Le retour retrouve ces filtres après rechargement ou ouverture dans un
  nouvel onglet ; un accès direct revient à la catégorie du bloc. Les destinations
  externes ne sont jamais acceptées.
- Fichiers : `_catalog/block-gallery.tsx`, nouveau `block-back-link.tsx`, page
  `/blocks/[slug]`, `blocks.css`, tests navigateur et documentation du catalogue.
- Vérifications exécutées : build Next.js (TypeScript inclus), lint, 48 tests
  site et 36 tests navigateur Chromium/Firefox/WebKit réussis. Captures desktop
  sombre et mobile clair inspectées ; débordements contrôlés sur les sept presets
  en clair/sombre. Aucun commit ni push.

## Phases réalisées

| Phase | État |
| --- | --- |
| Fondations | Next.js App Router, TypeScript, intégration workspace, thème et navigation en place |
| Site vitrine | Accueil, compositions interactives, responsive et choix d'apparence en place |
| Documentation | Guides, API générées, exemples Preview/Code, recherche, articles et releases MDX en place |
| Catalogue | 135 références pour 129 familles, illustrations et personnalisation isolée en place |
| Stabilisation | Contrôles automatiques présents ; revues visuelles et technologies d'assistance encore ouvertes |

## Versions et travail courant

- Les cinq packages npm sont publiés en `0.1.0-beta.8`. Le [changelog](../../CHANGELOG.md)
  et les releases publiques distinguent le publié du workspace.
- Ink & Signal a été publié en beta.7 ; beta.8 publie le retour aux couleurs
  slate/indigo du commit `f01aca8`, en conservant le nouveau design et une légère
  correction de contraste du texte secondaire clair. Aucun huitième preset.
- La bibliothèque ne télécharge pas de polices. Le site les auto-héberge avec leurs
  licences dans `public/fonts/`. Les autres palettes conservent leurs valeurs
  publiées ; rayon et densité explicites restent prioritaires.
- Les guides Theming/Colors, README EN/FR et notes Unreleased décrivent beta.8.
  Le baseline des statuts est celui de beta.8 ; les 135 overrides du cycle
  précédent ont été retirés.
- Le Design Lab versionné utilise les vrais composants pour trois compositions.
  `/design-preview`, son adaptateur et ses tests dédiés sont regroupés dans
  `app/design-preview/`, ignoré et facultatif. La CI n'en dépend pas.
  Next.js inclut cette route dans un build local si le dossier est présent.

## Structure et authentification des Blocks — 5 novembre 2026

- Les modules réutilisables sont rangés dans
  `components/blocks/<catégorie>/<sous-catégorie>/<variante>.tsx`. Les composants
  du site, la navigation, le registre de previews et les miniatures sont isolés
  dans `_catalog/`, avec des miniatures par catégorie.
- Les manifests `content/blocks/authentication.ts`, `marketing.ts` et
  `application.ts` sont agrégés par `content/blocks.ts`. La taxonomie est dans
  `content/blocks/categories.ts`. Les URL des quatre blocs précédents sont
  conservées. Le générateur valide le classement des sources ; les registres
  typés imposent une preview et une miniature pour chaque bloc.
- Le catalogue contient maintenant huit blocs, dont cinq d’authentification :
  connexion compacte, connexion avec panneau, inscription avec confirmation du
  mot de passe, demande de réinitialisation et vérification à six chiffres.
  Les previews chargent les modules individuellement avec Next.js dynamic.
- Les handlers sont des démonstrations locales. Aucun compte n’est créé, aucun
  e-mail n’est envoyé et la vérification utilise explicitement `123456`. Les
  consommateurs doivent connecter leurs services. Les sources copiables restent
  autonomes et importent les composants depuis `@pimolu/react`.
- Le guide d’auteur dans `components/blocks/README.md`, le contrat
  [BLOCKS_CATALOG.md](../../docs/BLOCKS_CATALOG.md), les notes publiques Unreleased,
  les compteurs, la recherche et le sitemap reflètent ces ajouts.
- Vérifications exécutées : TypeScript, lint, 48 tests du site et build Next.js
  passent, avec 323 pages dans le build local incluant la route de design ignorée.
  Les huit sources compilent indépendamment. Les 39 scénarios navigateur ciblés
  passent sur Chromium, Firefox et WebKit : validations d’inscription, e-mail,
  code incorrect/correct, remise à zéro, previews, code, filtres, mobile et thèmes.
  Les cinq blocs Auth sont contrôlés en clair/sombre de 320 à 1 440 px ; captures
  revues pour l’inscription, la connexion avec panneau et la vérification mobile.
  La matrice des miniatures couvre aussi sept presets × deux modes.
- Les commandes Preview/Code attendent leur hydratation avant d’accepter une
  interaction. Un test retarde les scripts pour vérifier qu’un clic précoce
  n’est plus perdu. Le PIN utilise les named parts pour conserver six cellules
  sur une ligne aux petites largeurs. Aucun composant public ni baseline de
  version n’a été modifié pour ces compositions.

## Catalogue Blocks — 5 novembre 2026

- La présentation reprend le catalogue Components : sidebar, grille d’aperçus
  compacts, titres, descriptions et liens couvrant les cards, sans contrôles
  interactifs imbriqués dans ces liens.
- Six catégories et leurs sous-catégories utiles sont déclarées dans
  `content/blocks.ts` : Application, Authentication, Commerce, Content, Marketing
  et Navigation. Les compteurs correspondent aux quatre modules réels ; les
  collections sans bloc sont indiquées Planned. Le contrat et la suite prévue
  sont dans [BLOCKS_CATALOG.md](../../docs/BLOCKS_CATALOG.md).
- La recherche combine mots, usages, exports et libellés de classification,
  sans distinction de casse ou d’accents. Effacer la recherche conserve la
  catégorie ; Reset filters réinitialise l’ensemble. URL partageable, reload et
  Back restaurent les filtres validés.
- Sur mobile, la navigation s’ouvre dans un Drawer avec sous-catégories
  dépliables et retour du focus. Les miniatures de connexion utilisent des
  Skeleton décoratifs, sans champs de formulaire ; le champ de recherche a un nom
  spécifique et `autocomplete="off"`. Cette préférence ne contrôle pas tous les
  gestionnaires de mots de passe.
- README, guide public Composition, recherche globale et notes Unreleased
  documentent cette évolution. Les composants de la bibliothèque et le baseline
  de version restent ceux du travail précédent.
- Vérifications exécutées sur cette évolution : TypeScript, lint, 48 tests du
  website et build Next.js passent. Les 30 scénarios ciblés passent sur Chromium,
  Firefox et WebKit, avec recherche, URL/Back/reload, copies, sous-catégories,
  fermeture et focus du Drawer. La matrice du catalogue couvre sept presets ×
  clair/sombre à 390 et 1 440 px ; chaque miniature reste dans son cadre. Les
  quatre pages de blocs sont aussi contrôlées de 320 à 1 440 px. Captures du
  catalogue et du Drawer revues en mobile et desktop. Aucun snapshot de référence
  n’a été remplacé.

## CSS, navigation et Blocks — 5 novembre 2026

- Le bundle CSS partagé trouvé vide a été régénéré. `dev:website` appelle
  désormais `build:all`, et le builder CSS prépare ses sorties en mémoire avant
  remplacement atomique ; une sortie vide est rejetée.
- Le header conserve Docs, Components, Blocks et Showcase. Resources regroupe
  uniquement Blog et Releases, au survol souris, au clic/toucher et au clavier.
  Sur mobile, le sous-menu s’ouvre dans la navigation. `NavigationMenu.openOnHover`
  est facultatif, conserve le focus et ignore les triggers désactivés. Cette prop
  appartient au workspace après beta.7, pas à la version npm actuelle.
- Quatre Blocks gratuits : hero éditorial, connexion locale, pricing interactif
  et workspace avec recherche/création locale de projets. Catalogue filtrable,
  pages dédiées Preview/Code, copie du vrai module React, source formatée et
  vérifiée indépendamment par TypeScript. Les exemples nécessitent Pimolu et
  Tailwind ; ils ne fournissent pas de service d’authentification ou de paiement.
- Recherche globale, sitemap, llms.txt, footer et données structurées incluent
  les Blocks. Sources : `components/blocks/`, `content/blocks.ts` et
  `scripts/build-blocks.mjs`. Les notes Unreleased, guides de contribution,
  README et documentation NavigationMenu sont synchronisés ; les badges Updated
  restent associés aux changements après le baseline beta.7, qui n’a pas été remis
  à zéro.
- `PIMOLU_TEST_PORT` permet de tester un serveur de production séparément du
  développement ; la valeur par défaut reste 3001.
- Vérifications exécutées : `pnpm verify` passe avec 1 527 tests React et
  31 tests CSS ; typecheck, lint et 47 tests du website passent. Le build Next.js
  local génère 319 pages, dont la route facultative `design-preview` ignorée.
  Les quatre sources copiables compilent indépendamment. Les 63 scénarios
  navigateur ciblés passent sur Chromium, Firefox et WebKit : menu, Blocks,
  accueil, recherche, navigation mobile et SEO. Les captures du menu ont été
  revues dans sept presets × clair/sombre et les Blocks contrôlés de 320 à
  1 440 px. Aucun baseline visuel n’a été remplacé. Le warning Vite du chunk
  principal Playground (environ 769 kB) reste présent.

## Retour de palette Default — 4 novembre 2026

- À la demande du mainteneur, Default reprend les couleurs du commit
  `f01aca89fddeae45df523d90996ff492da3e0abb` en clair et en sombre. La proposition
  graphite intermédiaire est abandonnée. La typographie, les rayons, espacements,
  animations, layouts et améliorations récentes de l’accueil sont conservés.
- Les 39 autres alias historiques correspondent au commit. Seul le texte
  secondaire clair passe de `#64748B` à `#607087` pour atteindre 4,60:1 sur la
  surface atténuée. Les rôles récents de contour fonctionnel et d’accent doux
  restent disponibles. Les anciennes primitives et les autres presets sont préservés.
- Les 270 illustrations du catalogue sont régénérées. Les 135 références portent
  Updated, avec une description de ce retour de palette ; la baseline beta.7
  n’est pas modifiée. Ce travail reste distinct de la version publiée sur npm.
- Vérifications sur cette palette finale : `pnpm verify` réussi, dont 1 522 tests
  React, 13 tests thèmes et 31 tests CSS ; audit strict à 0 erreur / 0 warning.
  Website : build avec TypeScript (314 pages avec la route locale), lint,
  45 tests de documentation et 42 parcours navigateur réussis sur trois moteurs.
- Revue responsive : 72 contrôles sur accueil/catalogue/theming, trois moteurs,
  deux modes et quatre largeurs de 320 à 1440 px, sans overflow de page ni
  exception. La police de titre actuelle et l’aperçu sombre indépendant sont
  contrôlés ; captures et rapports dans `.artifacts/default-restoration/`.
- Ces vérifications ne remplacent pas une revue exhaustive de chaque état et
  technologie d’assistance. Aucun commit, push ou publication réalisé.

## Ajustements de l’accueil — 4 novembre 2026

- Les cards de découverte utilisent `surface` / `surface-foreground`, les légendes
  sont agrandies et le fond du workspace distingue mieux ses cards internes.
  Les changements restent dans les styles de l’accueil ; aucun token ni défaut
  de composant de la bibliothèque n’est modifié.
- L’aperçu d’identité démarre en sombre, avec code synchronisé et interrupteur
  indépendant des préférences du site. Le texte d’aide et les notes Unreleased
  décrivent ce comportement.
- Vérifications de cette itération : build Next.js avec TypeScript réussi
  (314 pages, dont la route locale facultative), lint et 45 tests de documentation
  réussis ; 36 parcours existants Home Discovery / Brand Polish réussis sur
  Chromium, Firefox et WebKit.
- Revue ponctuelle : 24 contrôles Default (trois moteurs × deux modes × quatre
  largeurs de 320 à 1440 px) et 12 contrôles des autres presets à 390 px, sans
  débordement de page. Le clavier confirme que l’interrupteur change uniquement
  l’aperçu et son code. Captures locales dans `.artifacts/home-polish/`.
- Les captures ont été examinées ; la comparaison pixel à pixel d’Argent n’a pas
  pu être utilisée, car la version installée ne la prend pas en charge sur Chromium.
  Ces contrôles ne mesurent pas la préférence des visiteurs pour la palette.

## Architecture et maintenance

- `app/` : routes Next.js, métadonnées, styles globaux et accueil.
- `components/` : navigation, recherche, compositions et présentation des guides.
- `content/` : guides, exemples, statuts, articles et releases MDX.
- `scripts/` : génération des contenus, API, sources copiables et illustrations.
- `e2e/` et `tests/` : parcours navigateur et vérifications de documentation.
- `content/component-status-overrides.json` : statuts éditoriaux, notamment pour
  les modifications de documentation non détectées par les fingerprints source.
- `content/component-baseline.json` : snapshot par référence avec compatibilité
  de lecture du précédent format par dossier source. L'avancer dans le workflow
  de release, jamais pour masquer un badge.

Voir le [README du site](README.md), le [guide de développement](../../docs/ai/DEVELOPMENT_GUIDE.md)
et le [design system](../../docs/ai/DESIGN_SYSTEM.md) pour les commandes et contrats.

## Vérifications enregistrées le 4 novembre 2026

| Périmètre | Résultat enregistré |
| --- | --- |
| `pnpm verify` | Réussi, dont 1 522 tests React |
| Derniers ajustements thèmes/CSS | 13 tests thèmes, 31 tests CSS ; audit strict à 0 erreur / 0 warning |
| Website | 45 tests de documentation, lint et TypeScript validés |
| Builds | Playground réussi ; Next.js réussi, 312 pages sans la revue locale |
| Revue locale sur trois moteurs | Neuf parcours Chromium/Firefox/WebKit : formulaire, données, modes, presets, densité et focus |
| Responsive Chromium | 24 captures de compositions à 320/390/768/1440 px et huit accueils, sans overflow de page |
| Contrôles Chromium | 308 captures : 22 contrôles × sept presets × clair/sombre à 390 px, sans overflow de page ni exception |
| Catalogue | 270 illustrations régénérées et contrôlées par les tests existants |

Les neuf parcours de revue locale ne font pas partie de la CI après exclusion
de `design-preview`. Les tests permanents des tokens restent versionnés.
Captures et journaux : `.artifacts/ink-and-signal/`, non versionné.
Le build sans la page a été vérifié sans l'ancien cache `.next/dev` qui la
référençait ; cache et page ont ensuite été restaurés.

## Autres vérifications historiques utiles

- Personnalisation, 27 octobre : les hooks nommés et l'entrée CSS layered ont été
  contrôlés sur les familles existantes. Le [contrat](../../docs/CUSTOMIZATION.md)
  décrit les recettes supportées ; l'[audit daté](../../docs/audits/CUSTOMIZATION_2026-10-26.md)
  conserve les constats antérieurs à leur implémentation.
- Navigation et mouvement : tests ciblés et parcours sur trois moteurs. Consulter
  les contrats [NavbarMenu](../../docs/NAVBAR_MOBILE_MENU.md), [Tabs](../../docs/TABS_ANIMATION.md)
  et [mouvement natif](../../docs/NATIVE_MOTION.md), ainsi que l'[inventaire motion](../../docs/NATIVE_MOTION_AUDIT.md).
- Les débordements Calendar/TreeTable du Playground ont été corrigés : 336 contrôles
  ciblés sur trois moteurs, sept presets, deux modes et quatre largeurs ; 258 pages
  sans overflow pour les 129 familles à 390/1440 px en Default sombre sur Chromium.

## Limites et prochaines étapes

- La revue de toutes les références, variantes et interactions reste ouverte.
  Les tests de structure ne constituent pas une certification d'accessibilité.
  Les parcours lecteur d'écran et tests utilisateurs sont distincts.
- Suivre l'[audit d'accessibilité](ACCESSIBILITY_AUDIT.md) et l'[audit qualité](../../docs/ai/QUALITY_AUDIT.md)
  pour les périmètres vérifiés et les travaux restants.
- `brandColor` ne recalcule pas automatiquement le premier plan : contrôler
  le contraste du texte, du survol et du focus.
- Le chunk principal Playground reste au-dessus du seuil Vite de 500 kB
  (environ 769 kB dans la vérification enregistrée).
- Valider le rendu d'Ink & Signal avant adoption et release. Commit, push, merge
  et publication exigent une autorisation explicite.

## Entretien de ce résumé

Conserver ici l'état, les limites, les prochaines étapes et les résultats datés
utiles aux contributeurs. Transcripts, captures, brouillons et journaux bruts
vont dans `.artifacts/notes/` ou `docs/local/`, ignorés par Git. Décisions durables,
contrats, roadmaps, audits et contenus publics restent versionnés.
Ne pas créer de lien indispensable vers une archive locale absente des clones.
