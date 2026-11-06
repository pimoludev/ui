# Pimolu Blocks catalogue

The website catalogue lives at `/blocks`. Cards show full captures of the real
compositions, with minimal chrome, a title and real counts. The grid uses three
columns on wide screens, two on intermediate widths and one on mobile. Categories
open in a Drawer on small screens. Each card is a keyboard-accessible link;
decorative screenshots remain inert. Captures use the Default preset and follow
light/dark mode. Open the working preview to explore other presets.

After editing a composition, run `pnpm --dir apps/website blocks:capture` against
a running website (`PREVIEWS_BASE_URL` can override the default localhost:3001).
Commit the light/dark WebP files in `public/block-previews` alongside the source.
The gallery uses local assets and does not mount fifty interactive forms.
Photo-based blocks provide asset download links and replacement instructions on
their detail pages. Photo attribution is retained in `public/images/blocks/README.md`.
The All blocks view shows illustrated category cards with their real block counts.
Choose a category or subcategory to browse individual compositions; empty categories
are labelled Planned and have no detail link. Search in All blocks filters these
category cards, while search inside a category filters its blocks.

Detail links preserve the originating query and classification in a `from`
parameter. Back restores those catalog filters, including after a reload or opening
the detail in a new tab. Direct detail visits fall back to the block's own category.
Only validated catalog parameters are accepted, never external redirect URLs.

## Available and planned use cases

Keep the initial taxonomy useful and small. Avoid separate collections for
near-identical marketing sections, decorative effects or specific industries.
The source of truth is `apps/website/content/blocks.ts`.

| Category | Available | Planned subcategories |
| --- | --- | --- |
| Application | Dashboard, project management, notification settings, contextual help, invitations | Data tables, planning & calendars |
| Authentication | Sign in (five variants), sign up (three variants), password reset, verification, onboarding | More integration patterns |
| Commerce | Product detail, shopping cart | Checkout, orders |
| Content | Newsletter, blogs, blog posts, help center, resource downloads | Documentation |
| Marketing | Hero (four variants), pricing, features, FAQ, contact, About, Compare, CTA, downloads | Testimonials |
| Navigation | Workspace navbar, studio footer, store footer | Sidebar & app shell |

There are **141 implemented blocks** across **46 available collections**. Every
available collection has at least three standalone variants; sign-in has five
and Hero has four. Empty collections remain explicitly Planned.

| Category | Blocks | Organization |
| --- | ---: | --- |
| Application | 18 | Dashboard, projects, settings, help, invitations, leaderboard |
| Authentication | 17 | Sign-in, sign-up, password reset, verify email, onboarding |
| Commerce | 54 | 18 use cases, three variants each |
| Content | 15 | Blog, blog post, help center, downloads, newsletter |
| Marketing | 31 | Hero, features, pricing, FAQ, contact, About, Compare, CTA, downloads, Launch |
| Navigation | 6 | Navbar and Footer |

Commerce separates product cards, product detail, product gallery, product list,
product search, product quick view, inventory, wishlist, shopping cart, checkout,
orders, order history, order management, order tracking, payment methods, promo,
reviews and live purchase. The existing `studio-headphones` URL now belongs to
Product detail; its URL is preserved. Views range from image-led campaigns and
card collections to compact lists, editable tables and management boards.

Live purchase examples are labelled simulations and advance only through user
actions. Publish verified, consented real events in production. Checkout does not
collect card numbers; payment methods show masked samples. Order statuses,
inventory, coupons, reviews and verification are local examples, not server-side
validation. Real checkout must recalculate price, availability, discounts and tax
on the server; authentication must verify signed, expiring tokens.

The gallery includes 282 real light/dark captures. New use cases must ship with
at least three distinct authored variants before becoming available. Node tests
enforce the minimum and independent compilation; browser checks cover responsive
layouts and representative interactions across three engines.

Counts come from those modules, never
from planned collections. Unavailable categories can be expanded to discover
their planned uses; their selection controls stay disabled. No placeholder
block is published as a working composition.

## Search and filter behavior

