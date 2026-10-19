---
name: playground-sync
description: Keep the apps/playground demo in sync with Pimolu UI components, props and variants. Use when a component or variant is added or changed.
---

# playground-sync

## Activation
Use when a component, prop, variant or visual state is added/changed and the
playground should demonstrate it. Also usable to review playground freshness.

## Responsibilities
- Every public component/variant has a real, current demo using the real package.
- Every component page ends with real-world examples, not just prop permutations.
- No duplicated rendering logic; demos import from `@pimolu/react`.

## Current playground facts
- App: `apps/playground` (Vite + React 19). Entry `src/main.tsx`, shell `src/App.tsx`.
- One page per component: `src/pages/<name>-page.tsx`, registered in
  `src/router.ts` (`pages`) and `src/App.tsx` (`pageComponents`). Routes are
  hash-based: `#/overview`, `#/button`, `#/input`.
- Shared data and derived option lists live in `src/demo-data.ts`.
- Chrome: `src/sidebar.tsx` (grouped page navigation), `src/toolbar.tsx`
  (brand and theme/preset controls), `src/section.tsx` (`PageHeader`, `Section`).
- A page entry in `src/router.ts` also carries a `group` (Getting started,
  Actions, Forms, Data display, Layout, Feedback). The sidebar renders the
  groups in first-appearance order, so the `pages` array is kept grouped and
  alphabetical inside each family.
- Styles come from `@pimolu/web-styles/styles.css`, imported in `src/main.tsx`,
  so `pnpm build:all` must run first.
- Presets present in the repo: `default`, `monochrome`, `cartoon`, `glass`,
  `luxury`, `neo-brutalism`.

## Steps
1. Read the component's public API (`<name>.tsx`, `input/…variants.ts`).
2. Find or create its page in `src/pages/`.
3. Add or update demos for: each new/changed variant, size, key state, and events.
   Do not duplicate an existing demo.
4. Import components from `@pimolu/react` (never re-implement their markup).
5. Derive option lists from the component's variant map via `demo-data.ts`;
   never hardcode a variant list in a page. Components without variant axes
   (a Card, a layout primitive) need a page but no derived lists.
6. Add interactive controls where useful (buttons that toggle props/state).
7. Show `light` + `dark` and the relevant style presets.
8. **Always add an "Examples" section with real-world compositions** built from the
   same component: an e-commerce product card with an image and a price, a profile
   card, a metric card, a pricing plan, an empty state… Use realistic copy and,
   when an image helps, a local asset under `apps/playground/public/`. Prop
   permutations are not enough: the section must show the component solving a
   plausible interface problem.
9. Validate visually before calling it done: the page in the six presets × light
   and dark, every size, the hover/focus/disabled/error states, contrast, and the
   layout at narrow widths (the layout uses flex-wrap). Automated tests secure the
   behaviour; they never replace this judgment.
10. Run the checks: `pnpm lint`, `pnpm --dir apps/playground run build`, and
    `test-runner`; the dev server hot-reloads changes (`pnpm "playground dev"`).
11. Present the edits.

## Organization
Each component gets its own page and its own nav entry. Registering a page means
one entry in `src/router.ts` and one mapping in `src/App.tsx`. Keep shared demo
data in `src/demo-data.ts`; a page file should contain demos, not option lists.

## Skills used
`component-development` (context), `test-runner`, `theme-integrity-audit`,
`playground-visual-tests` when visual verification is needed.

## Failure conditions
- A public variant has no demo after a component change.
- A new prop, state, placement or behaviour has no demo on the page.
- Demo re-implements the component instead of importing it.
- Playground does not build (`pnpm --dir apps/playground run build` fails).

## Validation criteria
- All current variants are demonstrated; build + lint green.
- The page includes real-world examples, not only prop permutations.
- Demos render correctly in light/dark and the listed presets.

## Report format
```
PLAYGROUND
- component(s): <...>
- demos added/updated: <variant → page file>
- presets/themes verified: <...>
- checks: lint/build → result
- notes: <responsive or follow-ups>
```
