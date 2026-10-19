# Pimolu UI Playground

Application Vite de vérification manuelle des composants React, thèmes et presets.

Depuis la racine du monorepo :

```bash
pnpm install
pnpm build:all
pnpm "playground dev"
```

`pnpm build:all` est nécessaire après un clone ou un changement des tokens, des thèmes ou du CSS : le playground importe `@pimolu/web-styles/styles.css`, généré dans `packages/web-styles/dist/`.

Les routes sont déclarées dans `src/router.ts`, les pages dans `src/pages/` et les listes de variantes dans `src/demo-data.ts`. La vérification automatique du projet est `pnpm verify` ; les rendus et interactions doivent aussi être examinés dans un navigateur.

Voir `../../docs/ai/DEVELOPMENT_GUIDE.md` pour les conventions et commandes complètes.
