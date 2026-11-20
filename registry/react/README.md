# @pimolu/react

**One system. Your signature.**

A token-first React component library for interfaces that need to feel intentional. Pimolu ships 136 component families, seven visual presets, light and dark themes, and typed named-part styling without a CSS-in-JS runtime.

[Documentation](https://pimolu.com/components) · [Quick start](https://pimolu.com/docs/quick-start) · [Identity Kit](https://pimolu.com/identity-kit) · [Showcase](https://pimolu.com/showcase) · [Customization](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/registry/react)

> **Beta:** `0.1.0-beta.9` is a preview. Component APIs and visual tokens may change before `1.0.0`.

## Why Pimolu?

- **A system, not a pile of controls.** Every family shares one token, theme and preset language. Change the preset and the whole interface follows.
- **CSS-first by design.** Plain CSS classes and CSS variables, with no Tailwind requirement and no CSS-in-JS runtime. The optional `layered.css` entry makes application overrides predictable.
- **Customization that survives refactors.** Typed `classNames` maps cover every family and compound part. You style public part keys, not internal DOM structure.
- **Built for real product surfaces.** Forms, overlays, navigation, data tables, charts, schedulers, file tools and complete application shells are included.
- **Accessibility is part of the work.** Components use keyboard, focus and ARIA patterns with browser regressions. This is engineering care, not a blanket WCAG certification.
- **Bilingual documentation.** English and French guides, live examples, generated API references and an [llms.txt](https://pimolu.com/llms.txt) map for AI-assisted workflows.

## At a glance

| | |
| --- | --- |
| Components | 136 React families |
| Themes | Light, dark and system |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Styling | Plain CSS, CSS variables, optional cascade layers |
| Customization | Typed `classNames` on every family and compound part |
| Framework | React 18 and 19, Next.js App Router |
| Distribution | ESM, TypeScript declarations, `"use client"` entry |
| Package size | One tree-shakeable ESM entry; shared or per-component CSS |

## Install

```bash
pnpm add @pimolu/react@latest @pimolu/web-styles@latest
```

React and React DOM 18 or 19 are peer dependencies. Load the shared stylesheet once in your application entry.

## Quick start

In your global CSS — for example `app/globals.css` in Next.js:

```css
@import "@pimolu/web-styles/styles.css";
```

Wrap the interface once. `PimoluProvider` owns the colour mode, style preset, radius, density and brand colour.

```tsx
"use client";

import { Button, PimoluProvider } from "@pimolu/react";

export function App() {
  return (
    <PimoluProvider defaultTheme="system" defaultStylePreset="default">
      <Button>Create workspace</Button>
    </PimoluProvider>
  );
}
```

The package is ESM-only. Its entry includes `"use client"` so it can be imported from a Next.js client boundary without extra configuration.

The entry is a single module with `sideEffects: false`, so a bundler removes the families you do not import. React itself stays a peer dependency.

## Load only the CSS you use

`styles.css` is the simplest path: one import, every component sheet, the tokens, the themes and the presets. For smaller payloads, `@pimolu/web-styles` also exports `tokens.css`, `themes.css`, `motion.css` and one sheet per family:

```css
/* Tokens, themes and presets, without component rules */
@import "@pimolu/web-styles/tokens.css";

/* Only the families on this page */
@import "@pimolu/web-styles/button.css";
@import "@pimolu/web-styles/input.css";
@import "@pimolu/web-styles/card.css";
```

Per-family sheets include the shared motion policy, so a standalone `motion.css` import is not needed for them. Never combine `styles.css` or `layered.css` with `tokens.css` or `themes.css`; import one entry only. See the [customization contract](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md#minimal-payloads) for the exact rules.

## What is inside

| Area | Examples |
| --- | --- |
| Inputs and forms | Button, Input, Select, Combobox, MultiSelect, DatePicker, Calendar, FileUpload, Form |
| Surfaces and overlays | Card, Dialog, Drawer, Popover, Tooltip, Toast, Alert, Banner |
| Navigation and layout | Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, DashboardLayout, AppShell |
| Data and productivity | Table, DataTable, DataGrid, TreeTable, Chart, Scheduler, Gantt, Kanban, FileManager |
| Content and media | Typography, Prose, CodeBlock, Carousel, ThumbnailCarousel, CoverflowCarousel, PeekCarousel, StackCarousel, ArcCarousel, MultiCarousel, VideoPlayer, AudioPlayer, PDFViewer, Lightbox |

## Customize a part, not a selector

```tsx
import { Button } from "@pimolu/react";

export function CheckoutAction() {
  return (
    <Button
      classNames={{
        root: "checkout-action",
        label: "checkout-action__label",
      }}
    >
      Pay securely
    </Button>
  );
}
```

```css
.checkout-action {
  border-radius: 999px;
}

.checkout-action__label {
  letter-spacing: 0.01em;
}
```

Every family exposes stable part keys. Compound components inherit their family scope through wrappers and portals, while independently nested roots reset it. See the [customization contract](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) for the complete key reference, layer recipes and accessibility responsibilities.

## The package family

| Package | Role |
| --- | --- |
| [`@pimolu/react`](https://www.npmjs.com/package/@pimolu/react) | React components, hooks and layouts |
| [`@pimolu/web-styles`](https://www.npmjs.com/package/@pimolu/web-styles) | Plain CSS bundle, layered entry and per-component CSS |
| [`@pimolu/themes`](https://www.npmjs.com/package/@pimolu/themes) | Light/dark themes, seven presets and visual data |
| [`@pimolu/design-tokens`](https://www.npmjs.com/package/@pimolu/design-tokens) | Primitive tokens in CSS and JSON |
| [`@pimolu/core`](https://www.npmjs.com/package/@pimolu/core) | Framework-independent variant class utility |

## Starters and projects built with Pimolu

All of these install the published npm packages, not a repository checkout:

| Project | Stack | Source |
| --- | --- | --- |
| [Next.js starter](https://github.com/pimoludev/nextjs-starter) | Next.js 16 App Router, TypeScript, Tailwind CSS | GitHub |
| [React + Vite starter](https://github.com/pimoludev/react-vite-starter) | Vite, TypeScript, Tailwind CSS | GitHub |
| [Dashboard starter](https://github.com/pimoludev/dashboard-starter) | Complete SaaS dashboard with the published packages | GitHub |
| [Project Workspace](https://saas-landing.pimolu.com/) | SaaS landing page built with Pimolu UI | [Source](https://github.com/pimoludev/saas-landing) |
| [Pimolu Headset](https://pimolu-headset.pimolu.com/) | E-commerce product storefront | [Source](https://github.com/pimoludev/pimolu-headset) |
| [MECANES](https://www.mecanes.fr/) | Agency site built with Pimolu UI | [Showcase](https://pimolu.com/showcase) |

## Documentation and status

- [Component catalogue](https://pimolu.com/components) with live examples, APIs and usage notes
- [Quick start](https://pimolu.com/docs/quick-start)
- [Theming guide](https://pimolu.com/docs/theming)
- [Identity Kit](https://pimolu.com/identity-kit): choose a preset, brand colour, radius and density, preview real components, then export CSS variables and JSON
- [Starters and showcase](https://pimolu.com/showcase)
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. The React registry is implemented; native, Angular and web-component registries are future directions, not current packages. The full visual and assistive-technology audit remains open, so this release is a preview rather than a stable `1.0.0`.

MIT © Pimolu
