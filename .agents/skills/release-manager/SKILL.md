---
name: release-manager
description: Prepare a Pimolu UI version release, SemVer bump, changelog and package verification. Use when the user asks to prepare or plan a release.
---

# release-manager

## Activation
Use when preparing a release/version bump or a changelog. Never publish
without a separate, explicit request.

## Reality check (read first)
- `@pimolu/core`, `@pimolu/themes`, `@pimolu/react` are `private: true` → they
  **cannot** be published as-is. `@pimolu/design-tokens` is the only package with
  a `files` list (`dist`) and no `private` flag, but its `version` is `0.0.0`.
- No changesets/versioning tool is configured. Versioning is manual.
- Therefore this skill usually produces a **release plan + changelog**, not a publish.

## Steps
1. Get the commit range: `git log --oneline <last-tag>..HEAD` (`git tag` to find tags).
2. Classify commits (Conventional Commits): `feat` → minor, `fix`/`perf` → patch,
   `!` / `BREAKING CHANGE:` → major. `docs`/`test`/`ci`/`chore` alone → no bump.
3. Respect SemVer; propose the target version per affected package.
4. Draft a changelog grouped as Added / Changed / Fixed / Breaking
   (bilingual EN/FR, consistent with commit style).
5. Verify inter-package dependencies (`workspace:*`) and their ordering.
6. Verify distribution builds and exports: run `pnpm build:all`, then inspect
   `packages/*/package.json` `files`/`exports` and confirm each published package
   ships only expected files (no sources/tests if unintended, no missing `dist`).
7. Verify entry points resolve (`pnpm typecheck`) and tests pass (`pnpm verify`).
8. Present the plan. **Do not tag, publish or bump versions without explicit confirmation.**

## Skills used
`test-runner`, `public-api-review`, `documentation-sync`.

## Failure conditions
- Proposed version violates SemVer for the detected changes.
- A package marked for publishing is `private`, or its `files`/`exports` would ship
  unintended content.
- Any mandatory check fails.

## Validation criteria
- Version plan and changelog match the actual commit range.
- Distribution build + exports verified; contents inspected.

## Report format
```
RELEASE PLAN
- range: <tag..HEAD or first release>
- per package: <name → current → proposed bump>
- changelog:
  EN: <...>
  FR: <...>
- packaging: <files/exports checked, findings>
- checks: verify → result
- action: awaiting explicit confirmation (publish not performed)
```
