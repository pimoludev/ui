import { CustomizationExample } from "./split-button-customization-demo";
import { useState } from "react";

import {
  Badge,
  SplitButton,
} from "@pimolu/react";

import type { PimoluSplitButtonItem } from "@pimolu/react";

import { PageHeader, Section } from "../section";

const publishItems: PimoluSplitButtonItem[] = [
  {
    id: "draft",
    label: "Save as draft",
    icon: <span>✎</span>,
    shortcut: "⌘S",
  },
  {
    id: "schedule",
    label: "Schedule for later",
    icon: <span>◷</span>,
    shortcut: "⌘⇧S",
  },
  {
    id: "duplicate",
    label: "Duplicate",
    icon: <span>⧉</span>,
  },
  {
    id: "archive",
    label: "Archive",
    icon: <span>▣</span>,
    disabled: true,
  },
];

const exportItems: PimoluSplitButtonItem[] = [
  { id: "pdf", label: "Export as PDF" },
  { id: "markdown", label: "Export as Markdown" },
  { id: "html", label: "Export as HTML" },
];

function PublishControl() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <SplitButton
          aria-label="Publish document"
          items={publishItems.map((item) => ({
            ...item,
            onSelect: () =>
              setLastAction(item.label),
          }))}
          onClick={() => setLastAction("Published now")}
        >
          Publish
        </SplitButton>

        <Badge variant="neutral">
          last action: {lastAction}
        </Badge>
      </div>

      <p className="pg-meta">
        The primary button publishes immediately; the
        chevron opens the secondary actions.
      </p>
    </div>
  );
}

export function SplitButtonPage() {
  return (
    <>
      <PageHeader
        title="SplitButton"
        hint="A primary action joined to a menu of closely related actions. It reuses Button for both segments and DropdownMenu for the panel, including keyboard navigation, dismissal and focus return."
      />

      <Section
        title="Anatomy"
        hint="A primary button and an icon-only menu trigger with an accessible name and aria-haspopup."
      >
        <PublishControl />
      </Section>

      <Section
        title="Variants, appearances and sizes"
        hint="Both segments share the same semantic variant, appearance and size."
      >
        <div className="pg-row">
          <SplitButton
            items={exportItems}
            aria-label="Export"
          >
            Export
          </SplitButton>

          <SplitButton
            items={exportItems}
            variant="secondary"
            appearance="soft"
            aria-label="Export soft"
          >
            Export
          </SplitButton>

          <SplitButton
            items={exportItems}
            variant="neutral"
            appearance="outline"
            size="lg"
            aria-label="Export large"
          >
            Export
          </SplitButton>
        </div>
      </Section>

      <Section
        title="Menu content"
        hint="Items support a decorative icon, a keyboard shortcut hint and a disabled state."
      >
        <div className="pg-row">
          <SplitButton
            items={publishItems}
            menuLabel="Document options"
            align="start"
            aria-label="Document options start"
          >
            Save changes
          </SplitButton>

          <SplitButton
            items={publishItems}
            menuLabel="Document options"
            align="end"
            variant="success"
            aria-label="Document options end"
          >
            Save changes
          </SplitButton>
        </div>
      </Section>

      <Section
        title="States"
        hint="disabled turns off the primary action and the menu together; menu items can be disabled individually."
      >
        <div className="pg-row">
          <SplitButton
            items={exportItems}
            disabled
            aria-label="Export disabled"
          >
            Export
          </SplitButton>

          <SplitButton
            items={[
              { id: "now", label: "Send now" },
              {
                id: "later",
                label: "Send later",
                disabled: true,
              },
            ]}
            variant="primary"
            aria-label="Send"
          >
            Send
          </SplitButton>
        </div>
      </Section>

      <Section
        title="Example: deployment"
        hint="A deployment action with environment-specific follow-ups, aligned to the trailing edge of the trigger."
      >
        <div className="pg-panel">
          <div className="pg-row pg-row--between pg-example-actions">
            <div>
              <strong>Production</strong>
              <p className="pg-meta">
                Last deploy succeeded 14 minutes ago.
              </p>
            </div>

            <SplitButton
              aria-label="Deploy production"
              variant="success"
              items={[
                {
                  id: "staging",
                  label: "Deploy to staging",
                  icon: <span>◇</span>,
                },
                {
                  id: "preview",
                  label: "Create preview URL",
                  icon: <span>◈</span>,
                },
                {
                  id: "rollback",
                  label: "Roll back",
                  icon: <span>↺</span>,
                  disabled: true,
                },
              ]}
            >
              Deploy
            </SplitButton>
          </div>
        </div>
      </Section>

      <Section title="Viewport edges" hint="Open both menus near the edges, then resize the window or try RTL. Alignment stays inside the viewport.">
        <div className="pg-row pg-row--between">
          <SplitButton menuLabel="Start edge actions" align="end" items={[{ id: "save", label: "Save a copy" }, { id: "export", label: "Export document" }]}>Start edge</SplitButton>
          <SplitButton menuLabel="End edge actions" align="start" items={[{ id: "save", label: "Save a copy" }, { id: "export", label: "Export document" }]}>End edge</SplitButton>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
