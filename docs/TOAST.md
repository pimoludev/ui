# Toast feedback

These additions are available in the source workspace, pending a package release.
Existing `toast({ title, description, variant, duration, action })` calls still work.
Mount **one** `Toaster` inside `PimoluProvider` and import the shared stylesheet.
Calls to toast belong in client event handlers/effects, not server rendering.

```tsx
import { Button, toast, Toaster } from "@pimolu/react";

export function SaveExample() {
  return (
    <>
      <Button onClick={() => toast.success("Changes saved")}>
        Save
      </Button>
      <Toaster position="bottom-right" />
    </>
  );
}
```

In Next.js, place `"use client"` at the top of the interactive module.

## Loading and updates

```tsx
const id = toast.loading("Uploading project…");

// When the operation finishes:
toast.update(id, {
  title: "Upload complete",
  variant: "success",
  duration: 5000,
});
```

Loading never auto-dismisses, even if a duration is provided. It shows a decorative
Spinner, sets `aria-busy` and disables its action. The close button remains usable.
On completion, the updated tone resumes the configured dismissal delay.
`toast({ id, title })` also updates an existing id without duplicating it.
`updateToast` is the standalone equivalent of `toast.update`; an unknown id is a no-op.
`useToast()` returns `{ toast, dismiss, update }` for the same shared store.

## Promises

```tsx
toast.promise(() => saveProject(), {
  loading: "Saving your project…",
  success: (project) => `${project.name} saved`,
  error: (error) => error instanceof Error ? error.message : "Save failed",
});
```

The first argument is a Promise or a function returning one. A thrown async-factory
error also becomes failure feedback. Loading, success and failure use the same card.
`toast.promise` returns the **toast id**, not the promise result; retain your original
promise if the application needs its value. A late result never restores a dismissed
notification or overwrites one manually updated in the meantime. Closing a notification
does not cancel the underlying task. A message formatter that throws falls back to a
generic failure message.

## Icons and tone

Shortcuts: `toast.success`, `toast.error` (danger tone), `toast.warning`, `toast.info`
and `toast.loading`. Their second argument accepts normal toast options except title
and variant. The equivalent variants are listed in `toastVariantMap.variant`.

```tsx
toast.info("Invitation received", {
  icon: <EnvelopeIcon />,
  dismissLabel: "Close invitation",
});

toast.success("Preferences saved", { icon: null });
```

`EnvelopeIcon` represents an application-supplied icon component. `undefined` selects
the built-in tone icon; `null` or `false` hides it. Icons are decorative: express the
state in the title rather than relying on color or an icon alone.

## Dismissal and reading time

- Default delay: 5000 ms. `duration: 0` keeps a notification open.
- `pauseOnHover` and `pauseOnFocus` default to true. Pointer and keyboard focus pause
  independently; the remaining time resumes only after both leave.
- `toast.update` resets the full delay, while respecting current interaction pauses.
- `dismissible: false` hides the close button. Timers and `toast.dismiss(id)` still work.
- `onDismiss(id)` runs once for manual, action or automatic dismissal.
- `toast.dismiss()` / `dismissAllToasts()` remove all notifications and clear their timers.
- `dismissToast(id)` remains supported. Action callbacks run before removal.

Keep important feedback available elsewhere in the application. Toaster maintains a
named, polite live region even when empty. It never steals keyboard focus. Screen
reader announcements still require testing with the assistive technology you support.

## Positions and styling

Positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`,
`bottom-right`. Left/right retain the existing logical start/end behavior in RTL;
centered positions remain physically centered. The stack scrolls within the viewport
when necessary. Touch controls have at least a 44px target.

Use `classNames` for named parts (`icon`, `title`, `description`, `body`, `actions`,
`action`, `close`, `toast`, `root`) and the sizing/motion variables documented in
[Customization](CUSTOMIZATION.md). Entry motion uses native CSS. Spinner and entry
animations respect `prefers-reduced-motion`; no Motion dependency is added.
