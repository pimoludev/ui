# Block source organization

The catalogue contains 141 standalone compositions. Every available collection
has at least three variants. New variants share the use-case
folder, not a runtime template: store and gaming authentication have different
layouts, copy and interactions. Category counts come from the manifests.

| Collection | Available compositions |
| --- | ---: |
| Authentication | 17 |
| Marketing | 31 |
| Application | 18 |
| Commerce | 54 |
| Content | 15 |
| Navigation | 6 |

Marketing includes About, Compare, CTA and Download alongside Hero, Features,
Pricing, Contact and FAQ. Content separates Blog, Blog post and Help center;
Application includes contextual Help and Invite users. Navigation includes studio
and store footers. Search also recognizes `register` for sign-up compositions.

The download compositions create real editable `.txt` files, not app installers.
Invitation previews do not send mail or grant access. Replace local handlers with
server authorization and expiring invitation tokens. Detail pages link the images
required by each copied module, including the Unsplash credit where applicable.

One standalone React module per block, grouped by category and use case:

```text
blocks/
  _catalog/                       Website-only browser, navigation and previews
    block-previews.tsx            Typed lazy imports for the detail pages
    block-thumbnail.tsx           Light/dark captures of the real compositions
  application/
    dashboard/workspace.tsx
    projects/project-list.tsx
    settings/notification-preferences.tsx
  authentication/
    sign-in/email-password.tsx
    sign-in/split-panel.tsx
    sign-in/email-link.tsx
    sign-up/create-account.tsx
    password-reset/request-link.tsx
    verification/one-time-code.tsx
    onboarding/workspace-setup.tsx
  commerce/
    products/studio-headphones.tsx
    cart/order-summary.tsx
  content/
    newsletter/editorial-signup.tsx
  marketing/
    hero/studio.tsx
    hero/product-launch.tsx
    features/product-bento.tsx
    faq/product-questions.tsx
    contact/project-inquiry.tsx
    pricing/three-plans.tsx
  navigation/
    navbar/workspace-bar.tsx
```

Add further variants as sibling files in their use-case folder. Keep catalogue
helpers in `_catalog`; they are never part of the copied user code. Block modules
import React and `@pimolu/react` directly and use portable Tailwind utilities.
Keep any small block-specific helper in that module so its source stays complete.

Metadata lives in `content/blocks/<category>.ts`. The public internal entry
`content/blocks.ts` aggregates these manifests and validates category/subcategory
pairs against `content/blocks/categories.ts`. Adding a category requires adding
its manifest to the aggregate. Existing page slugs stay independent of filenames.

To add a block:

1. Create its source in `<category>/<subcategory>/<name>.tsx`.
2. Add its metadata to the category manifest, including its source path.
3. Register its lazy preview in `_catalog/block-previews.tsx`. With the website
   running, use `pnpm --dir apps/website blocks:capture <slug>` to generate both
   gallery images in `public/block-previews`. Set `PREVIEWS_BASE_URL` if needed.
   The thumbnail resolves captures by slug; do not recreate the block as a miniature.
4. Run `pnpm --dir apps/website docs:generate`, then the website tests, lint,
   typecheck, build and relevant browser tests. Copied sources compile independently.

The generator reads only registered source paths, never the catalogue helpers.
Metadata drives navigation counts, search, sitemap and the machine-readable map.

Authentication examples are **UI compositions with local handlers**. Account
creation and reset do not call a server or send email. Verification uses the
explicit demo code `123456`. Replace these handlers with your application's
authentication service; do not use the demo comparison for real verification.

## Formatting and preview copy

Run `pnpm --dir apps/website blocks:format` after editing authored blocks.
`blocks:format:check` checks all registered modules without writing. The copyable
source uses the same Prettier formatter (88-column target), with one variable
declaration and one statement per line. Prettier is a development-only dependency.
The website tests check formatting, exact preview/source parity and compilation.

Keep catalogue categories, technical integration notes and mock-data explanations
in page documentation rather than repeating them inside the composition. Each
preview should contain the actual product UI: useful headings, labels, fields and
actions. Empty status regions stay visually hidden until there is feedback. Keep
necessary instructions such as the verification demo code and label simulated
activity clearly. Use TableHeader/TableRow/TableHead/TableBody/TableCell inside
Table so headers and cells share Pimolu spacing and alignment.
