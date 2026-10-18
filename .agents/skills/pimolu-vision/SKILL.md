---
name: pimolu-vision
description: Keep work aligned with the Pimolu UI goal (one design system shared across web and native). Use at the start of non-trivial tasks, when choosing what to build next, or when a change might drift from the architecture.
---

# pimolu-vision

## Activation
Read this before a non-trivial task, a new component, an architectural choice,
or whenever a request seems to add a second way of doing something. The
`pimolu-orchestrator` should consult it before routing multi-step work.

## The goal
One visual identity, usable everywhere: React/Next, Angular, plain HTML/CSS via
CDN, and React Native. The hard problem is not writing components; it is keeping
a single source of design truth that every platform consumes without duplicating
styles.

## Non-negotiables
1. **One source of truth per concern.** Primitives in `design-tokens`, semantic
   colours in `themes.json`, preset colours in `src/presets`, preset visuals in
   `src/visual`. Never re-declare a value elsewhere.
2. **Presets are data, not component code.** No `.pimolu-*` selectors in theme or
   preset files. Component styling lives in the render layer and is driven by
   tokens.
3. **Components consume tokens.** No theme state read in JS for styling; theming
   is attribute-driven (`data-pimolu-theme`, `data-pimolu-style`).
4. **The web CSS layer is shared.** `packages/web-styles` and the `pimolu-*` class
   contract serve React, Next, Angular and CDN alike.
5. **Native mirrors the data, not the CSS.** Same tokens, its own rendering.
   Aim for visual and behavioural coherence, not pixel parity.
6. **Enumerate, don't duplicate.** Variant options come from component variant
   maps (`buttonVariantMap`, `inputVariantMap`), never hand-copied into demos,
   docs or tests.
7. **Don't build on a foundation we know must change.** Fix the foundation first,
   or flag it explicitly.

## Current state
Colour themes and presets are data; preset visual tokens are data and generate
web CSS plus JS for native (`dist/visual.{css}`, `dist/visuals.{js,d.ts}`).
`packages/web-styles` owns the shared web CSS and produces `pimolu.css` /
`pimolu.min.css` for the CDN. `@pimolu/react` ships components with no CSS of its
own. The playground has one page per component (hash routes). There is no native
registry yet.

## Roadmap order
1. Preset visual tokens as data — done.
2. Shared web styles layer and bundle — in progress (Button and Input moved).
3. Native registry reading the same generated data.
4. More components, one at a time, on the stable foundation.

## Decision filter
Before starting, answer these. A "no" means redesign the approach.
- Does it introduce a second source of truth?
- Does it put component behaviour into themes or presets?
- Does it duplicate a variant list?
- Does it require a foundation change first?
- Does it keep the playground page for the component in sync?
- Is it the smallest step that proves the direction?

## Red flags
Hardcoded colours instead of tokens. `.pimolu-*` selectors inside a preset file.
Variant values copied into a demo, README or test. CSS imported by the React
package. A new component built before its data exists. A build that only works
because a generated `dist/` already sits on disk.

## When a request conflicts
Name the drift and its cost, propose the aligned alternative, and let the user
decide. Never silently follow a request that breaks the foundation, and never
refuse without offering a path.

## Report format (short)
```
DIRECTION
- verdict: aligned | drift
- why: <one or two lines>
- next step: <the smallest aligned move>
```
