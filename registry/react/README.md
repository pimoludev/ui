# @pimolu/react

Accessible React components, hooks and application layouts built on Pimolu's shared design system. The beta includes 129 component families, from Button and Form to DataGrid and DashboardLayout.

> **0.1.0-beta.3** is a preview release. Component APIs may change before 1.0.

## Install

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

React and React DOM 18 or 19 are peer dependencies. The CSS ships separately so applications can load it once.

## Use

In your global stylesheet (for example, `app/globals.css` in Next.js):

```css
@import "@pimolu/web-styles/styles.css";
```

In a client component:

```tsx
"use client";

import { Button, PimoluProvider } from "@pimolu/react";

export function App() {
  return (
    <PimoluProvider defaultTheme="system" defaultStylePreset="default">
      <Button onClick={() => alert("Welcome to Pimolu")}>
        Try Pimolu
      </Button>
    </PimoluProvider>
  );
}
```

`PimoluProvider` supplies the colour mode and style preset. Components use Pimolu CSS variables; change the provider preferences or override semantic tokens to match your product. The package is ESM-only and its entry includes `"use client"` for React Server Component environments.

Browse the [component catalogue](https://pimolu.com/components) for live examples, API tables and accessibility notes, or follow the [quick start](https://pimolu.com/docs/quick-start) for app setup.

## Links

[All npm packages](https://www.npmjs.com/org/pimolu) · [Source](https://github.com/pimoludev/ui/tree/main/registry/react) · [Report an issue](https://github.com/pimoludev/ui/issues)

MIT © Pimolu
