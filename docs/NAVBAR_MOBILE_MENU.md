# Navbar mobile panels

`NavbarMenu` is an additive API available since 0.1.0-beta.5.
It reuses Pimolu Drawer behavior and native CSS animations. No Motion dependency
is required. Existing navbars without NavbarMenu retain their inline mobile menu.

```tsx
import {
  Navbar, NavbarBrand, NavbarToggle, NavbarMenu,
  NavbarContent, NavbarItem, NavbarActions, Button,
} from "@pimolu/react";

<Navbar collapsible>
  <NavbarBrand href="/">Atlas</NavbarBrand>
  <NavbarToggle />
  <NavbarMenu side="left" size="sm" label="Workspace">
    <NavbarContent aria-label="Workspace sections">
      <NavbarItem href="/projects">Projects</NavbarItem>
      <NavbarItem href="/team">Team</NavbarItem>
    </NavbarContent>
    <NavbarActions><Button>New project</Button></NavbarActions>
  </NavbarMenu>
</Navbar>
```

Use **one NavbarMenu** per Navbar, with the brand and toggle outside it. Group
both navigation and trailing actions inside the menu. `collapsible` is required
for the modal presentation. Desktop layout remains inline. The breakpoint is the
navbar's **content width** (700px), matching its CSS container query, so a narrow
navbar inside a desktop application can also offer this menu.

| Prop | Default | Behavior |
| --- | --- | --- |
| `side` | `right` | Physical viewport edge: `left`, `right`, `top`, `bottom`. |
| `size` | `sm` | `sm`, `md`, `lg`: width for horizontal sides, height for vertical sides. |
| `fullScreen` | `false` | Cover the viewport, ignoring the preset panel size. |
| `animated` | `true` | CSS entry/exit; false removes animations and unmounts immediately on close. |
| `label` | `Navigation` | Visible heading and accessible dialog name. |
| `closeLabel` | `Close menu` | Accessible label of the close button. |
| `className`, `style` | — | Customize the mobile panel; className also reaches the desktop contents wrapper. |
| `classNames` | — | Additive named parts, including those inside the portal. |

`left` means left to right; `right` means right to left; `top` opens downward;
`bottom` opens upward. These physical edges remain the same in RTL. Native CSS
animations honor `prefers-reduced-motion`, even with animated enabled.

```tsx
<NavbarMenu side="bottom" fullScreen animated={false} label="Explore">
  {/* NavbarContent and NavbarActions */}
</NavbarMenu>
```

Customize partial-panel dimensions through the existing Drawer variable:

```tsx
<NavbarMenu side="left" style={{ "--pimolu-drawer-size": "18rem" } as React.CSSProperties}>
  {/* navigation */}
</NavbarMenu>
```

For application state, control the existing `Navbar` props `open` and
`onOpenChange`. Normal NavbarItem navigation closes the menu. If an onClick
handler prevents default navigation to update a local view instead, close it
explicitly with your controlled state. NavbarActions may contain any controls;
their event handlers decide whether to close the panel.

The modal moves focus into navigation, traps Tab, closes on Escape or backdrop
press, locks document scrolling and restores the trigger. Widening the navbar
closes the modal and focuses the restored inline navigation. Keep persistent
application state above NavbarMenu: panel children unmount when the menu closes
or switches between inline and portalled presentations.

Navbar-level `classNames` exposes `menuLayer`, `menuOverlay`, `menuPanel`,
`menuHeader`, `menuTitle` and `menuCloseButton`. The existing content/item/actions
hooks continue to work inside the portal. Local CSS variables declared on the
header do not inherit across a portal; supply panel-specific overrides through
NavbarMenu's style/className. The full stylesheet includes Drawer rules, and the
standalone `@pimolu/web-styles/navbar.css` entry bundles this dependency too.

The playground and `/components/navbar` demonstrate all four sides, partial and
fullscreen panels, animation controls and a local workspace interaction.
