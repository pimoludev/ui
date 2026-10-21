# Pimolu website

Next.js App Router application consuming Pimolu directly from the root workspace.

Run all commands from the repository root. The root lockfile is the source of truth. The scaffold's nested workspace and lockfile are preserved as `pnpm-workspace.standalone.yaml` and `pnpm-lock.standalone.yaml`, and are not used by pnpm:

```sh
pnpm install
pnpm build:all
pnpm --filter @pimolu/website dev
```

Open http://localhost:3001. For production: `pnpm --filter @pimolu/website build`, then `pnpm --filter @pimolu/website start`.

Checks: `pnpm --filter @pimolu/website typecheck`, `lint`, `test`, `build`.
The Node test command requires Node 22.6+ for native TypeScript stripping (verified with Node 24).

Pimolu is the only UI library. Tailwind utilities are mapped to Pimolu semantic tokens; Preflight is deliberately omitted. MotionConfig respects the user's reduced-motion preference. Theme cookies are read on the server and updated by the existing PimoluProvider on the client, with site-specific cookie names.

The root layout reads cookies and therefore renders dynamically. The `components/ui.tsx` client boundary isolates the source registry from Server Components. Pages, metadata and layouts remain Server Components.

See IMPLEMENTATION_PROGRESS.md for scope and next steps.
