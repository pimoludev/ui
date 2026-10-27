# Pimolu website

Next.js App Router application consuming Pimolu directly from the root workspace.

The public guides target npm consumers: install `@pimolu/react@beta` and
`@pimolu/web-styles@beta`, load the shared CSS and add `PimoluProvider`.
The current published version is `0.1.0-beta.3.1` for all five library packages.
Repository build instructions below are for contributors; npm consumers do not
need a clone, `build:all` or `transpilePackages`. Quick start owns the npm setup;
`/docs/contributing` contains repository setup and contributor checks. The removed
`/docs/installation` URL redirects permanently to Quick start. Keep Frameworks
and the Next.js guide aligned when package entry points change.

Run all commands from the repository root. The root lockfile is the source of truth. The scaffold's nested workspace and lockfile are preserved as `pnpm-workspace.standalone.yaml` and `pnpm-lock.standalone.yaml`, and are not used by pnpm:

```sh
pnpm install
pnpm build:all
pnpm --filter @pimolu/website dev
```

Open http://localhost:3001. For production, run `pnpm build:website` from the
repository root. It builds every workspace package before building Next.js.
Start the production server with `pnpm start:website` (port 3000 by default,
or the hosting platform's `PORT` environment variable).

## Production deployment

- Canonical domain: **https://pimolu.com**, confirmed by the maintainer. Metadata,
  sitemap, RSS and machine-readable links share `lib/site.ts`.
- Use a Node.js or Next.js hosting runtime with **Node 24** and the pnpm version
  pinned by the root `packageManager`. The site reads theme cookies on the server
  and requires SSR; a static-file host alone cannot serve it.
- Repository root / working directory: the monorepo root. Install with
  `pnpm install --frozen-lockfile`, build with `pnpm build:website`, and start
  with `pnpm start:website`. Keep the workspace packages and their generated
  `dist` files with the runtime, together with `apps/website/.next` and `public`.
- On a managed Next.js host whose project root is `apps/website`, enable access
  to files outside that directory. `vercel.json` sets the Vercel build command
  to `cd ../.. && pnpm build:website`, so workspace packages are compiled before
  documentation generation and the Next.js build. Let its Next.js adapter serve
  the output; do not configure a static export directory.
- Attach `pimolu.com` to the hosting project, apply that host's required DNS
  records at the registrar, and enable HTTPS. Redirect any configured `www`
  alias to the canonical apex domain at the host.
- After deployment, check `/`, `/docs/quick-start`, `/components`,
  `/sitemap.xml`, `/robots.txt`, `/blog/feed.xml`, `/opengraph-image` and an
  unknown URL (404). Check appearance persistence and global search over HTTPS.

`.github/workflows/ci.yml` runs library verification and a separate website job
on PRs and pushes to main/dev. The website job builds workspace assets and
Next.js, runs lint and documentation tests, then the production Playwright suite
in Chromium, Firefox and WebKit. Browser reports are retained for seven days.
CI does not deploy. Configure required checks in GitHub branch protection
after the workflow has run once.

Checks: `pnpm --filter @pimolu/website typecheck`, `lint`, `test`, `build`.
The Node test command requires Node 22.6+ for native TypeScript stripping (verified with Node 24).

Pimolu is the only UI library. Tailwind utilities are mapped to Pimolu semantic tokens; Preflight is deliberately omitted. MotionConfig respects the user's reduced-motion preference. Theme cookies are read on the server and updated by the existing PimoluProvider on the client, with site-specific cookie names.

The root layout reads cookies and therefore renders dynamically. The `components/ui.tsx` client boundary isolates the source registry from Server Components. Pages, metadata and layouts remain Server Components.

See IMPLEMENTATION_PROGRESS.md for scope and next steps.

## Documentation and component catalog

- `/docs`: 15 guides, from quick start and framework integration to colors, styling, composition and agent resources.
- `/components`: a searchable visual catalog grouped by purpose, with a complete family sidebar.
- `/components/<family>`: **133 component references, each with at least four interactive examples**, generated public APIs, copyable source, usage and accessibility advice.
- `/releases` and `/releases/unreleased`: release navigation and full development notes. No unpublished version is presented as a release.
- `/blog` and `/blog/<slug>`: three original articles, topic/search filters, reading times, article outlines and related reading.
- `/blog/feed.xml`: RSS feed. `/llms.txt`: a canonical documentation map with the current distribution status.
- Old `/docs/components/<family>` URLs permanently redirect to the canonical component page, preserving query settings.

`content/docs.ts` contains guide composition and the original twenty component-reference definitions; `content/handbook.ts` adds nine guides. Standalone guide snippets are compiled alongside the 532 component examples.
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
DashboardLayout, AppShell, DocsLayout, Anchor, TableOfContents and Tabs use isolated preview documents to preserve landmarks and fragment destinations.
The other examples render directly inside the workbench.

Search composes Pimolu Dialog and Command (Ctrl/Cmd K). It includes **148** generated guide, component, article and development-note references, plus Home, the catalogue, Blog and Releases (**152 destinations**).
The search module loads on opening; deferred autofocus lets Dialog capture and restore the actual opener.
The mobile sidebar uses Drawer. APIs and examples use ApiTable and CodeBlock.

**Customize preview** isolates preset, mode, radius, density, brand, width and direction.
Copied source includes Provider settings. Shared links restore validated settings, and Reset remounts local state.
The displayed width is measured, capped by available space. Copied compositions use Tailwind utilities; private Playground layout helpers are not shown.
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

`test:e2e` starts the production server if needed. Its local configuration covers all 133 references, 1440 × 900 and 390 × 844 containment,
legacy redirects, search, responsive navigation, theme illustrations and targeted keyboard workflows in three engines.
No GitHub workflow was enabled. WebKit on Windows is not a substitute for native Safari/iOS testing.

`audit:a11y` requires the running site and scans the 129 initial Default/light standalone examples for unnamed controls,
duplicate ids, unresolved ARIA references and main landmarks. It writes `.artifacts/accessibility-structure.json` and exits nonzero on findings.
It is a deliberately limited structural check, **not axe, a screen-reader test or WCAG certification**.
See [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) for observed public-library issues and exact limits.

Playwright reports/traces live in ignored `playwright-report/` and `test-results/`.

## SEO and validation

`/sitemap.xml` lists 152 canonical routes. `/themes` redirects to `/docs/theming`; site appearance lives in the header. `/robots.txt` and preview metadata exclude preview documents.
`/opengraph-image` renders an original 1200 × 630 PNG from the generated Pimolu palette.

The homepage title identifies Pimolu as a customizable React component library;
catalog, component and guide titles describe their examples, API or integration.
The visible brand slogan remains unchanged. `lib/structured-data.ts` provides
JSON-LD builders and escapes `<` before server rendering via
`components/structured-data.tsx`. The homepage declares WebSite and Organization;
blog articles declare BlogPosting using authored titles, dates, categories and
the displayed Pimolu editorial author. Documentation, components, blog and
releases declare canonical BreadcrumbList paths. Preview documents omit this
markup. No ratings, invented publication dates or search endpoint are declared.
Run `e2e/seo.spec.ts` against the production build to check rendered titles,
canonical links and JSON-LD on representative routes in all three engines.
After deployment, inspect the live pages with Google's Rich Results Test and
Schema Markup Validator; local validation does not certify Google indexing.

Run website `typecheck`, `lint`, `test`, `build`, `test:e2e` and `audit:a11y` separately:
root `pnpm verify` does not include this application. Release MDX is compiled at build time;
there is no browser MDX compiler or extra search dependency.


## Multiple examples and surface appearances

Every family has its primary workbench and three additional, independent compositions (**532 examples**).
`scripts/build-additional-examples.mjs` extracts real Playground sections and lexical dependencies, following
`content/extended-components.ts` for the primary selection. Named cards can be extracted individually.
For sparse families, `content/additional/<family>.json` names authored compositions under
`components/docs/additional/`. These files import the real public API; they do not reimplement components.
Generation fails if a family has fewer than three supplements. Do not hand-edit `content/generated/`.

Additional examples use lazy iframes to isolate ids, landmarks, overlays and shared stores. Their code is
fetched only on demand from `/api/examples/<family>/<example-id>`; addresses are restricted to the generated
manifest. Unknown examples return 404. Preview height messages validate both origin and source window.
Primary and additional compositions use Pimolu Preview/Code tabs. Switching views preserves demo state. Additional source is fetched on first opening of the Code tab. Local composition CSS is not exposed as a separate reader-facing panel.

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


## Site navigation and identity

`components/site-search.tsx` owns the shared Dialog/Command search and Ctrl/Cmd K shortcut on every route.
`SiteSearchTrigger` presents a search bar on desktop and a visible icon before the mobile menu toggle.
Pointer activation explicitly focuses the opener before the dialog mounts, including WebKit.

`components/scroll-outline.tsx` controls the existing TableOfContents using section positions. Scroll and
resize measurements are scheduled once per animation frame; ResizeObserver also tracks asynchronous
preview layout changes. Both catalogue categories and article sections expose aria-current=location.

The header mark and favicon share the vector silhouette in `app/icon.svg`, based on the homepage's
Georgia Italic p. Header color follows the Pimolu primary token. Site scrollbar styles consume semantic
colors and leave forced-colors and native scrollbar visibility preferences available.

Playwright uses `http://localhost:3001`, matching Next's default development origin. Using 127.0.0.1 against
the development server can cause Next's HMR origin check to block client hydration. Production review can
run on a separate port so the existing development server stays available.

## Readable examples and header appearance

`SiteAppearance` provides a palette icon for the seven existing presets, an icon toggle for dark/light, and a device-mode reset. Validated cookies continue to preserve choices; the former `/themes` page redirects to the theming guide and is excluded from the sitemap and site navigation.

`scripts/simplify-example.mjs` compiles the actual curated examples into readable TSX: variant galleries become explicit component props, unused enumeration helpers/imports disappear, and `pg-*` classes become Tailwind utilities. The generated modules are used by both the rendered supplements and their copyable code. Real data arrays, hooks and event handlers remain. It also restores a grid gap between extracted sibling blocks. `@source` in `app/globals.css` includes these ignored generated modules in Tailwind's scan. Never hand-edit generated outputs.

All **532** snippets are compiled together as independent virtual modules in `tests/docs.test.mjs`, in addition to syntax, metadata, source dependency and distinctness checks. Main examples keep ordinary application behavior; Tabs' site-only style selector is outside its copyable component function.


### Formatting every copied component example

`scripts/format-example.mjs` wraps TSX by syntax (88-column target), then applies TypeScript indentation. It handles imports, JSX props/children, object and array literals, destructured parameters, calls, conditional expressions and return blocks. Long prose and embedded asset strings are split without changing their runtime value. Module/type names and CSS class tokens are not split blindly. Provider wrappers produced by customization also place settings on separate lines.

Every one of the **532** primary/supplemental examples is checked for stable formatting, a **140-character maximum line**, valid standalone TypeScript and complete public imports. This runs through `pnpm test`; no formatting dependency is installed. Generated files remain ignored and must not be hand-edited.

### Component gallery illustrations

The catalogue uses 266 product illustrations: one light and one dark PNG for each of the 133 references. These are captures of real Pimolu components, isolated from documentation controls and fitted completely inside a 640 × 400 canvas with a consistent margin. They are static illustrations; the linked reference provides interactive examples. They show the Default preset.

`scripts/capture-previews.mjs` selects the component root, opens real overlays when necessary, and uses shorter existing examples for large compositions. Images load after hydration so their loaded state is captured. Surrounding demo content is hidden while inherited tokens, original component styling and intentionally hidden descendants are preserved. Sharp is already provided by Next.js; no dependency was added.

Run `pnpm previews:capture` while the website is available on localhost:3001. Set `PREVIEWS_BASE_URL` to use another running server (production review used localhost:3002). Optional family arguments regenerate only those illustrations, e.g. `pnpm previews:capture tabs accordion`. The tracked `public/component-previews/capture-manifest.json` records the selected examples, selectors, complete bounds and fitted dimensions. Review changed product illustrations before committing; these are not automatically accepted visual-test snapshots.

### Journal, development notes and palette exploration

`content/journal.ts` owns articles. Releases are authored in **`content/releases/*.mdx`**,
one file per version plus `unreleased.mdx`. `content/releases.ts` is only the typed
adapter for generated metadata. Keep publication claims backed by npm and the source tag.

### Writing a release

Create `content/releases/<version>.mdx`. Export literal string metadata and write
Markdown inside `ReleaseSection`; its stable `id`, `title` and `label` supply the
detail-page headings, outline, index highlights and search keywords:

```mdx
export const metadata = {
  slug: "unreleased",
  title: "Unreleased",
  status: "Development",
  summary: "A short description for the index and search.",
  notice: "These changes are not a published package version."
};

<ReleaseSection id="improvements" title="Improvements" label="Updated">

- Explain the change and its impact, with **Markdown** and links.

</ReleaseSection>
```

The example describes the existing Unreleased file; use a matching filename/slug for
each new version. Published previews use `status: "Preview"`, `date: "YYYY-MM-DD"`
and `tag`. Required fields are slug, title, status, summary and notice. Metadata values
are literal strings; anchors must be unique. Published entries sort by descending date;
development notes follow them.

Fenced code renders Pimolu `CodeBlock` with copy support. MDX can also use `Badge`,
`Alert`, `Button` and `CodeBlock` from the shared component mapping. Interactive examples
with state should be local client components added to that mapping, then used in MDX.
No component code is duplicated in content.

`pnpm docs:generate` compiles trusted local files with `@mdx-js/mdx` before generating
the rest of the documentation. Outputs in `content/generated/releases/` are ignored:
never edit them. Missing metadata, invalid dates and duplicate anchors fail generation.
Run the dev/build/test commands normally; no route registration is needed for a new file.
Restart the dev command after editing release MDX to regenerate its compiled output.
There is no remote MDX evaluation or CMS dependency.

`lib/text-resources.ts` builds the RSS feed and documentation map from the same content. `scripts/build-docs.mjs` adds article and development-note text to the search index; `lib/site.ts` includes their canonical routes in the sitemap. The blog uses App Router navigation for article cards while preserving Pimolu Link and normal modified-click behavior.

`lib/palettes.ts` resolves generated base themes plus preset overrides and normalizes camelCase keys to CSS names. Inherited status colors must not appear empty in the explorer. `components/color-reference.tsx` compares eight semantic roles without changing the whole site's appearance and copies their CSS variables. The sticky header offers seven compact, labelled color circles; the accent appears in the Adaptive swatch. Its panel has a viewport-bounded height and a stable trailing edge, scoped to the website; public Popover and official tokens are unchanged.

The AI guide describes the repository's actual agent instructions and `/llms.txt`. A public MCP server, component-install CLI and non-React adapters are explicitly future work.


### Isolated demo navigation and sticky header

`components/docs/example-ready.tsx` prevents example links from navigating to the actual site,
including links in React portals and links targeting the parent window. Component click handlers,
valid local fragments, and same-origin/blob/data downloads remain available. This boundary is
website-only and is excluded from copyable examples. The documentation navigation and ?Open preview?
links outside examples continue to work normally.

The header stays visible while scrolling. Page sections, documentation sidebars and outlines have
an offset below it. The appearance popup uses seven named circles, accessible pressed state,
persistent selection, the existing dark/light toggle, and a device-mode reset.
`/blog/feed.xml` is the machine-readable RSS feed for subscribing to articles in a feed reader.


### Additional homepage compositions

`components/home-discovery.tsx` adds a hero-adjacent strip, six live component compositions and
four product contexts to the homepage. Existing homepage sections and `home-demos.tsx` are kept.
`app/home-discovery.css` only styles the added `discovery-*` surfaces. Examples use real Pimolu
components and existing local SVG/audio assets; forms and shopping actions are explicitly local previews.
Command opens on demand in Dialog so its option scrolling cannot move the homepage on initial load.
The public Image component now detects already decoded images after hydration, so cached artwork does not remain behind its skeleton. Browser coverage lives in
`e2e/home-discovery.spec.ts`; actual verification scope is recorded in IMPLEMENTATION_PROGRESS.md.


### Branded demonstration assets

`public/images/` contains original Pimolu artwork: `pimolu-studio.webp` (product),
`pimolu-atmosphere.webp` (editorial illustration) and `pimolu-avatar.svg` (official p emblem).
The two WebP images were created for this site with imagegen on 2026-10-22; the SVG derives from
`app/icon.svg`. Existing unused fixtures are preserved. `scripts/website-demo-assets.mjs` normalizes
website demo sources without changing Playground fixtures. Catalog thumbnails remain actual component
captures and are regenerated when their content changes.

Audio examples use the maintainer-provided `/sounds/action-game.mp3` and `/sounds/pixel-art-game.mp3`.
They remain unchanged. Input autofill styling, calendar alignment, emblem centering and product cover
sizing are scoped to the homepage compositions. See `e2e/brand-polish.spec.ts` for browser coverage.


## Component reference navigation

The library still has 129 source families. The website has 133 component
references: the Chart family is documented as BarChart, LineChart, AreaChart,
DonutChart and Sparkline, each with four independent examples. `/components/chart`
remains a selection guide; legacy `/preview/chart` links redirect to a dedicated
preview and preserve appearance parameters. No chart import changed.

`content/chart-references.ts` describes these references. Their `source` and
`playgroundFamily` point at the real chart source and playground page, so API
extraction, tests and examples never invent component directories.

### Sidebar status badges

`docs:generate` compares component source and CSS with the tracked
`content/component-baseline.json` snapshot (initially beta.2). New source families
or newly documented exports receive **New**; changed implementations/CSS and new
references for already available exports receive **Updated**. The generator
normalizes Windows/Linux line endings and does not use Git or network access.
Tests and generated output are excluded from the source fingerprint. Changes in
shared/transitive dependencies need an explicit editorial override.

To mark a deprecation or supply a specific explanation, add an entry to
`content/component-status-overrides.json`:

```json
{
  "component-family": {
    "kind": "deprecated",
    "description": "Explain the supported replacement and migration here."
  }
}
```

Allowed kinds: `new`, `updated`, `deprecated`; an explanation is required. There
are no fictitious deprecated components. Status text is visible in the component
navigation, and its explanation is an accessible link description without changing
the link name.

During a deliberate release-baseline update, regenerate docs first, then run
`pnpm --dir apps/website docs:baseline` and review the snapshot diff. Normal builds
never reset this snapshot. Clear overrides intentionally; they do not expire
automatically. The new snapshot command only writes a local reference; it does not
publish a package or tag a release.

`SidebarHeader` and `SidebarFooter` accept `collapsedContent` for a compact logo or
profile. Desktop rails preserve these slots and describe item icons with tooltips;
mobile folded navigation preserves the full brand and compact profile. The website
examples and playground demonstrate both slots. See `docs/COMPONENT_ROADMAP.md`
at the repository root for chart candidates that are not implemented.
