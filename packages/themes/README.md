# @pimolu/themes

Colour themes, style presets and visual token data for Pimolu UI.

> **0.1.0-beta.1** — preview release. Preset and token names may still change.

```bash
pnpm add @pimolu/themes
```

```ts
import "@pimolu/themes/presets.css";
import { pimoluPresets } from "@pimolu/themes/presets";
import { pimoluPresetVisuals } from "@pimolu/themes/visuals";
import themes from "@pimolu/themes/themes.json" with { type: "json" };
```

Apply a theme and preset with data attributes:

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">...</div>
```

The package ships generated CSS, JavaScript data and TypeScript declarations. It is
the cross-platform source of truth for borders, shadows, radii, typography and
press effects.

Documentation: <https://github.com/pimoludev/ui>

MIT © Pimolu
