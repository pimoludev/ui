# Changelog

All notable changes to Pimolu UI. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses Semantic Versioning.

## [Unreleased]

## [0.1.0-beta.10] — 2026-11-25

Preview release. Tag: `v0.1.0-beta.10`. All five library packages are published on
npm at this version with `latest` and `beta` dist-tags. The website builds 474
pages, including 142 component references across 136 source families. Pimolu UI
remains a beta release: the human design review and the assistive-technology
review stay open.

- EN: MultiCarousel keeps every card at its `slidesPerView` column width after
  filtering. When one or two cards fit, the rail centres them and renders no
  arrows or pagination. Navigation returns when the track overflows again, and
  the uncontrolled active page resets to the nearest valid page when a filter or
  resize removes it. Single-slide carousel galleries omit their navigation, and
  the base Carousel omits the autoplay button for one slide.
- FR : MultiCarousel conserve la largeur de colonne `slidesPerView` après un
  filtre. Quand une ou deux cartes tiennent, le rail les centre et n'affiche ni
  flèches ni pagination. Les commandes reviennent dès que la piste déborde, et
  la page active non contrôlée revient à la page valide la plus proche quand un
  filtre ou un redimensionnement la supprime. Les galeries à une seule slide
  omettent leur navigation, et le Carousel de base omet le bouton de lecture
  automatique pour une slide.

- EN: `layered.css` now declares `theme, base, pimolu.tokens, pimolu.components,
  components, utilities` before importing, and splits tokens from component
  rules. Import it before Tailwind, or declare the same order first: a framework
  that declares its layers first fixes the order. Existing `@layer pimolu`
  overrides keep working.
- FR : `layered.css` déclare désormais `theme, base, pimolu.tokens,
  pimolu.components, components, utilities` avant les imports et sépare les
  tokens des règles de composants. Importez-le avant Tailwind, ou déclarez le
  même ordre en premier : un framework qui déclare ses couches en premier fixe
  l'ordre. Les surcharges `@layer pimolu` existantes restent valides.

- EN: Carousel arrows are centred on the visible stage instead of the whole
  root, including the dots row. `showControlsOnMobile={false}` hides them below
  640px on all seven carousel components while swiping, dots and keyboard
  navigation remain. `--pimolu-control-background` and
  `--pimolu-control-foreground` style arrows without changing the inactive dot
  tone.
- FR : Les flèches des carrousels sont centrées sur la scène visible et non sur
  la racine entière, points compris. `showControlsOnMobile={false}` les masque
  sous 640px sur les sept composants carrousel, le balayage, les points et le
  clavier restant disponibles. `--pimolu-control-background` et
  `--pimolu-control-foreground` stylent les flèches sans modifier le ton des
  points inactifs.

- EN: `MultiCarousel` adds `slideAppearance="plain"` to remove the built-in slide
  border, background and clipping when a product card owns its frame and hover
  transform. `PeekCarousel` adds `slideWidth` for any CSS length. Thumbnails now
  crop to a uniform `1 / 1` ratio, adjustable with
  `--pimolu-carousel-thumbnail-aspect-ratio`, and expose
  `classNames.thumbnailImage` on the image itself.
- FR : `MultiCarousel` ajoute `slideAppearance="plain"` pour retirer la bordure,
  le fond et le rognage intégrés quand une carte produit possède son cadre et
  son survol. `PeekCarousel` ajoute `slideWidth` pour toute longueur CSS. Les
  vignettes sont rognées en `1 / 1` par défaut, ajustable avec
  `--pimolu-carousel-thumbnail-aspect-ratio`, et exposent
  `classNames.thumbnailImage` sur l'image elle-même.

- EN: The generated CSS-variable reference now follows relative stylesheet
  imports, so shared carousel variables appear on every carousel family. The
  carousel and Modal references no longer claim they are unpublished.
- FR : La référence générée des variables CSS suit désormais les imports
  relatifs, afin que les variables partagées des carrousels apparaissent sur
  chaque famille. Les références carrousel et Modal ne prétendent plus être
  non publiées.

- EN: The website adds the **Identity Kit** at `/identity-kit`: choose a preset,
  a brand colour, a radius and a density, preview real components in light or
  dark, then copy CSS variables or JSON. It is a source-workspace tool that
  generates an application override; the published packages keep their single
  theming API. The theming guide and quick start now link to it.
- FR : Le site ajoute l'**Identity Kit** à `/identity-kit` : choisissez un
  preset, une couleur de marque, un rayon et une densité, prévisualisez de vrais
  composants en clair ou sombre, puis copiez les variables CSS ou le JSON. C'est
  un outil du workspace source qui génère une surcharge d'application ; les
  packages publiés conservent leur unique API de thème. Le guide des thèmes et
  le démarrage rapide y renvoient désormais.

- EN: The quick start documents the per-family stylesheet entry
  (`@pimolu/web-styles/button.css` with `tokens.css`) next to the complete
  `styles.css` bundle, and both READMEs list the published starters and
  projects that install the npm packages outside the monorepo.
- FR : Le démarrage rapide documente l'entrée par feuille de famille
  (`@pimolu/web-styles/button.css` avec `tokens.css`) à côté du bundle complet
  `styles.css`, et les deux README listent les starters et projets publiés qui
  installent les packages npm hors du monorepo.

- EN: CodeBlock numeric syntax tokens use a stronger foreground mix, meeting AA
  contrast on the code surface, and the code surface now uses a grid by default
  so newline text nodes no longer add a blank line outside the documentation
  layout. The exact palette still follows the active preset.
- FR : Les jetons numériques de CodeBlock utilisent un mélange plus fort avec le
  premier plan, atteignant le contraste AA sur la surface de code, et la surface
  de code utilise désormais une grille par défaut afin que les nœuds de texte
  newline n'ajoutent plus de ligne vide hors du layout de documentation. La
  palette exacte suit toujours le preset actif.

- EN: Alert descriptions mix the muted tone with the foreground, so they meet AA
  contrast on the tinted info, success, warning and danger surfaces.
