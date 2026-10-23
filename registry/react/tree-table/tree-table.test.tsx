import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TreeTable } from "./tree-table";
import type {
  PimoluTreeTableColumn,
  PimoluTreeTableNode,
} from "./tree-table.types";

interface FileNode extends PimoluTreeTableNode {
  name: string;
  kind: string;
  size: number;
  children?: FileNode[];
}

const files: FileNode[] = [
  {
    id: "src",
    name: "src",
    kind: "Folder",
    size: 0,
    children: [
      {
        id: "components",
        name: "components",
        kind: "Folder",
        size: 0,
        children: [
          {
            id: "button",
            name: "button.tsx",
            kind: "TypeScript",
            size: 4.2,
          },
          {
            id: "table",
            name: "table.tsx",
            kind: "TypeScript",
            size: 6.8,
          },
        ],
      },
      {
        id: "index",
        name: "index.ts",
        kind: "TypeScript",
        size: 1.1,
      },
    ],
  },
  {
    id: "package",
    name: "package.json",
    kind: "JSON",
    size: 2.4,
  },
  {
    id: "readme",
    name: "README.md",
    kind: "Markdown",
    size: 8,
  },
];

const columns: PimoluTreeTableColumn<FileNode>[] = [
  {
    id: "name",
    header: "File",
    cell: (node) => node.name,
  },
  {
    id: "kind",
    header: "Type",
    cell: (node) => node.kind,
  },
  {
    id: "size",
    header: "Size",
    align: "end",
    cell: (node) => `${node.size} kB`,
  },
];

function getRows() {
  return screen.getAllByRole("row").slice(1);
}

function getRowByText(text: string) {
  const cell = screen.getByText(text).closest("tr");

  if (!cell) {
    throw new Error(`No row found for ${text}`);
  }

  return cell;
}

