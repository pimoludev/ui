"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Kbd } from "@pimolu/react";

const Search = dynamic(() => import("./docs/docs-search"), { loading: () => <p role="status">Loading search…</p> });
const SearchContext = createContext<{ open: boolean; show: () => void } | null>(null);

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.altKey) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return <SearchContext.Provider value={{ open, show: () => setOpen(true) }}><Dialog open={open} onOpenChange={setOpen}>
    {children}
    <DialogContent className="site-search-dialog" closeLabel="Close site search">
      <DialogHeader><DialogTitle>Search Pimolu</DialogTitle><DialogDescription>Components, guides, projects, articles and releases. Search by name or API property.</DialogDescription></DialogHeader>
      <Search onSelect={() => setOpen(false)} />
    </DialogContent>
  </Dialog></SearchContext.Provider>;
}

export function SiteSearchTrigger() {
  const search = useContext(SearchContext);
  return <Button appearance="outline" variant="neutral" className="site-search-trigger" aria-label="Search Pimolu" aria-haspopup="dialog" aria-expanded={search?.open ?? false} onClick={(event) => {
    // Safari does not focus buttons on pointer activation. Capture this opener
    // before Dialog records focus, while keyboard shortcuts keep their origin.
    event.currentTarget.focus({ preventScroll: true });
    search?.show();
  }}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
    <span className="site-search-placeholder">Search Pimolu…</span><Kbd>Ctrl K</Kbd>
  </Button>;
}
