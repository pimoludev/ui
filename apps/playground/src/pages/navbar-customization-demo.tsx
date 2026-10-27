"use client";

import {
  navbarVariantMap,
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  Button
} from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              Object.keys(navbarVariantMap.appearance).map((value) => {
                const appearance = value as keyof typeof navbarVariantMap.appearance; return (
                  <div
                    key={value}
                    className="pg-stack"
                  >
                    <span
                      className="pg-meta"
                    >{
                        value
                      }</span>
                    <Navbar
                      appearance={appearance}
                      bordered={appearance !== "transparent"}
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
                        aria-label={`${appearance} navigation`}
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
                );
              })
            }
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
    </>
  );
}
