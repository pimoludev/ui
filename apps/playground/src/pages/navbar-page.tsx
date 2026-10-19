import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function DemoNavbar({ sticky = false }: { sticky?: boolean }) {
  return (
    <Navbar sticky={sticky}>
      <NavbarBrand href="#/overview">
        Pimolu UI
      </NavbarBrand>

      <NavbarContent aria-label="Demo site">
        <NavbarItem href="#/overview" active>
          Docs
        </NavbarItem>

        <NavbarItem href="#/card">Components</NavbarItem>
        <NavbarItem href="#/overview">Pricing</NavbarItem>
      </NavbarContent>

      <NavbarActions>
        <Button size="sm" appearance="ghost">
          Sign in
        </Button>

        <Button size="sm">Get started</Button>
      </NavbarActions>
    </Navbar>
  );
}

export function NavbarPage() {
  return (
    <>
      <PageHeader
        title="Navbar"
        hint="A banner with a brand, a navigation landmark and trailing actions. The active link gets aria-current, sticky mode can keep it at the top, and the content wraps on narrow screens. Styles come from @pimolu/web-styles/navbar.css."
      />

      <Section
        title="Basic"
        hint="Brand, links and actions; the active link is marked for assistive technology."
      >
        <Card>
          <CardContent>
            <DemoNavbar />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Sticky"
        hint="Inside a scroll container, the bar stays pinned while the content moves."
      >
        <div className="pg-scroll-demo">
          <DemoNavbar sticky />

          <div className="pg-stack">
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index} className="pg-copy">
                Section {index + 1}. Scroll this container to see
                the sticky bar stay at the top.
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Composition"
        hint="The brand is an anchor, the content is a named nav, and the actions can be any control."
      >
        <Card>
          <CardHeader>
            <CardTitle>Dashboard header</CardTitle>
            <CardDescription>
              A full-width bar above the workspace.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Navbar>
              <NavbarBrand href="#/overview">
                <span className="pg-brand__mark">P</span>
                Acme
              </NavbarBrand>

              <NavbarContent aria-label="Workspace">
                <NavbarItem href="#/overview" active>
                  Overview
                </NavbarItem>
                <NavbarItem href="#/overview">Projects</NavbarItem>
                <NavbarItem href="#/overview">Activity</NavbarItem>
              </NavbarContent>

              <NavbarActions>
                <Button size="sm" appearance="outline">
                  Invite
                </Button>
              </NavbarActions>
            </Navbar>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
