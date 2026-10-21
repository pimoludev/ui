"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Button, Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DocsLayout, Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerTrigger, Kbd, Link,
} from "@pimolu/react";
import catalog from "@/content/generated/catalog.json";
import { docHref } from "@/content/docs";
import navigation from "@/content/generated/navigation.json";

const DocumentationSearch = dynamic(() => import("./docs-search"), { loading: () => <p role="status" className="mt-5">Loading documentation search…</p> });



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
  const [searchOpen, setSearchOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.altKey) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", openSearch);
    return () => document.removeEventListener("keydown", openSearch);
  }, []);
  return <Dialog open={searchOpen} onOpenChange={setSearchOpen}><div className="docs-container">
    <div className="docs-toolbar">
      <span className="docs-toolbar-label">{section === "docs" ? "THE PIMOLU HANDBOOK" : "THE COMPONENT LIBRARY"}</span>
      <div className="flex flex-wrap items-center gap-3">
        <Button appearance="outline" variant="neutral" aria-haspopup="dialog" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)} endIcon={<Kbd>Ctrl K</Kbd>}>Search docs</Button>
        <div className="docs-mobile-navigation"><Drawer open={navigationOpen} onOpenChange={setNavigationOpen}>
          <DrawerTrigger><Button appearance="outline" variant="neutral">{section === "docs" ? "Browse docs" : "Browse components"}</Button></DrawerTrigger>
          <DrawerContent side="left" size="sm" className="docs-navigation-drawer"><DrawerHeader><DrawerTitle>Documentation</DrawerTitle></DrawerHeader><DocsNavigation section={section} onNavigate={() => setNavigationOpen(false)} /></DrawerContent>
        </Drawer></div>
      </div>
    </div>
      <DialogContent className="docs-search-dialog" closeLabel="Close documentation search">
        <DialogHeader><DialogTitle>Search documentation</DialogTitle><DialogDescription>Find a component, guide or API property.</DialogDescription></DialogHeader>
        <DocumentationSearch onSelect={() => setSearchOpen(false)} />
      </DialogContent>
    <DocsLayout className="site-docs docs-layout" sidebarWidth="12rem" sticky sidebar={<DocsNavigation section={section} />}>
      <div id="main-content" tabIndex={-1} className="docs-document">{children}</div>
    </DocsLayout>
  </div></Dialog>;
}
