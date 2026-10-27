"use client";

import {
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
  CardContent
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="min-h-[420px]">
            <Sidebar
              sticky
              collapsible
              classNames={{
                root: "custom-sidebar-root",
                label: "custom-sidebar-label"
              }}
            >
              <SidebarHeader collapsedContent={<Avatar name="Pimolu" size="sm" />}>
                <span
                  className="grid place-items-center size-9 rounded-md bg-primary text-[var(--pimolu-primary-foreground)]"
                >P</span>
                <div>
                  <strong className="block">Pimolu</strong>
                  <span className="text-xs text-muted">Workspace</span>
                </div>
              </SidebarHeader>
              <SidebarContent aria-label="Workspace">
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarItem href="#/overview" active icon={<span>◉</span>}>Overview</SidebarItem>
                  <SidebarItem href="#/card" icon={<span>▦</span>}>Projects</SidebarItem>
                  <SidebarItem href="#/overview" icon={<span>≈</span>}>Activity</SidebarItem>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel>Settings</SidebarGroupLabel>
                  <SidebarItem href="#/overview">Members</SidebarItem>
                  <SidebarItem href="#/overview">Billing</SidebarItem>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter
                collapsedContent={<Avatar name="Ada Lovelace" size="sm" />}
              >
                <SidebarItem href="#/overview">Ada Lovelace</SidebarItem>
              </SidebarFooter>
            </Sidebar>
            <div className="grid gap-5 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    The content area scrolls independently from the navigation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="max-w-prose leading-relaxed">
                    A sidebar is a complementary landmark: the surrounding page
                    remains the main content, and the navigation inside is a named
                    nav.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active state</CardTitle>
                  <CardDescription>aria-current=&quot;page&quot; marks the current item.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="max-w-prose leading-relaxed">
                    The active item uses the muted surface and the foreground
                    colour; the others stay muted until hover or focus.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-sidebar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-sidebar-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