- FR : Les descriptions d'Alert mélangent le ton atténué avec le premier plan,
  afin d'atteindre le contraste AA sur les surfaces teintées info, succès,
  avertissement et danger.

- EN: A Chromium preset-parity spec mounts every component reference in the
  seven presets and both modes at 1440px and 390px, and
  `pnpm --dir apps/website audit:presets` records the complete matrix on demand.
- FR : Une spec de parité en Chromium monte chaque référence de composant dans
  les sept presets et les deux modes à 1440px et 390px, et
  `pnpm --dir apps/website audit:presets` enregistre la matrice complète à la
  demande.

- EN: The Default palette decision is closed: slate/indigo stays the committed
  Default, Ink & Signal is not adopted, and no eighth preset is added. The
  design direction, design system, READMEs and website guides state the same
  decision.
- FR : La décision de palette Default est close : slate/indigo reste le Default
  assumé, Ink & Signal n'est pas adopté et aucun huitième preset n'est ajouté.
  La direction visuelle, le design system, les README et les guides du site
  portent la même décision.

## [0.1.0-beta.9] — 2026-11-20

Preview release. Tag: `v0.1.0-beta.9`. All five library packages are published on
npm at this version with `latest` and `beta` dist-tags. The website builds 472
pages, including 142 component references across 136 source families. Pimolu UI
remains a beta release: the human design review and the assistive-technology
review stay open.

- EN: DialogTrigger, DrawerTrigger and DropdownMenuTrigger accept a tabIndex and
  add `tabIndex={0}` plus `role="button"` when the cloned child is not natively
  focusable, so keyboard users can reach the trigger. Popover, Tooltip,
  HoverCard, ContextMenu and Popconfirm apply the same rule through the shared
  helper, which keeps explicit roles and native controls untouched.
- FR : DialogTrigger, DrawerTrigger et DropdownMenuTrigger acceptent un tabIndex
  et ajoutent `tabIndex={0}` ainsi que `role="button"` quand l'enfant cloné n'est
  pas focusable nativement, afin que le clavier atteigne le déclencheur. Un
  helper partagé respecte les rôles explicites et les contrôles natifs.

- EN: A new **Modal** family joins the library: Modal, ModalTrigger, ModalContent,
  ModalHeader, ModalTitle, ModalDescription, ModalFooter and ModalClose, with
  sm/md/lg/xl sizes, focus trap, Escape and overlay dismissal, scroll lock, focus
  return and optional close button. It reuses the Dialog internals and the shared
  focusable-trigger helper.
- FR : Une nouvelle famille **Modal** rejoint la bibliothèque : Modal,
  ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription,
  ModalFooter et ModalClose, avec tailles sm/md/lg/xl, piège de focus, fermeture
  par Échap et overlay, verrou de scroll, retour du focus et bouton de fermeture
  optionnel. Elle réutilise les internes de Dialog et le helper de trigger
  focusable.

- EN: Six carousel families join the library: ThumbnailCarousel,
  CoverflowCarousel, PeekCarousel, StackCarousel, ArcCarousel and MultiCarousel.
  They share the carousel engine (index state, loop, labels, live region and
  keyboard navigation) and expose CarouselContent, CarouselSlide,
  CarouselPrevious, CarouselNext, CarouselDots, CarouselThumbnails,
  CarouselThumbnail and CarouselLiveRegion with typed named parts. Each family
  has a copyable composition, a standalone Named-part customization example and
  a Chromium/WebKit journey; the base Carousel API is unchanged. A Carousels
  overview compares the seven references: Carousel is the simple entry point
  with autoplay, while the six families are advanced layout choices.
  MultiCarousel pagination counts reachable pages, so its dots no longer imply
  extra slides after the end of the rail; swiping resynchronizes the active page.
- FR : Six familles de carrousel rejoignent la bibliothèque : ThumbnailCarousel,
  CoverflowCarousel, PeekCarousel, StackCarousel, ArcCarousel et MultiCarousel.
  Elles partagent le moteur de carrousel (index, boucle, libellés, région live et
  navigation clavier) et exposent CarouselContent, CarouselSlide,
  CarouselPrevious, CarouselNext, CarouselDots, CarouselThumbnails,
  CarouselThumbnail et CarouselLiveRegion avec des parties nommées typées.
  Chaque famille a une composition copiable, un exemple autonome de
  personnalisation des parties nommées et un parcours Chromium/WebKit ; l'API du
  Carousel de base reste inchangée. Une page Carousels compare les sept
  références : Carousel est l'entrée simple avec autoplay, les six familles sont
  les choix avancés de mise en page. La pagination de MultiCarousel compte les
  pages atteignables : ses points n'annoncent plus de slides supplémentaires
  après la fin du rail, et un swipe resynchronise la page active.

- EN: Installation guides recommend `@latest`; Quick start documents exact
  versions with `--save-exact`, lockfile behaviour and the optional `@beta`
  channel. Carousels gain a category and overview, Class names and CSS variables
  use readable grids, API tables fit without horizontal scroll and optional
  types omit `| undefined`. Scrollable code blocks are keyboard focusable.
- FR : Les guides d'installation recommandent `@latest` ; le Quick start détaille
  les versions exactes avec `--save-exact`, le comportement du lockfile et le
  canal `@beta` facultatif. Les carrousels gagnent une catégorie et une page
  d'introduction, Class names et variables CSS utilisent des grilles lisibles,
  les tableaux API tiennent sans défilement horizontal et les types optionnels
  omettent `| undefined`. Les blocs de code défilables sont focusables au clavier.

- EN: Next.js moves from 16.4.2 to 16.4.6 on the website to address the published
  security advisory; React stays on 19.3.1.
- FR : Next.js passe de 16.4.2 à 16.4.6 sur le site pour corriger l'avis de
  sécurité publié ; React reste en 19.3.1.

- EN: @pimolu/web-styles adds `tokens.css` (every custom property without
  component rules) and `themes.css` (primitives and light/dark semantic themes)
  for applications that import component stylesheets individually.
- FR : @pimolu/web-styles ajoute `tokens.css` (toutes les propriétés
  personnalisées sans règle de composant) et `themes.css` (primitives et thèmes
  sémantiques clair/sombre) pour les applications qui importent les feuilles de
  composants individuellement.

