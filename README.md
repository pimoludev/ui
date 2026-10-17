# Pimolu UI

Une bibliothèque de composants multi-plateforme avec un design cohérent.

Dépôt : https://github.com/pimoludev/ui

## Démarrage

Prérequis : Node.js 20+ ; `pnpm` recommandé.

```bash
pnpm install
pnpm build
pnpm test
```

> La génération des tokens fonctionne aussi sans installer de dépendances : `node packages/design-tokens/scripts/build.mjs`.

La commande `build` génère :
- `packages/design-tokens/dist/tokens.json` : valeurs primitives pour JS/React Native
- `packages/design-tokens/dist/tokens.css` : variables primitives CSS
- `packages/themes/dist/themes.json` : thèmes clair/sombre résolus pour JS/React Native
- `packages/themes/dist/styles.css` : styles CSS complets pour le web (primitives + thèmes)

### Utilisation web

Importer le CSS généré dans l'application :

```tsx
import '@pimolu/themes/styles.css';
```

La déclaration ci-dessus suppose que l'application dépend du package `@pimolu/themes` dans le workspace, ou que celui-ci est publié. Avant cela, un import relatif de `packages/themes/dist/styles.css` convient aussi.

```html
<div data-pimolu-theme="dark">
  <button class="demo-button">Essayer Pimolu</button>
</div>
```

```css
.demo-button {
  background: var(--pimolu-primary);
  color: var(--pimolu-primary-foreground);
  border-radius: var(--pimolu-radius-md);
  padding: var(--pimolu-spacing-2) var(--pimolu-spacing-4);
}
```

### Utilisation React Native (ultérieurement)

Importer les valeurs JSON depuis les packages, puis utiliser `themes.light.primary` et les tokens numériques de `spacing` / `radius` dans les objets de style React Native.

Les tokens sont une source de cohérence visuelle, **pas des composants partagés entre le DOM et le natif**.

## Structure

- `packages/design-tokens` : source des tokens et génération multi-plateforme
- `packages/themes` : thèmes sémantiques clair/sombre
- `packages/icons` : conventions et icônes (à venir)
- `packages/core` : comportements et utilitaires partagés (à venir)
- `registry/react` : composants React (prochaine étape)
- `registry/native`, `registry/angular`, `registry/web` : phases ultérieures
- `apps/website`, `apps/playground` : documentation et tests UI
- `examples/` : intégrations futures

## Licence

MIT (voir la licence déjà présente dans le dépôt GitHub).
