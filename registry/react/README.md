# @pimolu/react

**One system. Your signature.**

A token-first React component library for interfaces that need to feel intentional. Pimolu ships 129 component families, seven visual presets, light and dark themes, and typed named-part styling without a CSS-in-JS runtime.

[Documentation](https://pimolu.com/components) · [Quick start](https://pimolu.com/docs/quick-start) · [Customization](https://github.com/pimoludev/ui/blob/main/docs/CUSTOMIZATION.md) · [Source](https://github.com/pimoludev/ui/tree/main/registry/react)

> **Beta:** `0.1.0-beta.6` is a preview. Component APIs and visual tokens may change before `1.0.0`.

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
| Components | 129 React families |
| Themes | Light, dark and system |
| Presets | default, adaptive, cartoon, glass, luxury, monochrome, neo-brutalism |
| Styling | Plain CSS, CSS variables, optional cascade layers |
| Customization | Typed `classNames` on every family and compound part |
| Framework | React 18 and 19, Next.js App Router |
| Distribution | ESM, TypeScript declarations, `"use client"` entry |
| Package size | One compiled React bundle plus shared CSS |

## Install

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
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

## What is inside

| Area | Examples |
| --- | --- |
| Inputs and forms | Button, Input, Select, Combobox, MultiSelect, DatePicker, Calendar, FileUpload, Form |
| Surfaces and overlays | Card, Dialog, Drawer, Popover, Tooltip, Toast, Alert, Banner |
| Navigation and layout | Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, DashboardLayout, AppShell |
| Data and productivity | Table, DataTable, DataGrid, TreeTable, Chart, Scheduler, Gantt, Kanban, FileManager |
| Content and media | Typography, Prose, CodeBlock, Carousel, VideoPlayer, AudioPlayer, PDFViewer, Lightbox |

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

## Documentation and status

- [Component catalogue](https://pimolu.com/components) with live examples, APIs and usage notes
- [Quick start](https://pimolu.com/docs/quick-start)
- [Theming guide](https://pimolu.com/docs/theming)
- [Source and issues](https://github.com/pimoludev/ui)

Pimolu UI is a beta. The React registry is implemented; native, Angular and web-component registries are future directions, not current packages. The full visual and assistive-technology audit remains open, so this release is a preview rather than a stable `1.0.0`.

MIT © Pimolu
