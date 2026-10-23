import { useState } from "react";

import {
  Badge,
  Button,
  Select,
  TreeTable,
  type PimoluTreeTableColumn,
  type PimoluTreeTableNode,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DATA
========================================= */

type FileKind =
  | "Folder"
  | "TypeScript"
  | "CSS"
  | "JSON"
  | "Markdown";

interface ProjectNode extends PimoluTreeTableNode {
  name: string;
  kind: FileKind;
  size: number;
  updated: string;
  children?: ProjectNode[];
}

const projectTree: ProjectNode[] = [
  {
    id: "src",
    name: "src",
    kind: "Folder",
    size: 0,
    updated: "Oct 20, 2026",
    children: [
      {
        id: "src/components",
        name: "components",
        kind: "Folder",
        size: 0,
        updated: "Oct 19, 2026",
        children: [
          {
            id: "src/components/button",
            name: "button.tsx",
            kind: "TypeScript",
            size: 4.2,
            updated: "Oct 18, 2026",
          },
          {
            id: "src/components/data-grid",
            name: "data-grid.tsx",
            kind: "TypeScript",
            size: 18.4,
            updated: "Oct 20, 2026",
          },
          {
            id: "src/components/tree-table",
            name: "tree-table.tsx",
            kind: "TypeScript",
            size: 14.7,
            updated: "Oct 20, 2026",
          },
        ],
      },
      {
        id: "src/styles",
        name: "styles",
        kind: "Folder",
        size: 0,
        updated: "Oct 17, 2026",
        children: [
          {
            id: "src/styles/tokens",
            name: "tokens.css",
            kind: "CSS",
            size: 12.1,
            updated: "Oct 12, 2026",
          },
          {
            id: "src/styles/playground",
            name: "playground.css",
            kind: "CSS",
            size: 9.8,
            updated: "Oct 17, 2026",
          },
        ],
      },
      {
        id: "src/index",
        name: "index.ts",
        kind: "TypeScript",
        size: 1.2,
        updated: "Oct 20, 2026",
      },
    ],
  },
  {
    id: "packages",
    name: "packages",
    kind: "Folder",
    size: 0,
    updated: "Oct 18, 2026",
    children: [
      {
        id: "packages/design-tokens",
        name: "design-tokens",
        kind: "Folder",
        size: 0,
        updated: "Oct 15, 2026",
        children: [
          {
            id: "packages/design-tokens/tokens",
            name: "tokens.json",
            kind: "JSON",
            size: 28.6,
            updated: "Oct 15, 2026",
          },
        ],
      },
      {
        id: "packages/themes",
        name: "themes",
        kind: "Folder",
        size: 0,
        updated: "Oct 16, 2026",
        children: [
          {
            id: "packages/themes/themes",
            name: "themes.json",
            kind: "JSON",
            size: 16.3,
            updated: "Oct 16, 2026",
          },
        ],
      },
    ],
  },
  {
    id: "app",
    name: "app",
    kind: "Folder",
    size: 0,
    updated: "Oct 20, 2026",
    children: [
      {
        id: "app/router",
        name: "router.ts",
        kind: "TypeScript",
        size: 2.1,
        updated: "Oct 20, 2026",
      },
      {
        id: "app/app",
        name: "App.tsx",
        kind: "TypeScript",
        size: 6.4,
        updated: "Oct 20, 2026",
      },
    ],
  },
  {
    id: "package",
    name: "package.json",
    kind: "JSON",
    size: 3.2,
    updated: "Oct 18, 2026",
  },
  {
    id: "readme",
    name: "README.md",
    kind: "Markdown",
    size: 8.9,
    updated: "Oct 14, 2026",
  },
];

const kindVariant: Record<
  FileKind,
  "neutral" | "primary" | "warning" | "success"
> = {
  Folder: "neutral",
  TypeScript: "primary",
  CSS: "success",
  JSON: "warning",
  Markdown: "neutral",
};

const columns: PimoluTreeTableColumn<ProjectNode>[] = [
  {
    id: "name",
    header: "Name",
    label: "file name",
    width: 340,
    cell: (node) => node.name,
  },
  {
    id: "kind",
    header: "Type",
    width: 140,
    cell: (node) => (
      <Badge
        variant={kindVariant[node.kind]}
        appearance="soft"
        size="sm"
      >
        {node.kind}
      </Badge>
    ),
  },
  {
    id: "size",
    header: "Size",
    align: "end",
    width: 110,
    cell: (node) =>
      node.kind === "Folder"
        ? "—"
        : `${node.size.toFixed(1)} kB`,
  },
  {
    id: "updated",
    header: "Modified",
    width: 150,
    cell: (node) => node.updated,
  },
];

function collectFolderIds(
  nodes: readonly ProjectNode[]
): string[] {
  const ids: string[] = [];

  for (const node of nodes) {
    if (node.children?.length) {
      ids.push(node.id);
      ids.push(...collectFolderIds(node.children));
    }
  }

  return ids;
}

const allFolderIds = collectFolderIds(projectTree);

/* =========================================
   EXAMPLES
========================================= */

function SelectableExplorer() {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    []
  );
  const [selectionMode, setSelectionMode] = useState<"cascade" | "independent">("cascade");
  const [archived, setArchived] = useState<string[]>([]);
  function visibleNodes(items: ProjectNode[]): ProjectNode[] {
    return items.filter((item) => !archived.includes(item.id)).map((item) => ({
      ...item, children: item.children ? visibleNodes(item.children) : undefined,
    }));
  }

  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <Select label="Selection" size="sm" value={selectionMode} onValueChange={(value) => setSelectionMode(value as typeof selectionMode)}>
          <option value="cascade">Folders and descendants</option><option value="independent">Individual rows</option>
        </Select>
        <span className="pg-meta">
          {selectedIds.length > 0
            ? `${selectedIds.length} node(s) selected`
            : "Select a file with its checkbox, a row click or Space"}
        </span>

        <Button
          size="sm"
          variant="primary"
          appearance="outline"
          disabled={selectedIds.length === 0}
          onClick={() => { setArchived([...archived, ...selectedIds]); setSelectedIds([]); }}
        >
          Archive selection
        </Button>
      </div>
      {archived.length > 0 && <div className="pg-row"><span role="status" className="pg-meta">Selection archived in this local example.</span>
        <Button size="sm" appearance="ghost" onClick={() => setArchived([])}>Restore files</Button></div>}

      <TreeTable
        nodes={visibleNodes(projectTree)}
        columns={columns}
        caption="Project files"
        defaultExpandedIds={[
          "src",
          "src/components",
          "packages",
        ]}
        selectable
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}

