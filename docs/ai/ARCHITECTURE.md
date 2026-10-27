# Pimolu UI architecture

## Current flow

```text
packages/design-tokens/src/tokens.json (primitives)
  → scripts/build.mjs → packages/design-tokens/dist/{tokens.json,tokens.css}
                      → packages/themes/dist/{themes.json,styles.css}
packages/themes/src/themes.json (light/dark semantic aliases)
  → scripts/build-default.mjs → dist/default.css
packages/themes/src/presets/*.json (six palettes)
  → scripts/build-presets.mjs → dist/{presets.css,presets.js,presets.d.ts}
packages/themes/src/visual/*.json (six visual token sets)
  → scripts/build-visuals.mjs → dist/{visual.css,visuals.js,visuals.d.ts}
packages/themes/style-presets.css (imports + web helpers + radius + density)
  → packages/web-styles/src/*.css → scripts/build.mjs → dist/pimolu.css + per-component CSS
packages/core/createVariants → registry/react/* + PimoluProvider
  → apps/playground and examples/nextjs
```

`pnpm build:all` runs that chain in order. The `dist` outputs are generated and
ignored by Git: edit their sources, never their copies. The
`@pimolu/web-styles/styles.css` bundle gathers the tokens, the presets, the
dimensions and the component styles; it has to be loaded for components to get
their appearance.

## Contracts between modules

- `packages/core` provides `createVariants()`, which assembles CSS classes and
  adds no style runtime.
- `registry/react/index.ts` defines the public exports. Each component owns its
  types and variants under `registry/react/<name>/`; its web CSS lives in
  `packages/web-styles/src/<name>.css`.
- `PimoluProvider` sets `data-pimolu-theme`, `data-pimolu-style`, and the
  optional `data-pimolu-radius` / `data-pimolu-density` attributes on a
  container, and writes the brand colour as inline custom properties. The
  stylesheets derive their appearance from those attributes and from the
  `--pimolu-*` variables.
- The floating menus of Select, Combobox, MultiSelect, Tooltip and Popover render
  through a portal attached to the theme container closest to the trigger, so
  tokens survive nested providers. Dialog portals to the theme scope of its
  root, so a trigger-less controlled dialog keeps the surrounding theme.
- `registry/react/internal/` also provides the shared overlay hooks:
  `usePresence` for exit animation, `useDismissableLayer` for outside/Escape
  dismissal, and `useFocusTrap` for modal focus. Combobox and MultiSelect use
  the shared dismissal layer; Dialog and Popover keep their specialized focus
  and positioning paths. Drawer, ContextMenu, HoverCard, CommandPalette and
  Toast build on these helpers. `Portal` is exported publicly as a low-level
  utility for custom overlays.
- The layout primitives (`Box`, `Stack`/`HStack`/`VStack`, `Flex`, `Grid`,
  `Container`, `Center`, `Spacer`, `AspectRatio`) expose token-level spacing and
  alignment as classes plus local CSS custom properties; they never introduce a
  CSS-in-JS layer. `FocusScope` reuses the shared focus-trap hook without
  requiring a modal.
- The advanced layer composes the same primitives: `DataGrid` and
  `TreeTable` extend the table family, `Chart` renders accessible SVG,
  `Form` orchestrates validation without a dependency, and the media,
  application and complex families (players, lightbox, QR code, Menubar,
  Toolbar, Tour, Kanban, Chat, Scheduler, Gantt, FileManager) remain
  data-driven and CSS-token based.
- `apps/playground/src/router.ts` declares the demo pages;
  `apps/playground/src/demo-data.ts` derives the option lists from the public
  variant maps. `examples/nextjs` is a separate integration example.

## Limits of the current architecture

The React and Core packages compile to `dist/` and are published on npm at
`0.1.0-beta.3.1` alongside the token, theme and web-style packages. Web components
and visual data are separate, which prepares token reuse on other platforms, but
no native or Angular implementation exists yet. Playwright covers the website;
the full Playground visual matrix remains a manual review.