- EN: Component reference pages publish a Class names table from the typed
  `classNames` parts and a CSS variables table generated from each shared
  stylesheet. Carousel exposes `--pimolu-carousel-control-reserve` instead of a
  hard-coded 56 px. The quick start uses `layered.css` and states that classNames
  adds hooks rather than overriding styles; the brandColor scope is documented as
  primary, hover and focus only.
- FR : Les pages de référence publient un tableau Class names issu des parties
  typées `classNames` et un tableau des variables CSS généré depuis chaque
  feuille partagée. Carousel expose `--pimolu-carousel-control-reserve` au lieu
  d'un 56 px codé en dur. Le Quick start utilise `layered.css` et précise que
  classNames ajoute des hooks sans surcharger les styles ; le périmètre de
  brandColor est documenté comme primary, hover et focus uniquement.

## [0.1.0-beta.8] — 2026-11-08

Preview release. Tag: `v0.1.0-beta.8`. All five library packages are published
on npm at this version with `latest` and `beta` dist-tags. The website documents
456 pages, including 141 free Blocks. Pimolu UI remains a beta release: the human
design review and the assistive-technology review stay open.

- EN: Default restores the slate/indigo palette from commit `f01aca8` in light
  and dark, after the Ink & Signal palette of beta.7. Typography, radii,
  spacing, motion and layouts keep the newer treatment; light secondary text is
  darkened to `#607087` for contrast on muted surfaces. The functional
  `control-border` and the soft accent roles remain, and the six other named
  presets keep their published palettes.
- FR : Default retrouve la palette slate/indigo du commit `f01aca8` en clair et
  en sombre, après la palette Ink & Signal de beta.7. La typographie, les rayons,
  les espacements, les animations et les mises en page conservent le traitement
  récent ; le texte secondaire clair est assombri à `#607087` pour le contraste
  sur les surfaces atténuées. `control-border` et les rôles d'accent doux restent
  disponibles, et les six autres presets nommés conservent leurs palettes.

- EN: The website publishes 141 free React Blocks across application,
  authentication, commerce, content, marketing and navigation collections.
  Every block has a searchable listing entry, category and subcategory filters,
  a live preview in light and dark, copyable typechecked source and its own page.
  Blocks are included in the sitemap, `llms.txt`, structured data and site search.
- FR : Le site publie 141 Blocks React gratuits répartis entre application,
  authentification, commerce, contenu, marketing et navigation. Chaque bloc a sa
  fiche filtrable, un aperçu réel en clair et sombre, un code source copiable
  vérifié par TypeScript et sa propre page. Les Blocks sont intégrés au sitemap,
  à `llms.txt`, aux données structurées et à la recherche du site.

- EN: Anchored panels no longer jump when they open. Select, Combobox,
  MultiSelect, TreeSelect, Cascader, Mentions, DropdownMenu, Menubar, Popover,
  Tooltip, HoverCard, DatePicker and DateRangePicker measure the mounted surface
  while hidden and reveal it already placed. Panels follow local container
  resizes, lateral content caps its height and scrolls, and focus loops skip
  hidden, inert and disabled controls.
- FR : Les panneaux ancrés ne sautent plus à l'ouverture. Select, Combobox,
  MultiSelect, TreeSelect, Cascader, Mentions, DropdownMenu, Menubar, Popover,
  Tooltip, HoverCard, DatePicker et DateRangePicker mesurent la surface montée en
  la gardant cachée et la révèlent déjà placée. Les panneaux suivent les
  redimensionnements locaux, le contenu latéral est plafonné et défilable, et les
  boucles de focus ignorent les contrôles cachés, inertes et désactivés.

- EN: NavigationMenu gains an optional `openOnHover` prop without changing the
  click and keyboard defaults. Blog and Releases move under a Resources menu,
  while Docs, Components, Blocks and Showcase stay visible.
- FR : NavigationMenu ajoute la prop facultative `openOnHover` sans changer les
  comportements clic et clavier par défaut. Blog et Releases passent sous un menu
  Resources, tandis que Docs, Components, Blocks et Showcase restent visibles.

- EN: The homepage separates demonstration cards from the page with the surface
  tokens and larger supporting text, and the identity preview starts in dark
  mode. `dev:website` rebuilds every workspace asset before Next.js starts, and
  CSS outputs are rejected when empty and replaced atomically so an interrupted
  build cannot truncate an existing stylesheet.
- FR : L'accueil distingue les cartes de démonstration de la page avec les tokens
  de surface et un texte secondaire plus grand, et l'aperçu d'identité démarre en
  sombre. `dev:website` reconstruit tous les assets du workspace avant Next.js,
  et les sorties CSS vides sont rejetées puis remplacées de façon atomique : une
  génération interrompue ne peut plus tronquer une feuille existante.

## [0.1.0-beta.7] — 2026-11-04

Preview release. Tag: `v0.1.0-beta.7`. All five library packages are published
on npm at this version with `latest` and `beta` dist-tags. The website documents
313 pages. Pimolu UI remains a beta release: the human design review, the
assistive-technology review and the stable promotion stay open.

- EN: Default adopts **Ink & Signal**: warm paper and ink neutrals, an iris
  signal, a functional `control-border` separated from the decorative `border`,
  new `primary-soft` roles and 10/16 px control/surface radii. The six other
  named presets and `adaptive` keep their published palettes, and explicit
  radius, density and brand-colour choices keep precedence.
- FR : Default adopte **Ink & Signal** : neutres papier/encre, signal iris,
  `control-border` fonctionnel distinct du `border` décoratif, nouveaux rôles
  `primary-soft` et rayons contrôles/surfaces de 10/16 px. Les six autres presets
  nommés et `adaptive` conservent leurs palettes publiées, et les choix explicites
  de rayon, densité et couleur de marque restent prioritaires.

- EN: Optional typography roles name DM Sans, Newsreader for editorial display
  and IBM Plex Mono, each with system fallbacks. The library downloads no fonts;
  the website self-hosts the licensed files. Buttons, fields, pickers and text
  inputs consume the new border, radius and weight tokens while focus, invalid,
  disabled and forced-colours states keep their behaviour.
