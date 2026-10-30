---
name: public-api-review
description: Review new exports, TypeScript declarations, public props, defaults and breaking changes in Pimolu UI. Use when the public surface of a package or component changes.
---

# public-api-review

## Activation
Use when exports, prop types, defaults, package entry points or peer/dependency
ranges change.

## Public surface in this repo
- `registry/react/index.ts` — the source entry for `@pimolu/react` (exports
  `Button`, `PimoluProvider` and their types); the published package resolves
  `dist/index.js` and `dist/index.d.ts`.
- `packages/core/index.ts` — the source entry for `@pimolu/core`
  (`createVariants`, `VariantProps`); the published package resolves `dist/`.
- `packages/design-tokens/package.json` — exports `./tokens.json`, `./tokens.css`.
- `packages/themes/package.json` — exports `./styles.css`, `./presets.css`,
  `./themes.json`, `./presets` and `./visuals`.
- `packages/themes/dist/presets.d.ts` declares `PimoluStylePreset`, `PimoluTheme`,
  `PimoluPresetColors` (generated).
- Note: all five library packages are public at `0.1.0-beta.6`; the website stays
  private. Check the actual `exports`/`types` after every build.

## Checks
- Every intended export is present in the entry file and typed.
- No accidental exports or leaked internal types.
- Prop defaults are documented and match the implementation
  (`defaultVariants` in `*.variants.ts`, destructuring defaults in the component).
- Union types (variants, presets, themes) stay in sync with the implementation.
- Package `exports`/`types` resolve (run `pnpm typecheck`, which follows them).
- Class-name contracts (`pimolu-button--*`) remain stable for consumers.

## Steps
1. Diff the public entry files and `package.json` `exports`.
2. Classify each change: additive (minor), behavior change (minor/patch),
   or breaking (removal/rename/signature change).
3. For breaking changes: list affected consumers and propose a migration
   (deprecation alias, codemod note, or major bump) — with `release-manager`.
4. Run `pnpm typecheck` and `pnpm test:react`.
5. Route documentation impact to `documentation-sync`.

## Skills used
`documentation-sync`, `release-manager`, `test-runner`.

## Failure conditions
- A breaking change is introduced without being flagged.
- An intended export is missing or untyped.

## Validation criteria
- Public surface is exactly as intended; `pnpm typecheck` green.
- Breaking changes are explicitly reported with a migration path.

## Report format
```
PUBLIC API
- changed: <file → symbol>
- classification: additive | behavior | breaking
- defaults/union sync: <ok/notes>
- migration: <path or n/a>
- checks: typecheck/test:react → result
```
