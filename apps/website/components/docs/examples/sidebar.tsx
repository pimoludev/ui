"use client";

import { useState } from "react";
import { Avatar, Badge, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarItem } from "@pimolu/react";

export function SidebarExample() {
  const [active, setActive] = useState("Overview");
  const descriptions: Record<string, string> = {
    Overview: "Your projects, people and delivery milestones in one place.",
    Projects: "Keep the design system, website and documentation moving together.",
    Members: "A shared workspace for designers, engineers and reviewers.",
  };
  return <div className="grid min-h-80 overflow-hidden rounded-xl border border-[var(--pimolu-border)] md:grid-cols-[auto_minmax(0,1fr)]">
    <Sidebar collapsible aria-label="Example sidebar">
      <SidebarHeader><Avatar name="Orbit" size="sm" /><strong>Orbit workspace</strong></SidebarHeader>
      <SidebarContent aria-label="Workspace sections"><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel>{["Overview", "Projects", "Members"].map((label, index) => <SidebarItem key={label} icon={
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={[
            "M3 10l9-7 9 7v10H3z M9 20v-7h6v7",
            "M3 7h7l2-3h9v16H3z",
            "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
          ][index]} />
        </svg>
      } href="#sidebar-example" active={active === label} onClick={(event) => { event.preventDefault(); setActive(label); }}>{label}</SidebarItem>)}</SidebarGroup></SidebarContent>
      <SidebarFooter>Personal workspace</SidebarFooter>
    </Sidebar>
    <section id="sidebar-example" className="space-y-4 p-6" aria-live="polite">
      <Badge variant="neutral">Workspace</Badge>
      <h2 className="text-xl font-semibold">{active}</h2>
      <p className="text-sm text-[var(--pimolu-muted-foreground)]">{descriptions[active]}</p>
    </section>
  </div>;
}
