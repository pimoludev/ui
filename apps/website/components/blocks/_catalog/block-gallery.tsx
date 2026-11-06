"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Badge, Button, DocsLayout, Drawer, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerTrigger, Link, PageHeader, SearchInput,
} from "@pimolu/react";
import {
  blocks, blockCategories, blockClassification, blockFilterQuery, defaultBlockFilter,
  filterBlocks, readBlockFilter, type BlockFilter,
} from "@/content/blocks";
import { BlockNavigation } from "./block-navigation";
import { BlockThumbnail } from "./block-thumbnail";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

const collectionCovers = {
  application: "workspace", authentication: "split-sign-in", commerce: "studio-headphones",
  content: "editorial-signup", marketing: "studio-hero", navigation: "workspace-bar",
} as const;

export function BlockGallery({ initialFilter }: { initialFilter: BlockFilter }) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [filter, setFilter] = useState(initialFilter);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const visible = filterBlocks(filter.query, filter.category, filter.subcategory);
  const selectedCategory = blockCategories.find(({ id }) => id === filter.category);
  const selectedSubcategory = selectedCategory?.subcategories.find(({ id }) => id === filter.subcategory);
  const categories = blockCategories.map((category) => ({
    ...category,
    items: visible.filter((block) => block.category === category.id),
    total: blocks.filter((block) => block.category === category.id).length,
  })).filter((category) => !filter.query.trim() || category.items.length > 0);
  const returnQuery = blockFilterQuery(filter);

  useEffect(() => {
    const restore = () => setFilter(readBlockFilter(new URLSearchParams(window.location.search)));
    const media = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = () => { if (media.matches) setNavigationOpen(false); };
    window.addEventListener("popstate", restore);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("popstate", restore);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  function updateFilter(next: BlockFilter, push = false) {
    setFilter(next);
    const query = blockFilterQuery(next);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history[push ? "pushState" : "replaceState"](window.history.state, "", url);
  }

  function selectCategory(category: string, subcategory = "all") {
    updateFilter({ ...filter, category, subcategory }, true);
    setNavigationOpen(false);
  }

  const navigation = <BlockNavigation filter={filter} onSelect={selectCategory} disabled={!ready} />;

  return (
    <div className="blocks-container">
      <section className="blocks-toolbar" aria-label="Block library controls">
        <span>THE BLOCK LIBRARY</span>
        <div className="blocks-mobile-navigation">
          <Drawer open={navigationOpen} onOpenChange={setNavigationOpen}>
            <DrawerTrigger><Button appearance="outline" variant="neutral" disabled={!ready}>Browse categories</Button></DrawerTrigger>
            <DrawerContent side="left" size="sm" closeLabel="Close block categories" className="blocks-navigation-drawer">
              <DrawerHeader><DrawerTitle>Block categories</DrawerTitle></DrawerHeader>
              {navigation}
            </DrawerContent>
          </Drawer>
        </div>
      </section>
      <DocsLayout sticky sidebarWidth="14rem" className="blocks-layout" classNames={{ skipLink: "hidden" }} sidebar={navigation}>
        <div className="blocks-document" id="main-content" tabIndex={-1}>
          <header className="blocks-catalog-intro">
            <PageHeader title={selectedCategory?.label ?? "Blocks"} description="Interfaces ready for your next idea. Explore a collection, try a block, make it yours." />
            <Badge variant="primary">Free & open source</Badge>
          </header>
          <section className="blocks-browser" aria-label="Browse free blocks">
            <div className="blocks-filters">
              <SearchInput
                label="Find a block" placeholder="Search by name, use case or component…"
                id="pimolu-block-search" name="pimolu-block-query" autoComplete="off"
                clearLabel="Clear block search" value={filter.query}
                disabled={!ready}
                onValueChange={(query) => updateFilter({ ...filter, query: query.slice(0, 160) })}
              />
              <Button
                appearance="ghost" size="sm" variant="neutral"
                disabled={!ready || (!filter.query && filter.category === "all")}
                onClick={() => updateFilter(defaultBlockFilter, true)}
              >Reset filters</Button>
            </div>
            <div className="blocks-results-heading">
              <p className="blocks-count" role="status">
                {visible.length} of {blocks.length} free blocks
                {selectedCategory && ` · ${selectedCategory.label}`}
                {selectedSubcategory && ` / ${selectedSubcategory.label}`}
              </p>
              {selectedCategory && <Button size="sm" appearance="ghost" variant="neutral" onClick={() => selectCategory("all")}>All categories</Button>}
            </div>
            <div className={`blocks-grid${!selectedCategory ? " blocks-grid--collections" : ""}`}>
              {!selectedCategory ? categories.map((category) => (
                <article key={category.id} className="block-card block-category-card" data-collection={category.id} aria-labelledby={`category-${category.id}`}>
                  {category.items[0] ? <BlockThumbnail slug={(category.items.find((block) => block.slug === collectionCovers[category.id]) ?? category.items[0]).slug} /> : <div className="block-thumbnail block-category-planned" aria-hidden="true"><span>Coming next</span></div>}
                  <div className="block-collection-info">
                  {category.total > 0 ? <Link
                    className="block-card-link"
                    href={`/blocks?${blockFilterQuery({ ...filter, category: category.id, subcategory: "all" })}`}
                    onClick={(event) => {
                      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      selectCategory(category.id);
                    }}
                    aria-label={`Browse ${category.label} blocks`}
                  ><h2 id={`category-${category.id}`}>{category.label}</h2><span aria-hidden="true">→</span></Link>
                    : <h2 id={`category-${category.id}`} className="block-category-title">{category.label}</h2>}
                  <p className="block-card-description">{category.total} {category.total === 1 ? "block" : "blocks"}{!category.total && " · Planned"}{filter.query.trim() && ` · ${category.items.length} matching`}</p>
                  </div>
                </article>
              )) : visible.map((block) => (
                <article key={block.slug} className="block-card" aria-labelledby={`block-${block.slug}`}>
                  <BlockThumbnail slug={block.slug} />
                  <Link className="block-card-link" href={`/blocks/${block.slug}?from=${encodeURIComponent(returnQuery)}`} aria-label={`Explore ${block.title}`}>
                    <h2 id={`block-${block.slug}`}>{block.title}</h2><span aria-hidden="true">↗</span>
                  </Link>
                  <p className="block-card-category">{blockClassification(block).category.label} / {blockClassification(block).subcategory.label}</p>
                  <p className="block-card-description">{block.description}</p>
                </article>
              ))}
            </div>
            {!visible.length && <div className="blocks-empty">
              <h2>No matching blocks.</h2>
              <p>Try a name, a use case like “login”, or a component like “Button”.</p>
              {filter.query && <Button appearance="outline" onClick={() => updateFilter({ ...filter, query: "" })}>Clear search</Button>}
              <Button appearance="ghost" onClick={() => updateFilter(defaultBlockFilter, true)}>Show all blocks</Button>
            </div>}
          </section>
          <div className="blocks-guide"><div>
            <h2>A starting point, with room to grow.</h2>
            <p>Every available collection offers at least three authored variants. Copy a block into your React application: Pimolu supplies the components and tokens; Tailwind handles the layout. Each block includes a working preview and readable source. Collections marked Planned do not have published blocks yet.</p>
          </div><Link href="/docs/quick-start" variant="inherit">Set up Pimolu <span aria-hidden="true">→</span></Link></div>
        </div>
      </DocsLayout>
    </div>
  );
}
