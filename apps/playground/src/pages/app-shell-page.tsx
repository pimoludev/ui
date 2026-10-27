import { CustomizationExample } from "./app-shell-customization-demo";
import {
  Avatar,
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  Stat,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";
import { DemoNavIcon } from "../demo-nav-icon";

function ShellHeader() {
  return (
    <div
      className="pg-row pg-row--between"
      style={{ flexWrap: "wrap" }}
    >
      <div className="pg-row">
        <span className="pg-brand__mark">P</span>

        <div>
          <strong className="pg-brand__name">
            Acme Console
          </strong>
          <span className="pg-brand__tag">
            Operations workspace
          </span>
        </div>
      </div>

      <div className="pg-row">
        <Badge variant="success">Live</Badge>

        <Button size="sm" appearance="outline">
          Search
        </Button>

        <Button size="sm">New project</Button>
      </div>
    </div>
  );
}

function WorkspaceSidebar({ compact = false }: { compact?: boolean }) {
  return (
    <Sidebar collapsible>
      <SidebarHeader collapsedContent={<Avatar name="Pimolu" size="sm" />}>
        <span className="pg-brand__mark">A</span>

        <div>
          <strong className="pg-brand__name">Acme</strong>
          <span className="pg-brand__tag">
            {compact ? "Team" : "Design system"}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent aria-label="Workspace">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarItem href="#/app-shell" active icon={<DemoNavIcon name="overview" />}>
            Overview
          </SidebarItem>
          <SidebarItem href="#/data-table" icon={<DemoNavIcon name="projects" />}>Projects</SidebarItem>
          <SidebarItem href="#/stat" icon={<DemoNavIcon name="analytics" />}>Analytics</SidebarItem>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarItem href="#/form-field" icon={<DemoNavIcon name="billing" />}>Billing</SidebarItem>
          <SidebarItem href="#/dialog" icon={<DemoNavIcon name="settings" />}>Settings</SidebarItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter collapsedContent={<Avatar name="Ada Lovelace" size="sm" />}>
        <span className="pg-meta">Acme Inc. · Pro plan</span>
      </SidebarFooter>
    </Sidebar>
  );
}

const activity = [
  {
    name: "Ada Lovelace",
    action: "shipped the Q3 report",
    time: "8 min",
  },
  {
    name: "Noah Dubois",
    action: "invited three teammates",
    time: "26 min",
  },
  {
    name: "Maya Chen",
    action: "connected a data source",
    time: "1 h",
  },
];

function WorkspaceAside() {
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

function WorkspaceContent({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <div>
          <h2 className="pg-section__title">
            Workspace overview
          </h2>
          <p className="pg-copy">
            {compact
              ? "The same shell without a sidebar or right rail."
              : "A full-width header and footer around a navigation rail, the main region and a contextual aside."}
          </p>
        </div>

        <Badge variant="primary">Q3</Badge>
      </div>

      <Grid
        columns="auto-fit"
        minItemWidth={170}
        gap={3}
      >
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
              label="Open tasks"
              value="24"
              delta="+3"
              trend="up"
              description="Across six projects"
            />
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Release readiness</CardTitle>
          <CardDescription>
            Main content is a real landmark; any component can
            live inside it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="pg-stack">
            <div className="pg-row pg-row--between">
              <span>Design tokens</span>
              <Badge variant="success">Ready</Badge>
            </div>

            <div className="pg-row pg-row--between">
              <span>Documentation</span>
              <Badge variant="warning">Review</Badge>
            </div>

            <div className="pg-row pg-row--between">
              <span>Native screens</span>
              <Badge variant="neutral">Draft</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShellFooter() {
  return (
    <div className="pg-row pg-row--between">
      <span>Acme Inc. · Internal workspace</span>
      <span>All systems operational</span>
    </div>
  );
}

export function AppShellPage() {
  return (
    <>
      <PageHeader
        title="AppShell"
        hint="A generic application frame: a full-width header and footer around an optional sidebar, the main region and an optional aside. Unlike DashboardLayout, the chrome spans the whole viewport and the header is required. Styles come from @pimolu/web-styles/app-shell.css."
      />

      <Section
        title="Full application chrome"
        hint="The header and footer span every column, the sidebar sits under the header and the aside is a second labelled complementary landmark. The header stays pinned while the main content scrolls."
      >
        <AppShell
          header={<ShellHeader />}
          sidebar={<WorkspaceSidebar />}
          aside={<WorkspaceAside />}
          footer={<ShellFooter />}
          stickyHeader
          sidebarWidth="15rem"
          asideWidth="16rem"
          sidebarLabel="Workspace navigation"
          asideLabel="Recent activity"
          style={{ minHeight: 640 }}
        >
          <WorkspaceContent />
        </AppShell>
      </Section>

      <Section
        title="Main content only"
        hint="Both rails are optional. The shell collapses to a single column while keeping the header, main and footer landmarks."
      >
        <AppShell
          header={<ShellHeader />}
          footer={<ShellFooter />}
          style={{ minHeight: 420 }}
        >
          <WorkspaceContent compact />
        </AppShell>
      </Section>

      <Section
        title="Custom rail widths"
        hint="sidebarWidth and asideWidth accept any CSS length or a number of pixels. The shell sets the matching custom properties."
      >
        <AppShell
          header={<ShellHeader />}
          sidebar={<WorkspaceSidebar compact />}
          aside={<WorkspaceAside />}
          sidebarWidth={200}
          asideWidth="14rem"
          style={{ minHeight: 520 }}
        >
          <WorkspaceContent />
        </AppShell>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
