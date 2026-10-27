"use client";

import {
  Card,
  CardContent,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <Card>
            <CardContent>
              <NavigationMenu
                aria-label="Documentation"
                classNames={{
                  root: "custom-navigation-menu-root",
                  content: "custom-navigation-menu-content"
                }}
              >
                <NavigationMenuList>
                  <NavigationMenuItem value="docs">
                    <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink href="#/overview" active>Overview</NavigationMenuLink>
                      <NavigationMenuLink href="#/button">Components</NavigationMenuLink>
                      <NavigationMenuLink href="#/code">Code & Kbd</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem value="resources">
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink href="#/typography">Typography</NavigationMenuLink>
                      <NavigationMenuLink href="#/themes">Themes</NavigationMenuLink>
                      <NavigationMenuLink href="#/card">Playground</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem value="pricing">
                    <NavigationMenuLink
                      href="#/overview"
                      className="pimolu-navigation-menu__trigger"
                    >
                      Pricing
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CardContent>
          </Card>
        </>)
      }
      <style>
        {
          `
.custom-navigation-menu-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-navigation-menu-content {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
