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
