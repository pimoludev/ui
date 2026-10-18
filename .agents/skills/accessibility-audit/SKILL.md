---
name: accessibility-audit
description: Audit Pimolu UI components for keyboard, focus, semantics, ARIA, contrast and disabled-state accessibility. Use when adding or changing an interactive component.
---

# accessibility-audit

## Activation
Use for any interactive component (button, input, menu, modal…) or when
accessibility is explicitly requested.

## Responsibilities
- Verify real, testable accessibility — not checklists for their own sake.
- Propose localized fixes consistent with the existing architecture.

## Checklist (verify by relevance)
- Keyboard: reachable and operable with `Tab` and `Enter`/`Space`.
- Focus visibility: `:focus-visible` outline using `--pimolu-focus-ring`
  (see `button.css`).
- Semantics: native elements first (`<button>`, `<input>`, `<nav>`…), not `div`+click.
- Accessible names and labels; icon-only elements need `aria-label`.
- ARIA state only when needed (`aria-busy` during loading, `aria-disabled`, `role`).
- Disabled handling: real `disabled`, no handler firing.
- Loading handling: announced as busy, interaction blocked.
- Contrast: text vs background and focus ring vs surface, in `light` and `dark`
  and each preset.
- Modals/menus: focus trap, `Escape`, focus return (once such components exist).

## Reference implementation
`registry/react/button/button.tsx` + `button.css`: `forwardRef`, real `<button>`,
`disabled={disabled || loading}`, `aria-busy`, screen-reader-only label for
`iconOnly`, `:focus-visible` outline, `prefers-reduced-motion` handling. Use it as
the pattern for new components.

## Steps
1. Read the component markup and CSS.
2. Walk the checklist; for each item mark pass/fail/na with evidence.
3. Where a test can prove it (keyboard activation, disabled blocks handler,
   accessible name), route it to `test-coverage-audit`.
4. Propose minimal fixes; do not restructure the component unnecessarily.
5. Verify with `pnpm typecheck` + `pnpm test:react` after any fix.

## Skills used
`test-coverage-audit`, `test-runner`, `component-development` for fixes.

## Failure conditions
- Missing accessible name on an interactive/icon-only control.
- Focus not visible, or a click-only non-semantic element.
- Disabled/loading state still triggers the action.

## Validation criteria
- All applicable checklist items pass or are explicitly flagged with a fix plan.
- Keyboard-only operation confirmed.

## Report format
```
A11Y
- component: <name>
- pass: <items>
- fail: <item → evidence → proposed fix>
- tests to add: <scenario → route to test-coverage-audit>
- verdict: ok | needs-fix
```
