import { CustomizationExample } from "./navigation-menu-customization-demo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function NavigationMenuPage() {
  return (
    <>
      <PageHeader
        title="NavigationMenu"
        hint="A horizontal navigation with disclosure panels. Triggers expose aria-expanded, panels close on Escape or an outside click, ArrowDown opens and focuses the first link, and the active link carries aria-current. Styles come from @pimolu/web-styles/navigation-menu.css."
      />

      <Section
        title="Basic"
        hint="Two menus and a direct link. Click a trigger to open its panel."
      >
        <Card>
          <CardContent>
            <NavigationMenu aria-label="Documentation">
              <NavigationMenuList>
                <NavigationMenuItem value="docs">
                  <NavigationMenuTrigger>
                    Documentation
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <NavigationMenuLink
                      href="#/overview"
                      active
                    >
                      Overview
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/button">
                      Components
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/code">
                      Code & Kbd
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem value="resources">
                  <NavigationMenuTrigger>
                    Resources
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <NavigationMenuLink href="#/typography">
                      Typography
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/themes">
                      Themes
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/card">
                      Playground
                    </NavigationMenuLink>
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
      </Section>

      <Section
        title="Composition"
        hint="The menu can sit inside a navbar or a page header; the panel is positioned under its item."
      >
        <Card>
          <CardHeader>
            <CardTitle>Product navigation</CardTitle>
            <CardDescription>
              Two panels with a current link and a direct
              destination.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <NavigationMenu aria-label="Product">
              <NavigationMenuList>
                <NavigationMenuItem value="product">
                  <NavigationMenuTrigger>
                    Product
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <NavigationMenuLink href="#/card">
                      Components
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/themes">
                      Themes
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/overview">
                      Changelog
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem value="company">
                  <NavigationMenuTrigger>
                    Company
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <NavigationMenuLink href="#/overview">
                      About
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/overview">
                      Careers
                    </NavigationMenuLink>

                    <NavigationMenuLink href="#/overview">
                      Contact
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
