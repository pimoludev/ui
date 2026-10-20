# Development guide

## Preparing the workspace

Node >= 20 and pnpm pinned in `package.json`. From the root: `pnpm install`, then
`pnpm build:all` to produce the Git-ignored outputs. The playground starts with
`pnpm "playground dev"`.

## Commands verified in `package.json`

| Command | Effect |
| --- | --- |
| `pnpm build` | Generates the primitives and the base themes only. |
| `pnpm build:all` | Also generates Default, the six palettes, the six visual sets and the web CSS. |
| `pnpm test` | Node tests for the design tokens; reruns their build. |
| `pnpm test:themes` | Node tests for themes and presets, contrast included. |
| `pnpm test:react` | Vitest + Testing Library in `registry/react`. |
| `pnpm test:web-styles` | Tests for the generated CSS bundles. |
| `pnpm typecheck` | Root TypeScript over packages and registry. |
| `pnpm lint` | ESLint for the playground. |
| `pnpm audit:themes:strict` | Theme audit, also failing on a warning. |
| `pnpm skills:check` | Validates the `.agents/skills` catalog. |
| `pnpm verify:quick` | Build, typecheck, audit, tokens, themes, React and CSS tests. |
| `pnpm verify` | Quick verification + lint + skills + playground build. |
| `pnpm check` | Full verification + `examples/nextjs` build. |

`pnpm --dir registry/react exec vitest run button/button.test.tsx` targets one
React test. The pre-commit hook runs `verify:quick` and checks the staged files;
pre-push runs `verify`. The GitHub workflow
`.github/workflows/ci.yml.disabled` must stay disabled until an explicit
maintainer decision.

The TypeScript configurations of the root, the playground and the Next.js example
use `strict`. The root typecheck covers packages and registry; the playground and
Next.js builds check their own applications.

## Adding or changing a component

Read `registry/react/button/` as the model, then the component closest to the
need. Put React, types, variants and tests in `registry/react/<name>/`, the CSS in
`packages/web-styles/src/<name>.css`, declare the bundle in
`packages/web-styles/scripts/build.mjs` and the exports in
`packages/web-styles/package.json` and `registry/react/index.ts`. Synchronise
`apps/playground/src/pages/`, its routing and, when needed,
`src/demo-data.ts`. Check controlled/uncontrolled states, forms, keyboard,
screen readers, reduced motion, forced colors and RTL as the component requires.
Update the READMEs and the docs for public changes.

Design data lives in the source JSON, never in `dist`. Use the `--pimolu-*`
variables and the `pimolu-*` classes, without introducing a styling framework.
Run `pnpm verify`, then look at the real rendering across the seven presets and
both colour modes for any visual change. Do not claim a check was run when it was
not.

## Consumer customization

Start with the component props, then pass `className`/`style` or override its
documented `--pimolu-*` variables in application CSS loaded after the Pimolu
bundle. Avoid editing generated `dist` files. For example, `Sidebar` accepts
`collapsible`, `collapsed`/`defaultCollapsed`, `onCollapsedChange` and
`collapseOnMobile`; `AppShell` and `DashboardLayout` accept rail width props.
`ColorPicker` accepts a replacement `presets` array and also allows any hex
color. `PhoneInput` accepts a replacement `countries` array. `Box` accepts
`padding`, `paddingX` and `paddingY` on the shared spacing scale.

```tsx
<Sidebar collapsible collapseOnMobile>
  <SidebarContent aria-label="Workspace">...</SidebarContent>
</Sidebar>

<ColorPicker presets={["#5B55E7", "#0EA5E9"]} />

<TimePicker className="booking-time" label="Arrival" />
```

```css
.booking-time {
  --pimolu-time-picker-height: 44px;
  --pimolu-time-picker-tone: var(--pimolu-primary);
}
```

## Choosing between related components

| Need | Choose | Why |
| --- | --- | --- |
| A straightforward local data table | `DataTable` | Native table semantics with sorting, filtering, selection and pagination. |
| A data workspace with server ownership, grouping or configurable columns | `DataGrid` | Adds explicit client/server mode, page size control, column visibility and keyboard/pointer resizing. It does not yet virtualize rows or pin/reorder columns. |
| An application frame with a required full-width header and optional footer | `AppShell` | Header and footer span the rails; sidebar and aside are optional. |
| A dashboard with sidebar navigation and a navbar over the main region | `DashboardLayout` | Supports sticky sidebar/navbar and an optional aside; it has no footer slot. |

Start with the smaller component when its API covers the use case. The pairs
are separate public APIs; one is not an alias of the other.
