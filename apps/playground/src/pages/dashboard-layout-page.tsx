import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardLayout,
  Grid,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  Stat,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";
import { DemoNavIcon } from "../demo-nav-icon";

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
          <SidebarItem href="#/dashboard-layout" active icon={<DemoNavIcon name="overview" />}>
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

const activity = [
  {
    name: "Ada Lovelace",
    action: "published the Q3 report",
    time: "12 min",
  },
  {
    name: "Noah Dubois",
    action: "invited two teammates",
    time: "38 min",
  },
  {
    name: "Maya Chen",
    action: "changed the workspace plan",
    time: "1 h",
  },
  {
    name: "Liam O’Connor",
    action: "connected a data source",
    time: "2 h",
  },
];

function DashboardContent() {
  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <div>
          <h2 className="pg-section__title">Workspace overview</h2>
          <p className="pg-copy">
            A compact dashboard with a persistent sidebar, a
            centered navbar and an optional right rail.
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
            The dashboard content can use Table, DataTable or
            any other component.
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

function DashboardAside() {
  return (
    <div className="pg-stack" style={{ gap: 16 }}>
      <Card>
        <CardHeader><CardTitle as="h2">Team activity</CardTitle><CardDescription>The latest in your workspace.</CardDescription></CardHeader>
        <CardContent>
          <div className="pg-stack" style={{ gap: 20 }}>
            {activity.slice(0, 3).map((item) => (
              <div key={item.name} className="pg-row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 10 }}>
                <Avatar name={item.name} size="sm" />
                <div style={{ minWidth: 0 }}><strong style={{ display: "block", fontSize: 13 }}>{item.name}</strong><p className="pg-meta" style={{ margin: "4px 0", lineHeight: 1.5 }}>{item.action}</p><span className="pg-meta">{item.time} ago</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle as="h2">Next milestone</CardTitle><CardDescription>Design review, Friday at 10:00</CardDescription></CardHeader><CardContent><Badge variant="primary">3 projects ready</Badge></CardContent></Card>
    </div>
  );
}

export function DashboardLayoutPage() {
  return (
    <>
      <PageHeader
        title="DashboardLayout"
        hint="A full-width application shell with a persistent sidebar, a top navbar, a main content region and an optional right rail. The existing Sidebar and Navbar components slot directly into it. Styles come from @pimolu/web-styles/dashboard-layout.css."
      />

      <Section
        title="Sidebar and navbar"
        hint="The sidebar stays visible while the main content scrolls. The right rail is optional and shown in the next example."
      >
        <DashboardLayout
          sidebar={<DashboardSidebar />}
          navbar={<DashboardNavbar />}
          stickySidebar
          stickyNavbar
          sidebarWidth="14rem"
          style={{ minHeight: 720 }}
        >
          <DashboardContent />
        </DashboardLayout>
      </Section>

      <Section
        title="With a right rail"
        hint="At narrow widths, the sidebar collapses and stacks above the content. The right rail remains available below the main region."
      >
        <DashboardLayout
          sidebar={<DashboardSidebar />}
          aside={<DashboardAside />}
          asideLabel="Recent activity"
          sidebarWidth="12rem"
          asideWidth={240}
          style={{ minHeight: 620 }}
        >
          <DashboardContent />
        </DashboardLayout>
      </Section>

      <Section
        title="Main content only"
        hint="Both sidebar and aside are optional; the layout collapses to a single main region and the navbar can still be sticky."
      >
        <DashboardLayout
          navbar={
            <Navbar bordered={false}>
              <NavbarBrand href="#/dashboard-layout">
                Reports
              </NavbarBrand>
              <NavbarActions>
                <Button size="sm" appearance="outline">
                  Export
                </Button>
              </NavbarActions>
            </Navbar>
          }
          stickyNavbar
          style={{ minHeight: 320 }}
        >
          <div className="pg-stack">
            <h2 className="pg-section__title">Q3 report</h2>
            <p className="pg-copy">
              No sidebar or aside is rendered. The layout keeps
              the main landmark and the same responsive rules.
            </p>
            <Badge variant="neutral">Draft</Badge>
          </div>
        </DashboardLayout>
      </Section>

      <Section
        title="Custom width"
        hint="sidebarWidth and asideWidth accept CSS lengths and numbers (pixels); this example narrows the sidebar."
      >
        <DashboardLayout
          sidebar={<DashboardSidebar />}
          sidebarWidth="14rem"
          style={{ minHeight: 420 }}
        >
          <DashboardContent />
        </DashboardLayout>
      </Section>
    </>
  );
}
