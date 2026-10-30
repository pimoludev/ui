import { useState } from "react";
import {
  Button, Checkbox, Navbar, NavbarActions, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenu, NavbarToggle, Select, type PimoluNavbarMenuProps,
} from "@pimolu/react";

export function NavbarMenuDemo() {
  const [side, setSide] = useState<NonNullable<PimoluNavbarMenuProps["side"]>>("left");
  const [size, setSize] = useState<NonNullable<PimoluNavbarMenuProps["size"]>>("sm");
  const [fullScreen, setFullScreen] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("Projects");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Select label="Opening edge" value={side} onValueChange={(value) => setSide(value as typeof side)}>
          <option value="left">Left → right</option>
          <option value="right">Right → left</option>
          <option value="top">Top → bottom</option>
          <option value="bottom">Bottom → top</option>
        </Select>
        <Select label="Panel size" value={size} onValueChange={(value) => setSize(value as typeof size)} disabled={fullScreen}>
          <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
        </Select>
        <Checkbox label="Full screen" checked={fullScreen} onCheckedChange={setFullScreen} />
        <Checkbox label="Animate menu" checked={animated} onCheckedChange={setAnimated} />
      </div>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Navbar collapsible open={open} onOpenChange={setOpen}>
          <NavbarBrand href="#navbar-menu-example" onClick={(event) => event.preventDefault()}>Atlas workspace</NavbarBrand>
          <NavbarToggle />
          <NavbarMenu side={side} size={size} fullScreen={fullScreen} animated={animated} label="Your workspace">
            <NavbarContent aria-label="Workspace sections">
              {["Projects", "Team", "Settings"].map((label) => (
                <NavbarItem key={label} href="#navbar-menu-example" active={view === label} onClick={(event) => {
                  event.preventDefault(); setView(label); setOpen(false);
                }}>{label}</NavbarItem>
              ))}
            </NavbarContent>
            <NavbarActions><Button onClick={() => { setView("New project"); setOpen(false); }}>New project</Button></NavbarActions>
          </NavbarMenu>
        </Navbar>
      </div>
      <p id="navbar-menu-example" role="status">Current workspace view: {view}.</p>
    </div>
  );
}
