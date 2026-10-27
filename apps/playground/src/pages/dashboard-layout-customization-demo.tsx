"use client";

import {
  DashboardLayout,
  Sidebar,
  SidebarHeader,
  Avatar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  Button,
  Badge,
  Grid,
  Card,
  CardContent,
  Stat,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@pimolu/react";
import { type ReactNode } from "react";

type DemoNavIconName = "overview" | "projects" | "people" | "analytics" | "billing" | "settings";

const paths: Record<DemoNavIconName, ReactNode> = {
  overview: <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
  </>,
  projects: <>
    <rect x="3" y="6" width="18" height="15" rx="2" />
    <path
      d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"
    />
  </>,
  people: <>
    <circle cx="9" cy="8" r="3" />
    <path
      d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M17 5a3 3 0 0 1 0 6m2.5 9v-2a5.5 5.5 0 0 0-3-5"
    />
  </>,
  analytics: <>
    <path d="M4 20V12m5 8V7m5 13v-5m5 5V4" strokeLinecap="round" />
    <path
      d="M2 21h20"
    />
  </>,
  billing: <>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path
      d="M2.5 9.5h19M6 15h4"
    />
  </>,
  settings: <>
    <circle cx="12" cy="12" r="3" />
    <path
      d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"
      strokeLinecap="round"
    />
  </>,
};

function DemoNavIcon({ name }: { name: DemoNavIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function DashboardSidebar() {
  return (
    <Sidebar collapsible>
      <SidebarHeader collapsedContent={<Avatar name="Pimolu" size="sm" />}>
        <span className="pg-brand__mark">P</span>
        <div>
          <strong className="pg-brand__name">Pimolu</strong>
          <span className="pg-brand__tag">Workspace</span>
        </div>
      </SidebarHeader>
      <SidebarContent aria-label="Workspace">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarItem
            href="#/dashboard-layout"
            active
            icon={<DemoNavIcon
              name="overview"
            />}
          >
            Overview
          </SidebarItem>
          <SidebarItem href="#/data-table" icon={<DemoNavIcon name="people" />}>Members</SidebarItem>
          <SidebarItem href="#/stat" icon={<DemoNavIcon name="analytics" />}>Analytics</SidebarItem>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarItem href="#/form-field" icon={<DemoNavIcon name="billing" />}>Billing</SidebarItem>
          <SidebarItem href="#/dialog" icon={<DemoNavIcon name="settings" />}>Preferences</SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter collapsedContent={<Avatar name="Ada Lovelace" size="sm" />}>
        <span className="pg-meta">Acme Inc. · Free plan</span>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardNavbar() {
  return (
    <Navbar bordered={false} itemsPosition="center" collapsible>
      <NavbarBrand href="#/dashboard-layout">Dashboard</NavbarBrand>
      <NavbarToggle />
      <NavbarContent aria-label="Dashboard navigation">
        <NavbarItem href="#/dashboard-layout" active>
          Overview
        </NavbarItem>
        <NavbarItem href="#/data-table">Reports</NavbarItem>
        <NavbarItem href="#/stat">Settings</NavbarItem>
      </NavbarContent>
      <NavbarActions>
        <Button size="sm" appearance="outline">
          Invite
        </Button>
        <Button size="sm">New report</Button>
      </NavbarActions>
    </Navbar>
  );
}

function DashboardContent() {
  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <div>
          <h2 className="pg-section__title">Workspace overview</h2>
          <p className="pg-copy">
            A compact dashboard with a persistent sidebar, a centered navbar
            and an optional right rail.
          </p>
        </div>
        <Badge variant="success" style={{ flex: "none" }}>
          Live
        </Badge>
      </div>
      <Grid columns="auto-fit" minItemWidth={170} gap={3}>
        <Card>
          <CardContent>
            <Stat
              label="Monthly revenue"
              value="$48,200"
              delta="+12.4%"
              trend="up"
              description="Compared with September"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stat
              label="Active users"
              value="12,840"
              delta="+8.2%"
              trend="up"
              description="7,310 weekly active"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stat
              label="Churn"
              value="2.1%"
              delta="-0.4 pts"
              trend="down"
              description="Lower is better"
            />
          </CardContent>
        </Card>
      </Grid>
      <Card>
        <CardHeader>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>
            The dashboard content can use Table, DataTable or any other
            component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table density="sm" style={{ minWidth: 560 }}>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Design tokens</TableCell>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell>12 min ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mobile navigation</TableCell>
                <TableCell>Noah Dubois</TableCell>
                <TableCell>
                  <Badge variant="warning">Review</Badge>
                </TableCell>
                <TableCell>38 min ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Data platform</TableCell>
                <TableCell>Maya Chen</TableCell>
                <TableCell>
                  <Badge variant="neutral">Draft</Badge>
                </TableCell>
                <TableCell>2 h ago</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <DashboardLayout
            sidebar={<DashboardSidebar />}
            navbar={<DashboardNavbar />}
            stickySidebar
            stickyNavbar
            sidebarWidth="14rem"
            style={{ minHeight: 720 }}
            classNames={{
              root: "custom-dashboard-layout-root",
              content: "custom-dashboard-layout-content"
            }}
          >
            <DashboardContent />
          </DashboardLayout>
        </>)
      }
      <style>
        {
          `
.custom-dashboard-layout-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-dashboard-layout-content {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
