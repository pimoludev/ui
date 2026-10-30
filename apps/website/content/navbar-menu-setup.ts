import type { ComponentSetup } from "./component-setups.ts";

export const navbarMenuSetup: ComponentSetup = {
  title: "A directional menu on small screens",
  paragraphs: [
    "Keep NavbarBrand and NavbarToggle outside NavbarMenu. Put NavbarContent and NavbarActions inside one NavbarMenu. In a collapsible Navbar whose content width is at most 700px, that group becomes a modal panel. At larger widths the same composition appears inline, without a second navigation tree.",
    "side chooses the physical opening edge: left slides left to right, right slides right to left, top slides downward and bottom slides upward. fullScreen fills the viewport; size controls a partial panel's width or height. These directions are physical, including in RTL.",
    "animated=false removes entry and exit animation and closes immediately. CSS animations respect prefers-reduced-motion. The menu reuses Drawer's focus trap, Escape/overlay dismissal and scroll locking; the toggle receives aria-haspopup=dialog while the modal presentation is active.",
  ],
  examples: [{
    filename: "mobile-navbar.tsx",
    title: "A workspace menu opening from the left",
    code: `"use client";

import {
  Button,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarToggle,
} from "@pimolu/react";

export function MobileNavbar() {
  return (
    <div className="w-full max-w-sm">
      <Navbar collapsible>
        <NavbarBrand href="#workspace">Atlas</NavbarBrand>
        <NavbarToggle />
        <NavbarMenu side="left" size="sm" label="Workspace">
          <NavbarContent aria-label="Workspace sections">
            <NavbarItem href="#workspace" active>Overview</NavbarItem>
            <NavbarItem href="#projects">Projects</NavbarItem>
            <NavbarItem href="#team">Team</NavbarItem>
          </NavbarContent>
          <NavbarActions>
            <Button>New project</Button>
          </NavbarActions>
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
`,
  }],
  notes: [
    "NavbarMenu is an additive workspace API pending publication. Existing navbars without it retain the inline collapsible menu. Use one NavbarMenu per Navbar. Panel children unmount when the menu closes or changes between desktop and portal presentations; keep persistent application state above NavbarMenu.",
    "Customize the mobile panel using className/style, including --pimolu-drawer-size for a custom dimension. Root Navbar classNames can target menuLayer, menuOverlay, menuPanel, menuHeader, menuTitle and menuCloseButton, including inside the portal. Local panel overrides belong on NavbarMenu, since CSS inheritance from the header does not cross the portal.",
    "A navbar responds to its own container width, not just the screen width. Open the standalone preview or use its mobile width to explore the menu. A fullscreen preview fills its isolated preview document. On widening the navbar, an open modal closes and restores the inline navigation.",
  ],
};
