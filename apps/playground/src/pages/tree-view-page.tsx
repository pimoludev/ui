import { CustomizationExample } from "./tree-view-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TreeView,
  type PimoluTreeItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const files: PimoluTreeItem[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "card", label: "card.tsx" },
          { id: "tabs", label: "tabs.tsx" },
        ],
      },
      { id: "app", label: "App.tsx" },
      { id: "styles", label: "styles.css" },
    ],
  },
  {
    id: "tests",
    label: "tests",
    children: [
      { id: "button-test", label: "button.test.tsx" },
      { id: "card-test", label: "card.test.tsx" },
    ],
  },
  { id: "readme", label: "README.md" },
  { id: "package", label: "package.json" },
];

function ControlledTree() {
  const [selected, setSelected] = useState("tabs");
  const [expanded, setExpanded] = useState<string[]>([
    "src",
    "components",
  ]);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">
          {selected ?? "none"}
        </Badge>

        <span className="pg-meta">
          expanded: {expanded.join(", ") || "none"}
        </span>
      </div>

      <TreeView
        items={files}
        aria-label="Controlled file tree"
        selectedId={selected}
        onSelectedChange={(id) =>
          setSelected(id ?? "")
        }
        expandedIds={expanded}
        onExpandedChange={setExpanded}
      />
    </div>
  );
}

export function TreeViewPage() {
  return (
    <>
      <PageHeader
        title="TreeView"
        hint="An ARIA tree with flattened visible nodes, aria-level, aria-expanded and aria-selected. Arrow keys move focus, Right/Left expand and collapse, Enter/Space select, and the selected or focused node owns the roving tab stop. Styles come from @pimolu/web-styles/tree-view.css."
      />

      <Section
        title="File tree"
        hint="Click a folder to select and toggle it; disabled nodes are skipped by the keyboard."
      >
        <TreeView
          items={files}
          aria-label="Project files"
          defaultExpandedIds={["src", "components"]}
          defaultSelectedId="tabs"
        />
      </Section>

      <Section
        title="Controlled"
        hint="expandedIds, selectedId and their callbacks keep the tree in the page."
      >
        <Card>
          <CardHeader>
            <CardTitle>Selection and expansion</CardTitle>
            <CardDescription>
              The badges reflect the controlled state.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ControlledTree />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Disabled branch"
        hint="A disabled node keeps its label but cannot be selected or focused."
      >
        <TreeView
          items={[
            { id: "src", label: "src" },
            {
              id: "vendor",
              label: "vendor (read-only)",
              disabled: true,
              children: [{ id: "lib", label: "lib.js" }],
            },
            { id: "readme", label: "README.md" },
          ]}
          aria-label="Read-only tree"
          defaultExpandedIds={["vendor"]}
        />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
