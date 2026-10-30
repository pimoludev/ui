# Native motion in Pimolu

These refinements are available since 0.1.0-beta.5; Tailwind Preflight compatibility is covered since 0.1.0-beta.6. They add no animation
dependency. `@pimolu/motion` is still a separate, optional direction.

Motion explains interaction rather than making every component move on mount:

- Accordion expands/collapses using CSS grid tracks, opacity and a small reveal.
  It handles unequal content heights, rapid toggles and nested controls. Closed
  content becomes inert and leaves accessibility immediately, including during
  the decorative exit. `animated={false}` disables entry, exit and chevron motion.
- NavbarMenu uses native Drawer slides, with four edges, fullscreen and an
  `animated` switch. The original inline mobile menu gains a short reveal too.
- FormError and FormField validation messages enter with a short fade/translation.
  Forms themselves stay fixed. Input focus, submission loading and Button press
  behavior remain with their existing components.
- Sidebar collapse animates its width/padding. Cards, badges, avatars, table rows,
  command items and navigation controls get quiet surface/color transitions when
  those visual properties actually change. Static cards do not pretend to be
  clickable; typography and layout primitives stay stationary.
- Existing sliders, toggles, selections, charts, loading states and overlays keep
  their component-specific feedback. Chart/data animations are not replayed on
  every pointer movement; sliders do not lag behind the pointer.

## Shared controls

The full `styles.css` and opt-in `layered.css` bundles include `motion.css`.
The standalone motion entry is also published by web-styles after the next build:

```css
@import "@pimolu/web-styles/motion.css";

.workspace {
  --pimolu-interaction-duration: 150ms;
  --pimolu-interaction-easing: ease-out;
}
```

Those variables control the new shared surface transitions, not every existing
component's duration. Existing component-level motion variables remain valid.
No `transition: all`, continuous decoration or forced entrance on reading content
is added.

```tsx
<div data-pimolu-motion="off">
  <PimoluProvider><App /></PimoluProvider>
</div>
```

`data-pimolu-motion="off"` on a wrapper removes animation/transition within that
subtree, including custom children and pseudo-elements. It is intentionally a
strict subtree setting; a nested element cannot re-enable motion inside it.
Place it outside the Provider or on another portal host when overlays should follow it.
An attribute on a field wrapper does not affect a panel portalled elsewhere.

CSS opt-out suppresses visual movement; it does not change existing overlay
presence timers. Use the supported component `animated={false}` prop when an
immediate close/unmount is required (Accordion and NavbarMenu).

The user's `prefers-reduced-motion: reduce` setting always wins for Pimolu
elements and pseudo-elements. Indeterminate loaders remain visible as static
status indicators. Keep an accessible text label describing progress.

## Verification

`Native motion` examples in the Accordion/Form playground pages, Design Lab and
the Accordion/Form/FormError/FormField website references demonstrate the shared
policy with real components. See `apps/website/IMPLEMENTATION_PROGRESS.md` for
executed checks and browser coverage. A static CSS inventory cannot prove frame
rate, physical-device performance or assistive-technology behavior.
