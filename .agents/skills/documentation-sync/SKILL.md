---
name: documentation-sync
description: Keep Pimolu UI documentation accurate when public APIs or setup change. Use when a public component, prop, install step or command changes.
---

# documentation-sync

## Activation
Use when a **public** API, install/setup step, or developer command changes.
Do not use for internal refactors with no externally visible effect.

## Responsibilities
- Keep docs truthful and minimal; never rewrite everything per change.
- Never document behavior that is not implemented.

## Documentation sources in this repo
- `README.md` (English) and `README.fr.md` (French): project presentation, `pnpm`
  prerequisites, build outputs, themes/presets, usage, commands. Keep the command
  tables aligned with `package.json` and keep both languages in sync.
- `AGENTS.md`: agent-facing commands, architecture, workflow orchestration.
- `apps/playground/README.md`: currently the **unmodified Vite template** — treat
  as untrusted boilerplate; replace only if the user wants it.
- `packages/*/README.md`: none yet.

## Steps
1. Identify what changed at the public boundary (exports, props, defaults, commands,
   required setup).
2. Search existing docs for the affected names (`grep` across `*.md`).
3. Update only the affected sections.
4. Verify code examples against the real API and real file paths.
5. If a command changed, update it in every doc that lists it (`README.md`, `AGENTS.md`).
6. If nothing in the docs is affected, report "no documentation change required".

## Skills used
`public-api-review` (to detect what is public), `test-runner` (to confirm commands run).

## Failure conditions
- Documenting an export/prop/command that does not exist.
- A documented command fails when executed.

## Validation criteria
- Every documented command was executed successfully (or is clearly a placeholder).
- Examples reference real paths and current API.

## Report format
```
DOCS
- trigger: <API/setup/command change>
- files updated: <path → section>
- examples verified: <yes/no, how>
- no-change rationale: <if none>
```
