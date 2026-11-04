# Pimolu UI

**A design system that keeps its promises.** One source of visual truth, themes and styles you can switch at runtime, and accessible React components — with no styling framework to learn.

[Documentation](https://pimolu.com/docs) · [Components](https://pimolu.com/components) · [Showcase](https://pimolu.com/showcase) · [Repository](https://github.com/pimoludev/ui) · MIT License

**English** · [Français](README.fr.md)

## Why Pimolu UI

Most interfaces drift. A colour is adjusted here, a radius there, and a few months later no two screens quite look like they belong to the same product. Pimolu UI treats that drift as the problem worth solving first: every visual decision lives behind a design token, so consistency becomes the default instead of a constant effort.

The second promise is freedom. Themes and visual styles are applied through data attributes, not through conditional code. Switching from a light to a dark interface, or from a sober look to an expressive one, changes nothing in the components. You design the interface once and dress it however the product needs, today and later.

The third is restraint. There is no CSS-in-JS runtime, no utility-class framework, no build magic to reason about. Styling is plain CSS built from `pimolu-*` classes and `--pimolu-*` variables. You can read it, override it and leave, which is exactly what a foundation should allow.

## What you get

| What | What it means for you |
| --- | --- |
| A single source of truth | Values are authored once as design tokens and compiled for the web and for JavaScript. A change propagates instead of being repeated. |
| Themes without rewrites | Light, dark and system modes, plus seven visual presets, are switched at runtime with an attribute. No component is touched. |
| Accessible components | Keyboard support, visible focus, busy and disabled states, screen-reader labels and reduced-motion handling are built in, not bolted on. |
| No framework to learn | Plain CSS classes and CSS variables. Predictable output, easy overrides, no lock-in. |
| Typed from end to end | Strict TypeScript across components and public APIs, so mistakes are caught before runtime. |
| Automated verification | `pnpm verify` checks the library and playground. The website has separate build, documentation and three-engine browser checks in CI. |

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
| `adaptive` | An alternative palette, available for comparison; not the Default |

Radius (`sharp`, `medium`, `round`), density (`compact`, `comfortable`, `spacious`) and `brandColor` can be configured independently through `PimoluProvider`. Density adjusts box metrics without shrinking text or icons. A custom brand colour does not automatically recalculate the foreground or guarantee contrast: verify the resulting text, hover and focus states.

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

Install the published beta in an existing React 18 or React 19 application:

```bash
npm install @pimolu/react@beta @pimolu/web-styles@beta
# Or with pnpm
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

The current release is **0.1.0-beta.7**. Import `@pimolu/web-styles/styles.css` once at your application entry and wrap your interface in `PimoluProvider` (see Usage below). Core, themes and design tokens are installed as dependencies; add them directly only when importing their APIs yourself. The published packages contain compiled ESM, types and CSS: no repository clone, Pimolu build step or Next.js `transpilePackages` setting is required. Tailwind CSS is optional.

To update an existing installation to the current beta:

```bash
npm install @pimolu/react@beta @pimolu/web-styles@beta
# Or with pnpm
pnpm update @pimolu/react@beta @pimolu/web-styles@beta
```

Update any other directly installed `@pimolu/*` packages to the same version and review the [release notes](https://pimolu.com/releases) before upgrading.

### Contributing and running the Playground

The source repository declares Node.js 20 or newer and pins pnpm in `packageManager`. Use **Node.js 24**, as CI does, for the full workspace; the website declares a minimum of Node.js 22.6. Clone the repository only to contribute or explore the local Playground:

```bash
git clone https://github.com/pimoludev/ui.git
cd ui
pnpm install
pnpm build:all
pnpm "playground dev"
```

| Command | Purpose |
| --- | --- |
| `pnpm build:all` | Generate tokens, themes, presets, visual tokens, component CSS and compiled packages |
| `pnpm build:packages` | Compile `@pimolu/core` and bundle `@pimolu/react` with declarations |
| `pnpm release:plan` | Read-only SemVer analysis from the commit range and audit state |
| `pnpm release:pack-check` | Build every publishable package and validate `npm pack --dry-run` output |
| `pnpm verify` | Full pipeline: build, typecheck, theme audit, tests, lint, playground build |
| `pnpm test:react` | Run the component tests |
| `pnpm audit:themes` | Read-only theme and preset integrity check |
| `pnpm "playground dev"` | Start the playground development server |
| `pnpm dev:website` | Compile the packages, generate the documentation and start the website on port 3001; run `build:all` first on a fresh clone |
| `pnpm build:website` | Build all workspace assets and the production Next.js website |
| `pnpm start:website` | Serve the production website (`PORT`, default 3000) |

## Use it

On the web, import the generated stylesheet and apply a theme and a style through attributes. Custom styles are written against semantic variables such as `var(--pimolu-primary)` and `var(--pimolu-radius-md)`.

```css
/* globals.css, or your application's global stylesheet */
@import "@pimolu/web-styles/styles.css";
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

The CSS import in the React example is an alternative to the global CSS `@import`; use one integration point. With Next.js App Router, put `@import` in `app/globals.css`, import that file from the root layout and place `PimoluProvider` in a Client Component. See the [Next.js guide](https://pimolu.com/docs/nextjs).

Tokens are also available as JSON and visual token data as JavaScript. These are foundations for future React Native rendering; Pimolu does not yet provide React Native components. Native will share design data and use its own rendering rather than React DOM components.

The integration guides show how to use Pimolu UI with Next.js. A standalone Next.js starter will be maintained in a separate repository.

## Customization

The published beta includes an opt-in `@pimolu/web-styles/layered.css` entry and typed `classNames` part hooks across all 129 component families, including compound descendants and portalled surfaces. Public props, semantic CSS variables and named parts let you refine components without copying their implementation. The existing CSS entry and class targets remain supported.

Choose `styles.css` or `layered.css`, rather than loading both. With Tailwind v4, put Preflight in the `base` layer before `pimolu`; with the unlayered entry, load Pimolu after Preflight. Portal content may sit outside your application wrapper: use its named parts to style the actual panel. See the [customization guide](https://pimolu.com/docs/customization) and [customization contract](docs/CUSTOMIZATION.md) for tested recipes and limits.

## Native CSS motion

The published beta includes sliding indicators for Tabs and SegmentedControl, natural-height Accordion transitions, directional NavbarMenu panels and subtle form-error feedback. These use native CSS without requiring Motion. Supported components expose `animated={false}`; `prefers-reduced-motion` is respected. To disable CSS motion for a subtree, place `data-pimolu-motion="off"` on a wrapper outside `PimoluProvider` so its portal host is included. This CSS switch does not replace each overlay's presence lifecycle. See the [animation guide](https://pimolu.com/docs/animation) and [native motion notes](docs/NATIVE_MOTION.md).

## Responsive navigation

Add `collapsible` and `NavbarToggle` to put links and actions behind a menu when the navbar is narrow. The button uses a hamburger by default; `icon` and `closeIcon` accept custom icons. Set `itemsPosition` to `"center"` or `"right"` to move the navigation cluster while the brand stays at the start and the actions stay at the end; the default is `"left"`.

```tsx
import { Navbar, NavbarBrand, NavbarToggle, NavbarContent, NavbarItem } from "@pimolu/react";

<Navbar collapsible>
  <NavbarBrand href="/">Pimolu</NavbarBrand>
  <NavbarToggle />
  <NavbarContent aria-label="Main navigation">
    <NavbarItem href="/docs">Docs</NavbarItem>
  </NavbarContent>
</Navbar>
```

Navbar and Footer accept `appearance="surface"` (the existing default), `"transparent"` (no surface fill) or `"floating"` (a framed surface using preset radius and raised-shadow tokens). Use `bordered={false}` to remove the horizontal divider; the floating appearance keeps its surrounding frame. For an edge-to-edge site, place a transparent Navbar or Footer inside a full-width section and constrain only its content.

For a modal mobile menu, compose `NavbarMenu` around the content and actions. It supports all four sides, a partial or full-screen panel and optional animation. The original inline menu remains available. See the [Navbar reference](https://pimolu.com/components/navbar) for working examples and focus behavior.

## Quality, automated

Correctness should not rely on memory. `pnpm verify` builds the assets, type-checks the code, audits the theme system, runs library test suites, lints the playground and builds it. GitHub CI runs this verification plus a separate website production build, lint, documentation tests and Chromium/Firefox/WebKit suite. Build the website from the monorepo root with `pnpm build:website`, then run `pnpm start:website`.

A dedicated read-only auditor guards the theme system specifically. It confirms light and dark parity, validates every preset, checks that palettes and their styles stay consistent, verifies the generated types, and reports any place where a theme or preset must still be registered. Git hooks run a quick verification before each commit and the full pipeline before each push, so the repository stays healthy without anyone having to think about it.

## Project status

Pimolu UI is under active development and has published its latest public preview, **`0.1.0-beta.7`**. The token pipeline, two color themes, seven visual presets and 129 React component families are present, with component tests and playground pages. The React registry is the current focus; other platform registries are not implemented yet. The five library packages are available on npm at `0.1.0-beta.7`, with both `latest` and `beta` tags:

```bash
pnpm add @pimolu/react@beta @pimolu/web-styles@beta
```

Browse all five packages in the [Pimolu npm organization](https://www.npmjs.com/org/pimolu).

The [public website](https://pimolu.com) includes guides, 135 live component references, a searchable illustrated catalogue, MDX articles and releases, and a showcase of real projects. Its Next.js App Router source is in `apps/website`.

This is still a beta. APIs and visual tokens may evolve; complex-component assistive-technology reviews and the full visual quality audit remain open. Automated browser checks do not establish complete accessibility conformance. See the [quality audit](docs/ai/QUALITY_AUDIT.md), [website accessibility audit](apps/website/ACCESSIBILITY_AUDIT.md) and [changelog](CHANGELOG.md) for coverage and limits.

## Design direction and next steps

The published beta.6 still uses the slate/indigo Default. On the source branch `feat/ink-and-signal`, **Ink & Signal** is implemented on the existing Default: warm neutrals, an iris accent, separate functional control borders and optional DM Sans / Newsreader / IBM Plex Mono roles with fallbacks. The website self-hosts the fonts; the library does not download them. These changes are not published on npm. The future **Identity Kit** remains a proposal to extend ThemeBuilder with identity preview and export.

The branch provides real component comparisons in Playground Design Lab (versioned), plus an optional local `/design-preview` route ignored by Git: marketing, a validated local form and a searchable dashboard, with a frozen beta.6 specimen. Review light/dark, responsive layouts, dense data, interactive states, customization and accessibility before a release. No eighth preset or stable release is introduced. Use `--pimolu-control-border` for essential field boundaries and `--pimolu-border` for decorative separators; the new roles require this source branch.

See the [design specification](docs/ai/pimolu-design-spec-v0.1.md), [design direction](docs/ai/DESIGN_DIRECTION.md) and [platform roadmap](docs/ai/PLATFORM_ROADMAP.md). React, Next.js and Vite are the current focus; Blocks and Electron integration come next, with React Native/Expo, Angular and a standalone HTML/JavaScript layer remaining future work. Shared CSS bundles already exist; they are not a complete framework-independent interaction library.

## Contributing

The reference component to learn the conventions is `registry/react/button`. Development workflows are documented in `AGENTS.md`, with specialized agent skills under `.agents/skills`. Before proposing a change, run `pnpm verify` and keep component tests, themes, documentation and the playground aligned.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
