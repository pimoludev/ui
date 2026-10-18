---
name: pimolu-orchestrator
description: Central router for Pimolu UI work. Use for multi-step or cross-cutting requests ("add a component", "create a theme", "audit all themes", "improve the playground", "prepare a commit/push/release") to select and sequence the right specialized skills.
---

# pimolu-orchestrator

Thin router/coordinator. It decides **which** specialized skills to use, in **what order**,
and under **which authorization** — it does not restate their instructions. Load a
specialized skill only when it is actually needed.

## Activation
Use when a request spans several domains or steps, or when the user describes an outcome
without naming skills:
- "Ajoute un composant Button" / "Create a new theme" / "Vérifie tous mes composants"
- "Améliore le playground" / "Prépare un commit" / "Push mes modifications" / "Prépare une release"

Do **not** activate for a trivial single-step edit (typo, one-line fix) — do it directly.

## Discovery (use native mechanisms)
1. The host runtime exposes the available skills with their `name` + `description`.
   Rely on that list; do not hardcode a fixed catalog here.
2. Read `.agents/<skill>/SKILL.md` frontmatter (name/description) to reason about
   responsibilities; load the full body only for the skills you selected.
3. To validate the catalog (names match directories, no duplicates, frontmatter valid):
   `pnpm skills:check`. Maintenance only — never pretend to "invoke" a skill from a script.
4. New skills become selectable as soon as they exist — no change to this file required.

## Routing (adapt to skills actually present)
| Intent | Skills, in order |
| --- | --- |
| Add/modify a component | `component-development` → `test-runner` → `test-coverage-audit` → `playground-sync` (+ `accessibility-audit`, `documentation-sync` when relevant) |
| Add/modify a theme or preset | `theme-integrity-audit` → `test-runner` → `test-coverage-audit` → `playground-sync` → `documentation-sync` |
| Change tokens/CSS variables | `theme-integrity-audit` → `test-runner` → `playground-visual-tests` |
| Playground work | `playground-sync` → `playground-visual-tests` → `test-runner` (+ `theme-integrity-audit` if styles) |
| Change a public API | `public-api-review` → `documentation-sync` → `test-runner` |
| Commit | `git-commit` (it pulls in `test-runner` + `test-coverage-audit`) |
| Push | `github-push` (full `test-runner`) |
| Release | `release-manager` → `public-api-review` → `documentation-sync` → `test-runner` |
| "Audit everything" | `theme-integrity-audit` (global mode) / `test-coverage-audit` per component |

These are examples of routing, **not** a list to run exhaustively.

## Sequencing & dependencies
- Implement before demo: finish the component, then sync the playground.
- Run validations **after** the last edit; reuse a still-valid result instead of re-running.
- Invalidate results as soon as a subsequent edit touches their inputs.
- Stop dependent steps when a blocking step fails (don't push a red tree, don't sync a broken component).
- Don't run the whole repository for a minor change — scope to what changed (see `test-runner`).

## Authorizations
- **A — implementation request** ("add X"): make the requested changes; update the
  playground if that is the project rule. Out-of-scope extras must be proposed first.
- **B — audit request** ("verify all themes"): read-only. Collect findings + proposals,
  then ask which corrections to apply. A verification request is **not** permission to edit.
- **C — commit / push / publish**: validations are mandatory; push and publish require
  explicit confirmation. Never infer authorization to commit/push/publish from a request
  to check.

## Missing skill
If no skill covers a need: check whether an existing one suffices; otherwise decide if the
task is small enough to do directly; only if it is a recurring workflow, propose creating
a new skill (purpose + responsibility) and **wait for approval**. Never create skills
unprompted, and never invent a delegation API that the runtime doesn't provide.

## Coverage gaps
When a skill flags missing functional coverage: identify the component/feature, the existing
tests, the missing scenario, the target file, and the test code; present it and await
confirmation before editing tests. Treat "mandatory" gaps as blockers for the relevant
validation step. Never claim an unexecuted check passed.

## Maintenance
When a skill is added/renamed/removed: verify metadata (`pnpm skills:check`), check for
duplicate responsibilities, confirm discoverability, and update routing here only when
necessary. Remove references to skills that no longer exist.

## Skills used
Orchestrates the specialized skills; it implements nothing itself.

## Failure conditions
- A required specialized skill is missing and the task cannot proceed safely.
- A blocking validation fails.
- A request would require an edit during an audit, or a push/publish without confirmation.

## Validation criteria
- The selected skills are the minimal sufficient set; no needless activation.
- Validations ran on the actual final code; results are reused, not blindly repeated.
- Authorizations respected; final report produced.

## Report format (synthesis — not a concatenation of sub-reports)
```
ORCHESTRATION
- request: <what was asked>
- skills selected: <name → why>
- actions: <summary>
- files changed: <...>
- validations: <command → result>
- tests: passed / failed / not executed
- remaining issues / blockers: <...>
- needs your approval: <...>
```
