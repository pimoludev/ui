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
- No duplicated rendering logic; demos import from `@pimolu/react`.

## Current playground facts
- App: `apps/playground` (Vite + React 19). Entry `src/main.tsx`, demo `src/App.tsx`.
- It already imports `@pimolu/themes/styles.css` and `@pimolu/themes/presets.css`,
  so `pnpm build:all` must have run for styles to exist.
- Demo state is local `useState` for `theme` (`light`/`dark`) and `stylePreset`.
- Presets present in the repo: `default`, `monochrome`, `cartoon`, `glass`,
  `luxury`, `neo-brutalism`.
- `src/App.css` is leftover Vite template CSS and is NOT imported — do not treat
  it as an app style source.

## Steps
1. Read the component's public API (`<name>.tsx`, `.variants.ts`).
2. Find its existing demo in `App.tsx` (search by component name).
3. Add or update demos for: each new/changed variant, size, key state, and events.
   Do not duplicate an existing demo.
4. Import components from `@pimolu/react` (never re-implement their markup).
5. Add interactive controls where useful (buttons that toggle props/state).
6. Show `light` + `dark` and the relevant style presets.
7. Check responsive behavior (the layout uses flex-wrap; verify narrow widths).
8. Run the checks: `pnpm lint`, `pnpm --dir apps/playground run build`, and
   `test-runner`; the dev server hot-reloads changes (`pnpm "playground dev"`).
9. Present the edits.

## Organization
Group demos by category inside `App.tsx`: Buttons, Inputs, Navigation, Display,
Feedback, Overlays, Other. Add a category section only when a component of that
category exists. Keep one source of truth; avoid scattering duplicate demos.

A demo-registry module (data-driven list of demos) may be introduced **only if**
it reduces maintenance — do not over-engineer for the current component count.

## Skills used
`component-development` (context), `test-runner`, `theme-integrity-audit`,
`playground-visual-tests` when visual verification is needed.

## Failure conditions
- A public variant has no demo after a component change.
- Demo re-implements the component instead of importing it.
- Playground does not build (`pnpm --dir apps/playground run build` fails).

## Validation criteria
- All current variants are demonstrated; build + lint green.
- Demos render correctly in light/dark and the listed presets.

## Report format
```
PLAYGROUND
- component(s): <...>
- demos added/updated: <variant → location in App.tsx>
- presets/themes verified: <...>
- checks: lint/build → result
- notes: <responsive or follow-ups>
```
