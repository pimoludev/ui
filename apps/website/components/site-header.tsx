"use client";

import { usePathname } from "next/navigation";
import { SiteSearchTrigger } from "./site-search";
import { SiteAppearance } from "./site-appearance";
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions, NavbarToggle,
} from "@pimolu/react";

const navigation = [
  { href: "/docs", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/blog", label: "Blog" },
  { href: "/releases", label: "Releases" },
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
        </NavbarContent>
        <NavbarActions className="flex-nowrap">
          <SiteSearchTrigger />
          <SiteAppearance />
          <NavbarItem href="https://github.com/pimoludev/ui" target="_blank" rel="noopener noreferrer">GitHub ↗</NavbarItem>
        </NavbarActions>
      </Navbar>
    </div>
  );
}
