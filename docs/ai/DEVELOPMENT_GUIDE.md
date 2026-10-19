# Guide de développement

## Préparer le workspace

Node >= 20 et pnpm épinglé dans `package.json`. À la racine : `pnpm install`, puis `pnpm build:all` pour produire les sorties ignorées par Git. Le playground démarre par `pnpm "playground dev"`.

## Commandes vérifiées dans `package.json`

| Commande | Effet |
| --- | --- |
| `pnpm build` | Génère les primitives et thèmes de base seulement. |
| `pnpm build:all` | Génère aussi Default, les cinq palettes, les six jeux visuels et le CSS web. |
| `pnpm test` | Tests Node des design tokens ; relance leur build. |
| `pnpm test:themes` | Tests Node des thèmes et presets. |
| `pnpm test:react` | Vitest + Testing Library dans `registry/react`. |
| `pnpm test:web-styles` | Tests des bundles CSS générés. |
| `pnpm typecheck` | TypeScript racine sur packages et registry. |
| `pnpm lint` | ESLint du playground. |
| `pnpm audit:themes:strict` | Audit de thèmes, échec également sur avertissement. |
| `pnpm skills:check` | Valide le catalogue `.agents/skills`. |
| `pnpm verify:quick` | Build, typecheck, audit, tests tokens, thèmes, React et CSS. |
| `pnpm verify` | Vérification rapide + lint + skills + build du playground. |
| `pnpm check` | Vérification complète + build de `examples/nextjs`. |

`pnpm --dir registry/react exec vitest run button/button.test.tsx` cible un test React. Le hook pre-commit lance `verify:quick` et contrôle les fichiers indexés ; pre-push lance `verify`. Le workflow GitHub `.github/workflows/ci.yml.disabled` doit rester désactivé jusqu'à une décision explicite du mainteneur.

Les configurations TypeScript de la racine, du playground et de l'exemple Next.js utilisent `strict`. Le typecheck racine couvre packages et registry ; les builds du playground et de Next.js vérifient leurs propres applications.

## Ajouter ou modifier un composant

Lire `registry/react/button/` comme modèle, puis le composant proche du besoin. Mettre React, types, variantes et tests dans `registry/react/<nom>/`, le CSS dans `packages/web-styles/src/<nom>.css`, déclarer le bundle dans `packages/web-styles/scripts/build.mjs` et les exports dans `packages/web-styles/package.json` et `registry/react/index.ts`. Synchroniser `apps/playground/src/pages/`, son routage et, si nécessaire, `src/demo-data.ts`. Vérifier les états contrôlés/non contrôlés, les formulaires, le clavier, les lecteurs d'écran, reduced motion, forced colors et RTL suivant le composant. Mettre à jour les READMEs et docs pour les changements publics.

Les données de design vivent dans les JSON source, jamais dans `dist`. Utiliser les variables `--pimolu-*` et les classes `pimolu-*`, sans introduire de framework de styles. Lancer `pnpm verify`, puis examiner le rendu réel des six presets et modes de couleur pour toute modification visuelle. Ne pas prétendre avoir exécuté un contrôle non lancé.