- FR : Les rôles typographiques facultatifs nomment DM Sans, Newsreader pour les
  titres éditoriaux et IBM Plex Mono, chacun avec des fallbacks système. La
  bibliothèque ne télécharge aucune police ; le site auto-héberge les fichiers
  sous licence. Boutons, champs, pickers et contrôles texte consomment les
  nouveaux tokens de contour, rayon et graisse, en conservant le comportement des
  états focus, invalide, désactivé et forced-colors.

- EN: Playground Design Lab adds real marketing, validated form and searchable
  dashboard compositions with a frozen beta.6 comparison. The mobile dashboard
  table is a named, focusable scroll region so keyboard users reach the clipped
  columns.
- FR : Le Design Lab du playground ajoute de vraies compositions marketing,
  formulaire validé et dashboard filtrable avec une comparaison beta.6 figée. Le
  tableau du dashboard mobile est une région scrollable nommée et focusable, afin
  que les utilisateurs clavier atteignent les colonnes coupées.

- EN: Component previews are regenerated against the new Default in light and
  dark. The documentation records the executed evidence: 1,522 React tests, 31
  CSS tests, a 313-page build, the full Chromium/Firefox/WebKit matrix
  (1,668 passed, 18 skipped) and 12 axe-core scenarios without violations. That
  axe run covers the three review surfaces only; it is not a WCAG conformance
  claim.
- FR : Les captures de composants sont régénérées avec le nouveau Default en
  clair et sombre. La documentation consigne les preuves exécutées : 1 522 tests
  React, 31 tests CSS, un build de 313 pages, la matrice complète
  Chromium/Firefox/WebKit (1 668 réussis, 18 ignorés) et 12 scénarios axe-core
  sans violation. Cette exécution axe couvre uniquement les trois surfaces de
  revue ; ce n'est pas une certification WCAG.

- EN: The component status baseline advances to beta.7 and the beta.6 Updated
  overrides are cleared, so released references no longer carry a stale badge.
  The GitHub issue workflow is documented bilingually for maintainers.
- FR : La baseline des statuts de composants passe à beta.7 et les overrides
  Updated de beta.6 sont supprimés : les références publiées ne portent plus de
  badge obsolète. Le workflow de publication d'issue GitHub est documenté en
  bilingue pour les mainteneurs.

## [0.1.0-beta.6] — 2026-10-30

Preview release. Tag: `v0.1.0-beta.6`. All five library packages are published
on npm at this version with `latest` and `beta` dist-tags. The website documents
312 pages. Pimolu UI remains a beta release while the visual and
assistive-technology reviews stay open.

- EN: Accordion now removes `hidden` while its closing box animates, so Tailwind
  v4 Preflight's `[hidden] { display: none !important; }` cannot cancel the exit.
  Closed content still carries `hidden`, `aria-hidden` and `inert`; reduced motion
  and `data-pimolu-motion="off"` close it immediately.
- FR : Accordion retire désormais `hidden` pendant l'animation de fermeture, afin
  que le Preflight Tailwind v4 (`[hidden] { display: none !important; }`) ne
  supprime plus la sortie. Le contenu fermé conserve `hidden`, `aria-hidden` et
  `inert` ; reduced motion et `data-pimolu-motion="off"` le ferment immédiatement.

- EN: Chat attachment links declare an explicit underline instead of relying on
  the browser default reset by Preflight. The Tailwind compatibility audit covered
  all 135 references with Tailwind 4.3.3; remaining differences are invisible
  controls or icon-only surfaces.
- FR : Les liens de pièces jointes Chat déclarent un soulignement explicite au
  lieu de dépendre du style navigateur réinitialisé par Preflight. L'audit de
  compatibilité Tailwind couvre les 135 références avec Tailwind 4.3.3 ; les
  différences restantes concernent des contrôles invisibles ou des surfaces
  icon-only.

- EN: The Customization guide and Handbook document a Tailwind v4 recipe with
  Preflight in the base layer, the unlayered `styles.css` ordering rule, and the
  Accordion hidden-content contract. Regression tests cover both fixes.
- FR : Le guide Customization et le Handbook documentent une recette Tailwind v4
  avec Preflight dans la couche base, l'ordre d'import de `styles.css` non
  layerisé et le contrat de contenu fermé d'Accordion. Des tests de régression
  couvrent les deux correctifs.

## [0.1.0-beta.5] — 2026-10-30

Preview release. Tag: `v0.1.0-beta.5`. All five library packages are published
on npm at this version with `latest` and `beta` dist-tags. The website documents
311 pages. Pimolu UI remains a beta release while the visual and
assistive-technology reviews stay open.

- EN: Navbar adds `NavbarMenu` for modal mobile navigation opening from any of
  four edges, with partial sizes, full screen and optional native CSS animation.
  It reuses Drawer focus, dismissal and scroll-lock behavior, preserves inline
  desktop composition, and exposes named parts for portal customization.
- FR : Navbar ajoute `NavbarMenu` pour une navigation mobile modale depuis les
  quatre côtés, avec tailles partielles, plein écran et animation CSS optionnelle.
  Focus, fermeture et blocage du défilement réutilisent Drawer ; la composition
  desktop reste intégrée et les parties du portail sont personnalisables.

- EN: Native motion gains a shared reduced-motion and subtree opt-out policy,
  natural-height Accordion expansion/collapse with `animated={false}`, subtle
  form error feedback and surface transitions. Layout and typography stay static;
  existing component animations and optional Motion remain separate. The
  standalone `@pimolu/web-styles/motion.css` entry is now published.
- FR : Les animations CSS partagent une protection reduced-motion et une
  désactivation par zone. Accordion ouvre et ferme à hauteur naturelle avec
  `animated={false}` ; les erreurs de formulaire et les surfaces ont des
  transitions discrètes. Les layouts et textes restent fixes ; les animations
  existantes et Motion restent séparés. L'entrée `@pimolu/web-styles/motion.css`
  est désormais publiée.

