"use client";

import { useState } from "react";
import {
  Avatar, Badge, Card, CardContent, CircularProgress, DashboardLayout, Navbar,
  NavbarActions, NavbarBrand, PageHeader, Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarItem, Stat, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@pimolu/react";

export function DashboardLayoutExample() {
  const [active, setActive] = useState("Overview");
  const projects = [
    { name: "Design system", owner: "Maya Chen", progress: 72, review: false },
    { name: "Documentation", owner: "Noah Dubois", progress: 45, review: true },
    { name: "Website", owner: "Ada Martin", progress: 90, review: false },
  ];
  return <DashboardLayout style={{ minHeight: 620 }} sidebarWidth="13rem" sidebar={
    <Sidebar collapsible>
      <SidebarHeader collapsedContent={<Avatar name="Orbit" size="sm" />}><Avatar name="Orbit" size="sm" /><strong>Orbit</strong></SidebarHeader><SidebarContent aria-label="Dashboard sections">{["Overview", "Projects"].map((label) => <SidebarItem key={label} href="#dashboard-content" active={active === label} icon={<span aria-hidden="true">◇</span>} onClick={(event) => { event.preventDefault(); setActive(label); }}>{label}</SidebarItem>)}</SidebarContent><SidebarFooter collapsedContent={<Avatar name="Maya Chen" size="sm" />}><div className="flex items-center gap-2"><Avatar name="Maya Chen" size="sm" /><span>Maya Chen</span></div></SidebarFooter>
    </Sidebar>
  } navbar={<Navbar><NavbarBrand href="#dashboard-content">Your workspace</NavbarBrand><NavbarActions><Avatar name="Maya Chen" size="sm" /></NavbarActions></Navbar>}>
    <div id="dashboard-content" className="space-y-6">
      <PageHeader size="sm" titleAs="h2" eyebrow="Orbit workspace" title={active}
        description="Keep delivery, ownership and the next milestones in view."
        meta={<Badge variant="neutral">Local demo</Badge>} />
      {active === "Overview" && <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent><Stat label="Active projects" value={String(projects.length)} description="Across the workspace" /></CardContent></Card>
        <Card><CardContent><Stat label="Needs review" value={String(projects.filter((project) => project.review).length)} description="Ready for a second look" /></CardContent></Card>
        <Card><CardContent><Stat label="Average completion"
          value={`${Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)}%`}
          description="Across these three projects" /></CardContent></Card>
      </div>}
      <Card><CardContent>
        <Table aria-label="Workspace projects" density="sm" style={{ minWidth: 560 }}>
          <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead><TableHead>Completion</TableHead></TableRow></TableHeader>
          <TableBody>{projects.map((project) => <TableRow key={project.name}>
            <TableCell>{project.name}</TableCell><TableCell>{project.owner}</TableCell>
            <TableCell><Badge variant={project.review ? "warning" : "success"}>{project.review ? "Review" : "Active"}</Badge></TableCell>
            <TableCell><CircularProgress size="sm" value={project.progress} showValue label={`${project.name} completion`} /></TableCell>
          </TableRow>)}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  </DashboardLayout>;
}
