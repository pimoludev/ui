import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataGrid } from "./data-grid";
import type { PimoluDataGridColumn } from "./data-grid.types";

interface Member {
  id: string;
  name: string;
  role: string;
  team: string;
  score: number;
}

const members: Member[] = [
  {
    id: "r1",
    name: "Zoe Adams",
    role: "Designer",
    team: "Design",
    score: 82,
  },
  {
    id: "r2",
    name: "Alice Martin",
    role: "Engineer",
    team: "Platform",
    score: 94,
  },
  {
    id: "r3",
    name: "Maya Chen",
    role: "Designer",
    team: "Design",
    score: 76,
  },
  {
    id: "r4",
    name: "Noah Dubois",
    role: "Manager",
    team: "Platform",
    score: 68,
  },
];

const columns: PimoluDataGridColumn<Member>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    width: 180,
    minWidth: 140,
    maxWidth: 260,
    resizable: true,
  },
  {
    id: "role",
    header: "Role",
    sortable: true,
    width: 140,
  },
  {
    id: "team",
    header: "Team",
    width: 140,
  },
  {
    id: "score",
    header: "Score",
    align: "end",
    sortable: true,
    width: 100,
    accessor: (row) => row.score,
  },
];

function getRowId(row: Member) {
  return row.id;
}

function getBodyRows() {
  return screen.getAllByRole("row").slice(1);
}

function getHeader(name: RegExp) {
  return screen.getByRole("columnheader", {
    name,
  });
}

