import { CustomizationExample } from "./table-of-contents-customization-demo";
import type {
  MouseEvent,
  ReactNode,
} from "react";
import { useState } from "react";

import { TableOfContents } from "@pimolu/react";

import { PageHeader, Section } from "../section";

/**
 * The playground hash doubles as its router; keep plain "#section"
 * links on this page so the demo does not navigate away.
 */
function InPageLinkGuard({
  children,
}: {
  children: ReactNode;
}) {
  function handleClickCapture(
    event: MouseEvent<HTMLDivElement>
  ) {
    const anchor = (
      event.target as HTMLElement
    ).closest?.("a[href^='#']");

    const href = anchor?.getAttribute("href");

    if (href && !href.startsWith("#/")) {
      event.preventDefault();
    }
  }

  return (
    <div onClickCapture={handleClickCapture}>
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

const referenceItems = [
  { id: "props", label: "Props" },
  { id: "events", label: "Events" },
  { id: "slots", label: "Slots" },
  { id: "tokens", label: "Design tokens" },
];

export function TableOfContentsPage() {
  const [activeId, setActiveId] = useState("installation");

  const [lastNavigation, setLastNavigation] =
    useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="TableOfContents"
        hint="An in-page navigation built from the headings of a document. Entries of level 3 are nested inside the previous level 2 entry, the active heading carries aria-current=location, and the component stays sticky-friendly without any JavaScript scroll spy. Styles come from @pimolu/web-styles/table-of-contents.css."
      />

      <Section
        title="Interactive guide"
        hint="activeId is controlled by the consumer. Clicking an entry calls onNavigate and updates the active state in this demo."
      >
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
              />
            </div>

            <div className="pg-stack">
              <h2 className="pg-section__title">
                Getting started
              </h2>

              <p className="pg-copy">
                The navigation names itself from its visible
                title through aria-labelledby. Each link points
                at the id of a real heading in the article.
              </p>

              <p className="pg-meta" role="status">
                {lastNavigation
                  ? `Selected: ${lastNavigation}`
                  : "Select an entry to update the active state."}
              </p>

              <div className="pg-panel">
                <div className="pg-stack">
                  {guideItems.map((item) => (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </InPageLinkGuard>
      </Section>

      <Section
        title="Active entry"
        hint="Only the current heading receives aria-current=location; the others keep no attribute at all."
      >
        <InPageLinkGuard>
          <div className="pg-grid pg-grid--start">
            <TableOfContents
              items={referenceItems}
              activeId="events"
              title="Reference"
            />

            <TableOfContents
              items={guideItems}
              activeId="theming"
              title="Contents"
              aria-label="Guide contents"
            />
          </div>
        </InPageLinkGuard>
      </Section>

      <Section
        title="Nested levels"
        hint="A level 3 entry is rendered in a nested ordered list inside its parent entry. A level 3 entry without a parent still renders as a top-level link."
      >
        <InPageLinkGuard>
          <div className="pg-panel">
            <TableOfContents
              items={[
                { id: "overview", label: "Overview" },
                {
                  id: "architecture",
                  label: "Architecture",
                  level: 3,
                },
                { id: "packages", label: "Packages" },
                {
                  id: "themes",
                  label: "Themes",
                  level: 3,
                },
                {
                  id: "presets",
                  label:
                    "Presets and visual tokens",
                  level: 3,
                },
                { id: "testing", label: "Testing" },
              ]}
              title="Project guide"
            />
          </div>
        </InPageLinkGuard>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
