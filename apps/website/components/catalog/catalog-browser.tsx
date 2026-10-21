"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Link, Select, TableOfContents } from "@pimolu/react";
import { catalogQuery, defaultCatalogFilter, filterCatalog, readCatalogFilter, type CatalogEntry, type CatalogFilter } from "@/lib/catalog";

export function CatalogBrowser({ entries, initialFilter }: { entries: CatalogEntry[]; initialFilter: CatalogFilter }) {
  const [filter, setFilter] = useState<CatalogFilter>({ ...initialFilter, coverage: "all" });
  const groups = [...new Set(entries.map((entry) => entry.group))];
  const results = filterCatalog(entries, filter);
  useEffect(() => {
    const query = catalogQuery(filter);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [filter]);
  useEffect(() => {
    const groups = [...new Set(entries.map((entry) => entry.group))];
    const restore = () => setFilter({ ...readCatalogFilter(new URLSearchParams(window.location.search), groups), coverage: "all" });
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [entries]);
  return <div className="catalog-browser">
    <div className="min-w-0">
      <div className="catalog-filters">
        <Input label="Find a component" placeholder="Search by name, purpose or export…" value={filter.query} onValueChange={(query) => setFilter({ ...filter, query })} fullWidth clearable clearLabel="Clear component search" maxLength={160} />
        <Select label="Category" value={filter.group} onValueChange={(group) => setFilter({ ...filter, group, coverage: "all" })} fullWidth><option value="all">All components</option>{groups.map((group) => <option key={group}>{group}</option>)}</Select>
      </div>
      <div className="catalog-results-heading"><p role="status" aria-live="polite" className="text-sm text-muted">{results.length} of {entries.length} families{filter.group !== "all" ? ` · ${filter.group}` : ""}</p><Button appearance="ghost" size="sm" variant="neutral" onClick={() => setFilter(defaultCatalogFilter)} disabled={!filter.query && filter.group === "all" && filter.coverage === "all"}>Reset filters</Button></div>
      {results.length ? groups.filter((group) => results.some((entry) => entry.group === group)).map((group) => <section className="catalog-section" id={`category-${group.toLowerCase().replaceAll(" ", "-")}`} key={group}>
        <div className="catalog-section-heading"><h2>{group}</h2><span>{results.filter((entry) => entry.group === group).length} {results.filter((entry) => entry.group === group).length === 1 ? "family" : "families"}</span></div>
        <ul className="catalog-grid">{results.filter((entry) => entry.group === group).map((entry) => <li key={entry.family}>
          <Card className="catalog-card" fullWidth>
            <Link href={entry.href} className="catalog-illustration" aria-label={`Preview ${entry.title}`}>
              {/* Generated screenshots of real Pimolu compositions, not decorative UI substitutes. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="catalog-image-light" src={`/component-previews/${entry.family}-light.png`} width={640} height={400} loading="lazy" alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="catalog-image-dark" src={`/component-previews/${entry.family}-dark.png`} width={640} height={400} loading="lazy" alt="" />
            </Link>
            <CardHeader><CardTitle as="h3"><Link href={entry.href}>{entry.title}</Link></CardTitle><p className="text-sm text-muted mt-3">{entry.description}</p></CardHeader>
            <CardContent className="catalog-card-content"><Link href={entry.href} aria-label={`Explore ${entry.title}`}>Example &amp; API <span aria-hidden="true">&#8599;</span></Link></CardContent>
          </Card>
        </li>)}</ul>
      </section>) : <div className="catalog-empty"><h2>No matching components.</h2><p className="text-muted mt-3">Try a shorter name or reset the category.</p><Button className="mt-6" onClick={() => setFilter(defaultCatalogFilter)}>Show all components</Button></div>}
      <p className="text-sm text-muted mt-10">Every family includes a real example, source-derived API and integration notes. This coverage does not imply an exhaustive accessibility audit.</p>
    </div>
    <aside className="catalog-toc"><TableOfContents title="Browse categories" items={groups.filter((group) => results.some((entry) => entry.group === group)).map((group) => ({ id: `category-${group.toLowerCase().replaceAll(" ", "-")}`, label: group }))} /></aside>
  </div>;
}
