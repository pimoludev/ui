"use client";

import { useEffect, useState } from "react";
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, Link } from "@pimolu/react";
import { releaseNotes } from "@/content/releases";

function ReleaseLinks({ currentSlug, onNavigate }: { currentSlug?: string; onNavigate?: () => void }) {
  return <nav className="release-navigation" aria-label="Release navigation">
    <span className="editorial-eyebrow">Overview</span>
    <Link href="/releases" aria-current={!currentSlug ? "page" : undefined} onClick={onNavigate}>All releases</Link>
    <span className="editorial-eyebrow">Releases</span>
    {releaseNotes.map((entry) => <Link key={entry.slug} href={`/releases/${entry.slug}`} aria-current={currentSlug === entry.slug ? "page" : undefined} onClick={onNavigate}>{entry.title}<span className="release-nav-dot" aria-hidden="true" /></Link>)}
    <div className="release-navigation-foot"><span>Follow the source</span><Link href="https://github.com/pimoludev/ui" external>GitHub</Link></div>
  </nav>;
}

export function ReleasesNavigation({ currentSlug }: { currentSlug?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 721px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return <>
    <div className="release-navigation-desktop"><ReleaseLinks currentSlug={currentSlug} /></div>
    <div className="release-navigation-mobile">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger><Button appearance="outline" variant="neutral" startIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></svg>}>Browse releases</Button></DrawerTrigger>
        <DrawerContent side="left" size="sm" className="release-navigation-drawer" closeLabel="Close release navigation">
          <DrawerHeader><DrawerTitle>Release navigation</DrawerTitle></DrawerHeader>
          <ReleaseLinks currentSlug={currentSlug} onNavigate={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  </>;
}
