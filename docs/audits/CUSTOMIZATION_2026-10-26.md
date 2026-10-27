# Customization audit — 26 October 2026

## Implementation follow-up

The observations below describe the pre-implementation baseline. The workspace
now implements the opt-in `@pimolu/web-styles/layered.css` entry and typed named
parts on all 129 families (the initial seven were generalized on 27 October). Input has a separate focus outline that
preserves preset elevation; Select honors its styled-control `style`; Dialog and
Drawer content accept panel styles. These changes are not published yet.

The supported integration is described in [the customization contract](../CUSTOMIZATION.md).
Run its regression checks with:

```sh
pnpm build:all
pnpm --dir apps/website exec node scripts/audit-customization.mjs --contract
```

The contract run passed **1,974 / 1,974 observations**: 47 goals x three engines x
seven presets x two theme/width pairs, with no runtime/harness errors. It reads
the real layered package export and styles panels/options directly through
public hooks, including local panel variables without an extra Provider.
Its JSON report is `apps/website/.artifacts/customization-audit/contract-results.json`.

The family-wide contract is now listed in [the part reference](../COMPONENT_CUSTOMIZATION.md).
The public API audit covers 236 styled exports; 18 headless controllers intentionally
use their Content or child surface. Compound parts inherit classes through their
own family scope, independently nested roots reset that scope, and changing a map
does not remount the live DOM or lose uncontrolled values/focus. Toast overrides
and generic VirtualList are covered explicitly. Each of the 129 Playground families
and 133 website references includes a dedicated customization composition.

The 122 new compositions were rendered against source copies from before the
generalization, with customization removed. All 122 retain equivalent default
HTML after normalizing generated IDs and duplicate class tokens. A new regression
keeps CodeBlock's unstyled tokens free of empty class attributes. This is a DOM
comparison, not a pixel comparison or screen-reader certification.

The original plain import remains compatible and unlayered. Ordinary ancestor
selectors and inherited wrapper variables still do not cross a portal; those
unsupported recipes are intentionally not relabelled as successful. Use the
direct hooks, local panel styles, or a nested Provider for a theme scope.

## Verdict

Pimolu supports substantial customization without `!important`, but the stronger
promise "small changes never cause CSS specificity problems" is not yet true for
the default, unlayered import. Explicit cascade layers resolve the tested style
precedence conflicts. Portalled parts also require a suitable customization scope.

This audit adds a reproducible consumer fixture and browser runner. No library
implementation, public API, theme data, dependency or existing test was changed.

## Reproduce

From the repository root, with existing dependencies and browser binaries:

```sh
pnpm build:all
pnpm --dir apps/website exec node scripts/audit-customization.mjs
```

The runner builds an isolated React application using the workspace's actual
`@pimolu/react` and `@pimolu/web-styles/styles.css` exports. It compiles real
Tailwind utilities using the already installed plugin, starts a temporary local
HTTP server, and checks computed styles and interactions in installed browsers.
It does not inherit the official website's CSS overrides.

The runner exits nonzero when a customization goal remains unmet. This is an
audit of user expectations, not an assertion that every observation is a new
regression. It closes its own browsers and server. Results and screenshots are
ignored under `apps/website/.artifacts/customization-audit/`.

Two integration strategies are compared:

1. **Plain**: library CSS imported normally, application CSS loaded afterward,
   Tailwind utilities in their usual utility layer.
2. **Layered**: library, application overrides and utilities explicitly ordered.

The matrix uses Chromium, Firefox and WebKit, seven presets, light at 1440px and
dark at 390px. Width and theme are paired, not independently cross-tested. These
are desktop browser engines with resized viewports, not physical mobile devices.
The packages are rebuilt from the current workspace; this is not verification of
a fresh download from npm or of every one of the library's component families.

## Executed results

- 84 integration profiles, 29 goals per profile: **2,436 observations**.
- **1,986 met the requested goal; 450 did not**. No harness/runtime errors in
  the final run. The command intentionally exited 1 to retain these failures.
- Plain integration: 912 / 1,218 goals met. Layered: 1,074 / 1,218.
- Engines: Chromium 156.0.8078.4, Firefox 157.0, WebKit 27.2.
- Rebuilt workspace packages, fixture TypeScript and targeted ESLint passed.
- Initial exploratory runs exposed timing races in the audit harness: sending
  Escape before the Dialog initial-focus effect, or inspecting focus before its
  cleanup restored it. The final runner waits for actual focus readiness and
  restoration rather than forcing focus, and retains the same focus assertions.

Each strategy below has 42 profiles (three engines x seven presets x two themes):

