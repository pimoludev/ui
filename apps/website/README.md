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

## Documentation and component catalog

- `/docs`: introduction, installation, Next.js, themes, customization and accessibility.
- `/components`: a searchable visual catalog grouped by purpose, with a complete family sidebar.
- `/components/<family>`: **129 component references, each with at least four interactive examples**, generated public APIs, copyable source, usage and accessibility advice.
- `/releases`: truthful development status and source-history links. No unpublished version is presented as a release.
- Old `/docs/components/<family>` URLs permanently redirect to the canonical component page, preserving query settings.

`content/docs.ts` contains the original twenty examples and guides.
`content/extended-components.ts` curates the other **109** compositions and their editorial notes.
`components/docs/examples/` holds authored standalone overrides and the twenty original examples.
Otherwise `scripts/extract-example.mjs` extracts the selected Playground helper or section **with its lexical dependencies**.
It removes Playground routing guards, adapts local demo asset paths and maps Playground links to website destinations.
The shared library components themselves are imported, never copied.

`docs:generate` produces ignored `content/generated/` modules and JSON: APIs, catalog, examples, navigation, preview options, layout styles and search.
It also copies the repository's existing demo assets to ignored `public/demos/`.
A missing curated section/helper fails generation rather than inventing an example.
Edit the source/curation, then regenerate. Dev, typecheck, test and build run generation automatically.

The dynamic example registry loads examples on demand. A small harness exposes a mounted marker after effects are installed:
browser tests wait for a genuinely interactive example rather than clicking unhydrated server markup.
DashboardLayout, AppShell, DocsLayout, Anchor and TableOfContents use isolated preview documents to preserve landmarks and fragment destinations.
The other examples render directly inside the workbench.

Search composes Pimolu Dialog and Command (Ctrl/Cmd K). It includes the **135** guide/component references and public API keywords.
The search module loads on opening; deferred autofocus lets Dialog capture and restore the actual opener.
The mobile sidebar uses Drawer. APIs and examples use ApiTable and CodeBlock.

**Customize preview** isolates preset, mode, radius, density, brand, width and direction.
Copied source includes Provider settings. Shared links restore validated settings, and Reset remounts local state.
The displayed width is measured, capped by available space. Application layout helpers are also available as copyable CSS.
Check contrast after choosing a custom brand color.

## Real component illustrations

`public/component-previews/` contains 258 checked-in PNG screenshots: one light and one dark illustration per family, using Default.
They are produced from the real examples, with a **320 × 200 CSS viewport at DPR 2**, giving **640 × 400 PNGs**.
Short compositions are centered by capture-only layout rules. These are illustrations, not baseline snapshots or a visual certification.
Images load lazily, and the selected image follows explicit Light/Dark or the resolved System preference.

With a built site running on port 3001:

```sh
pnpm --filter @pimolu/website previews:capture
# Regenerate only changed examples:
pnpm --filter @pimolu/website previews:capture button tabs
```

The captures are reviewed artifacts. Regenerating them is deliberate, not part of normal build/test.
Restart `next start` after adding new public filenames: production enumerates its public assets on startup.

## Browser and accessibility checks

Playwright and Chromium/Firefox/WebKit were added with maintainer approval. No additional UI library was installed.

```sh
pnpm --filter @pimolu/website test:e2e:install
pnpm --filter @pimolu/website build
pnpm --filter @pimolu/website test:e2e
pnpm --filter @pimolu/website audit:a11y
```

`test:e2e` starts the production server if needed. Its local configuration covers all 129 references, 1440 × 900 and 390 × 844 containment,
legacy redirects, search, responsive navigation, theme illustrations and targeted keyboard workflows in three engines.
No GitHub workflow was enabled. WebKit on Windows is not a substitute for native Safari/iOS testing.

`audit:a11y` requires the running site and scans the 129 initial Default/light standalone examples for unnamed controls,
duplicate ids, unresolved ARIA references and main landmarks. It writes `.artifacts/accessibility-structure.json` and exits nonzero on findings.
It is a deliberately limited structural check, **not axe, a screen-reader test or WCAG certification**.
See [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) for observed public-library issues and exact limits.

Playwright reports/traces live in ignored `playwright-report/` and `test-results/`.

## SEO and validation

`/sitemap.xml` lists 139 canonical routes. `/robots.txt` and preview metadata exclude preview documents.
`/opengraph-image` renders an original 1200 × 630 PNG from the generated Pimolu palette.

Run website `typecheck`, `lint`, `test`, `build`, `test:e2e` and `audit:a11y` separately:
root `pnpm verify` does not include this application. No MDX runtime or extra search dependency is installed.


## Multiple examples and surface appearances

Every family has its primary workbench and three additional, independent compositions (**516 examples**).
`scripts/build-additional-examples.mjs` extracts real Playground sections and lexical dependencies, following
`content/extended-components.ts` for the primary selection. Named cards can be extracted individually.
For sparse families, `content/additional/<family>.json` names authored compositions under
`components/docs/additional/`. These files import the real public API; they do not reimplement components.
Generation fails if a family has fewer than three supplements. Do not hand-edit `content/generated/`.

Additional examples use lazy iframes to isolate ids, landmarks, overlays and shared stores. Their code is
fetched only on demand from `/api/examples/<family>/<example-id>`; addresses are restricted to the generated
manifest. Unknown examples return 404. Preview height messages validate both origin and source window.
Composition CSS is available below the examples, alongside the copied TSX.

Navbar and Footer now accept `appearance="surface" | "transparent" | "floating"`.
`surface` preserves their defaults; the website uses `transparent` inside full-width site regions.
`bordered` controls the horizontal divider; a floating surface keeps its surrounding frame.
Colors, radius and raised shadows still come from the selected Pimolu preset.

For a structural check of all examples, start the built site and run:

```sh
pnpm --dir apps/website audit:a11y --all-examples
```

The report is `.artifacts/accessibility-all-examples.json`. It checks initial named controls, ids,
ARIA references and main landmarks; it is not a screen-reader or WCAG conformance audit.
