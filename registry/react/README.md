# @pimolu/react

Accessible React components for Pimolu UI, built on plain CSS and semantic design tokens.

> **0.1.0-beta.1** — preview release. The public component API may still change.

## Install

```bash
pnpm add @pimolu/react @pimolu/web-styles
```

`react` and `react-dom` 18 or 19 are peer dependencies.

## Use

```tsx
import { Button, PimoluProvider } from "@pimolu/react";
import "@pimolu/web-styles/styles.css";

export function App() {
  return (
    <PimoluProvider theme="light" stylePreset="default">
      <Button>Try Pimolu</Button>
    </PimoluProvider>
  );
}
```

The package is ESM-only, ships a single tree-shakeable bundle with declarations,
and includes the `"use client"` directive for React Server Components. The
companion stylesheet is imported separately from `@pimolu/web-styles`.

The 0.1 beta includes 129 component families. See the documentation site for
props, live examples and accessibility notes.

Documentation: <https://github.com/pimoludev/ui>

MIT © Pimolu
