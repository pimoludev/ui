# Tabs animation

Workspace addition for the next release. No animation dependency is required.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pimolu/react";

export function Reports() {
  return (
    <Tabs defaultValue="summary" variant="segmented" className="report-tabs">
      <TabsList aria-label="Reports">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="details">Detailed reports</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Workspace overview.</TabsContent>
      <TabsContent value="details">Performance and deployment history.</TabsContent>
    </Tabs>
  );
}
```

All four variants share one measured, decorative indicator per list. `line`
slides an underline; `solid`, `soft` and `segmented` slide their active surface.
Widths/heights follow the actual trigger dimensions, including wrapping,
vertical lists, scrollable lists, resized labels and RTL layouts. Initial
measurement does not animate from the origin. Rapid selection interrupts the
current CSS transition from its current visual position.

```css
.report-tabs {
  --pimolu-tabs-indicator-duration: 400ms; /* default: 240ms */
  --pimolu-tabs-indicator-easing: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Use `animated={false}` on `Tabs` to disable indicator, trigger and panel
animations. `prefers-reduced-motion: reduce` also disables them, regardless of
duration overrides. `classNames.indicator` reaches the decorative surface;
it has no tab stop and is hidden from accessibility APIs. The existing
controlled/uncontrolled selection, disabled tabs, focus, manual activation
and mounted panels keep their behavior. Forced colors uses the static selected
trigger border instead of the moving surface.

JavaScript only measures geometry on selection and layout changes; CSS owns
the animation. Translation uses `translate3d`; width and height transition on
the absolutely positioned indicator so unequal widths keep their shape without
scaling text, border radii or the surrounding layout.

## Scrollbars and the segmented control

`<TabsList scrollable>` keeps native scrollbars hidden; swipe, wheel,
keyboard and previous/next buttons remain available. Set `showScrollbar` on
`TabsList` to display its native horizontal scrollbar. The website's scrollbar
defaults live in the base CSS layer so they respect component choices.

`SegmentedControl` uses the same private geometry hook and native CSS sliding
surface. It accepts `animated` (default `true`) and `showScrollbar` (default
`false`). Options always keep a single track and overflow stays scrollable,
whether the native scrollbar is visible or hidden. The unreleased `scrollable`
prop was removed: scrollbar visibility must not switch between scrolling and wrapping.
For vertical scrolling, also set `orientation="vertical"` and a bounded
`style={{ maxHeight: 160 }}`. Selection is revealed inside the control without
scrolling the whole page. The hidden form input and radio keyboard behavior
are preserved.

```tsx
<SegmentedControl
  aria-label="Workspace view"
  options={[
    { value: "summary", label: "Summary" },
    { value: "reports", label: "Detailed reports" },
    { value: "team", label: "Team" },
  ]}
  defaultValue="summary"
  showScrollbar={false}
  className="workspace-view"
/>
```

```css
.workspace-view {
  --pimolu-segmented-indicator-duration: 350ms;
  --pimolu-segmented-indicator-easing: cubic-bezier(.22, 1, .36, 1);
}
```

`classNames.indicator` styles the SegmentedControl surface; reduced motion and
forced colors follow the same policy as Tabs. No dependency was added.
