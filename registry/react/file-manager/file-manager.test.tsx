import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FileManager } from "./file-manager";
import type { PimoluFileEntry } from "./file-manager.types";

const entries: PimoluFileEntry[] = [
  {
    id: "brand",
    name: "Brand",
    type: "folder",
    modified: new Date(2026, 8, 12),
    children: [
      {
        id: "logo",
        name: "logo.svg",
        type: "file",
        size: 24_000,
        mime: "image/svg+xml",
        modified: new Date(2026, 8, 10),
      },
      {
        id: "guidelines",
        name: "guidelines.pdf",
        type: "file",
        size: 1_500_000,
        mime: "application/pdf",
        modified: new Date(2026, 8, 11),
      },
    ],
  },
  {
    id: "deliverables",
    name: "Deliverables",
    type: "folder",
    modified: new Date(2026, 8, 5),
    children: [
      {
        id: "report",
        name: "Report.pdf",
        type: "file",
        size: 2_400_000,
        mime: "application/pdf",
        modified: new Date(2026, 9, 2),
      },
      {
        id: "budget",
        name: "Budget.xlsx",
        type: "file",
        size: 320_000,
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        modified: new Date(2026, 9, 8),
      },
      {
        id: "notes",
        name: "Notes.txt",
        type: "file",
        size: 1_200,
        mime: "text/plain",
        modified: new Date(2026, 8, 30),
      },
    ],
  },
  {
    id: "readme",
    name: "README.md",
    type: "file",
    size: 800,
    mime: "text/markdown",
    modified: new Date(2026, 9, 20),
  },
  {
    id: "brief",
    name: "brief.pdf",
    type: "file",
    size: 500_000,
    mime: "application/pdf",
    modified: new Date(2026, 9, 1),
  },
];

function optionIds() {
  const listbox = screen.getByRole("listbox");

  return within(listbox)
    .getAllByRole("option")
    .map((option) =>
      option.getAttribute("data-file-id")
    );
}

function folder(name: string) {
  return screen.getByRole("option", {
    name: new RegExp(`${name}, Folder`),
  });
}

