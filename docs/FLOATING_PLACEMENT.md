# Floating panel placement

Source-workspace correction after **0.1.0-beta.7**. This fix has not been
published to npm yet; it does not add a public prop or dependency.

Select and the other anchored components measure their real panel before making
it visible. Previously, the placement hook could choose a side using an estimated
height before the Portal mounted, then switch sides when the actual content was
measured. The menu could visibly jump during its opening.

The shared implementation now:

- Keeps initial placement hidden while applying width and viewport constraints.
- Receives an internal notification when portalled child refs have committed.
- Completes measurement before paint and reveals the correctly positioned panel.
- Attaches its ResizeObserver to the actual mounted surface, including delayed
  portals; scroll and viewport resize continue to update placement.
- Defers menu, dialog and calendar focus until the surface is visible, without
  scrolling the page. Popover also restores focus inside a panel reopened during
  its closing animation.

Select, Combobox, MultiSelect, TreeSelect, Cascader, Mentions, DropdownMenu,
Menubar, Popover, Tooltip, HoverCard, DatePicker and DateRangePicker share this
logic. Compositions using them inherit the fix, including PhoneInput,
ThemeBuilder, SplitButton, Popconfirm, ColorPicker, NotificationCenter, DataGrid
filter popovers and Sidebar tooltips. Native Select mode is unaffected.

Applications do not need an additional placement prop or a pnpm patch once
they consume a Pimolu version containing this correction. A patch applied to
an older installed package remains a separate application-level workaround;
remove it only after updating and checking the corrected package.

The hook also observes the anchor, so an open list follows a local container
resize without requiring a window resize. Left/right panels cap their height
and allow internal scrolling. Lateral Popover panels let their measured width
override the usual minimum width when space is limited.

If the trigger ref is assigned after opening, the hook waits for it without
reading layout while it is absent, then measures before revealing the panel.
Waiting is cancelled on close or unmount. Trigger wrappers must still forward
their DOM ref and event props; an anchor that never mounts cannot be positioned.
The hidden sizing pass runs when placement state changes, not on unrelated
renders, and redundant pending frames are cancelled once placement is ready.

Focus helpers exclude hidden, inert and disabled controls. Dialog keyboard loops
therefore remain inside the visible actions when an optional action is hidden
with CSS. Roving ContextMenu items retain programmatic arrow-key focus.
Computed styles are reused only within a single focus traversal, so shared
ancestors are read once and the next interaction sees live visibility changes.

The playground and website provide working Preview/Code examples for resizing
Select, long lateral Popover content and conditional Dialog actions. The 29
affected references have refreshed Updated overrides. These changes are source
workspace fixes after beta.7 and are not yet published on npm.

See the dated website implementation progress entry for executed checks and
the recovery of damaged local source files and caches.
