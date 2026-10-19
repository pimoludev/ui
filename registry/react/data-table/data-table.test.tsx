import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./data-table";
import type { PimoluDataTableColumn } from "./data-table.types";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  orders: number;
}

const users: User[] = [
  {
    id: "u1",
    name: "Maya Chen",
    email: "maya@example.com",
    role: "Designer",
    orders: 32,
  },
  {
    id: "u2",
    name: "Alice Martin",
    email: "alice@example.com",
    role: "Engineer",
    orders: 18,
  },
  {
    id: "u3",
    name: "Noah Dubois",
    email: "noah@example.com",
    role: "Manager",
    orders: 45,
  },
  {
    id: "u4",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Analyst",
    orders: 7,
  },
];

const columns: PimoluDataTableColumn<User>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    accessor: (row) => row.name,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email,
  },
  {
    id: "role-label",
    header: "Role",
    sortable: true,
    /* No raw `role-label` property: search and sort read the cell text. */
    cell: (row) => <span>{row.role}</span>,
  },
  {
    id: "orders",
    header: "Orders",
    align: "end",
    sortable: true,
    accessor: (row) => row.orders,
  },
];

function getRowId(row: User) {
  return row.id;
}

function getBodyRows() {
  return screen.getAllByRole("row").slice(1);
}

describe("Pimolu DataTable", () => {
  it("renders a named table, its columns and its rows", () => {
    render(
      <DataTable
        data={users}
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

    expect(
      screen.getByRole("columnheader", {
        name: "Name",
      })
    ).toHaveAttribute("aria-sort", "none");

    expect(
      screen.getByRole("columnheader", {
        name: "Email",
      })
    ).not.toHaveAttribute("aria-sort");

    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(4);

    expect(
      screen.getByLabelText("Filter rows")
    ).toBeInTheDocument();
  });

  it("filters globally and case-insensitively, then shows the empty state", () => {
    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
      />
    );

    const filter = screen.getByLabelText("Filter rows");

    fireEvent.change(filter, {
      target: { value: "ALICE" },
    });

    expect(screen.getByText("Alice Martin")).toBeInTheDocument();
    expect(
      screen.queryByText("Maya Chen")
    ).not.toBeInTheDocument();

    fireEvent.change(filter, {
      target: { value: "engineer" },
    });

    expect(screen.getByText("Alice Martin")).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(1);

    fireEvent.change(filter, {
      target: { value: "nobody" },
    });

    expect(
      screen.getByText("No rows to display.")
    ).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(1);
  });

  it("sorts ascending, descending and back to none with aria-sort", () => {
    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
      />
    );

    const sortButton = screen.getByRole("button", {
      name: "Sort by Name",
    });

    const header = screen.getByRole("columnheader", {
      name: "Name",
    });

    fireEvent.click(sortButton);

    expect(header).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    expect(getBodyRows()[0]).toHaveTextContent("Alice Martin");

    fireEvent.click(sortButton);

    expect(header).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(getBodyRows()[0]).toHaveTextContent("Noah Dubois");

    fireEvent.click(sortButton);

    expect(header).toHaveAttribute("aria-sort", "none");
    expect(getBodyRows()[0]).toHaveTextContent("Maya Chen");
  });

  it("selects one row, all rows and reports the indeterminate state", () => {
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select row u2",
      })
    );

    expect(onSelectionChange).toHaveBeenLastCalledWith(["u2"]);
    expect(
      screen.getByRole("checkbox", {
        name: "Select row u2",
      })
    ).toBeChecked();

    const selectAll = screen.getByRole("checkbox", {
      name: "Select all rows",
    });

    fireEvent.click(selectAll);

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "u1",
      "u2",
      "u3",
      "u4",
    ]);

    expect(selectAll).toBeChecked();
    expect(getBodyRows()).toHaveLength(4);

    getBodyRows().forEach((row) => {
      expect(
        within(row).getByRole("checkbox")
      ).toBeChecked();
    });

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select row u1",
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
    expect(selectAll).not.toBePartiallyChecked();
  });

  it("paginates rows and announces the visible range", () => {
    const manyUsers = Array.from(
      { length: 25 },
      (_, index): User => ({
        id: `user-${index + 1}`,
        name: `User ${String(index + 1).padStart(2, "0")}`,
        email: `user${index + 1}@example.com`,
        role: "Member",
        orders: index + 1,
      })
    );

    render(
      <DataTable
        data={manyUsers}
        columns={columns}
        getRowId={getRowId}
        caption="Directory"
        filterable={false}
        pageSize={10}
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
    expect(screen.getByText("User 11")).toBeInTheDocument();
    expect(
      screen.queryByText("User 10")
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 3",
      })
    );

    expect(
      screen.getByText("Showing 21–25 of 25")
    ).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(5);
  });

  it("follows controlled selection and the selection callback", () => {
    const onSelectionChange = vi.fn();

    const { rerender } = render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        selectable
        selectedRowIds={["u1"]}
        onSelectionChange={onSelectionChange}
      />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Select row u1",
      })
    ).toBeChecked();

    const secondRow = screen.getByRole("checkbox", {
      name: "Select row u2",
    });

    fireEvent.click(secondRow);

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      "u1",
      "u2",
    ]);
    expect(secondRow).not.toBeChecked();

    rerender(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        selectable
        selectedRowIds={["u1", "u2"]}
        onSelectionChange={onSelectionChange}
      />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Select row u2",
      })
    ).toBeChecked();
  });

  it("follows a controlled page", () => {
    const onPageChange = vi.fn();

    const { rerender } = render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        filterable={false}
        page={2}
        pageSize={2}
        onPageChange={onPageChange}
      />
    );

    expect(
      screen.getByText("Showing 3–4 of 4")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 1",
      })
    );

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(
      screen.getByText("Showing 3–4 of 4")
    ).toBeInTheDocument();

    rerender(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        filterable={false}
        page={1}
        pageSize={2}
        onPageChange={onPageChange}
      />
    );

    expect(
      screen.getByText("Showing 1–2 of 4")
    ).toBeInTheDocument();
  });

  it("renders a custom empty state and an aria-label", () => {
    render(
      <DataTable
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
    expect(
      screen.getByRole("columnheader", {
        name: "Name",
      })
    ).toBeInTheDocument();
  });

  it("exposes accessible names and sorts from the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={users}
        columns={columns}
        getRowId={getRowId}
        caption="Team members"
        selectable
      />
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Filter rows",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: "Select all rows",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: "Select row u3",
      })
    ).toBeInTheDocument();

    const sortButton = screen.getByRole("button", {
      name: "Sort by Name",
    });

    sortButton.focus();

    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("columnheader", {
        name: "Name",
      })
    ).toHaveAttribute("aria-sort", "ascending");
  });

  it("shows a busy status while loading", () => {
    render(
      <DataTable
        data={users}
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
});
