# Changelog

All notable changes to Pimolu UI. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses Semantic Versioning.

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
- Publishable `@pimolu/design-tokens`, `@pimolu/themes`, `@pimolu/core`,
  `@pimolu/react` and `@pimolu/web-styles` packages with synchronized
  `0.1.0-beta.1` versions, package READMEs and `npm pack` validation.
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
- No npm package has been published. `npm pack --dry-run` passed for all five
  packages.
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
- Des packages publiables `@pimolu/design-tokens`, `@pimolu/themes`,
  `@pimolu/core`, `@pimolu/react` et `@pimolu/web-styles`, avec la version
  synchronisée `0.1.0-beta.1`, des README et une validation `npm pack`.
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
- Aucun package npm n'a été publié. `npm pack --dry-run` passe pour les cinq
  packages.
- La preview du site nécessite un hébergeur ; le build de production passe en
  local mais aucune URL publique n'est attachée à cette entrée.

[0.1.0-beta.1]: https://github.com/pimoludev/ui/releases/tag/v0.1.0-beta.1
