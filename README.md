# Pimolu UI

**A design system that keeps its promises.** One source of visual truth, themes and styles you can switch at runtime, and accessible React components — with no styling framework to learn.

[Repository](https://github.com/pimoludev/ui) · MIT License · Node.js 20+

**English** · [Français](README.fr.md)

## Why Pimolu UI

Most interfaces drift. A colour is adjusted here, a radius there, and a few months later no two screens quite look like they belong to the same product. Pimolu UI treats that drift as the problem worth solving first: every visual decision lives behind a design token, so consistency becomes the default instead of a constant effort.

The second promise is freedom. Themes and visual styles are applied through data attributes, not through conditional code. Switching from a light to a dark interface, or from a sober look to an expressive one, changes nothing in the components. You design the interface once and dress it however the product needs, today and later.

The third is restraint. There is no CSS-in-JS runtime, no utility-class framework, no build magic to reason about. Styling is plain CSS built from `pimolu-*` classes and `--pimolu-*` variables. You can read it, override it and leave, which is exactly what a foundation should allow.

## What you get

| What | What it means for you |
| --- | --- |
| A single source of truth | Values are authored once as design tokens and compiled for the web and for JavaScript. A change propagates instead of being repeated. |
| Themes without rewrites | Light and dark themes, plus six visual presets, are switched at runtime with an attribute. No component is touched. |
| Accessible components | Keyboard support, visible focus, busy and disabled states, screen-reader labels and reduced-motion handling are built in, not bolted on. |
| No framework to learn | Plain CSS classes and CSS variables. Predictable output, easy overrides, no lock-in. |
| Typed from end to end | Strict TypeScript across components and public APIs, so mistakes are caught before runtime. |
| Quality you do not have to remember | One command verifies the build, the types, the theme system, every test suite, the lint and the playground. |

## Themes and presets

The design system has two complementary layers. A colour theme gives meaning to primitives and exists in a light and a dark variant. A style preset reshapes the visual character of the interface, and the two combine freely.

| Preset | Character |
| --- | --- |
| `default` | The reference look, based on the active theme |
| `monochrome` | A restrained greyscale palette |
| `cartoon` | Bold outlines and a playful feel |
| `glass` | Translucent surfaces and soft depth |
| `luxury` | Refined typography and warm neutrals |
| `neo-brutalism` | Hard borders, flat shadows and high contrast |

```html
<div data-pimolu-theme="dark" data-pimolu-style="glass">
  <button class="pimolu-button pimolu-button--primary pimolu-button--solid pimolu-button--md">
    Try Pimolu
  </button>
</div>
```

## Foundations

The primitive layer is authored in the Design Tokens Community Group format and lives in one place. Semantics sit on top of it: a component never refers to `indigo-600`, only to `primary`. That indirection is what lets a dark theme or a radical preset exist without duplicating a single component style.

Components consume tokens exclusively through CSS custom properties and data attributes. A provider sets `data-pimolu-theme` and `data-pimolu-style` on a container, and the CSS reacts to those attributes, keeping styling declarative and free of JavaScript side effects. The result is a system that is small to learn and hard to misuse.

## Getting started

Pimolu UI requires Node.js 20 or newer and uses pnpm. Start by exploring the playground, where every component and preset is demonstrated live.

```bash
git clone https://github.com/pimoludev/ui.git
cd ui
pnpm install
pnpm build:all
pnpm "playground dev"
```

| Command | Purpose |
| --- | --- |
| `pnpm build:all` | Generate tokens, themes, presets, visual tokens and component CSS |
| `pnpm verify` | Full pipeline: build, typecheck, theme audit, tests, lint, playground build |
| `pnpm test:react` | Run the component tests |
| `pnpm audit:themes` | Read-only theme and preset integrity check |
| `pnpm "playground dev"` | Start the playground development server |

## Use it

On the web, import the generated stylesheet and apply a theme and a style through attributes. Custom styles are written against semantic variables such as `var(--pimolu-primary)` and `var(--pimolu-radius-md)`.

```tsx
import "@pimolu/web-styles/styles.css";
```

In React, the provider and components wrap the same foundations, so markup stays stable while the design evolves around it.

```tsx
import { Button, PimoluProvider } from "@pimolu/react";
import "@pimolu/web-styles/styles.css";

export function App() {
  return (
    <PimoluProvider theme="dark" stylePreset="luxury">
      <Button appearance="outline">Explore</Button>
    </PimoluProvider>
  );
}
```

Tokens are also available as JSON, so React Native and other JavaScript consumers feed the same values into native style objects. On native the priority is visual consistency through shared tokens rather than shared component code.

A complete Next.js App Router example, including server-read theme cookies, lives in `examples/nextjs`.

## Quality, automated

Correctness should not rely on memory. A single command, `pnpm verify`, builds the assets, type-checks the code, audits the theme system, runs every test suite, lints the application and builds the playground. GitHub CI is currently disabled while the existing library is being refined.

A dedicated read-only auditor guards the theme system specifically. It confirms light and dark parity, validates every preset, checks that palettes and their styles stay consistent, verifies the generated types, and reports any place where a theme or preset must still be registered. Git hooks run a quick verification before each commit and the full pipeline before each push, so the repository stays healthy without anyone having to think about it.

## Project status

Pimolu UI is under active development. The token pipeline, two color themes, six visual presets and 83 React component families are present, with component tests and playground pages. The React registry is the current focus; other platform registries remain placeholders. Packages are consumed from the workspace today, with registry distribution planned. See [technical context](docs/ai/PROJECT_CONTEXT.md) for the verified architecture and current limits.

## Contributing

The reference component to learn the conventions is `registry/react/button`. Development workflows are documented in `AGENTS.md`, with specialized agent skills under `.agents/skills`. Before proposing a change, run `pnpm verify` and keep component tests, themes, documentation and the playground aligned.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
