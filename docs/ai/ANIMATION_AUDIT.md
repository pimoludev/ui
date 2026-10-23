# Animation audit and comparison

Date: 2026-10-23. Local production Playground, 390×844, headless browsers.

## Implemented CSS changes

- 131 stylesheets inspected; 264 transition/animation/hint declarations.
- 66 component stylesheets consume common duration/easing tokens. Primitive data lives in design-tokens/src/tokens.json and generates CSS plus @pimolu/design-tokens/motion (numeric ms and cubic-bezier tuples).
- Feedback 120ms; controls 150ms; entrances 180ms; layout 200ms. Existing bounded CSS exit times remain aligned with their React presence timers. Entrance customization does not change exit retention.
- Layout transitions: 3 before, 0 after. Progress animates scaleX, Carousel dots animate scaleX, DataGrid resizer thickness updates immediately.
- Progress retains the legacy --pimolu-progress-value width fallback for non-React CSS consumers; the React fill uses a full-width surface plus a scale and follows RTL origin.
- Stylesheets with animation declarations but no reduced-motion treatment: 0. Persistent will-change hints: 0.
- Motion-marked Buttons disable CSS transitions, avoiding a second interpolation over per-frame Motion transforms/opacity.

## Optional advanced Motion

pimoluMotionPresets.press supplies spring gestures; reveal coordinates explicit entrance/exit surfaces; layout animates keyed reordering. Adapters retain reduced-motion and disabled/loading safeguards. The Playground compares the same five components and reorders real data with keyboard-operable buttons.

## Measurements

The workflows use the same components, but CSS keeps the native treatments while
Motion uses its optional fades/springs. Motion trajectories are not identical.
This compares practical integrations, not equivalent mathematical curves.
Both modes run in the same already-loaded comparison page. RAF sampling does
not measure the startup cost of a clean CSS-only application; bundle fixtures
measure the separate JavaScript increment.

The separate visual matrix covers seven presets, light/dark and both engines:
84 screenshots, reviewed in contact sheets. Progress geometry and RTL origin,
plus Carousel indicator transitions, were checked in all three browsers after
the production CSS compiler's :dir() lowering was replaced with inherited dir
scope variables. The final strict theme audit has zero errors or warnings.

Three cycles per target × two engines × two motion preferences × three browsers = 60 samples / 180 interaction cycles. Each panel is checked for focus, Escape, unmount and restored trigger focus. Reduced-motion and actual reordered state are checked.

Median of per-sample p95 RAF intervals, normal-motion mode (milliseconds):

| Target | CSS | Motion |
| --- | ---: | ---: |
| Button | 16.00 | 16.00 |
| Dialog | 16.70 | 16.80 |
| Drawer | 16.70 | 16.80 |
| Tabs | 16.00 | 16.00 |
| Accordion | 16.00 | 16.00 |

These RAF intervals include browser automation, screenshots, headless scheduling and machine contention. They do not isolate animation work, measure dropped frames reliably or establish superiority in production. There is no controlled before/after speedup claim. The CSS changes remove avoidable layout interpolation; Motion is selected for functionality, not an assumed performance gain.

### Equal-external-dependency bundle fixtures

React and React DOM are excluded equally. Fixtures import Button versus MotionButton and bundle/minify the local packages with esbuild. These figures include the retained Pimolu bundle/context initialization, so they are not standalone Button component sizes or total website payloads.

- CSS fixture: 434691 bytes minified; 125442 gzip.
- Motion fixture: 561897 bytes minified; 167725 gzip.
- Increment: 42283 gzip bytes.

## Reproduce

Run pnpm build:all, build the Playground and serve it on port 4173; then pnpm --dir apps/website measure:animations. PIMOLU_BENCHMARK_URL can change that server. pnpm audit:animations prints the static inventory without mutating sources. Raw measurements and screenshots are ignored under apps/website/.artifacts/animation-measurements/.

Keep CSS for ordinary feedback. Opt into Motion for spring gestures, keyed layout movement and coordinated presence. New tokens/module APIs are workspace changes pending a coordinated release; no package was published.
