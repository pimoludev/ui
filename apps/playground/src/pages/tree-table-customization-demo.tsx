"use client";

import {
  TreeTable,
  type PimoluTreeTableNode,
  type PimoluTreeTableColumn,
  Badge
} from "@pimolu/react";

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

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <TreeTable
            nodes={projectTree}
            columns={columns}
            ariaLabel="Expanded project audit"
            defaultExpandAll
            density="sm"
            labels={{
              empty: "This audit contains no file.",
            }}
            classNames={{
              root: "custom-tree-table-root",
              label: "custom-tree-table-label"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-tree-table-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tree-table-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
