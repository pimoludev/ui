# Changelog

All notable changes to Pimolu UI. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses Semantic Versioning.

## [Unreleased]

### English

- Add an optional layered CSS entry and typed, additive `classNames` hooks across all 129 families, including compound descendants and portalled surfaces.
- Add panel `style` to DialogContent/DrawerContent and honor Select `style` on
  its styled trigger. Existing class targets and the default CSS entry remain.
- Restore Input's focus halo without discarding preset elevation.
- Document the customization contract and add standalone examples and browser
  regressions for cascade order, portals, disabled states and focus.

### Français

- Ajout d'une entrée CSS en couche optionnelle et de hooks typés `classNames`
  sur les 129 familles, leurs sous-composants composés et leurs surfaces en portail.
- Ajout de `style` sur les panneaux Dialog/Drawer et prise en compte de `style`
  sur le contrôle Select personnalisé, sans changer les anciennes cibles.
- Rétablissement du halo de focus Input en conservant l'ombre du preset.
- Documentation du contrat, exemples autonomes et régressions navigateur pour
  les couches CSS, portails, états désactivés et le focus.

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

[0.1.0-beta.2]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.2
[0.1.0-beta.1]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.1
