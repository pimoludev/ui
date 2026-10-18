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
- Location: `registry/react/<name>/` with exactly these files:
  ` <name>.tsx`, `<name>.variants.ts`, `<name>.css`, `<name>.test.tsx`.
- Export the component and its prop type from `registry/react/index.ts`.
- Variants: use `createVariants` from `@pimolu/core` in `<name>.variants.ts`.
  It returns a **className string** — there is no `cn`/Tailwind/CVA.
- Styling: plain CSS using `pimolu-*` classes and `--pimolu-*` variables.
  No Tailwind, no CSS-in-JS, no inline style objects for theming.
- Theming is attribute-driven: components rely on `data-pimolu-theme` /
  `data-pimolu-style` set by `PimoluProvider`. Never read theme via JS context.
- Use semantic vars (`--pimolu-primary`, `--pimolu-border`, `--pimolu-muted`…)
  and physical tokens (`--pimolu-radius-md`, `--pimolu-spacing-4`, `--pimolu-focus-ring`).
  Provide sensible CSS fallbacks, as `button.css` does.
- Components are function components; use `forwardRef` when a DOM ref is useful.
- Reference implementation to copy from: `registry/react/button/`.

## Steps
1. Read the closest existing component (`button`) and `packages/core/index.ts`.
2. Define the props interface (`interface <Name>Props extends <HtmlAttributes>` +
   `VariantProps<typeof <name>Variants>`).
3. Implement `<name>.variants.ts` (base class + variant classes + `defaultVariants`).
4. Implement `<name>.css` for base, variants, states, and reduced-motion.
5. Implement states when relevant: hover, focus-visible, active, disabled, loading.
6. Ensure accessibility: real HTML semantics, focus-visible outline using
   `--pimolu-focus-ring`, `aria-*` for state, accessible name for icon-only.
7. Avoid duplicated logic/styles; extract shared pieces only when truly reused.
8. Export from `registry/react/index.ts`.
9. Run `test-runner` (`pnpm verify:quick`), then `test-coverage-audit`.
10. If public, run `playground-sync`, `public-api-review`, and
    `documentation-sync` / `theme-integrity-audit` as applicable.

## Skills used
`test-runner`, `test-coverage-audit`, `playground-sync`, plus
`public-api-review`, `accessibility-audit`, `theme-integrity-audit` when relevant.

## Failure conditions
- Would break an existing public prop/type without an explicit request.
- Introduces a new styling/token mechanism instead of the existing one.
- Missing TypeScript typing or untyped `any` leaking into the public API.

## Validation criteria
- Files follow the layout; export added.
- `pnpm typecheck` and `pnpm test:react` green; states covered per `test-coverage-audit`.
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
