"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Button, DocsLayout, Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerTrigger, Link, Badge,
} from "@pimolu/react";
import catalog from "@/content/generated/catalog.json";
import { docHref } from "@/content/docs";
import navigation from "@/content/generated/navigation.json";

type NavigationStatus = { kind: "new" | "updated" | "deprecated"; description: string };

function DocsNavigation({ onNavigate, section }: { onNavigate?: () => void; section: "docs" | "components" }) {
  const pathname = usePathname();
  const id = useId();
  const entries = section === "docs" ? navigation.filter((entry) => !entry.slug.startsWith("components/")).map((entry) => ({ ...entry, status: null })) : [
    { slug: "components", title: "All components", group: "Overview", status: null as NavigationStatus | null },
    ...catalog.map((entry) => ({ slug: `components/${entry.family}`, title: entry.title, group: entry.group, status: entry.status as NavigationStatus | null })),
  ];
  const href = (slug: string) => slug === "components" ? "/components" : docHref(slug);
  return <nav className="docs-navigation" aria-label={section === "docs" ? "Documentation" : "Components"}>
    {[...new Set(entries.map((entry) => entry.group))].map((group) => <div key={group} className="docs-nav-group">
      <p className="docs-nav-label">{group}</p>
      {entries.filter((entry) => entry.group === group)
        .sort((a, b) => section === "components"
          ? a.title.localeCompare(b.title, "en", { sensitivity: "base", numeric: true })
          : 0)
        .map((entry) => <Fragment key={entry.slug}>
        <Link href={href(entry.slug)} variant="muted" aria-current={pathname === href(entry.slug) ? "page" : undefined} aria-describedby={entry.status ? `${id}-${entry.slug}` : undefined} onClick={onNavigate}>
          <span className="docs-nav-title">{entry.title}</span>
          {entry.status && <Badge className="docs-nav-status" aria-hidden="true" variant={entry.status.kind === "new" ? "success" : entry.status.kind === "deprecated" ? "warning" : "primary"}>{entry.status.kind === "new" ? "New" : entry.status.kind === "deprecated" ? "Deprecated" : "Updated"}</Badge>}
        </Link>
        {entry.status && <span id={`${id}-${entry.slug}`} className="sr-only">{entry.status.description}</span>}
      </Fragment>)}
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
    <DocsLayout className="site-docs docs-layout" sidebarWidth="14rem" sticky sidebar={<DocsNavigation section={section} />}>
      <div id="main-content" tabIndex={-1} className="docs-document">{children}</div>
    </DocsLayout>
  </div>;
}
