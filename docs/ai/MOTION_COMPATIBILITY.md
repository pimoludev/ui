# Motion architecture and compatibility

Shared CSS timings and optional advanced recipes now have a measured comparison:
see [Animation audit](ANIMATION_AUDIT.md) and `packages/motion/README.md`.


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
Integration tests live in `registry/react/motion-package.test.tsx`; provider/
lifecycle tests live in `registry/react/animation/animation-engine.test.tsx`.
The Playground has `#/motion-integration` and a global Animation selector.
Website examples are at `/docs/animation` with Playwright coverage in three engines.

Motion's underlying contracts: [custom components](https://motion.dev/docs/react-motion-component)
and [reduced motion configuration](https://motion.dev/docs/react-motion-config).

## Core integration

The core engine interface owns a scope mount/cleanup contract and exit duration.
It never imports the optional driver. Portal hosts inherit the React context and
mount their own scoped driver. Nested CSS overrides block outer observers.
Explicit adapters mark their native target to avoid two drivers on one surface.

The generated map currently contains 250 exports (compound parts included):
163 DOM, 38 composite-container, 49 engine/context adapters. Context-only roots
preserve their generic/component signatures and do not accept Motion DOM props.
All public animation exports and declarations come from built React declarations.

UsePresence retains a panel for driver exit duration plus 34 ms, cancels stale
exits on reopen and observes a reduced-motion preference change during closing.
Notifications retain removed items by id; reduced-motion changes cancel retention.
Tab/accordion outgoing panels leave the accessibility tree immediately.
The driver restores its original inline styles, inert state and ownership marker
when a scope is removed or switched off. Timers/observers/listeners are cleaned.

Core DOM refs and style targets were extended across navigation, form groups,
complex views and compound parts. Internal refs are combined with stable callbacks
that preserve React 18/19 ref cleanup. No imperative handle becomes a DOM ref.
React remains compatible with direct motion.create for proven native targets.

See apps/website/IMPLEMENTATION_PROGRESS.md for executed checks and limits.
