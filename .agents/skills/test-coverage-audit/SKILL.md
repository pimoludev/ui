---
name: test-coverage-audit
description: Detect Pimolu UI features that lack sufficient tests and propose ready-to-paste test code. Use when a component, prop, variant or behavior changes and before committing.
---

# test-coverage-audit

## Activation
Use after implementing or modifying a component, variant, prop, state, event or
bug fix, and as part of `git-commit`. Do not use to measure line coverage alone.

## Responsibilities
- Compare implemented behavior against existing tests (`*.test.tsx`).
- Identify the missing scenarios that truly matter and propose test code.
- **Do not write test files automatically** unless the user explicitly asks.

## What to audit
- New components (is there a `registry/react/<name>/<name>.test.tsx`?).
- New public props and their defaults.
- Variants: `variant`, `appearance`, `size`, `radius` (and any new axis).
- Interactive states: hover, focus-visible, active, `disabled`, `loading`.
- Events/callbacks: `onClick`, keyboard activation (`Enter`/`Space`).
- Disabled behavior (must not fire handlers).
- Keyboard navigation and accessible names (`iconOnly` needs `aria-label`).
- Theme/preset behavior (`light`, `dark`; presets `default`, `monochrome`,
  `cartoon`, `glass`, `luxury`, `neo-brutalism`).
- Bug fixes → a non-regression test is mandatory.

## Environment (must match existing tests)
- `vitest` + `@testing-library/react` + `@testing-library/user-event`; matchers
  from `@testing-library/jest-dom` (loaded by `registry/react/test/setup.ts`).
- Model to follow: `registry/react/button/button.test.tsx`
  (`describe`/`it`, `render`, `screen.getByRole`, `userEvent.setup()`, `it.each`).

## Steps
1. Read the component source and its current test file.
2. Map each behavior to a test; list uncovered mandatory scenarios.
3. For each gap: state the feature, the risk, the target file.
4. Produce copy-paste test code consistent with the existing style.
5. Mark which tests are **mandatory before commit** vs nice-to-have.
6. Present everything; await authorization before writing any file.

## Skills used
`test-runner` (to confirm current suite state). `component-development` when the
gap reveals a design flaw.

## Failure conditions
- A mandatory scenario has no test and the change is about to be committed.
- Proposal would require changing production code to be testable → flag it instead of faking.

## Validation criteria
- Each implemented feature is either tested or explicitly listed as a gap.
- Proposed tests run against the real implementation (no mocking of the behavior under test).

## Report format
```
COVERAGE AUDIT
- component: <name>
- covered: <scenario → test name>
- gaps (mandatory):
    - feature: <...>
      risk: <...>
      file: registry/react/<name>/<name>.test.tsx
      code:
        <ready to paste>
- gaps (optional): <...>
- line coverage ≠ functional coverage: noted
```
