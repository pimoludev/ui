"use client";

import { useId, useState } from "react";
import { Button } from "@pimolu/react";
import { blocks, blockCategories, type BlockFilter } from "@/content/blocks";

export function BlockNavigation({ filter, onSelect, disabled = false }: {
  filter: BlockFilter;
  disabled?: boolean;
  onSelect: (category: string, subcategory?: string) => void;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState<string[]>(["marketing", filter.category]);

  return (
    <nav className="blocks-navigation" aria-label="Block categories">
      <p className="blocks-nav-heading">Categories</p>
      <Button
        appearance="ghost" variant="neutral" className="blocks-nav-all"
        aria-label="All blocks" aria-pressed={filter.category === "all"}
        onClick={() => onSelect("all")}
        disabled={disabled}
      >
        <span>All blocks</span><span aria-hidden="true">{blocks.length}</span>
      </Button>
      <div className="blocks-nav-groups">
        {blockCategories.map((category) => {
          const count = blocks.filter((block) => block.category === category.id).length;
          const open = expanded.includes(category.id);
          const panelId = `${id}-${category.id}`;
          return (
            <div className="blocks-nav-group" key={category.id}>
              <div className="blocks-nav-category" data-active={filter.category === category.id || undefined}>
                <Button
                  appearance="ghost" variant="neutral" disabled={disabled || !count}
                  aria-label={`${category.label} blocks`}
                  aria-pressed={filter.category === category.id && filter.subcategory === "all"}
                  onClick={() => onSelect(category.id)}
                >
                  <span>{category.label}</span>
                  <span className="blocks-nav-count" aria-hidden="true">{count || "Planned"}</span>
                </Button>
                <Button
                  iconOnly appearance="ghost" variant="neutral" size="sm"
                  disabled={disabled}
                  aria-label={`${open ? "Collapse" : "Expand"} ${category.label} subcategories`}
                  aria-expanded={open} aria-controls={panelId}
                  onClick={() => setExpanded((current) => open
                    ? current.filter((item) => item !== category.id)
                    : [...current, category.id])}
                  startIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d={open ? "m6 9 6 6 6-6" : "m9 6 6 6-6 6"} />
                  </svg>}
                />
              </div>
              <div id={panelId} hidden={!open} className="blocks-nav-children">
                {category.subcategories.map((subcategory) => {
                  const count = blocks.filter((block) => block.category === category.id && block.subcategory === subcategory.id).length;
                  return (
                    <Button
                      key={subcategory.id} appearance="ghost" variant="neutral"
                      aria-label={`${subcategory.label} blocks`} disabled={disabled || !count}
                      aria-pressed={filter.category === category.id && filter.subcategory === subcategory.id}
                      onClick={() => onSelect(category.id, subcategory.id)}
                    >
                      <span>{subcategory.label}</span><span aria-hidden="true">{count || "Planned"}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="blocks-nav-note">Counts show available blocks. Planned collections will grow with the library.</p>
    </nav>
  );
}
