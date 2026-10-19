# Architecture de Pimolu UI

## Flux actuel

```text
packages/design-tokens/src/tokens.json (primitives)
  └─ scripts/build.mjs → packages/design-tokens/dist/{tokens.json,tokens.css}
                      → packages/themes/dist/{themes.json,styles.css}
packages/themes/src/themes.json (alias sémantiques light/dark)
  └─ scripts/build-default.mjs → dist/default.css
packages/themes/src/presets/*.json (cinq palettes)
  └─ scripts/build-presets.mjs → dist/{presets.css,presets.js,presets.d.ts}
packages/themes/src/visual/*.json (six jeux de tokens visuels)
  └─ scripts/build-visuals.mjs → dist/{visual.css,visuals.js,visuals.d.ts}
packages/themes/style-presets.css (imports + aides web)
  └─ packages/web-styles/src/*.css → scripts/build.mjs → dist/pimolu.css + CSS par composant
packages/core/createVariants → registry/react/* + PimoluProvider
  └─ apps/playground et examples/nextjs
```

`pnpm build:all` exécute cette chaîne dans l'ordre. Les sorties `dist` sont générées et ignorées par Git : modifier leurs sources, jamais leurs copies. Le bundle `@pimolu/web-styles/styles.css` rassemble les tokens, presets et styles des composants ; il doit être chargé pour obtenir leur apparence.

## Contrats entre modules

- `packages/core` fournit `createVariants()`, qui assemble des classes CSS et n'ajoute aucun runtime de style.
- `registry/react/index.ts` définit les exports publics. Chaque composant possède ses types et variantes sous `registry/react/<nom>/`; son CSS web vit dans `packages/web-styles/src/<nom>.css`.
- `PimoluProvider` applique `data-pimolu-theme` et `data-pimolu-style` sur un conteneur. Les feuilles CSS dérivent l'apparence de ces attributs et des variables `--pimolu-*`.
- Les menus flottants de Select, Combobox, MultiSelect et Tooltip utilisent un portail attaché au conteneur de thème le plus proche du déclencheur, pour conserver les tokens dans des providers imbriqués.
- `apps/playground/src/router.ts` déclare les pages de démonstration ; `apps/playground/src/demo-data.ts` dérive les listes de variantes publiques. `examples/nextjs` est un exemple d'intégration distinct.

## Limites de l'architecture actuelle

Les packages React et Core exposent des sources TypeScript et n'ont pas de build de publication. Les composants web et les données visuelles sont distincts, ce qui prépare une réutilisation des tokens sur d'autres plateformes, mais aucune implémentation native ou Angular n'est encore présente. La validation visuelle et les parcours E2E ne disposent pas de runner automatisé.