- Match every search word, case-insensitively and without accent distinctions,
  across names, descriptions, component exports, categories and subcategories.
- “Login” finds the five sign-in blocks; “Button pricing” finds the pricing compositions.
- Search combines with the selected category and subcategory. Clear search keeps
  the category; Reset filters returns to the entire catalogue.
- `q`, `category` and `subcategory` are shareable URL parameters. Refresh and
  browser Back restore the selection. Unknown categories and mismatched
  subcategories fall back to a valid selection.
- The search has a dedicated name and `autocomplete="off"`. Decorative thumbnails
  contain no login/password inputs. Browsers and password managers retain final
  control over their own suggestions; no library-wide autofill behavior changes.

## Adding a block

1. Compose existing Pimolu components in
   `apps/website/components/blocks/<category>/<subcategory>/<name>.tsx`.
   Keep the code standalone and the layout portable. Avoid site-only helpers.
2. Add metadata with an existing category/subcategory pair in
   `content/blocks/<category>.ts`. The `content/blocks.ts` aggregate validates the
   pair. Register its lazy preview in the private `_catalog/`
   folder. See the [block authoring guide](../apps/website/components/blocks/README.md).
3. Run `pnpm --dir apps/website docs:generate` and `blocks:capture`. This updates real source previews
   and search; metadata also feeds the sitemap and machine-readable map.
4. Verify copied source, interactive behavior, keyboard focus, mobile layout,
   theme modes and existing component compatibility. Update the public notes.

The existing `/blocks/sign-in`, `/blocks/pricing`, `/blocks/studio-hero` and
`/blocks/workspace` URLs remain unchanged by the source reorganization. Every
copied source is self-contained. The detail-page registry loads compositions
individually instead of importing the entire collection into every preview.

Authentication handlers remain local: sign-up compares passwords, reset prepares
an email request without sending it, and verification validates the documented
demo code `123456`. Consumers must provide a real authentication service.

Planned blocks need usable content and interactions before publication. Prioritize
application workflows, documentation and commerce next. This list is a direction, not a release promise.

## Focused authentication layouts

Reset and verification blocks should look like the screen a user will actually
complete: a short title, one instruction, the relevant fields and one main action.
Keep classification names and implementation explanations in the catalogue and
integration notes instead of repeating them as a hero inside the preview.
Use a confirmation state after a reset request, offer resend and email correction,
and separate any local verification simulation from the production action.

Reference patterns consulted: [Auth0 reset-email confirmation](https://support.auth0.com/center/s/article/Use-Custom-HTML-on-Check-Your-Email-Screen),
[Clerk email-link flows](https://clerk.com/docs/react/guides/development/custom-flows/authentication/email-links),
and [Atlassian email correction and resend guidance](https://support.atlassian.com/atlassian-account/docs/email-address-verification-issues/).
These inform the interaction structure; the compositions use Pimolu exclusively.

## Preview and source quality

All 141 authored modules and copied examples share Prettier formatting: one
variable declaration per statement, readable handlers, imports and JSX, with
an 88-column target. Run `pnpm --dir apps/website blocks:format` to write or
`pnpm --dir apps/website blocks:format:check` to verify. Exact source parity is
covered by the website tests.

Previews contain the composition itself, without repeated category badges or
generic library descriptions. Integration guidance belongs to the detail page,
source comments and this guide. Status messages appear after an interaction;
necessary instructions and simulated-activity labels remain explicit.

The six table blocks use Pimolu table parts consistently for shared column
alignment and spacing. Marketing no longer advertises a Testimonials collection.

## Accessible catalogue text and headings

Use foreground or muted-foreground for small labels, selected navigation text
and card classifications. Bright primary palette colors can be useful accents
without being readable as text on every surface. The setup link inherits the
foreground color. These choices are checked with axe across all seven presets,
light/dark, desktop categories and the mobile Drawer.

The catalogue toolbar has its own named region. The site's global Skip to content
link remains available; the redundant DocsLayout skip link is hidden through its
existing named-part API so there is one usable skip target. Main stays a top-level
landmark. Standalone sign-in uses CardTitle as="h2" below the host page's h1.
