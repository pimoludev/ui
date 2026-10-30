"use client";

import { useState } from "react";
import {
  Button, Checkbox, Navbar, NavbarActions, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenu, NavbarToggle, Select, type PimoluNavbarMenuProps,
} from "@pimolu/react";

export function DemoExample() {
  const [side, setSide] = useState<NonNullable<PimoluNavbarMenuProps["side"]>>("left");
  const [fullScreen, setFullScreen] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("Projects");

  return (
    <div className="grid gap-5">
      <Select label="Opening edge" value={side} onValueChange={(value) => setSide(value as typeof side)}>
        <option value="left">Left to right</option>
        <option value="right">Right to left</option>
        <option value="top">Top to bottom</option>
        <option value="bottom">Bottom to top</option>
      </Select>
      <div className="flex flex-wrap gap-5">
        <Checkbox label="Full screen" checked={fullScreen} onCheckedChange={setFullScreen} />
        <Checkbox label="Animate menu" checked={animated} onCheckedChange={setAnimated} />
      </div>
      <div className="w-full max-w-sm">
        <Navbar collapsible open={open} onOpenChange={setOpen}>
          <NavbarBrand href="#workspace" onClick={(event) => event.preventDefault()}>Atlas workspace</NavbarBrand>
          <NavbarToggle />
          <NavbarMenu
            side={side}
            size="sm"
            fullScreen={fullScreen}
            animated={animated}
            label="Your workspace"
            classNames={{ menuTitle: "workspace-menu-title" }}
          >
            <NavbarContent aria-label="Workspace sections">
              {["Projects", "Team", "Settings"].map((label) => (
                <NavbarItem key={label} href="#workspace" active={view === label} onClick={(event) => {
                  event.preventDefault();
                  setView(label);
                  setOpen(false);
                }}>{label}</NavbarItem>
              ))}
            </NavbarContent>
            <NavbarActions>
              <Button onClick={() => { setView("New project"); setOpen(false); }}>New project</Button>
            </NavbarActions>
          </NavbarMenu>
        </Navbar>
      </div>
      <p role="status">Current workspace view: {view}.</p>
      <style>{`
.workspace-menu-title {
  letter-spacing: -0.02em;
}
`}</style>
    </div>
  );
}