| Goal | Plain | Layered |
| --- | ---: | ---: |
| Provider brand / local semantic color, each | 42/42 | 42/42 |
| Button radius / icon gap via CSS class, each | 42/42 | 42/42 |
| Simple Button hover class | 0/42 | 42/42 |
| Button hover with enabled-state guard | 42/42 | 42/42 |
| Tailwind icon gap / hover, each | 0/42 | 42/42 |
| Tailwind radius goal | 6/42 | 42/42 |
| Input typography / wrapper radius, each | 42/42 | 42/42 |
| Card / CardContent classes, each | 42/42 | 42/42 |
| Slider control variable | 42/42 | 42/42 |
| Select panel styled from ordinary wrapper | 0/42 | 0/42 |
| Select panel/options scoped to nested Provider, each | 42/42 | 42/42 |
| Dialog content / title classes, each | 42/42 | 42/42 |
| Dialog button inherits ordinary wrapper token | 0/42 | 0/42 |
| Dialog button inherits nested Provider brand | 42/42 | 42/42 |
| Input focus indication / Dialog focus return, each | 42/42 | 42/42 |
| Input focus halo specifically | 24/42 | 24/42 |
| Document contained at tested width | 42/42 | 42/42 |

Some preset defaults already match the requested 14px Tailwind radius; matching
that computed value in six plain profiles does not prove that the utility won
the cascade. Tailwind gap and hover make the precedence failure unambiguous.

## Findings

### Works through existing public APIs

- Provider brand color and locally scoped semantic color variables.
- Button radius, icon gap, native inline styles and suitably guarded hover CSS.
- Input control typography and an application-scoped wrapper override.
- Card root and CardContent overrides.
- Slider custom variables on its control via `style`. Its outer element has a
  separate `containerStyle`; inspecting the wrong element would misdiagnose it.
- Select control typography.
- DialogContent and DialogTitle class names; closing still restores trigger focus.

All successful recipes avoid `!important`. Internal descendant selectors work
today, but are less robust than a documented public prop or token.

### Ordinary Tailwind utilities can lose to unlayered Pimolu CSS

The unlayered library takes precedence over layered utilities, regardless of
stylesheet order or class-name order. Even the fixture's arbitrary radius and
gap utilities lose in that integration. A simple `.audit-hover:hover` also loses
to `.pimolu-button--solid:hover:not(:disabled)` in ordinary CSS specificity.

An application hover selector with the matching enabled-state guard works in
the tested ordinary import. Ordering cascade layers also makes the simple class
and Tailwind recipes work without increasing specificity.

The official website already orders layers in `apps/website/app/globals.css`.
The plain package import does not impose that integration automatically. A
consumer recipe should make the choice explicit, for example:

```css
@layer pimolu, application, utilities;
@import "@pimolu/web-styles/styles.css" layer(pimolu);
@import "tailwindcss/utilities.css" layer(utilities);

@layer application {
  .save-button:hover:enabled {
    background: #b45309;
  }
}
```

This is a recipe for an application that already configures Tailwind scanning
and theme utilities; it is not a complete Tailwind installation stylesheet.
Changing layer precedence does not remove the need to preserve disabled, focus
and contrast states when writing custom styles.

### Local portal customization is not transparent

Select and Dialog portal into the closest Pimolu Provider scope. An ordinary
wrapper around their triggers is not the DOM ancestor of the floating panel.
Consequently, a local descendant selector cannot reach that panel, and CSS custom
properties defined only on that wrapper do not reach it either.

The fixture confirms that a nested Provider with an application class can scope
Select panel/options styling, while an isolated Provider brand reaches a Dialog's
content. This works now, but requires understanding the portal boundary.

Select currently offers `className` and `containerClassName`, but no public
`listboxClassName`, `optionClassName` or equivalent slot API. Dialog exposes its
panel/title classes, but not equivalent styling props for every internal part.
These are opportunities for a consistent optional part-customization contract,
not instructions to change the public API during this audit.

### Additional focus-halo observation

The Input focus rule combines its focus shadow with
`var(--pimolu-input-elevation)`. If the elevation resolves to `none`, a comma-list
containing a real shadow and `none` is invalid and the halo can disappear. Focus
border changes and the actual focused element are measured separately; a missing
halo must not be equated with absence of every focus indication.

This is an existing CSS concern found during the checks, not caused by the test
class that changes only typography and wrapper radius. It should be addressed
and regression-tested separately before claiming all focus styling is robust.
The affected presets in this matrix were default, adaptive and monochrome;
the other four retained the halo. A border change still indicated Input focus
in every profile, and Dialog focus return passed in every final profile.

## Recommended next work

1. Document a tested CSS-layer recipe for Tailwind and plain application CSS.
2. Define which component variables and part classes are stable customization
   hooks, then fill the most useful missing hooks on portalled controls.
3. Add customization regression cases for normal/hover/focus/disabled states and
   nested providers, and repair the observed focus-halo composition.

No commit, push or publication is part of this audit.
