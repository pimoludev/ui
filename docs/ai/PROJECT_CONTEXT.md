# Pimolu UI — technical context

Updated: 2026-10-20. This folder describes the local repository and is the
starting point for the next sessions. Re-read the relevant source before any
change: these notes do not replace it.

## Verified state

- pnpm and TypeScript monorepo, with the React source library in
  `registry/react`, the shared CSS in `packages/web-styles`, and tokens and
  themes in `packages/design-tokens` and `packages/themes`.
- Two colour modes (`light`, `dark`) plus `system`; seven presets: `default`,
  `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism` and `adaptive`
  (candidate palette, not yet adopted as Default).
- 111 React component families exported by `registry/react/index.ts`, each shown
  in the playground. `examples/nextjs` illustrates the App Router integration.
- Three design dimensions are independent of the preset: radius
  (`data-pimolu-radius`), density (`data-pimolu-density`) and a brand colour
  carried by `PimoluProvider`.
- `apps/website`, the remaining examples and `registry/native`,
  `registry/angular`, `registry/web` are future placeholders with no platform
  implementation.
- `@pimolu/react`, `@pimolu/core`, `@pimolu/themes` and `@pimolu/web-styles` are
  private and are not yet a publishable npm distribution.
- GitHub CI stays disabled in `.github/workflows/ci.yml.disabled`. The local
  `.githooks` and `pnpm verify` are the checks in service.

## Vision expressed by the maintainer

One shared visual identity across React, Next.js, React Native, Angular,
Electron and eventually HTML/CSS through a CDN. Longer term: public
documentation, developer tooling, AI integrations and MCP. Those targets are not
features present in the repository.

## Related documents

- [Architecture](ARCHITECTURE.md): package flow and generated outputs.
- [Design system](DESIGN_SYSTEM.md): theme sources, presets, dimensions and the
  Default direction.
- [Components](COMPONENT_INVENTORY.md): inventory and limits.
- [Development](DEVELOPMENT_GUIDE.md): commands and conventions.
- [Density](DENSITY.md): the density contract and its variable map.
- [Roadmap](ROADMAP.md): proposed priorities, with no delivery commitment.
- [Quality audit](QUALITY_AUDIT.md): verified browser coverage and remaining
  visual and accessibility reviews.

The two public READMEs are `README.md` and `README.fr.md`. Agent instructions
live in `AGENTS.md` and `.agents/skills/`.
