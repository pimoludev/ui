# Pimolu Website — Suivi d'implémentation

## Périmètre et état

Phase 1 uniquement : fondations du site officiel. Les phases suivantes attendent la commande **« suivant »**.

- [x] Phase 1 — Fondations Next.js, workspace, layouts, thèmes, navigation.
- [ ] Phase 2 — Site vitrine premium, compositions interactives, animations Motion.
- [ ] Phase 3 — Documentation détaillée, installation, guides, API, recherche.
- [ ] Phase 4 — Catalogue interactif, personnalisation, accessibilité et optimisation.

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

## Prochaines étapes — attendre « suivant »

**Phase 2 :** composer une véritable homepage premium avec les composants Pimolu, démonstrations interactives, sections de valeur, CTA et transitions Motion discrètes. Les pages actuelles sont des fondations navigables, pas la vitrine finale.

**Phase 3 :** installation fidèle au mode de distribution réel, guides, contenu MDX si retenu, documentation pilote, exemples copiables, API, recherche et navigation documentaire enrichie. Ne pas annoncer de commande npm publique avant la préparation des packages.

**Phase 4 :** catalogue complet connecté aux composants existants, previews et personnalisation, validation clavier/lecteurs d'écran, matrice de presets, SEO approfondi/sitemap, performances et contrôle de production.

L'inspiration de HeroUI et shadcn porte sur la lisibilité de la navigation et l'expérience développeur. Aucune de ces bibliothèques n'est utilisée comme dépendance UI.
