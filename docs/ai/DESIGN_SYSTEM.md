# Design system Pimolu

## Sources de vérité

- Primitives : `packages/design-tokens/src/tokens.json` (couleurs, espacements, rayons, tailles et famille de caractères).
- Alias sémantiques clair/sombre : `packages/themes/src/themes.json`. Les clés doivent être identiques dans les deux modes et les références `{color.*}` doivent résoudre une primitive.
- Preset Default : palette issue des alias par `packages/themes/scripts/build-default.mjs`, tokens visuels dans `packages/themes/src/visual/default.json`.
- Autres presets : palettes dans `packages/themes/src/presets/<nom>.json` et valeurs visuelles dans `packages/themes/src/visual/<nom>.json`.
- Défauts CSS partagés et exceptions web : `packages/themes/style-base.css`, `style-glass.css`, `style-luxury.css`. Les styles internes des composants restent dans `packages/web-styles/src/`.

`build:presets` valide le nom, les clés requises, la parité light/dark et les couleurs des palettes. `build:visuals` produit CSS et exports JavaScript (`pimoluPresetVisuals`), utilisables comme données sur une future plateforme native. `pnpm audit:themes` examine les points d'intégration et les variables manquantes. `system` suit `prefers-color-scheme` dans le CSS généré. Le provider peut conserver les préférences si `persist` est activé ; consulter `registry/react/provider/pimolu-provider.tsx` avant de modifier cette logique.

## Direction artistique proposée pour Default

Default doit être la référence calme et précise : neutres ardoise lisibles, indigo concentré sur les actions primaires, signaux success/warning/danger sémantiques, typographie sans empattement, rythmes d'espacement issus des primitives et rayons cohérents entre contrôles et surfaces. Les frontières doivent être nettes, l'ombre discrète et réservée à la hiérarchie ; les états hover, focus, pressed, disabled et invalid doivent rester reconnaissables en light, dark, clavier et forced colors. Garder les cinq autres presets expressifs par leurs tokens plutôt que par des branches de composants.

La direction est une proposition de design, pas une validation visuelle complète. Avant de figer de nouvelles valeurs, comparer les six presets sur les pages du playground en ordinateur et mobile, vérifier les contrastes et conserver des captures de référence. Le projet ne possède pas de tests visuels automatisés aujourd'hui.

## Ajouter un preset

Créer palette et valeurs visuelles JSON, maintenir light/dark, enregistrer les points manuels (notamment le type de thème si un thème est ajouté et la liste du playground), puis exécuter `pnpm build:all`, `pnpm audit:themes:strict`, les tests et une revue visuelle. Ne jamais éditer `dist` à la main.
