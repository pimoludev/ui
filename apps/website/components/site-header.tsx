"use client";

import { usePathname } from "next/navigation";
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions, NavbarToggle,
  Select, usePimoluTheme, type PimoluThemeMode,
} from "@pimolu/react";

const navigation = [
  { href: "/docs", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/themes", label: "Themes" },
  { href: "/releases", label: "Releases" },
];

export function SiteHeader() {
  const path = usePathname();
  const { theme, setTheme } = usePimoluTheme();
  return (
    <div className="site-header">
      <Navbar key={path} appearance="transparent" bordered={false} collapsible className="site-nav mx-auto w-full max-w-7xl">
        <NavbarBrand href="/" aria-label="Pimolu UI home">
          <span className="site-mark" aria-hidden="true">p</span>
          <span>Pimolu<span className="site-wordmark-suffix"> UI</span></span>
        </NavbarBrand>
        <NavbarToggle openLabel="Open navigation" closeLabel="Close navigation" />
        <NavbarContent aria-label="Main navigation">
          {navigation.map(({ href, label }) => (
            <NavbarItem key={href} href={href} active={path === href || path.startsWith(`${href}/`)}>{label}</NavbarItem>
          ))}
        </NavbarContent>
        <NavbarActions className="flex-nowrap">
          <Select aria-label="Color mode" size="sm" value={theme} containerClassName="w-32 shrink-0"
            onValueChange={(value) => setTheme(value as PimoluThemeMode)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
          <NavbarItem href="https://github.com/pimoludev/ui" target="_blank" rel="noopener noreferrer">GitHub ↗</NavbarItem>
        </NavbarActions>
      </Navbar>
    </div>
  );
}