- EN: Component references document both changes with Setup guidance, generated
  APIs, Playground demos, real Preview/Code examples and Updated badges. The
  website adds dedicated NavbarMenu and native-motion coverage in Chromium,
  Firefox and WebKit.
- FR : Les références documentent les deux changements avec les guides Setup,
  les API générées, les démos Playground, de vrais exemples Preview/Code et les
  badges Updated. Le site ajoute une couverture dédiée NavbarMenu et motion
  native sur Chromium, Firefox et WebKit.

## [0.1.0-beta.4] — 2026-10-29

Preview release. Tag: `v0.1.0-beta.4`. All five library packages are published
on npm at this version with `latest` and `beta` dist-tags. The website documents
310 pages. Pimolu UI remains a beta release while the visual and
assistive-technology reviews stay open.

- EN: Toast adds loading and information tones, semantic or custom icons,
  promise feedback, in-place updates and dismissal callbacks. Timers pause
  independently on pointer and keyboard focus, six positions cover every corner,
  and touch controls keep long stacks usable in short viewports.
- FR : Toast ajoute les états chargement et information, les icônes sémantiques
  ou personnalisées, le suivi des promesses, les mises à jour sur place et les
  callbacks de fermeture. Les délais se suspendent indépendamment au survol et au
  focus clavier, six positions couvrent chaque coin et les contrôles tactiles
  gardent les longues piles utilisables dans un viewport court.

- EN: Button adds `loadingIndicator` for a custom decorative loader, inherited
  by FormSubmit. Omitting it preserves the ring; null or false hides only the
  visual while keeping disabled and `aria-busy`. FormSubmit and FormError gain
  standalone references, setup modules, focused APIs and interactive examples.
- FR : Button ajoute `loadingIndicator` pour personnaliser le loader décoratif,
  hérité par FormSubmit. Sans prop, le cercle reste ; null ou false masque
  uniquement le visuel en conservant disabled et `aria-busy`. FormSubmit et
  FormError ont leurs références dédiées, modules de setup, API ciblées et
  exemples interactifs.

- EN: Input keeps its themed surface during browser autofill and subsequent
  editing, including translucent appearances and controls sharing its styles.
  Native autocomplete remains configurable; focus and forced-colors support are
  preserved.
- FR : Input conserve sa surface thématisée pendant le remplissage automatique
  et la saisie suivante, y compris les apparences translucides et les champs
  dérivés. L'autocomplétion reste configurable ; le focus et les couleurs forcées
  sont préservés.

- EN: Tabs gains a native CSS sliding indicator across all variants, unequal
  widths, vertical and scrollable lists. Added `animated` (default `true`),
  `classNames.indicator` and CSS duration/easing controls; reduced motion disables
  transitions. SegmentedControl shares the indicator and keeps a scrollable track
  with optional visible scrollbars; TabsList adds `showScrollbar`.
- FR : Tabs ajoute un indicateur glissant en CSS natif pour tous les variants,
  les largeurs différentes et les listes verticales ou défilantes. Ajout de
  `animated` (actif par défaut), `classNames.indicator` et des réglages CSS de
  durée/courbe ; la réduction des animations supprime les transitions.
  SegmentedControl partage l'indicateur et conserve une piste défilante avec
  barres natives optionnelles ; TabsList ajoute `showScrollbar`.

- EN: Component references open with authored Setup sections and generated
  previews. The journal is authored in MDX and generates metadata, search
  content, RSS, sitemap and compiled modules. A showcase page presents a real
  Pimolu project, legacy documentation paths redirect permanently, and the
  release planner now parses multi-segment beta tags correctly with fewer Git
  processes.
- FR : Les références de composants s'ouvrent sur des sections Setup rédigées
  et des aperçus générés. Le journal est rédigé en MDX et génère ses métadonnées,
  son contenu de recherche, le RSS, le sitemap et les modules compilés. Une page
  showcase présente un vrai projet Pimolu, les anciens chemins de documentation
  redirigent définitivement, et le planificateur de release lit correctement les
  tags bêta multi-segments avec moins de processus Git.

## [0.1.0-beta.3.1] — 2026-10-27

Documentation-only preview of Pimolu UI. Tag: `v0.1.0-beta.3.1`. All five
library packages are published on npm at this version with `latest` and `beta`
dist-tags. The runtime and public APIs are unchanged from `0.1.0-beta.3`.

### English

#### Changed

- Rewrote the READMEs for all five packages around one consistent structure:
  why the package exists, an at-a-glance summary, install, a short quick start,
  the package family, documentation and status.
- Added a faster first-success path for React, CSS, themes, tokens and the core
  variant utility, with copyable examples and links to the live reference.
- Clarified the difference between the complete `styles.css`, the layered
  `layered.css` entry and per-component CSS.
- Corrected the design-tokens JSON example to describe the plain nested object
  that the package actually exports.
- Kept the beta's open visual and assistive-technology limitations visible in
  every package README instead of presenting the preview as a stable release.

#### Fixed

- Removed stale encoding artifacts from package README links and footers.
- Kept English and French package pages aligned.

#### Known limitations

- No runtime API changed in this release.
- The seven complex-component assistive-technology reviews and the complete
  visual matrix remain open. Browser tests do not replace manual visual and
  screen-reader review.

### Français

#### Changements

- Réécriture des README des cinq packages autour d'une structure commune :
  raison d'être, résumé, installation, démarrage rapide, famille de packages,
  documentation et état.
- Ajout d'un premier succès plus rapide pour React, le CSS, les thèmes, les
  tokens et l'utilitaire de variantes, avec exemples copiables et liens vers la
  référence live.
- Clarification de la différence entre le CSS complet `styles.css`, l'entrée en
  couches `layered.css` et le CSS par composant.
- Correction de l'exemple JSON des design-tokens pour décrire l'objet imbriqué
  réellement exporté.
- Maintien des limites visuelles et d'assistance technique ouvertes dans chaque
  README, sans présenter la prévisualisation comme une stable.

#### Corrections

- Suppression d'artefacts d'encodage dans les liens et pieds de page.
- Alignement des pages anglaises et françaises.

#### Limites connues

