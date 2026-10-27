"use client";

import { ReactNode } from "react";
import { Anchor } from "@pimolu/react";

function InPageLinkGuard({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <InPageLinkGuard>
            <div className="min-w-0 rounded-lg border border-border p-6">
              <div className="grid gap-5 min-w-0">
                <Anchor
                  id="anchor-level-1-custom-parts"
                  level={2}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 2 - section title
                </Anchor>
                <Anchor
                  id="anchor-level-2-custom-parts"
                  level={2}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 2 — section
                </Anchor>
                <Anchor
                  id="anchor-level-3-custom-parts"
                  level={3}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 3 — subsection
                </Anchor>
                <Anchor
                  id="anchor-level-4-custom-parts"
                  level={4}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 4 — detail
                </Anchor>
                <Anchor
                  id="anchor-level-5-custom-parts"
                  level={5}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 5 — label
                </Anchor>
                <Anchor
                  id="anchor-level-6-custom-parts"
                  level={6}
                  classNames={{
                    root: "custom-anchor-root",
                    label: "custom-anchor-label"
                  }}
                >
                  Level 6 — smallest heading
                </Anchor>
              </div>
            </div>
          </InPageLinkGuard>
        </>)
      }
      <style>
        {
          `
.custom-anchor-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-anchor-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
