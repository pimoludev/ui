import { MotionCompatibilityExample } from "../motion-compatibility-example";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function SidebarPage() {
  return (
    <>
      <PageHeader
        title="Sidebar"
        hint="A complementary landmark with grouped navigation and a footer. Collapse it to keep icon shortcuts on desktop; on narrow screens, the toggle opens the full navigation. Active links expose aria-current."
      />

      <Section
        title="Dashboard"
        hint="Collapse the navigation to give the content more room. On narrow screens, the navigation stacks above the content."
      >
        <div className="pg-sidebar-demo">
          <Sidebar sticky collapsible>
            <SidebarHeader>
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
                  href="#/overview"
                  active
                  icon={<span>◉</span>}
                >
                  Overview
                </SidebarItem>

                <SidebarItem
                  href="#/card"
                  icon={<span>▦</span>}
                >
                  Projects
                </SidebarItem>

                <SidebarItem
                  href="#/overview"
                  icon={<span>≈</span>}
                >
                  Activity
                </SidebarItem>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>

                <SidebarItem href="#/overview">
                  Members
                </SidebarItem>

                <SidebarItem href="#/overview">
                  Billing
                </SidebarItem>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarItem href="#/overview">
                Ada Lovelace
              </SidebarItem>
            </SidebarFooter>
          </Sidebar>

          <div className="pg-stack">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  The content area scrolls independently from
                  the navigation.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="pg-copy">
                  A sidebar is a complementary landmark: the
                  surrounding page remains the main content, and
                  the navigation inside is a named nav.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active state</CardTitle>
                <CardDescription>
                  aria-current="page" marks the current item.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="pg-copy">
                  The active item uses the muted surface and the
                  foreground colour; the others stay muted until
                  hover or focus.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
      <MotionCompatibilityExample target="Sidebar" />
    </>
  );
}