- Aucune API runtime n'a changé dans cette version.
- Les sept revues d'assistance technique des composants complexes et la matrice
  visuelle complète restent ouvertes. Les tests navigateur ne remplacent pas la
  revue visuelle et lecteur d'écran manuelle.

## [0.1.0-beta.3] — 2026-10-27

Third public preview of Pimolu UI. Tag: `v0.1.0-beta.3`. All five library
packages are published on npm at this version with `latest` and `beta`
dist-tags.

### English

#### Added

- Optional typed `classNames` maps on all 129 React families, including
  compound descendants and portalled surfaces. Structural, variant and state
  classes remain additive, and public `PimoluClassNames` and
  `PimoluComponentParts` types reject unknown families or parts.
- An opt-in `@pimolu/web-styles/layered.css` entry for predictable application
  and Tailwind overrides without `!important`. The existing unlayered
  `styles.css` entry and legacy class targets remain compatible.
- Panel `style` for DialogContent and DrawerContent, Select control style
  support, and an Input focus halo that preserves preset elevation.
- Dedicated BarChart, LineChart, AreaChart, DonutChart and Sparkline references
  with their own examples, APIs and previews. `/components/chart` now groups
  the five chart types by purpose.
- Source-backed component status badges and a beta.3 baseline. Every Playground
  page and all 133 website references include a standalone customization
  example.

#### Changed

- Five library packages, the website and the source tag are aligned on
  `0.1.0-beta.3`.
- Sidebar accepts `collapsedContent` for its header and footer, keeps brand and
  profile controls reachable in the collapsed rail and adds keyboard tooltips
  to icon-only items.
- AppShell and DashboardLayout keep a contextual rail beside content at 1012 px
  and collapse at 720 px. PageHeader centers its actions below the content.
- The documentation reference now includes 133 component pages, 665 component
  snippets and four standalone guide snippets.

#### Fixed

- Select commits on a completed click or tap, ignores touch pans and focuses
  its trigger without scrolling. Cascader and TreeSelect distinguish mouse
  hover from touch contact, including TreeSelect branch-arrow panning.
- RangeSlider moves a bound only after a completed tap. Slider and RangeSlider
  fills follow the inherited direction, and Carousel keeps RTL scroll
  positions, indicators, controls and arrow keys synchronized.
- FileManager exposes an explicit Open action instead of relying on double-tap.
  Signature Clear and Undo finish valid touch taps after a stroke without
  firing twice.
- Shared floating placement clamps its initial width and position to the
  viewport, preventing narrow-screen overflow across floating consumers.
- Calendar and TreeTable no longer widen the Playground document at phone
  widths.

#### Known limitations

- This is a beta: component APIs and visual tokens may still change before
  0.1.0 stable.
- The seven complex-component assistive-technology reviews and the complete
  visual matrix remain open in `docs/ai/QUALITY_AUDIT.md`. Browser tests do not
  replace manual visual and screen-reader review.
- Native, Angular and web registries are not implemented. The Playground bundle
  still exceeds the Vite 500 kB warning threshold.

### Français

#### Ajouts

- Maps `classNames` typées optionnelles sur les 129 familles React, y compris
  les descendants composés et les surfaces en portail. Les classes
  structurelles, de variante et d'état restent additives, et les types publics
  `PimoluClassNames` et `PimoluComponentParts` rejettent les familles ou parties
  inconnues.
- Entrée optionnelle `@pimolu/web-styles/layered.css` pour des surcharges
  prévisibles de l'application et de Tailwind sans `!important`. L'entrée
  classique `styles.css` et les cibles de classes historiques restent
  compatibles.
- `style` de panneau pour DialogContent et DrawerContent, prise en charge du
  style du contrôle Select et halo de focus Input conservant l'ombre du preset.
- Références dédiées BarChart, LineChart, AreaChart, DonutChart et Sparkline
  avec exemples, API et captures propres. `/components/chart` regroupe désormais
  les cinq types de graphiques par usage.
- Statuts de composants issus des sources et baseline beta.3. Chaque page du
  Playground et les 133 références du site incluent un exemple de
  personnalisation autonome.

#### Changements

- Les cinq packages, le site et le tag source sont alignés sur
  `0.1.0-beta.3`.
- Sidebar accepte `collapsedContent` pour son header et son footer, garde la
  marque et le profil accessibles dans le rail replié et ajoute des tooltips
  clavier aux items icônes.
- AppShell et DashboardLayout conservent un rail contextuel à côté du contenu à
  1012 px et se replient à 720 px. PageHeader centre ses actions sous le
  contenu.
- La référence documentaire comprend désormais 133 pages de composants, 665
  snippets de composants et quatre snippets de guides autonomes.

#### Corrections

- Select valide sur un clic ou tap terminé, ignore les pans tactiles et
  focalise son déclencheur sans défilement. Cascader et TreeSelect distinguent
  le survol souris du contact tactile, y compris le pan sur la flèche d'une
  branche TreeSelect.
- RangeSlider ne déplace une borne qu'après un tap terminé. Les remplissages
  Slider et RangeSlider suivent la direction héritée, et Carousel garde les
  positions RTL, indicateurs, contrôles et flèches clavier synchronisés.
- FileManager expose une action Open explicite au lieu de dépendre du
  double-tap. Signature termine Clear et Undo sur un tap valide après un tracé
  sans double déclenchement.
- Le placement flottant partagé borne sa largeur et sa position initiales au
  viewport, évitant le débordement sur écran étroit chez tous les consommateurs.
- Calendar et TreeTable n'élargissent plus le document du Playground aux
  largeurs téléphone.

#### Limites connues

- Ceci est une bêta : les API des composants et les tokens visuels peuvent
  encore évoluer avant la stable 0.1.0.
- Les sept revues d'assistance technique des composants complexes et la matrice
  visuelle complète restent ouvertes dans `docs/ai/QUALITY_AUDIT.md`. Les tests
  navigateur ne remplacent pas la revue visuelle et lecteur d'écran manuelle.
- Les registres Native, Angular et web ne sont pas implémentés. Le bundle du
  Playground dépasse encore le seuil d'avertissement Vite de 500 kB.