describe("Pimolu FileManager", () => {
  it("renders the toolbar, breadcrumb and a sorted list of entries", () => {
    render(<FileManager entries={entries} />);

    expect(
      screen.getByRole("toolbar", {
        name: "File actions",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("listbox", {
        name: "Files items",
      })
    ).toHaveAttribute("aria-multiselectable", "true");

    expect(
      screen.getByRole("searchbox", {
        name: "Search files",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("4 items")
    ).toBeInTheDocument();

    expect(optionIds()).toEqual([
      "brand",
      "deliverables",
      "brief",
      "readme",
    ]);

    expect(
      screen.getByRole("option", {
        name: /Brand, Folder, 2 items/,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: /brief\.pdf, PDF, 488 KB/,
      })
    ).toBeInTheDocument();
  });

  it("opens a folder on double click and navigates back with the breadcrumb", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onPathChange = vi.fn();

    render(
      <FileManager
        entries={entries}
        onOpen={onOpen}
        onPathChange={onPathChange}
      />
    );

    await user.dblClick(folder("Brand"));

    expect(onOpen).toHaveBeenCalledWith(entries[0]);
    expect(onPathChange).toHaveBeenCalledWith([
      "brand",
    ]);
    expect(
      screen.getByRole("option", {
        name: /logo\.svg, Image/,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: /guidelines\.pdf, PDF/,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Brand")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", {
        name: "Files",
      })
    );

    expect(
      screen.getByRole("listbox", {
        name: "Files items",
      })
    ).toBeInTheDocument();
    expect(optionIds()).toHaveLength(4);
  });

  it("supports multiple selection with Ctrl and reports the entries", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <FileManager
        entries={entries}
        onSelect={onSelect}
      />
    );

    const readme = screen.getByRole("option", {
      name: /README\.md/,
    });

    await user.click(readme);

    expect(readme).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(onSelect).toHaveBeenLastCalledWith([
      entries[2],
    ]);

    const brand = folder("Brand");

    await user.keyboard("{Control>}");
    await user.click(brand);
    await user.keyboard("{/Control}");

    expect(brand).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(readme).toHaveAttribute(
      "aria-selected",
      "true"
    );

    const selected = onSelect.mock.lastCall?.[0] as PimoluFileEntry[];

    expect(selected.map((entry) => entry.id)).toEqual([
      "readme",
      "brand",
    ]);
  });

  it("replaces the selection in single mode", async () => {
    const user = userEvent.setup();

    render(
      <FileManager
        entries={entries}
        selectionMode="single"
      />
    );

    const brand = folder("Brand");

    await user.click(brand);
    await user.click(folder("Deliverables"));

    expect(brand).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(folder("Deliverables")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(
      screen.getByRole("listbox", {
        name: "Files items",
      })
    ).not.toHaveAttribute("aria-multiselectable");
  });

  it("opens a file on double click", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(
      <FileManager
        entries={entries}
        onOpen={onOpen}
      />
    );

    await user.dblClick(
      screen.getByRole("option", {
        name: /README\.md/,
      })
    );

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(entries[2]);
  });

  it("filters by search and shows an empty state", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <FileManager
        entries={entries}
        onSearchChange={onSearchChange}
      />
    );

    const search = screen.getByRole("searchbox", {
      name: "Search files",
    });

    await user.type(search, "read");

    expect(onSearchChange).toHaveBeenLastCalledWith(
      "read"
    );
    expect(optionIds()).toEqual(["readme"]);

    await user.clear(search);
    await user.type(search, "zzz");

    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("No matching files")
    ).toBeInTheDocument();

    await user.clear(search);

    expect(optionIds()).toHaveLength(4);
  });

  it("sorts by size and toggles the direction", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(
      <FileManager
        entries={entries}
        onSortChange={onSortChange}
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Sort by",
      }),
      "size"
    );

    expect(onSortChange).toHaveBeenLastCalledWith({
      by: "size",
      direction: "asc",
    });
    expect(optionIds()).toEqual([
      "brand",
      "deliverables",
      "readme",
      "brief",
    ]);

    await user.click(
      screen.getByRole("button", {
        name: "Sort descending",
      })
    );

    expect(onSortChange).toHaveBeenLastCalledWith({
      by: "size",
      direction: "desc",
    });
    expect(optionIds()).toEqual([
      "deliverables",
      "brand",
      "brief",
      "readme",
    ]);
  });

  it("switches between list and grid views", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    render(
      <FileManager
        entries={entries}
        onViewChange={onViewChange}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: "Grid" })
    );

    expect(onViewChange).toHaveBeenLastCalledWith(
      "grid"
    );

    const grid = screen.getByRole("listbox", {
      name: "Files items",
    });

    expect(
      within(grid).getAllByRole("option")
    ).toHaveLength(4);
    expect(grid).toHaveClass("pimolu-file-manager__grid");

    const tiles = within(grid).getAllByRole("option");
    tiles[0].focus();
    await user.keyboard("{ArrowDown}");
    expect(tiles[1]).toHaveFocus();

    await user.click(
      screen.getByRole("radio", { name: "List" })
    );

    expect(
      screen.getByRole("listbox", {
        name: "Files items",
      })
    ).toBeInTheDocument();
  });

  it("deletes selected entries from the toolbar and the keyboard", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <FileManager
        entries={entries}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete selected",
    });

    expect(deleteButton).toBeDisabled();

    await user.click(
      screen.getByRole("option", {
        name: /brief\.pdf/,
      })
    );

    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenLastCalledWith([
      entries[3],
    ]);

    const readme = screen.getByRole("option", {
      name: /README\.md/,
    });

    await user.click(readme);
    await user.keyboard("{Delete}");

    expect(onDelete).toHaveBeenLastCalledWith([
      entries[2],
    ]);
  });

  it("supports flat entries linked with parentId", async () => {
    const user = userEvent.setup();

    const flat: PimoluFileEntry[] = [
      {
        id: "docs",
        name: "Docs",
        type: "folder",
      },
      {
        id: "assets",
        name: "Assets",
        type: "folder",
      },
      {
        id: "specs",
        name: "Specs.txt",
        type: "file",
        parentId: "docs",
        size: 120,
      },
      {
        id: "logo",
        name: "logo.png",
        type: "file",
        parentId: "assets",
        size: 2_000,
        mime: "image/png",
      },
      {
        id: "root-file",
        name: "Root.txt",
        type: "file",
        size: 50,
      },
    ];

    render(<FileManager entries={flat} />);

    expect(optionIds()).toEqual([
      "assets",
      "docs",
      "root-file",
    ]);

    await user.dblClick(folder("Docs"));

    expect(optionIds()).toEqual(["specs"]);
    expect(
      screen.getByText("Docs")
    ).toBeInTheDocument();
  });

  it("shows the empty-folder state", () => {
    render(<FileManager entries={[]} />);

    expect(
      screen.getByText("This folder is empty")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("listbox")
    ).not.toBeInTheDocument();
  });
});
