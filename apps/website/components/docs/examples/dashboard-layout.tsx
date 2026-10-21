"use client";

import { useState } from "react";
import { Avatar, Card, CardContent, DashboardLayout, Navbar, NavbarActions, NavbarBrand, Sidebar, SidebarContent, SidebarHeader, SidebarItem, Stat } from "@pimolu/react";

export function DashboardLayoutExample() {
  const [active, setActive] = useState("Overview");
  return <DashboardLayout sidebarWidth="13rem" sidebar={
    <Sidebar collapsible collapseOnMobile={false}>
      <SidebarHeader>Orbit</SidebarHeader><SidebarContent aria-label="Dashboard sections">{["Overview", "Projects"].map((label) => <SidebarItem key={label} href="#dashboard-content" active={active === label} icon={<span aria-hidden="true">◇</span>} onClick={(event) => { event.preventDefault(); setActive(label); }}>{label}</SidebarItem>)}</SidebarContent>
    </Sidebar>
  } navbar={<Navbar><NavbarBrand href="#dashboard-content">Your workspace</NavbarBrand><NavbarActions><Avatar name="Maya Chen" size="sm" /></NavbarActions></Navbar>}>
    <div id="dashboard-content" className="p-5 space-y-5"><h2 className="text-2xl">{active}</h2><Card size="lg"><CardContent><Stat label="Projects taking shape" value="12" description="One idea at a time." /></CardContent></Card><p>Compose the regions, then let your application own the content.</p></div>
  </DashboardLayout>;
}
