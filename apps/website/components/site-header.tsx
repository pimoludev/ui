"use client";

import { usePathname } from "next/navigation";
import { SiteSearchTrigger } from "./site-search";
import { SiteAppearance } from "./site-appearance";
import { SocialIcon } from "./social-icon";
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions, NavbarToggle,
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink,
} from "@pimolu/react";

const navigation = [
  { href: "/docs", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/showcase", label: "Showcase" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <div className="site-header">
      <Navbar key={path} appearance="transparent" bordered={false} collapsible className="site-nav mx-auto w-full max-w-7xl">
        <NavbarBrand href="/" aria-label="Pimolu UI home">
          <span className="site-mark" aria-hidden="true" />
          <span>Pimolu<span className="site-wordmark-suffix"> UI</span></span>
        </NavbarBrand>
        <div className="site-search-mobile"><SiteSearchTrigger /><SiteAppearance /></div>
        <NavbarToggle openLabel="Open navigation" closeLabel="Close navigation" />
        <NavbarContent aria-label="Main navigation">
          {navigation.map(({ href, label }) => (
            <NavbarItem key={href} href={href} active={path === href || path.startsWith(`${href}/`)}>{label}</NavbarItem>
          ))}
          <NavigationMenu openOnHover label="Resources" className="site-resources">
            <NavigationMenuList>
              <NavigationMenuItem value="resources" className={/^\/(blog|releases)(\/|$)/.test(path) ? "site-resources-active" : undefined}>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="/blog" active={path.startsWith("/blog")}>
                    <span className="site-resource-title">Blog</span>
                    <span className="site-resource-description">Design decisions and engineering notes.</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/releases" active={path.startsWith("/releases")}>
                    <span className="site-resource-title">Releases</span>
                    <span className="site-resource-description">What’s new, improved and ready to use.</span>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </NavbarContent>
        <NavbarActions className="flex-nowrap">
          <SiteSearchTrigger />
          <SiteAppearance />
          <NavbarItem className="site-social-link" href="https://discord.gg/b2UDyvKAcH" aria-label="Discord" title="Discord" target="_blank" rel="noopener noreferrer"><SocialIcon name="Discord" /></NavbarItem>
          <NavbarItem className="site-social-link" href="https://github.com/pimoludev/ui" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener noreferrer"><SocialIcon name="GitHub" /></NavbarItem>
          <NavbarItem className="site-social-link" href="https://www.npmjs.com/org/pimolu" aria-label="Pimolu packages on npm" title="Pimolu packages on npm" target="_blank" rel="noopener noreferrer"><SocialIcon name="npm" /></NavbarItem>
        </NavbarActions>
      </Navbar>
    </div>
  );
}
