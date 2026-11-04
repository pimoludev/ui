---
name: blog-authoring
description: Write or update a Pimolu UI journal article under apps/website/content/blog, update the hardcoded counters and tests, then regenerate and verify. Use when asked to write, add, publish or refresh a blog article, or to explain a durable idea on the website journal.
---

# blog-authoring

Owns the complete life cycle of a website journal article: editorial decision,
MDX authoring, generated metadata, static counters, tests and verification.

## Activation

Use when the user asks to:
- write, add, publish or rewrite a blog / journal article;
- turn a design or engineering decision into public editorial content;
- fix or extend an existing article in `apps/website/content/blog/`.

Do **not** use for:
- a release announcement → `release-manager` and `content/releases/*.mdx`;
- a changelog entry → `CHANGELOG.md`;
- a guide or handbook page → `documentation-sync`.

## Editorial gate

An article explains an idea that stays true after the next release. A release,
a fix, a regenerated capture or a dependency bump is never an article.

Write one when at least one holds:
1. a design direction is decided and needs its reasoning recorded
   (example: Ink & Signal, functional `control-border` vs decorative `border`);
2. an engineering decision is non-obvious and reusable
   (example: tokens → generated CSS → React registry pipeline);
3. an accessibility practice can be taught from a real case
   (example: a wide table exposed as a named, focusable scroll region);
4. a migration will raise questions users cannot answer from the API reference.

Do not write one when the content would be a changelog, a marketing claim with
no technical substance, or a duplicate of an existing article's thesis.
Never invent measurements, user research, benchmark numbers or adoption data.

The journal is **English only**. Do not add a French twin; the bilingual surface
is `CHANGELOG.md` and the GitHub Release.

## Source of truth

| Concern | File |
| --- | --- |
| Article | `apps/website/content/blog/<slug>.mdx` |
| Generator | `apps/website/scripts/build-blog.mjs` (run by `docs:generate`) |
| Generated output (gitignored) | `apps/website/content/generated/blog/` |
| Typed adapter | `apps/website/content/journal.ts` |
| Editorial tests | `apps/website/tests/editorial.test.mjs`, `apps/website/tests/docs.test.mjs` |
| Browser journeys | `apps/website/e2e/editorial.spec.ts`, `apps/website/e2e/editorial-mobile.spec.ts` |
| Static counters | `apps/website/README.md`, `docs/ai/PROJECT_CONTEXT.md`, `apps/website/tests/catalog.test.mjs` |

The article feeds the listing, search index, reading time, RSS
(`/blog/feed.xml`), sitemap, `llms.txt`, outline, related reading and
`BlogPosting` JSON-LD. No route registration is required.

## Steps

### 1. Choose the slug and metadata

- Slug: kebab-case, stable, descriptive of the idea — not the version.
- `category`: `Engineering`, `Design system` or `Accessibility`.
- `artwork`: `system` (pipeline/architecture), `palette` (visual identity),
  `interaction` (behavior/accessibility).
- `date`: `YYYY-MM-DD`, today's date in UTC; it must round-trip exactly.
- `order`: optional non-negative integer **string**, only to order same-day posts.

### 2. Create `apps/website/content/blog/<slug>.mdx`

Literal strings only — the generator rejects expressions and non-string
attributes.

```mdx
export const metadata = {
  slug: "my-article",
  title: "My article",
  description: "One sentence for the listing, search and RSS feed.",
  category: "Design system",
  date: "2026-11-04",
  artwork: "system"
};

<JournalSection id="the-idea" title="The idea">

Markdown with **emphasis**, [links](/docs) and fenced code blocks.

</JournalSection>
```

### 3. Write the content

- 3–6 sections, each with a claim, the reasoning and a concrete consequence.
- Open with the problem the reader recognizes, not with the release.
- Prefer real repository facts: file paths, token names, commands, measured
  behavior that was actually executed.
- Link to `/docs/...`, `/components/...` or `/releases/...` instead of repeating
  reference material.
- Close with what the reader should do differently, not with a call to action.
- Available MDX components: `Alert`, `Badge`, `Button`, `CodeBlock`; Markdown
  links and fences map to Pimolu `Link` and `CodeBlock` automatically.

### 4. Regenerate

```bash
pnpm --dir apps/website docs:generate
```

This prints `Docs generated: <n> catalog references, <n> live examples, <n>
searchable references.` Keep that last number: it feeds the README counters.
Restart `pnpm dev:website` if it was already running.

### 5. Update the static counters

These are hand-maintained and a new article invalidates them:

- `apps/website/README.md` — the `/blog` bullet ("three original articles" →
  the real count) and the search line ("148 generated … references" and
  "152 destinations"). Recompute: references = the generator's searchable count,
  destinations = references + 4 (Home, catalogue, Blog, Releases). Do not trust
  the numbers already in the file; they can be stale.
- `docs/ai/PROJECT_CONTEXT.md` — the article count and the search/sitemap
  destination count.
- `apps/website/tests/catalog.test.mjs` — `paths.length` is asserted exactly;
  each new article adds one indexable path.

Counters that need no edit: `journalPosts.length`, the RSS item count and the
search index length are computed at runtime by the tests.

### 6. Verify

```bash
pnpm --dir apps/website test
pnpm --dir apps/website lint
pnpm --dir apps/website typecheck
pnpm --dir apps/website build
pnpm --dir apps/website exec playwright test --project=chromium e2e/editorial.spec.ts e2e/editorial-mobile.spec.ts
```

Run the full three-engine matrix (`pnpm --dir apps/website exec playwright test`)
only when the article changes shared rendering or when cutting a release.
Report the real page count from the build; a local `/design-preview` route adds
one page that production does not have.

## MDX contract (enforced by `build-blog.mjs`)

| Rule | Failure |
| --- | --- |
| Required metadata: `slug`, `title`, `description`, `category`, `date`, `artwork` | build error |
| `metadata.slug` equals the filename, kebab-case | build error |
| One `metadata` export only | build error |
| `category` in the three allowed values | build error |
| `artwork` in `system` / `palette` / `interaction` | build error |
| `date` is a real `YYYY-MM-DD` day | build error |
| `order`, when present, is a digit string | build error |
| At least one `JournalSection` with kebab-case `id`, non-empty `title` | build error |
| Section ids unique, sections non-empty | build error |
| Attributes are literal strings | build error |

## Skills used

`documentation-sync` (counter and public-copy accuracy), `test-runner` (website
checks). Escalate to `release-manager` only if the article ships with a release.

## Failure conditions

- Publishing an article that is a release announcement or a changelog in prose.
- Claiming a measurement, review or adoption figure that was never executed.
- Leaving a stale counter or an exact-count test broken.
- Adding a French twin or inventing an i18n pipeline that does not exist.
- Reporting browser or build results that were not executed.

## Validation criteria

- `docs:generate` succeeds and the article appears in the listing, RSS, sitemap
  and search counts.
- Website tests, lint, typecheck and build pass.
- The editorial journeys pass in Chromium.
- Every touched counter matches the generated output.

## Report format

```
BLOG
- slug: <slug>
- category / artwork: <category> / <artwork>
- sections: <n>
- files: <created/updated paths>
- counters: <old → new, per file>
- generated: <command → result>
- checks: <command → result>
- remaining: <open items or none>
```
