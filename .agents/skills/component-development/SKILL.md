---
name: component-development
description: Create or modify Pimolu UI React components following the repo's conventions, tokens and accessibility rules. Use when adding or changing a component in registry/react.
---

# component-development

## Activation
Use when creating, editing or refactoring a React component in `registry/react`,
or when adding props/variants/states to an existing one.

## Responsibilities
- Follow the existing architecture; never introduce a parallel styling system.
- Reuse tokens, shared primitives and CSS classes.
- Keep the public API typed and backward compatible unless asked otherwise.

## Architecture rules (do not deviate)
- Component code lives in `registry/react/<name>/`: `<name>.tsx`, `<name>.types.ts`
  (plus `<name>.variants.ts` only when the component has variant axes) and
  `<name>.test.tsx`. The React package ships **no CSS of its own**.
- Component CSS lives in `packages/web-styles/src/<name>.css`. It is exposed as
  `@pimolu/web-styles/<name>.css`, imported by `packages/web-styles/src/styles.css`,
  and rebuilt with `pnpm build:web-styles` (or `build:all`).
- Export the component and its prop type from `registry/react/index.ts`; also
  export the variant map when the component has one.
- Variants: use `createVariants` from `@pimolu/core` in `<name>.variants.ts`, and
  export `<name>VariantMap` so consumers (playground, docs, other apps) enumerate
  the options instead of duplicating them. It returns a **className string** —
  there is no `cn`/Tailwind/CVA.
- Styling: plain CSS using `pimolu-*` classes and `--pimolu-*` variables.
  No Tailwind, no CSS-in-JS, no inline style objects for theming.
- Theming is attribute-driven: components rely on `data-pimolu-theme` /
  `data-pimolu-style` set by `PimoluProvider`. Never read theme via JS context.
- Use semantic vars (`--pimolu-primary`, `--pimolu-border`, `--pimolu-muted`…)
  and physical tokens (`--pimolu-radius-md`, `--pimolu-spacing-4`, `--pimolu-focus-ring`).
  Provide sensible CSS fallbacks, as `button.css` does.
- Components are function components; use `forwardRef` when a DOM ref is useful.
- Reference implementations: `registry/react/button/` with
  `packages/web-styles/src/button.css`; `registry/react/input/` for form controls.

## Steps
1. Read the closest existing component (`button`, `input`) and `packages/core/index.ts`.
2. Define the props in `registry/react/<name>/<name>.types.ts`.
3. When the component has variant axes, implement `<name>.variants.ts` (base class,
   variant classes, `defaultVariants`) and export the variant map.
4. Write the CSS in `packages/web-styles/src/<name>.css`: base, variants, states and
   reduced-motion. Register it in `styles.css` and in the package `exports`, then
   run `pnpm build:web-styles`.
5. Implement states when relevant: hover, focus-visible, active, disabled, loading.
6. Ensure accessibility: real HTML semantics, focus-visible outline using
   `--pimolu-focus-ring`, `aria-*` for state, accessible name for icon-only.
7. Avoid duplicated logic/styles; extract shared pieces only when truly reused.
8. Export from `registry/react/index.ts`.
9. Run `test-runner` (`pnpm verify:quick`), then `test-coverage-audit`.
10. If public, run `playground-sync` to create or update the component's page, plus
    `public-api-review` and `documentation-sync` / `theme-integrity-audit` as applicable.

## Skills used
`test-runner`, `test-coverage-audit`, `playground-sync`, plus
`public-api-review`, `accessibility-audit`, `theme-integrity-audit` when relevant.

## Failure conditions
- Would break an existing public prop/type without an explicit request.
- Introduces a new styling/token mechanism instead of the existing one.
- Missing TypeScript typing or untyped `any` leaking into the public API.

## Validation criteria
- Files follow the layout; export added; CSS in `packages/web-styles` and rebuilt.
- `pnpm typecheck`, `pnpm test:react` and `pnpm check` green; states covered per `test-coverage-audit`.
- Works under both `light` and `dark` and all presets in the playground.

## Report format
```
COMPONENT
- name: <Name>
- files: <created/modified>
- public API: <props, defaults, variants>
- states: <handled>
- checks: typecheck/test:react → result
- follow-ups: playground / docs / coverage
```