## [0.1.0-beta.2] — 2026-10-23

Second public preview of Pimolu UI. Tag: `v0.1.0-beta.2`. All five library
packages are published on npm at this version with `latest` and `beta`
dist-tags.

### English

#### Added

- Interactive charts: responsive container measurement, formatted value axes,
  pointer and keyboard exploration, accessible tooltips, smooth line/area
  curves, solid area fills, missing-value gaps and localizable instructions.
- TreeTable cascade selection with mixed parent state; Scheduler bounded
  timetables with visible headings and compact events; PageHeader `sm`, `md`
  and `lg` sizes with container-relative typography.
- MDX-authored release notes with a compile-time metadata and anchor pipeline.
- SEO titles, canonical URLs and server-rendered JSON-LD for Organization,
  WebSite, BlogPosting and BreadcrumbList.
- Mobile release navigation drawer, two-column journal filters and shared
  GitHub, Discord and npm links.
- Website production commands, Vercel deployment documentation and GitHub
  Actions for library verification plus three-engine browser checks.

#### Changed

- The five packages and website versions are aligned on `0.1.0-beta.2`;
  package READMEs now document npm installation, CSS loading and Provider setup.
- The public site is deployed at `https://pimolu.com`; the package READMEs
  and documentation point to the npm organization and live catalogue.
- AppShell, DashboardLayout, Sidebar, DocsLayout, Navbar, Gantt, Kanban,
  TagsInput and CircularProgress received layout, overflow, focus and compact
  state refinements.

#### Fixed

- PageHeader no longer collapses its title inside a flex row because of its
  inline-size container query.
- Playground lazy-route smoke coverage now waits for complex pages under
  aggregate test load.

#### Known limitations

- This is a beta: component APIs and visual tokens may still change.
- The complete 131-page visual review in seven presets and both modes remains
  unfinished, and the seven complex-component assistive-technology reviews
  remain open. See `docs/ai/QUALITY_AUDIT.md`.
- The local Playground bundle still exceeds 500 kB; the website browser suite
  is green in Chromium, Firefox and WebKit but does not replace manual visual
  and screen-reader review.

### Français

#### Ajouts

- Graphiques interactifs : mesure responsive du conteneur, axes formatés,
  exploration pointeur et clavier, tooltips accessibles, courbes lissées
  ligne/aire, remplissage d'aire solide, lacunes pour les valeurs manquantes
  et instructions localisables.
- Sélection en cascade de TreeTable avec état mixte des parents ; emplois du
  temps Scheduler bornés avec en-têtes visibles et événements compacts ;
  tailles PageHeader `sm`, `md` et `lg` avec typographie relative au conteneur.
- Notes de release rédigées en MDX avec pipeline de métadonnées et d'ancres
  compilé au build.
- Titres SEO, URL canoniques et JSON-LD rendu côté serveur pour Organization,
  WebSite, BlogPosting et BreadcrumbList.
- Drawer de navigation des releases sur mobile, filtres du journal en deux
  colonnes et liens GitHub, Discord et npm partagés.
- Commandes de production du site, documentation de déploiement Vercel et
  GitHub Actions pour la vérification de la bibliothèque et les contrôles
  navigateur sur trois moteurs.

#### Changements

- Les cinq packages et le site sont alignés sur `0.1.0-beta.2` ; les README
  documentent l'installation npm, le chargement du CSS et le Provider.
- Le site public est déployé sur `https://pimolu.com` ; les README et la
  documentation pointent vers l'organisation npm et le catalogue live.
- AppShell, DashboardLayout, Sidebar, DocsLayout, Navbar, Gantt, Kanban,
  TagsInput et CircularProgress reçoivent des finitions de layout, débordement,
  focus et états compacts.

#### Corrections

- PageHeader n'effondre plus son titre dans un flex à cause de sa container
  query inline-size.
- Le smoke test des routes lazy du Playground attend désormais les pages
  complexes sous la charge agrégée des tests.

#### Limites connues

- C'est une bêta : les API des composants et les tokens visuels peuvent encore
  évoluer.
- La revue visuelle complète des 131 pages dans sept presets et les deux modes
  reste inachevée, et les sept revues d'assistance technique des composants
  complexes restent ouvertes. Voir `docs/ai/QUALITY_AUDIT.md`.
- Le bundle local du Playground dépasse encore 500 kB ; la suite navigateur du
  site est verte sur Chromium, Firefox et WebKit mais ne remplace pas la revue
  visuelle et lecteur d'écran manuelle.

## [0.1.0-beta.1] — 2026-10-22

First public preview of Pimolu UI. Tag: `v0.1.0-beta.1`. This is a preview:
the component API, visual review and distribution packaging may still change.

### English

#### Added

- 129 React component families across foundations, forms, feedback, data,
  navigation, layout, media, documentation, marketing and complex application
  surfaces. The playground exposes 131 hash-routed demonstration pages.
- A Next.js 16 documentation website with 291 generated pages: guides, a
  component catalog, live examples, API tables, search, theme builder, palette
  explorer, journal, releases, RSS, `llms.txt`, sitemap and Open Graph images.
- Design-token and theme packages generated from one source: primitive tokens,
  light/dark semantic themes and seven visual presets (`default`, `adaptive`,
  `cartoon`, `glass`, `luxury`, `monochrome`, `neo-brutalism`).
- Published `@pimolu/design-tokens`, `@pimolu/themes`, `@pimolu/core`,
  `@pimolu/react` and `@pimolu/web-styles` packages with synchronized
  `0.1.0-beta.1` versions, package READMEs and `npm pack` validation. The
  `latest` and `beta` dist-tags both point to `0.1.0-beta.1`.
- A compiled `@pimolu/react` distribution: one ESM bundle with TypeScript
  declarations and the `"use client"` directive; `@pimolu/core` compiles to
  ESM and declarations as well.
- The `release-manager` skill now selects the SemVer version from the commit
  range and audit state, synchronizes packages and site versions, verifies
  pack contents, writes the changelog and creates the Git tag.

#### Changed

- `pnpm build:all` now also compiles the core and React packages. A fresh clone
  must build before the playground, website, examples or package exports load.