describe("Pimolu DataGrid", () => {
  it("renders a named grid with its columns and rows", () => {
    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
      />
    );

    expect(
      screen.getByRole("table", {
        name: "Team members",
      })
    ).toBeInTheDocument();

    expect(getHeader(/^Name/)).toHaveAttribute(
      "aria-sort",
      "none"
    );

    expect(getHeader(/^Team/)).not.toHaveAttribute(
      "aria-sort"
    );

    expect(screen.getByText("Zoe Adams")).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(4);

    expect(
      screen.getByRole("searchbox", {
        name: "Filter rows",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Columns",
      })
    ).toBeInTheDocument();
  });

  it("sorts locally, cycling ascending, descending and none", () => {
    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
      />
    );

    const sortButton = screen.getByRole("button", {
      name: "Sort by Name",
    });

    fireEvent.click(sortButton);

    expect(getHeader(/^Name/)).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    expect(getBodyRows()[0]).toHaveTextContent(
      "Alice Martin"
    );

    fireEvent.click(sortButton);

    expect(getHeader(/^Name/)).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(getBodyRows()[0]).toHaveTextContent(
      "Zoe Adams"
    );

    fireEvent.click(sortButton);

    expect(getHeader(/^Name/)).toHaveAttribute(
      "aria-sort",
      "none"
    );
    expect(getBodyRows()[0]).toHaveTextContent(
      "Zoe Adams"
    );
  });

  it("filters locally and shows the no-result empty state", () => {
    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
      />
    );

    const filter = screen.getByRole("searchbox", {
      name: "Filter rows",
    });

    fireEvent.change(filter, {
      target: { value: "engineer" },
    });

    expect(getBodyRows()).toHaveLength(1);
    expect(
      screen.getByText("Alice Martin")
    ).toBeInTheDocument();

    fireEvent.change(filter, {
      target: { value: "nothing" },
    });

    expect(
      screen.getByText("No rows to display.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("No rows match “nothing”.")
    ).toBeInTheDocument();
  });

  it("reports server intent without filtering or sorting locally", () => {
    const onSortChange = vi.fn();
    const onFilterChange = vi.fn();
    const onPageChange = vi.fn();

    render(
      <DataGrid
        mode="server"
        data={members.slice(0, 2)}
        columns={columns}
        getRowId={getRowId}
        caption="Server members"
        totalRows={12}
        page={1}
        pageSize={2}
        filter=""
        sort={{ columnId: "name", direction: "asc" }}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        onPageChange={onPageChange}
      />
    );

    expect(
      screen.getByText("Showing 1–2 of 12")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort by Name",
      })
    );

    expect(onSortChange).toHaveBeenCalledWith({
      columnId: "name",
      direction: "desc",
    });

    /* The server owns the order: the loaded rows stay untouched. */

    expect(getBodyRows()[0]).toHaveTextContent(
      "Zoe Adams"
    );

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Filter rows",
      }),
      { target: { value: "alice" } }
    );

    expect(onFilterChange).toHaveBeenCalledWith("alice");
    expect(getBodyRows()).toHaveLength(2);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next page",
      })
    );

    expect(onPageChange).toHaveBeenCalledWith(2);

    /* The controlled page keeps the displayed range until it changes. */

    expect(
      screen.getByText("Showing 1–2 of 12")
    ).toBeInTheDocument();
  });

  it("groups rows, shows counts and toggles a group", () => {
    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Grouped members"
        groupBy="team"
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Collapse group Design",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Collapse group Platform",
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText("2 rows")).toHaveLength(2);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Collapse group Design",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Expand group Design",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Zoe Adams")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Alice Martin")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expand group Design",
      })
    );

    expect(
      screen.getByText("Zoe Adams")
    ).toBeInTheDocument();

    /* Sorting runs before grouping, so the groups follow the sorted rows. */

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort by Score",
      })
    );

    const groupButtons = screen.getAllByRole("button", {
      name: /group (Design|Platform)/,
    });

    expect(groupButtons[0]).toHaveAccessibleName(
      "Collapse group Platform"
    );
    expect(groupButtons[1]).toHaveAccessibleName(
      "Collapse group Design"
    );
  });

  it("resizes a column with the pointer and reports the widths", () => {
    const onColumnWidthsChange = vi.fn();

    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        defaultColumnWidths={{ name: 160 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    );

    const handle = screen.getByRole("separator", {
      name: "Resize Name column",
    });

    fireEvent.pointerDown(handle, {
      button: 0,
      clientX: 100,
      pointerId: 1,
    });

    fireEvent.pointerMove(handle, {
      clientX: 140,
      pointerId: 1,
    });

    fireEvent.pointerUp(handle, {
      clientX: 140,
      pointerId: 1,
    });

    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
      name: 200,
    });

    expect(getHeader(/^Name/)).toHaveStyle({
      width: "200px",
    });
  });

  it("resizes from the keyboard and clamps to min and max", () => {
    const onColumnWidthsChange = vi.fn();

    const { rerender } = render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        defaultColumnWidths={{ name: 160 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    );

    const handle = screen.getByRole("separator", {
      name: "Resize Name column",
    });

    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(getHeader(/^Name/)).toHaveStyle({
      width: "144px",
    });

    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(getHeader(/^Name/)).toHaveStyle({
      width: "140px",
    });

    for (let index = 0; index < 8; index += 1) {
      fireEvent.keyDown(handle, {
        key: "ArrowRight",
      });
    }

    expect(getHeader(/^Name/)).toHaveStyle({
      width: "260px",
    });

    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
      name: 260,
    });

    /* A controlled width map stays authoritative after a resize. */

    rerender(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        columnWidths={{ name: 150 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    );

    expect(getHeader(/^Name/)).toHaveStyle({
      width: "150px",
    });

    fireEvent.keyDown(
      screen.getByRole("separator", {
        name: "Resize Name column",
      }),
      { key: "ArrowRight" }
    );

    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
      name: 166,
    });
    expect(getHeader(/^Name/)).toHaveStyle({
      width: "150px",
    });
  });

  it("hides and shows columns from the visibility menu", () => {
    const onHiddenColumnsChange = vi.fn();

    const { rerender } = render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        defaultHiddenColumns={["role"]}
        onHiddenColumnsChange={onHiddenColumnsChange}
      />
    );

    expect(
      screen.queryByRole("columnheader", {
        name: /^Role/,
      })
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Columns",
      })
    );

    const roleToggle = screen.getByRole("checkbox", {
      name: "Role",
    });

    expect(roleToggle).not.toBeChecked();

    fireEvent.click(roleToggle);

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(
      []
    );
    expect(getHeader(/^Role/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Team",
      })
    );

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(
      ["team"]
    );
    expect(
      screen.queryByRole("columnheader", {
        name: /^Team/,
      })
    ).not.toBeInTheDocument();

    /* Switching the same grid to a controlled list keeps it authoritative. */

    rerender(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        hiddenColumns={[]}
        onHiddenColumnsChange={onHiddenColumnsChange}
      />
    );

    expect(getHeader(/^Team/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Team",
      })
    );

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(
      ["team"]
    );
    expect(getHeader(/^Team/)).toBeInTheDocument();

    rerender(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        hiddenColumns={["team"]}
        onHiddenColumnsChange={onHiddenColumnsChange}
      />
    );

    expect(
      screen.queryByRole("columnheader", {
        name: /^Team/,
      })
    ).not.toBeInTheDocument();
  });

  it("selects rows, selects the page and clears the selection", () => {
    const onSelectionChange = vi.fn();

    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select row r2",
      })
    );

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "r2",
    ]);
    expect(screen.getByText("1 selected")).toBeInTheDocument();

    const selectAll = screen.getByRole("checkbox", {
      name: "Select all rows",
    });

    fireEvent.click(selectAll);

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "r1",
      "r2",
      "r3",
      "r4",
    ]);
    expect(selectAll).toBeChecked();

    getBodyRows().forEach((row) => {
      expect(
        within(row).getByRole("checkbox")
      ).toBeChecked();
    });

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select row r1",
      })
    );

    expect(selectAll).toBePartiallyChecked();
    expect(screen.getByText("3 selected")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear selection",
      })
    );

    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    expect(selectAll).not.toBeChecked();
  });

  it("paginates and changes the page size", () => {
    const onPageSizeChange = vi.fn();

    const manyMembers = Array.from(
      { length: 25 },
      (_, index): Member => ({
        id: `m-${index + 1}`,
        name: `Member ${String(index + 1).padStart(2, "0")}`,
        role: "Member",
        team: "Platform",
        score: index,
      })
    );

    render(
      <DataGrid
        data={manyMembers}
        columns={columns}
        getRowId={getRowId}
        caption="Directory"
        filterable={false}
        defaultPageSize={10}
        pageSizeOptions={[5, 10]}
        onPageSizeChange={onPageSizeChange}
      />
    );

    expect(getBodyRows()).toHaveLength(10);
    expect(
      screen.getByText("Showing 1–10 of 25")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next page",
      })
    );

    expect(
      screen.getByText("Showing 11–20 of 25")
    ).toBeInTheDocument();
    expect(screen.getByText("Member 11")).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText("Rows per page"),
      { target: { value: "5" } }
    );

    expect(onPageSizeChange).toHaveBeenCalledWith(5);
    expect(
      screen.getByText("Showing 1–5 of 25")
    ).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(5);
  });

  it("shows a busy status while loading", () => {
    render(
      <DataGrid
        data={members}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        loading
      />
    );

    expect(
      screen.getByRole("table", {
        name: "Team members",
      })
    ).toHaveAttribute("aria-busy", "true");

    expect(
      screen.getByText("Loading data…")
    ).toBeInTheDocument();
  });

  it("renders a custom empty state and an aria-label", () => {
    render(
      <DataGrid
        data={[]}
        columns={columns}
        getRowId={getRowId}
        ariaLabel="Empty report"
        emptyState={<span>Nothing here yet</span>}
      />
    );

    expect(
      screen.getByRole("table", {
        name: "Empty report",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Nothing here yet")
    ).toBeInTheDocument();
  });
});
