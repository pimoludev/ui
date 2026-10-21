"use client";

import { useState } from "react";
import { Badge, Navbar, NavbarActions, NavbarBrand, NavbarContent, NavbarItem, NavbarToggle } from "@pimolu/react";

export function NavbarExample() {
  const [active, setActive] = useState("Overview");
  return <div className="space-y-5">
    <Navbar collapsible>
      <NavbarBrand href="#navigation-example">Orbit</NavbarBrand>
      <NavbarToggle openLabel="Open example menu" closeLabel="Close example menu" />
      <NavbarContent aria-label="Example navigation">{["Overview", "Projects"].map((label) => <NavbarItem key={label} href="#navigation-example" active={active === label} onClick={(event) => { event.preventDefault(); setActive(label); }}>{label}</NavbarItem>)}</NavbarContent>
      <NavbarActions><Badge variant="success">Workspace</Badge></NavbarActions>
    </Navbar>
    <p id="navigation-example" role="status">Current view: {active}.</p>
  </div>;
}
