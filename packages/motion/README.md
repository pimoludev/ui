# @pimolu/motion

Optional Motion integration for Pimolu UI. Implemented in the workspace;
**not yet published to npm**. This package stays private until a coordinated
release includes the required `@pimolu/react` APIs. No publish command was run.

## Workspace setup

Add `"@pimolu/motion": "workspace:*"` and `motion` to the consuming application.
Run `pnpm install` and `pnpm build:all` from the repository root. Continue loading
`@pimolu/web-styles/styles.css` from your global CSS. React 18/19 are peer ranges;
the full repository suite uses React 19. An isolated packed-package fixture also
checks React 18.3.1 SSR, native/composite refs, portal context and cleanup.

After publication, installation will be `pnpm add @pimolu/motion motion` alongside
the compatible Pimolu React and stylesheet packages.

## Explicit components

```tsx
import { MotionButton } from "@pimolu/motion";

export function Save() {
  return (
    <MotionButton
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring" }}
    >
      Save
    </MotionButton>
  );
}
```

Motion props are consumed by Motion. Pimolu props, tokens, state and native refs
remain intact. Button disabled/loading suppresses interactive gestures. The
adapter sets `MotionConfig reducedMotion="user"` and suppresses interactive
hover/tap/focus gestures, drag and layout when motion is reduced. Explicit
animate/initial states follow Motion's contract; opacity can still animate.
Explicit native surfaces support
`AnimatePresence`; internal portal mounting remains owned by Pimolu.

## Global engine

```tsx
import { Button, PimoluProvider } from "@pimolu/react";
import { motionEngine } from "@pimolu/motion";

export function App() {
  return (
    <PimoluProvider animationEngine={motionEngine}>
      <Button>Motion feedback</Button>
      <PimoluProvider animationEngine="css">
        <Button>CSS feedback</Button>
      </PimoluProvider>
    </PimoluProvider>
  );
}
```

The object injection keeps Motion out of `@pimolu/react`. Omitting the prop
inherits the nearest engine, or uses CSS when there is none. `"css"` explicitly
blocks an inherited engine. `MotionProvider` is a standalone alternative when
theme configuration already exists.

`createMotionEngine({ enterDuration: 140, exitDuration: 180, interactions: true })`
customizes the bounded preset (milliseconds, 0–10000). Define it outside render.
The driver delegates subtle opacity feedback and fades supported surfaces;
it does not replace every React component or animate every DOM node.

## Adapter contracts

`motionComponentModes` is the generated map of all named adapters:

| Mode | Contract | Examples |
| --- | --- | --- |
| `dom` | Motion props animate the native element exposed by `ref`. No extra DOM wrapper. | MotionButton, MotionCard, MotionNavbar, MotionTabsTrigger |
| `container` | Motion props/style animate a local outer surface. The public ref still points to the original field or imperative handle. | MotionCombobox, MotionSelect, MotionSplitButton |
| `engine` | Original compound/generic API; inherited engine behavior. No arbitrary Motion DOM props. | MotionDialog, MotionPopover, MotionDataGrid |

Use `MotionDialog` with ordinary `DialogTrigger`, `DialogContent`, `DialogTitle`
etc. The portal inherits the engine. `MotionDataGrid` preserves generic row
inference; compose `MotionBox` around it to animate the complete grid. Logical
triggers must retain their original child/ref contract.

`createMotionComponent(Component, { container?: boolean, svg?: boolean })` creates
a custom DOM adapter. A native adapter requires ref and style on the **same**
native element. The generator checks this source contract and falls back to a
container where it cannot prove it; inspect the map when choosing an adapter.

## Shared timing and advanced recipes

Timing data comes from `@pimolu/design-tokens/motion` (`pimoluMotionTokens`).
CSS consumes the generated `--pimolu-motion-duration-*` and
`--pimolu-motion-easing-*` variables. Feedback is 120ms, ordinary controls 150ms,
entrances 180ms, layout transitions 200ms. CSS exit durations remain bounded by
their existing presence contract; changing an entrance token does not extend exit
retention. `createMotionEngine` accepts explicit millisecond overrides.

`pimoluMotionPresets.press`, `.reveal` and `.layout` are optional Motion recipes:

```tsx
import { MotionButton, MotionCard, pimoluMotionPresets } from "@pimolu/motion";

export function AnimatedContent() {
  return <>
    <MotionButton {...pimoluMotionPresets.press}>Save</MotionButton>
    <MotionCard {...pimoluMotionPresets.layout}>Reordered content</MotionCard>
  </>;
}
```

Override individual props after the spread. Use stable keys for layout changes.
Reduced-motion adapters suppress interactive gestures and layout movement.
AnimatePresence can coordinate `.reveal` exits on explicit surfaces. Ordinary
controls can retain CSS; springs and coordinated reordering justify opting in.

The Playground's comparison section exercises the same Button, Dialog, Drawer,
Tabs and Accordion in each engine and includes keyboard-operable list reordering.
With the production Playground on port 4173, run
`pnpm --dir apps/website measure:animations`. Results go to the ignored
`.artifacts/animation-measurements` directory. These are diagnostic headless RAF
samples and equal-external-dependency bundle fixtures, not a production FPS claim.

## Presence and accessibility

The global driver covers Dialog/AlertDialog, Drawer, Popover, dropdown/context/
navigation menus, Menubar, HoverCard, Tooltip, Toast, Tabs and Accordion. Derived
components inherit their primitives. Closing surfaces remain mounted for the
driver's duration plus one scheduling margin, become inert and then unmount.
Pimolu retains focus management, scroll lock, positioning and keyboard handling.
Reopening cancels the previous exit. Reduced motion closes without retention.

Do not apply a competing transform to positioned or draggable elements. Animate
an inner MotionBox or opacity. Transforms change fixed-position containing
blocks; use care on application layouts. Media playback, chart values, canvas
operations and row virtualization keep their existing application behavior.

## Build and verification

`pnpm build:packages` builds core, React, then this module. The module emits ESM
and declarations with external React, Pimolu and Motion imports. Generated
`src/components.ts` is refreshed from the built public React declarations.
`pnpm test:motion` runs the focused integration suite after a package build.
Integration tests live in `registry/react/motion-package.test.tsx`; provider/
lifecycle tests live in `registry/react/animation/animation-engine.test.tsx`.
The Playground has `#/motion-integration` and a global Animation selector.
Website examples are at `/docs/animation` with Playwright coverage in three engines.

Motion's underlying contracts: [custom components](https://motion.dev/docs/react-motion-component)
and [reduced motion configuration](https://motion.dev/docs/react-motion-config).
