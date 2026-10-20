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
  NavbarToggle,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

import "./navbar-page.css";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function CustomMenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="6" cy="6" r="1" /><circle cx="18" cy="6" r="1" />
      <circle cx="6" cy="18" r="1" /><circle cx="18" cy="18" r="1" />
    </svg>
  );
}

function CustomCloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5 19 19M19 5 5 19" />
    </svg>
  );
}

function DemoNavbar({ sticky = false }: { sticky?: boolean }) {
  return (
    <Navbar sticky={sticky} collapsible>
      <NavbarBrand href="#/overview">
        Pimolu UI
      </NavbarBrand>

      <NavbarToggle />

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

function PositionNavbar({
  position,
}: {
  position: "left" | "center" | "right";
}) {
  return (
    <div className="pg-navbar-preview">
      <p className="pg-navbar-preview__label">{position}</p>

      <div className="pg-navbar-preview__frame pg-navbar-preview__frame--wide">
        <Navbar itemsPosition={position}>
          <NavbarBrand href="#/navbar">Atlas</NavbarBrand>

          <NavbarContent aria-label={`${position} navigation`}>
            <NavbarItem href="#/navbar" active>
              Overview
            </NavbarItem>
            <NavbarItem href="#/navbar">Projects</NavbarItem>
            <NavbarItem href="#/navbar">Reports</NavbarItem>
          </NavbarContent>

          <NavbarActions>
            <Button size="sm" appearance="outline">
              Sign in
            </Button>
          </NavbarActions>
        </Navbar>
      </div>
    </div>
  );
}

function MobileNavbarDemo({ customIcon = false }: { customIcon?: boolean }) {  return (
    <div className="pg-navbar-preview">
      <p className="pg-navbar-preview__label">
        {customIcon ? "Custom menu icon" : "Default hamburger"}
      </p>
      <div className="pg-navbar-preview__frame">
        <Navbar collapsible>
          <NavbarBrand href="#/navbar">Atlas</NavbarBrand>
          <NavbarToggle
            icon={customIcon ? <CustomMenuIcon /> : undefined}
            closeIcon={customIcon ? <CustomCloseIcon /> : undefined}
          />
          <NavbarContent aria-label="Atlas navigation">
            <NavbarItem href="#/navbar" icon={<HomeIcon />} active>Home</NavbarItem>
            <NavbarItem href="#/navbar">Products</NavbarItem>
            <NavbarItem href="#/navbar">About</NavbarItem>
          </NavbarContent>
          <NavbarActions>
            <Button size="sm" appearance="outline">Sign in</Button>
            <Button size="sm">Get started</Button>
          </NavbarActions>
        </Navbar>
      </div>
    </div>
  );
}

export function NavbarPage() {
  return (
    <>
      <PageHeader
        title="Navbar"
        hint="A banner with a brand, a navigation landmark and trailing actions. Add NavbarToggle and collapsible for a mobile menu with a default or custom icon. Styles come from @pimolu/web-styles/navbar.css."
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
        title="Mobile menu"
        hint="Both examples use the same Navbar API. Open the menu to see links and actions; selecting a link closes it. The layout responds to the navbar's own width."
      >
        <div className="pg-navbar-preview-grid">
          <MobileNavbarDemo />
          <MobileNavbarDemo customIcon />
        </div>
      </Section>

      <Section
        title="Item position"
        hint="itemsPosition moves the navigation cluster while the brand stays at the start and the actions stay at the end. Defaults to left."
      >
        <div className="pg-stack">
          <PositionNavbar position="left" />
          <PositionNavbar position="center" />
          <PositionNavbar position="right" />
        </div>
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
            <Navbar collapsible>
              <NavbarBrand href="#/overview">
                <span className="pg-brand__mark">P</span>
                Acme
              </NavbarBrand>

              <NavbarToggle />

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