- Internal package dependencies use the release version instead of
  `workspace:*`, so the packed manifests are valid for npm consumers.
- The home page gained discovery, component-gallery and product-world sections,
  local Pimolu imagery and audio, and refreshed component previews.
- Gantt keeps its timeline width proportional across day, week and month scales;
  navigation and zoom use icon buttons and the 50%-200% limits are documented.
- Image detects already-decoded images after hydration without replaying the
  consumer's `onLoad` callback.

#### Fixed

- Gantt zoom no longer becomes non-proportional when the timeline is narrower
  than its viewport.
- Cached and broken images no longer show a permanent skeleton or a false
  loaded state.
- Website demo navigation, anchored header offsets, responsive site chrome and
  editorial artwork containment were corrected.

#### Known limitations

- This is a beta: the public API and visual tokens may still change.
- The complete 131-page visual review in seven presets and both modes is not
  finished, and the seven complex-component assistive-technology reviews remain
  open. See `docs/ai/QUALITY_AUDIT.md`.
- Chromium passed the full website E2E suite (306/306). A previous combined
  Firefox/WebKit run passed 493/608 checks; 115 checks timed out under the full
  three-browser load, and a focused rerun of representative failures passed. The
  full cross-browser gate remains open and was not rerun on this build.
- The structural accessibility audit inspected 516 examples with zero findings.
  It is browser evidence, not an axe run or a WCAG conformance claim.
- All five packages are published on npm at `0.1.0-beta.1`; both `latest` and
  `beta` dist-tags point to it. Install with
  `pnpm add @pimolu/react@beta @pimolu/web-styles@beta`.
- The website preview requires a hosting provider; the production build succeeds
  locally but no public preview URL is attached to this entry.

### Français

#### Ajouts

- 129 familles de composants React couvrant les fondations, formulaires,
  retours, données, navigation, layout, médias, documentation, marketing et
  surfaces applicatives complexes. Le playground expose 131 pages de
  démonstration routées par hash.
- Un site de documentation Next.js 16 avec 291 pages générées : guides,
  catalogue de composants, exemples live, tableaux d'API, recherche, theme
  builder, explorateur de palettes, journal, releases, RSS, `llms.txt`, sitemap
  et images Open Graph.
- Des packages de tokens et de thèmes générés depuis une source unique : tokens
  primitifs, thèmes sémantiques clair/sombre et sept presets visuels (`default`,
  `adaptive`, `cartoon`, `glass`, `luxury`, `monochrome`, `neo-brutalism`).
- Des packages publiés `@pimolu/design-tokens`, `@pimolu/themes`,
  `@pimolu/core`, `@pimolu/react` et `@pimolu/web-styles`, avec la version
  synchronisée `0.1.0-beta.1`, des README et une validation `npm pack`. Les
  dist-tags `latest` et `beta` pointent tous deux vers `0.1.0-beta.1`.
- Une distribution compilée de `@pimolu/react` : un bundle ESM unique avec les
  déclarations TypeScript et la directive `"use client"` ; `@pimolu/core` est
  aussi compilé en ESM avec ses déclarations.
- La skill `release-manager` choisit désormais la version SemVer à partir de la
  plage de commits et de l'état des audits, synchronise les packages et le site,
  vérifie le contenu des paquets, rédige le changelog et crée le tag Git.

#### Changements

- `pnpm build:all` compile maintenant aussi les packages core et React. Un clone
  neuf doit builder avant de charger le playground, le site, les exemples ou les
  exports des packages.
- Les dépendances internes utilisent la version de release au lieu de
  `workspace:*`, afin que les manifestes empaquetés soient valides pour npm.
- La page d'accueil reçoit des sections de découverte, galerie de composants et
  univers produit, des images et sons Pimolu locaux, et des previews actualisées.
- Gantt conserve une largeur proportionnelle sur les échelles jour, semaine et
  mois ; la navigation et le zoom utilisent des boutons icônes et les limites
  50 %-200 % sont documentées.
- Image détecte les images déjà décodées après l'hydratation sans rejouer le
  callback `onLoad` du consommateur.

#### Corrections

- Le zoom de Gantt n'est plus non proportionnel lorsque la timeline est plus
  étroite que son viewport.
- Les images en cache ou cassées n'affichent plus un skeleton permanent ni un
  faux état chargé.
- La navigation des démos du site, les décalages d'ancrage, le chrome responsive
  et le containment des visuels éditoriaux sont corrigés.

#### Limites connues

- C'est une bêta : l'API publique et les tokens visuels peuvent encore évoluer.
- La revue visuelle complète des 131 pages dans sept presets et les deux modes
  n'est pas terminée, et les sept revues d'assistance technique des composants
  complexes restent ouvertes. Voir `docs/ai/QUALITY_AUDIT.md`.
- Chromium passe toute la suite E2E du site (306/306). Une exécution combinée
  Firefox/WebKit antérieure a passé 493/608 vérifications ; 115 vérifications ont
  expiré sous la charge des trois navigateurs, et une relance ciblée d'échecs
  représentatifs passe. Le passage complet multi-navigateurs reste ouvert et n'a
  pas été relancé sur ce build.
- L'audit structurel d'accessibilité a inspecté 516 exemples sans finding. C'est
  une preuve navigateur, pas une exécution axe ni une certification WCAG.
- Les cinq packages sont publiés sur npm en `0.1.0-beta.1` ; les dist-tags
  `latest` et `beta` pointent tous deux vers cette version. Installation :
  `pnpm add @pimolu/react@beta @pimolu/web-styles@beta`.
- La preview du site nécessite un hébergeur ; le build de production passe en
  local mais aucune URL publique n'est attachée à cette entrée.

[0.1.0-beta.9]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.9
[0.1.0-beta.8]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.8
[0.1.0-beta.7]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.7
[0.1.0-beta.6]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.6
[0.1.0-beta.5]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.5
[0.1.0-beta.4]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.4
[0.1.0-beta.3.1]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.3.1
[0.1.0-beta.3]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.3
[0.1.0-beta.2]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.2
[0.1.0-beta.1]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.1
