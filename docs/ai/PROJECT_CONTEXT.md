# Pimolu UI — contexte technique

Mise à jour : 2026-10-19. Ce dossier décrit le dépôt local et sert de point de départ aux prochaines sessions. Relire le code concerné avant toute modification : ces notes ne remplacent pas la source.

## État vérifié

- Monorepo pnpm et TypeScript, avec bibliothèque React source dans `registry/react`, styles CSS partagés dans `packages/web-styles`, tokens et thèmes dans `packages/design-tokens` et `packages/themes`.
- Deux modes de couleur (`light`, `dark`) et le mode `system` ; six presets : `default`, `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`.
- 20 familles de composants React exportées par `registry/react/index.ts`, chacune montrée dans le playground. `examples/nextjs` illustre l'intégration App Router.
- `apps/website`, les autres exemples et `registry/native`, `registry/angular`, `registry/web` sont des emplacements futurs, sans implémentation de plateforme.
- `@pimolu/react`, `@pimolu/core`, `@pimolu/themes` et `@pimolu/web-styles` sont privés et ne constituent pas encore une distribution npm prête à publier.
- GitHub CI reste désactivé dans `.github/workflows/ci.yml.disabled`. Les hooks locaux `.githooks` et `pnpm verify` sont les contrôles en service.

## Vision exprimée par le mainteneur

Une identité visuelle commune entre React, Next.js, React Native, Angular, Electron et éventuellement HTML/CSS via CDN. À terme : documentation publique, outils de développement, intégrations IA et MCP. Ces cibles ne sont pas des fonctionnalités présentes dans le dépôt.

## Documents connexes

- [Architecture](ARCHITECTURE.md) : flux des packages et sorties générées.
- [Design system](DESIGN_SYSTEM.md) : sources des thèmes, presets et direction artistique Default.
- [Composants](COMPONENT_INVENTORY.md) : inventaire et limites.
- [Développement](DEVELOPMENT_GUIDE.md) : commandes et conventions.
- [Roadmap](ROADMAP.md) : priorités proposées, sans engagement de livraison.

Les deux READMEs publics sont `README.md` et `README.fr.md`. Les instructions d'agent se trouvent dans `AGENTS.md` et `.agents/skills/`.
