---
name: github-push
description: Run pre-push verification for Pimolu UI and publish commits to the remote only after explicit confirmation. Use when the user asks to push, sync with origin, or publish a branch.
---

# github-push

## Activation
Use when the user asks to push, "pousser", sync a branch, or publish commits.
Never run on your own initiative.

## Responsibilities
- Guarantee the repository is in a publishable state before contacting the remote.
- Never publish without explicit confirmation.

## Steps
1. Inspect: `git status`, `git branch -vv`, `git remote -v`.
2. List commits to publish: `git log --oneline @{u}..HEAD` (or against `origin/<branch>`).
3. Refuse to proceed if there are uncommitted changes that would make verification incomplete — commit first (`git-commit`) or stash explicitly with user consent.
4. Detect divergence with the remote (`git fetch` then `git log --oneline HEAD..@{u}`). If the remote moved, rebase/merge deliberately; never force-push.
5. Run the full validation with `test-runner`: `pnpm verify`.
6. Verify that the affected packages build (`pnpm build:all`) and that no unexpected files are tracked (secrets, `.env*`, `dist/`, `node_modules/`).
7. If `.github/workflows/` exists, read it and list which checks must still pass on GitHub.
8. **Block** the push if any mandatory check fails.
9. Ask for explicit confirmation, then push the current branch with `git push` (no `--force`).
   Force-push only with explicit authorization *and* after explaining the consequences (e.g. `--force-with-lease` on a personal branch).
10. Report the pushed range and the upstream state.

## Efficiency
Reuse results from a prior identical run: if `pnpm verify` passed and neither the sources nor dependencies/lockfile changed since, report it instead of re-running. Re-run if anything in the tree changed.

## Skills used
`test-runner` (full scope). `git-commit` first if there is uncommitted work.

## Failure conditions (abort)
- Uncommitted or unrelated changes present.
- Divergence with the remote not resolved.
- `pnpm verify` fails, or a secret/generated file would be published.
- The user has not given explicit confirmation.

## Validation criteria
- Full verification green on the exact committed tree.
- Branch/remote correct; no unintended refs pushed.

## Report format
```
PUSH
- branch: <local> → <remote>/<branch>
- commits: <list>
- validations: <command → result>
- github ci: <checks that must still pass, or "none configured">
- confirmation: requested/granted
- result: <pushed | blocked: reason>
```
