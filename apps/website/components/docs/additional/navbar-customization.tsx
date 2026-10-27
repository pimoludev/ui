"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  Button
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >surface</span>
              <Navbar
                appearance="surface"
                bordered={true}
                collapsible
                classNames={{
                  root: "custom-navbar-root",
                  content: "custom-navbar-content"
                }}
              >
                <NavbarBrand
                  href="#/navbar"
                >
                  Pimolu
                </NavbarBrand>
                <NavbarToggle />
                <NavbarContent
                  aria-label="surface navigation"
                >
                  <NavbarItem
                    href="#/navbar"
                    active
                  >
                    Overview
                  </NavbarItem>
                  <NavbarItem
                    href="#/button"
                  >
                    Components
                  </NavbarItem>
                </NavbarContent>
                <NavbarActions>
                  <Button
                    size="sm"
                  >
                    Get started
                  </Button>
                </NavbarActions>
              </Navbar>
            </div>
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >transparent</span>
              <Navbar
                appearance="transparent"
                bordered={false}
                collapsible
                classNames={{
                  root: "custom-navbar-root",
                  content: "custom-navbar-content"
                }}
              >
                <NavbarBrand
                  href="#/navbar"
                >
                  Pimolu
                </NavbarBrand>
                <NavbarToggle />
                <NavbarContent
                  aria-label="transparent navigation"
                >
                  <NavbarItem
                    href="#/navbar"
                    active
                  >
                    Overview
                  </NavbarItem>
                  <NavbarItem
                    href="#/button"
                  >
                    Components
                  </NavbarItem>
                </NavbarContent>
                <NavbarActions>
                  <Button
                    size="sm"
                  >
                    Get started
                  </Button>
                </NavbarActions>
              </Navbar>
            </div>
            <div className="grid gap-5 min-w-0">
              <span
                className="text-sm text-muted leading-relaxed"
              >floating</span>
              <Navbar
                appearance="floating"
                bordered={true}
                collapsible
                classNames={{
                  root: "custom-navbar-root",
                  content: "custom-navbar-content"
                }}
              >
                <NavbarBrand
                  href="#/navbar"
                >
                  Pimolu
                </NavbarBrand>
                <NavbarToggle />
                <NavbarContent
                  aria-label="floating navigation"
                >
                  <NavbarItem
                    href="#/navbar"
                    active
                  >
                    Overview
                  </NavbarItem>
                  <NavbarItem
                    href="#/button"
                  >
                    Components
                  </NavbarItem>
                </NavbarContent>
                <NavbarActions>
                  <Button
                    size="sm"
                  >
                    Get started
                  </Button>
                </NavbarActions>
              </Navbar>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-navbar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-navbar-content {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