function ControlledExpansionExplorer() {
  const [expandedIds, setExpandedIds] = useState<string[]>([
    "src",
    "src/components",
  ]);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button
          size="sm"
          variant="neutral"
          appearance="outline"
          onClick={() => setExpandedIds(allFolderIds)}
        >
          Expand all
        </Button>

        <Button
          size="sm"
          variant="neutral"
          appearance="outline"
          onClick={() => setExpandedIds([])}
        >
          Collapse all
        </Button>

        <span className="pg-meta">
          {expandedIds.length} folder(s) open
        </span>
      </div>

      <TreeTable
        nodes={projectTree}
        columns={columns}
        caption="Controlled project explorer"
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
      />
    </div>
  );
}

/* =========================================
   PAGE
========================================= */

export function TreeTablePage() {
  return (
    <>
      <PageHeader
        title="TreeTable"
        hint="A data-driven hierarchical table with treegrid semantics: nodes own their children, the page controls expansion when it wants to, and rows expose aria-level, aria-expanded and aria-selected. Up/Down move between visible rows, Right expands or enters a child, Left collapses or returns to the parent, Home/End jump, and Enter/Space toggle. Styles come from @pimolu/web-styles/tree-table.css."
      />

      <Section
        title="Project explorer"
        hint="The first column owns the expander and the indentation guides. Selection is controlled by the page and survives collapsing a branch; the header checkbox only targets the currently visible rows."
      >
        <SelectableExplorer />
      </Section>

      <Section
        title="Controlled expansion"
        hint="expandedIds and onExpandedChange move the expansion state to the page so toolbar actions can expand or collapse the whole hierarchy. The expanders still work and report every change."
      >
        <ControlledExpansionExplorer />
      </Section>

      <Section
        title="Dense audit tree"
        hint="defaultExpandAll opens every branch on first render, and density='sm' keeps a long audit trail compact. Disabled nodes keep their place but cannot be expanded or selected."
      >
        <TreeTable
          nodes={projectTree}
          columns={columns}
          ariaLabel="Expanded project audit"
          defaultExpandAll
          density="sm"
          labels={{
            empty: "This audit contains no file.",
          }}
        />
      </Section>
    </>
  );
}
