"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Button, DocsLayout, Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerTrigger, Link,
} from "@pimolu/react";
import catalog from "@/content/generated/catalog.json";
import { docHref } from "@/content/docs";
import navigation from "@/content/generated/navigation.json";

function DocsNavigation({ onNavigate, section }: { onNavigate?: () => void; section: "docs" | "components" }) {
  const pathname = usePathname();
  const entries = section === "docs" ? navigation.filter((entry) => !entry.slug.startsWith("components/")) : [
    { slug: "components", title: "All components", group: "Overview" },
    ...catalog.map((entry) => ({ slug: `components/${entry.family}`, title: entry.title, group: entry.group })),
  ];
  const href = (slug: string) => slug === "components" ? "/components" : docHref(slug);
  return <nav className="docs-navigation" aria-label={section === "docs" ? "Documentation" : "Components"}>
    {[...new Set(entries.map((entry) => entry.group))].map((group) => <div key={group} className="docs-nav-group">
      <p className="docs-nav-label">{group}</p>
      {entries.filter((entry) => entry.group === group).map((entry) => <Link key={entry.slug} href={href(entry.slug)} variant="muted" aria-current={pathname === href(entry.slug) ? "page" : undefined} onClick={onNavigate}>{entry.title}</Link>)}
    </div>)}
<Link href={section === "docs" ? "/components" : "/docs"} onClick={onNavigate}>{section === "docs" ? "Explore components" : "Read the guides"}</Link>
  </nav>;
}

export function DocsShell({ children, section = "docs" }: { children: ReactNode; section?: "docs" | "components" }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return <div className="docs-container">
    <div className="docs-toolbar">
      <span className="docs-toolbar-label">{section === "docs" ? "THE PIMOLU HANDBOOK" : "THE COMPONENT LIBRARY"}</span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="docs-mobile-navigation"><Drawer open={navigationOpen} onOpenChange={setNavigationOpen}>
          <DrawerTrigger><Button appearance="outline" variant="neutral">{section === "docs" ? "Browse docs" : "Browse components"}</Button></DrawerTrigger>
          <DrawerContent side="left" size="sm" className="docs-navigation-drawer"><DrawerHeader><DrawerTitle>Documentation</DrawerTitle></DrawerHeader><DocsNavigation section={section} onNavigate={() => setNavigationOpen(false)} /></DrawerContent>
        </Drawer></div>
      </div>
    </div>
    <DocsLayout className="site-docs docs-layout" sidebarWidth="12rem" sticky sidebar={<DocsNavigation section={section} />}>
      <div id="main-content" tabIndex={-1} className="docs-document">{children}</div>
    </DocsLayout>
  </div>;
}
