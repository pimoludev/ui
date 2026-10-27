"use client";

import {
  AppShell,
  Badge,
  Button,
  Sidebar,
  SidebarHeader,
  Avatar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Grid,
  Stat
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
        <CardHeader>
          <CardTitle as="h2">Team activity</CardTitle>
          <CardDescription>The latest in your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pg-stack" style={{ gap: 20 }}>
            {
              activity.slice(0, 3).map((item) => (
                <div
                  key={item.name}
                  className="pg-row"
                  style={{
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    gap: 10
                  }}
                >
                  <Avatar name={item.name} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: "block",
                        fontSize: 13
                      }}
                    >{
                        item.name
                      }</strong>
                    <p
                      className="pg-meta"
                      style={{
                        margin: "4px 0",
                        lineHeight: 1.5
                      }}
                    >{
                        item.action
                      }</p>
                    <span
                      className="pg-meta"
                    >{
                        item.time
                      } ago</span>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Next milestone</CardTitle>
          <CardDescription>Design review, Friday at 10:00</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge
            variant="primary"
          >
            3 projects ready
          </Badge>
        </CardContent>
      </Card>
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
            {
              compact
                ? "The same shell without a sidebar or right rail."
                : (
                  "A full-width header and footer around a navigation rail, the " +
                  "main region and a contextual aside."
                )
            }
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
            Main content is a real landmark; any component can live inside
            it.
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

export function CustomizationExample() {

  return (
    <>
      {
        (<>
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
            classNames={{
              root: "custom-app-shell-root",
              header: "custom-app-shell-header"
            }}
          >
            <WorkspaceContent />
          </AppShell>
        </>)
      }
      <style>
        {
          `
.custom-app-shell-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-app-shell-header {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
