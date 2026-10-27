"use client";

import { type ReactNode, useState } from "react";
import { TableOfContents } from "@pimolu/react";

function InPageLinkGuard({ children }: { children: ReactNode }) {
  return (
    <div onClickCapture={(event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const href = target.closest("a[href]")?.getAttribute("href");
      if (href?.startsWith("#") && !href.startsWith("#/")) event.preventDefault();
    }}>
      {children}
    </div>
  );
}

const guideItems = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  {
    id: "pnpm",
    label: "With pnpm",
    level: 3 as const,
  },
  { id: "npm", label: "With npm", level: 3 as const },
  { id: "theming", label: "Theming" },
  {
    id: "palettes",
    label: "Colour palettes",
    level: 3 as const,
  },
  { id: "accessibility", label: "Accessibility" },
];

export function CustomizationExample() {
  const [activeId, setActiveId] = useState("installation");
  const [lastNavigation, setLastNavigation] =
    useState<string | null>(null);
  return (
    <>
      {
        (<>
          <InPageLinkGuard>
            <div className="pg-grid pg-grid--start">
              <div className="pg-panel">
                <TableOfContents
                  items={guideItems}
                  activeId={activeId}
                  onNavigate={(item) => {
                    setActiveId(item.id);
                    setLastNavigation(String(item.label));
                  }}
                  classNames={{
                    root: "custom-table-of-contents-root",
                    title: "custom-table-of-contents-title"
                  }}
                />
              </div>
              <div className="pg-stack">
                <h2 className="pg-section__title">
                  Getting started
                </h2>
                <p className="pg-copy">
                  The navigation names itself from its visible title through
                  aria-labelledby. Each link points at the id of a real heading in
                  the article.
                </p>
                <p className="pg-meta" role="status">
                  {
                    lastNavigation
                      ? `Selected: ${lastNavigation}`
                      : "Select an entry to update the active state."
                  }
                </p>
                <div className="pg-panel">
                  <div className="pg-stack">
                    {
                      guideItems.map((item) => (
                        <p
                          key={item.id}
                          className={
                            item.level === 3
                              ? "pg-meta"
                              : "pg-copy"
                          }
                        >
                          {item.label}
                        </p>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </InPageLinkGuard>
        </>)
      }
      <style>
        {
          `
.custom-table-of-contents-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-table-of-contents-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
