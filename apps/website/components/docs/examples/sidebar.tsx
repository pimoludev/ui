"use client";

import { useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarItem } from "@pimolu/react";

export function SidebarExample() {
  const [active, setActive] = useState("Overview");
  return <div className="space-y-5">
    <Sidebar collapsible collapseOnMobile={false} aria-label="Example sidebar">
      <SidebarHeader>Orbit workspace</SidebarHeader>
      <SidebarContent aria-label="Workspace sections"><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel>{["Overview", "Projects", "Members"].map((label, index) => <SidebarItem key={label} icon={<span aria-hidden="true">{index + 1}</span>} href="#sidebar-example" active={active === label} onClick={(event) => { event.preventDefault(); setActive(label); }}>{label}</SidebarItem>)}</SidebarGroup></SidebarContent>
      <SidebarFooter>Personal workspace</SidebarFooter>
    </Sidebar>
    <p id="sidebar-example" role="status">Current section: {active}.</p>
  </div>;
}