describe("Pimolu TreeTable", () => {
  it("selects collapsed descendants in cascade mode and derives partial parents", () => {
    const onSelectionChange = vi.fn();
    render(<TreeTable nodes={files} columns={columns} selectable selectionMode="cascade" onSelectionChange={onSelectionChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select src" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["src", "components", "button", "table", "index"]);
    fireEvent.click(screen.getByRole("button", { name: "Expand src" }));
    fireEvent.click(screen.getByRole("button", { name: "Expand components" }));
    expect(screen.getByRole("checkbox", { name: "Select button.tsx" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select button.tsx" }));
    expect(screen.getByRole("checkbox", { name: "Select src" })).toBePartiallyChecked();
    expect(screen.getByRole("checkbox", { name: "Select components" })).toBePartiallyChecked();
    expect(onSelectionChange).toHaveBeenLastCalledWith(["table", "index"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select button.tsx" }));
    expect(screen.getByRole("checkbox", { name: "Select src" })).toBeChecked();
  });

  it("cascade select-all includes collapsed rows, skips disabled nodes and can clear all", () => {
    const onSelectionChange = vi.fn();
    const nodes: FileNode[] = [{ ...files[0], children: [{ ...files[0].children![0], disabled: true }, files[0].children![1]] }];
    render(<TreeTable nodes={nodes} columns={columns} selectable selectionMode="cascade" onSelectionChange={onSelectionChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["src", "button", "table", "index"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("supports controlled branch selection without mutating the supplied ids", () => {
    const selectedIds = ["src"];
    const onSelectionChange = vi.fn();
    render(<TreeTable nodes={files} columns={columns} selectable selectionMode="cascade" selectedIds={selectedIds}
      defaultExpandAll onSelectionChange={onSelectionChange} />);
    expect(screen.getByRole("checkbox", { name: "Select index.ts" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select table.tsx" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["button", "index"]);
    expect(selectedIds).toEqual(["src"]);
    expect(screen.getByRole("checkbox", { name: "Select table.tsx" })).toBeChecked();
  });
  it("renders a treegrid with headers, levels and collapsed roots", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
      />
    );

    expect(
      screen.getByRole("treegrid", {
        name: "Project files",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: "File",
      })
    ).toBeInTheDocument();

    expect(getRows()).toHaveLength(3);

    expect(getRowByText("src")).toHaveAttribute(
      "aria-level",
      "1"
    );
    expect(getRowByText("src")).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(
      getRowByText("package.json")
    ).not.toHaveAttribute("aria-expanded");

    expect(
      screen.getByRole("button", {
        name: "Expand src",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("index.ts")
    ).not.toBeInTheDocument();
  });

  it("renders expanded nodes with levels and indentation guides", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        defaultExpandedIds={["src", "components"]}
      />
    );

    expect(getRows()).toHaveLength(7);

    expect(getRowByText("src")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(getRowByText("components")).toHaveAttribute(
      "aria-level",
      "2"
    );
    expect(getRowByText("button.tsx")).toHaveAttribute(
      "aria-level",
      "3"
    );

    const treeCell = screen
      .getByText("button.tsx")
      .closest("td");

    expect(
      treeCell?.querySelectorAll(
        ".pimolu-tree-table__guide"
      )
    ).toHaveLength(2);
  });

  it("expands a node from its button and reports the ids", () => {
    const onExpandedChange = vi.fn();

    const { rerender } = render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expand src",
      })
    );

    expect(onExpandedChange).toHaveBeenCalledWith(["src"]);

    /* Controlled: the tree does not expand until the parent agrees. */

    expect(
      screen.queryByText("index.ts")
    ).not.toBeInTheDocument();

    rerender(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        expandedIds={["src"]}
        onExpandedChange={onExpandedChange}
      />
    );

    expect(
      screen.getByText("index.ts")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Collapse src",
      })
    ).toBeInTheDocument();
  });

  it("moves between visible rows with the arrow keys, Home and End", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        defaultExpandedIds={["src", "components"]}
      />
    );

    const rows = getRows();

    rows[0].focus();

    fireEvent.keyDown(rows[0], {
      key: "ArrowDown",
    });

    expect(rows[1]).toHaveFocus();

    fireEvent.keyDown(rows[1], { key: "End" });
    expect(rows[rows.length - 1]).toHaveFocus();

    fireEvent.keyDown(rows[6], { key: "Home" });
    expect(rows[0]).toHaveFocus();

    fireEvent.keyDown(rows[0], { key: "ArrowUp" });
    expect(rows[0]).toHaveFocus();
  });

  it("expands with ArrowRight and moves to the first child", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
      />
    );

    const srcRow = getRowByText("src");

    srcRow.focus();

    fireEvent.keyDown(srcRow, {
      key: "ArrowRight",
    });

    expect(srcRow).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(
      screen.getByText("components")
    ).toBeInTheDocument();
    expect(srcRow).toHaveFocus();

    fireEvent.keyDown(srcRow, {
      key: "ArrowRight",
    });

    expect(getRowByText("components")).toHaveFocus();

    const componentsRow = getRowByText("components");

    fireEvent.keyDown(componentsRow, {
      key: "ArrowRight",
    });

    expect(componentsRow).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.keyDown(componentsRow, {
      key: "ArrowRight",
    });

    expect(getRowByText("button.tsx")).toHaveFocus();
  });

  it("collapses with ArrowLeft and moves back to the parent", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        defaultExpandedIds={["src", "components"]}
      />
    );

    const buttonRow = getRowByText("button.tsx");

    buttonRow.focus();

    fireEvent.keyDown(buttonRow, {
      key: "ArrowLeft",
    });

    const componentsRow = getRowByText("components");

    expect(componentsRow).toHaveFocus();
    expect(componentsRow).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.keyDown(componentsRow, {
      key: "ArrowLeft",
    });

    expect(componentsRow).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(
      screen.queryByText("button.tsx")
    ).not.toBeInTheDocument();
    expect(componentsRow).toHaveFocus();

    fireEvent.keyDown(componentsRow, {
      key: "ArrowLeft",
    });

    expect(getRowByText("src")).toHaveFocus();
  });

  it("selects rows from checkboxes, Space and the header", () => {
    const onSelectionChange = vi.fn();

    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select src",
      })
    );

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "src",
    ]);
    expect(getRowByText("src")).toHaveAttribute(
      "aria-selected",
      "true"
    );

    const packageRow = getRowByText("package.json");

    packageRow.focus();

    fireEvent.keyDown(packageRow, { key: " " });

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "src",
      "package",
    ]);
    expect(
      screen.getByRole("checkbox", {
        name: "Select package.json",
      })
    ).toBeChecked();

    const selectAll = screen.getByRole("checkbox", {
      name: "Select all visible rows",
    });

    fireEvent.click(selectAll);

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "src",
      "package",
      "readme",
    ]);

    getRows().forEach((row) => {
      expect(
        within(row).getByRole("checkbox")
      ).toBeChecked();
    });

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select src",
      })
    );

    expect(selectAll).toBePartiallyChecked();
    expect(getRowByText("src")).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("toggles expansion with Enter and selects leaves", () => {
    render(
      <TreeTable
        nodes={files}
        columns={columns}
        caption="Project files"
        selectable
      />
    );

    const srcRow = getRowByText("src");

    srcRow.focus();

    fireEvent.keyDown(srcRow, {
      key: "Enter",
    });

    expect(srcRow).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(srcRow).toHaveAttribute(
      "aria-selected",
      "false"
    );

    const readmeRow = getRowByText("README.md");

    readmeRow.focus();

    fireEvent.keyDown(readmeRow, {
      key: "Enter",
    });

    expect(readmeRow).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("renders an empty state and a custom aria-label", () => {
    render(
      <TreeTable
        nodes={[]}
        columns={columns}
        ariaLabel="Empty tree"
        emptyState={<span>No files yet</span>}
      />
    );

    expect(
      screen.getByRole("treegrid", {
        name: "Empty tree",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("No files yet")
    ).toBeInTheDocument();
  });
});
