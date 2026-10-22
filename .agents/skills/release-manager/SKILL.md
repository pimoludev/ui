---
name: release-manager
description: Plan and execute a Pimolu UI versioned release (SemVer choice, package/site version sync, verify, pack checks, bilingual changelog, Git tag and preview deployment). Use when the user asks to prepare, cut, tag, publish or deploy a release.
---

# release-manager

## Activation
Use for a release plan **or** a full release execution: version bump, version
synchronisation, package dry-runs, changelog, tag and preview.

Two authorization levels:
- **Plan** is read-only unless the user asks to execute.
- **Execute** requires an explicit request covering the actions (commit, tag,
  deploy, npm publish). A request to “prepare the release” does not authorize an
  npm publish. A request to “tag and publish the preview” authorizes the tag and
  the website preview, not an npm publish.

Never use `--no-verify`. Never hide a failing gate.

## Version decision (the skill chooses, not the user)

Run `node .agents/skills/release-manager/scripts/release-plan.mjs` first. It
returns the range, Conventional Commit classification, quality-audit state,
target version and tag.

Rules:
1. **No previous `v*` tag** → first public base `0.1.0`.
2. **Quality audit still open** (`docs/ai/QUALITY_AUDIT.md` says in progress,
   still needs review, or lists remaining work) → `0.1.0-beta.N` preview.
3. **All gates green and audit complete** → stable `0.1.0`.
4. **Previous beta** → keep the same base and increment `beta.N`; promote to the
   base only when every gate passes.
5. **After a stable release** → `feat` = minor, `fix`/`perf` = patch,
   `!` / `BREAKING CHANGE:` = major. For `0.x`, a breaking change is a minor bump.
6. Never jump to `1.0.0` while the public API or the visual/accessibility audit
   is still moving.
7. Package versions, the website version and the Git tag must share the same
   version: `0.1.0-beta.1` → tag `v0.1.0-beta.1`.

The plan script exits `2` when the working tree is dirty. A dirty tree can be
inspected but never tagged.

## Full release pipeline

### 1. Commit and clean the tree
- Inventory the changes and commit only intended files (see `git-commit`).
- Keep generated `dist/` and local release evidence out of Git.
- Confirm `git status --porcelain` is empty before continuing.

### 2. Verify the product
```bash
pnpm verify
pnpm --dir apps/website lint
pnpm --dir apps/website typecheck
pnpm --dir apps/website test
pnpm --dir apps/website build
pnpm --dir apps/website exec playwright test --project=chromium
```
For a stable release also run the full cross-browser matrix and the site
accessibility audit:
```bash
pnpm --dir apps/website exec playwright test
pnpm --dir apps/website start   # then, in another shell:
pnpm --dir apps/website audit:a11y
```
A preview may ship with a documented WebKit/Firefox gap; a stable release may
not. Record the exact commands and results in the release notes.

### 3. Close visual and accessibility evidence
- Review the changed components in the playground in every relevant preset and
  both light/dark modes.
- Run the accessibility audit and inspect its structural findings. This is not
  an axe/WCAG conformance claim.
- Update `docs/ai/QUALITY_AUDIT.md` only with evidence actually executed.
- If the seven complex-component reviews or the 131-page visual matrix remain
  open, the release stays a beta. Do not change the audit wording to force a
  stable release.

### 4. Make and inspect the packages
Build generated assets, compile the source packages, then dry-run every
publishable package:
```bash
pnpm build:all
pnpm build:packages
pnpm release:pack-check
```
`pack-check` must confirm:
- `private` is absent from every package intended for npm.
- `exports`/`types` point at existing `dist/` files.
- `files` ships the expected build output and no tests/sources by accident.
- Internal dependencies use the release version, not `workspace:*`, in the
  packed manifests.
- No package is empty or missing its CSS/JSON/type entry points.

Use `npm pack --dry-run` output, not assumptions. Do not run `npm publish` in
this step. Publishing needs a separate explicit request.

### 5. Changelog
Update the root `CHANGELOG.md` with a bilingual section:
- `Added`, `Changed`, `Fixed`, `Breaking` (omit empty groups).
- English first, the same facts in French.
- State the version, date, tag, package versions and website preview status.
- Never claim a check that was not run.

### 6. Tag and preview
Only after steps 1–5:
```bash
git tag -a v<version> -m "Pimolu UI <version>"
```
Push the tag only when the user explicitly asks to publish the tag:
```bash
git push origin v<version>
```
For the website preview, first build it. Deploy only to a provider that is
actually configured in the repository or through an explicit environment
command:
```bash
pnpm --dir apps/website build
# Example, only when the user chose the provider:
# PIMOLU_PREVIEW_DEPLOY_COMMAND="..." pnpm release:preview
```
If no host, credentials or deploy command exists, do **not** invent one and do
not claim the site is public. Produce the production build, keep the evidence,
and report that deployment is blocked on a provider/target.

## Package map

| Package | Source | Build | Publish contents |
| --- | --- | --- | --- |
| `@pimolu/design-tokens` | `packages/design-tokens/src` | `pnpm build` | `dist/` |
| `@pimolu/themes` | `packages/themes/src` | `build:default`, `build:presets`, `build:visuals` | `dist/`, `style-*.css`, preset/visual sources |
| `@pimolu/core` | `packages/core` | `tsc` → `dist/` | compiled JS + types |
| `@pimolu/react` | `registry/react` | `tsc` → `dist/` | compiled JS + types |
| `@pimolu/web-styles` | `packages/web-styles/src` | `build:css` | `dist/` |
| `@pimolu/website` | `apps/website` | `next build` | private; deploy only |

Publish order after a separate approval:
`design-tokens` → `themes` → `core` → `react` → `web-styles`.

## Failure conditions
- Version mismatch between packages, website and tag.
- Dirty tree, failed verification, failed pack check, hidden failure.
- A package marked for npm is still `private`, or its `exports`/`files` are
  broken.
- A stable version is proposed while the quality audit remains open.
- A deployment is reported without a provider, URL and successful build.
- An npm publish runs without a new explicit request.

## Report format
```
RELEASE <version> (<stage>)
- range: <tag..HEAD or first release>
- commits: <n> (<feat/fix/...>)
- checks: <command → result>
- packages: <name → version → pack result>
- tag: <tag> (local/pushed)
- preview: <url or blocked reason>
- changelog: <path>
- remaining: <known gaps>
```
