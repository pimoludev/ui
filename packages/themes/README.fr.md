# @pimolu/themes

Thèmes de couleurs, presets de style et données de tokens visuels pour Pimolu UI.

> **0.1.0-beta.1** — version de prévisualisation. Les noms des presets et des tokens peuvent encore évoluer.

```bash
pnpm add @pimolu/themes
```

```ts
import "@pimolu/themes/presets.css";
import { pimoluPresets } from "@pimolu/themes/presets";
import { pimoluPresetVisuals } from "@pimolu/themes/visuals";
import themes from "@pimolu/themes/themes.json" with { type: "json" };
```

Appliquez un thème et un preset avec des attributs de données :

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">...</div>
```

Le package fournit le CSS généré, les données JavaScript et les déclarations
TypeScript. C'est la source de vérité multiplateforme pour les bordures, ombres,
rayons, typographies et effets d'appui.

Documentation : <https://github.com/pimoludev/ui>

MIT © Pimolu
