"use client";

import { ReactNode, useState } from "react";
import { TableOfContents } from "@pimolu/react";

function InPageLinkGuard({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
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

export function DemoExample() {
  const [activeId, setActiveId] = useState("installation");
  const [lastNavigation, setLastNavigation] = useState<string | null>(null);
  return (
    <div className="grid gap-6">
      {
        (<>
          <InPageLinkGuard>
            <div
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
            >
              <div className="min-w-0 rounded-lg border border-border p-6">
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
              <div className="grid gap-5 min-w-0">
                <h2 className="mb-2 text-lg">Getting started</h2>
                <p className="max-w-prose leading-relaxed">
                  The navigation names itself from its visible title through
                  aria-labelledby. Each link points at the id of a real heading in
                  the article.
                </p>
                <p className="text-sm text-muted leading-relaxed" role="status">
                  {
                    lastNavigation
                      ? `Selected: ${lastNavigation}`
                      : "Select an entry to update the active state."
                  }
                </p>
                <div className="min-w-0 rounded-lg border border-border p-6">
                  <div className="grid gap-5 min-w-0">
                    {
                      guideItems.map((item) => (<p
                        key={item.id}
                        className={item.level === 3
                          ? "pg-meta"
                          : "pg-copy"}
                      >
                        {item.label}
                      </p>))
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
    </div>
  );
}
