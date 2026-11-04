# Pimolu design direction

Status: **proposal for validation**, 2026-11-01. This document defines how
Pimolu should be recognized and chosen, not how each component is implemented.
It complements [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [DENSITY.md](DENSITY.md),
[QUALITY_AUDIT.md](QUALITY_AUDIT.md) and [ROADMAP.md](ROADMAP.md).

## 1. Position

Pimolu is not another React component kit.

> **Pimolu is an identity-first design system: one behavioral grammar, many
> coherent visual identities, from the marketing site to the back-office.**

The promise has three parts:

1. **Identity without forking.** A team changes its palette, typography, shape,
   density and motion without copying components or rewriting behavior.
2. **Behavior stays guaranteed.** Every component works in every preset, in
   light and dark, with keyboard, reduced motion and forced colors.
3. **One source of truth.** Tokens, themes and presets are data. The web
   consumes generated CSS; a future native registry consumes the same data with
   its own rendering.

The current architecture already supports most of this. The missing piece is a
recognizable Pimolu identity and a product that makes the promise tangible.

## 2. What makes Pimolu different

| Dimension | Pimolu position | Common alternative | Proof required |
| --- | --- | --- | --- |
| Identity | Presets are art directions, not color swaps | One look with color themes | Preset parity matrix |
| Styling | Plain CSS variables and `pimolu-*` classes; Tailwind-compatible; no mandatory CSS-in-JS | Runtime styling or copy-paste ownership | Integration tests and documented recipes |
| Behavior | One component contract across identities | Behavior drifts when themes change | Tests in every preset and mode |
| Surface breadth | Marketing, docs, application, data and media surfaces in one system | Primitives only, or separate kits per surface | Quality depth on the broad families |
| Customization | Typed named parts, portals, additive classes | Eject the component or fight specificity | Customization audit |
| Portability | Web CSS shared across React/Next today; native reads the same data later | Platform-specific rewrites | Native proof before claiming parity |

The moat is not the number of components. It is the combination of **identity
portability**, **behavioral consistency** and **open styling**.

## 3. The design thesis

> **Calm precision, editorial clarity, tactile restraint.**

Pimolu interfaces should feel considered rather than decorated:

- **Calm**: low visual noise, few competing surfaces, one clear signal.
- **Precise**: crisp alignment, predictable spacing, tabular data, explicit states.
- **Editorial**: typography leads hierarchy; content is readable before it is chrome.
- **Tactile**: controls respond quickly and visibly; motion explains cause and effect.
- **Dense but readable**: compact modes serve real work without shrinking the type.

### The Pimolu grammar

The identity is not a color. It is a grammar that stays constant while presets
change the surface.

1. **Hierarchy through type and space.** Do not use cards, borders and shadows
   all at once to separate the same level.
2. **One signal per surface.** A primary action, a selected state or a status
   may be loud; everything else stays quiet.
3. **Hairline separation.** Borders define structure. Shadows are reserved for
   floating layers and elevation that the user can perceive.
4. **Explicit states.** Hover, focus, pressed, disabled, invalid and selected
   states are never color-only and never disappear in forced colors.
5. **Causal motion.** Feedback is fast; surfaces move only when their state
   changes. Reading content does not animate on entry.
6. **Density changes boxes, not legibility.** Font size, icon size, radius and
   color do not change with density.

These rules are the Pimolu signature. Presets may change the palette, type
family, radius values, elevation and texture; they must not change the grammar.

### Five signature moves

1. **Typography**
   - One display/body pairing, used consistently.
   - A monospaced voice for data, prices, dates, identifiers and code.
   - A short type scale; headings tight, body comfortable, numbers tabular.
   - No decorative font per preset unless it preserves the same roles.

2. **Surface and border**
   - Paper/ink relationship before gradients and glass.
   - One-pixel hairlines, low-contrast by default, stronger on focus and selection.
   - No card inside a card without a real hierarchy change.
   - Elevation is a layer signal, not a decoration.

3. **Shape**
   - Three roles: control radius, surface radius and pill.
   - Presets may change the values, not the roles.
   - Nested surfaces follow a predictable radius relationship.

4. **Motion**
   - About 120 ms for feedback and 220 ms for surfaces.
   - One easing family; no bounce unless a preset explicitly owns it.
   - Reduced motion and `data-pimolu-motion="off"` are first-class.
   - No entrance animation on prose, tables or reading content.

5. **Density and data**
   - Comfortable, compact and spacious are box-metric modes.
   - Tables, schedulers, data grids and dashboards are first-class surfaces.
   - Compact must remain readable; it is not a smaller font.

### Candidate Default direction: Ink & Signal

The current Default (slate neutrals, indigo primary) is a safe compatibility
baseline, but it is close to many SaaS systems. A candidate direction to
validate is **Ink & Signal**:

- warm paper-like neutrals instead of default slate;
- deep ink text and hairline structure;
- one high-chroma signal accent for primary action and selection;
- a restrained, editorial type hierarchy;
- monospaced data voice;
- shadows only for floating layers.

This is a **candidate, not a token change**. Validate it on the full preset and
component matrix before touching production tokens. A cooler alternative,
**Mineral**, can be tested in parallel if the warm direction feels too editorial
for data-heavy products.

The Default must be the purest expression of the grammar. Presets are dialects,
not separate languages.

### Anti-patterns

- “Modern, clean, minimal” as a direction; it describes everything and nothing.
- A new accent color presented as a new identity.
- Cards with borders, shadows and colored backgrounds at the same time.
- Presets that change component structure or interaction.
- Decorative motion on reading content.
- Density implemented by shrinking typography.
- A default that looks like a generic SaaS template.

## 4. Presets are art directions

A preset must define a coherent material, not only a palette:

| Preset | Intended character | Signature to protect |
| --- | --- | --- |
| `default` | Calm precision | Hairlines, one signal, editorial type |
| `monochrome` | Pure structure | Contrast and hierarchy without color |
| `cartoon` | Playful and friendly | Expressive shapes without losing readability |
| `glass` | Atmospheric and layered | Transparency with real contrast and focus |
| `luxury` | Deep, composed, premium | Restraint, spacing, refined elevation |
| `neo-brutalism` | Direct and energetic | Hard edges and offset shadows with usable states |
| `adaptive` | Context-aware | Candidate palette; validate before adoption |

### Preset parity contract

A preset is not finished until:

- every reference mounts and hydrates in that preset;
- light and dark both pass the layout and overflow checks;
- focus, disabled, invalid, selected and forced-colors states remain visible;
- forms, tables, navigation, overlays and data surfaces are all reviewed;
- no component branches on the preset name;
- no preset file declares component selectors.

## 5. The product differentiator: Identity Kit

The ThemeBuilder is the seed. The product should become an **Identity Kit**:

> **Brand in. System out.**

### Inputs

- brand color and neutral temperature;
- personality: calm, bold, luxurious, playful, technical;
- type pairing;
- shape language;
- density default;
- motion preference;
- target contrast.

### Outputs

- a colour theme and a visual preset;
- CSS variables for the web;
- native token data;
- Tailwind and JSON exports;
- a live preview on real components;
- a contrast and state report.

### Guardrails

- tokens only; no component internals in generated presets;
- contrast checks before export;
- all presets keep the same behavioral grammar;
- a generated identity must pass the same parity matrix as a built-in preset;
- no arbitrary CSS injection presented as a theme.

### MVP

Start with one screen: choose a base preset, a brand color, a neutral
temperature, a radius family and a density; preview a form, a table, a card and
an overlay; export CSS variables and JSON. Do not start with Figma sync, custom
component code or per-component overrides.

## 6. Product recipes

Components are copied. Coherent recipes are adopted.

Pimolu should ship a small number of complete, real compositions:

1. **Dashboard** — app shell, sidebar, page header, stats, table, filters.
2. **Settings** — form sections, validation, save states, destructive actions.
3. **Onboarding** — stepper, form, progress, success and recovery states.
4. **Billing** — plans, usage, invoices, status and empty states.
5. **Support** — chat, notifications, attachments and presence.
6. **Documentation** — docs layout, prose, code, search, table of contents.
7. **Marketing** — hero, feature grid, pricing, footer and showcase.

Each recipe uses the real components, the real tokens and the same preset
matrix. No screenshots pretending to be components.

## 7. Proof system

The positioning is credible only if it is measured.

### Preset parity

- Every component reference in seven presets × light/dark.
- Core controls additionally in three densities and three radii.
- Desktop and mobile widths.
- No page-level overflow, clipped labels or invisible states.

### Accessibility

- Keyboard paths for every interactive component.
- Visible focus in every preset.
- Forced colors and reduced motion.
- Documented assistive-technology gaps; no blanket certification.

### Integration

- Tailwind v4 Preflight in the base layer.
- Unlayered `styles.css` ordering.
- Next.js App Router and Vite.
- No hidden dependency on the documentation site's CSS.

### Public evidence

- Release notes with actual commands and results.
- Bilingual changelog and issues.
- A benchmark page that compares behavior and integration honestly, not
  marketing claims.
- A showcase of real applications using Pimolu.

### Metrics

- Time to first branded screen.
- Preset parity pass rate.
- Number of components with unresolved accessibility findings.
- Installation success outside the monorepo.
- Docs-to-install conversion.
- Real projects in the showcase.

## 8. What not to do

- Compete on the raw number of components.
- Copy the visual language of shadcn/ui, MUI or another library.
- Treat presets as color skins.
- Claim native parity before a native registry exists.
- Add a second theming API.
- Let the documentation site look like a generic docs template.
- Ship a broad family before its states, presets and accessibility are credible.
- Add a component because a competitor has it.

## 9. Roadmap

### Two weeks

- Validate the thesis and choose the Default candidate.
- Audit the current Default against the five signature moves.
- Choose the three signature moves visible on every screen.
- Rebuild the home page and one component page as a manifesto.
- Write the first preset parity checklist.

### Six weeks

- Ship an Identity Kit MVP with preview and CSS/JSON export.
- Add preset parity checks for the core controls.
- Ship three product recipes: dashboard, settings, marketing.
- Publish a “Why Pimolu” page that explains the difference in 30 seconds.

### Three months

- Prove the native data path with a small native surface.
- Add Figma/Tailwind export if the MVP proves useful.
- Publish an honest comparison and a community showcase.
- Review whether the Default direction is distinctive without the logo.

## 10. Open decisions

| Decision | Options | Recommendation | Status |
| --- | --- | --- | --- |
| Default palette | Current slate/indigo, Ink & Signal, Mineral | Test Ink & Signal first | Open |
| Type pairing | Humanist sans, geometric sans, editorial serif display | Choose one pairing and keep roles stable | Open |
| Shape family | Soft, precise, mixed by preset | Three radius roles; values per preset | Open |
| Signature component | ThemeBuilder, Command, DataGrid, Scheduler | ThemeBuilder / Identity Kit | Open |
| Native first surface | Tokens only, settings form, dashboard | Tokens plus one real screen | Open |
| Preset count | Keep seven, consolidate, add more | Keep seven until parity is proven | Open |

## 11. Decision filter

Before adding a feature, answer:

- Does it strengthen identity portability, behavior consistency or open styling?
- Does it introduce a second source of truth?
- Does it put component behavior into a preset?
- Does it duplicate a variant or recipe?
- Does it require a foundation change first?
- Is it proven in every preset and mode?
- Does it make Pimolu more recognizable without its logo?

A “no” means redesign the approach or defer it.

## 12. Success test

The direction works when a designer or developer can see a screen and say:

> “That is Pimolu.”

without seeing the logo, and then change the preset without losing what made it
recognizable.
