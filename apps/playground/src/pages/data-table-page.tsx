import { CustomizationExample } from "./data-table-customization-demo";
import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  DataTable,
  type PimoluDataTableColumn,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DATA
========================================= */

type UserStatus = "Active" | "Invited" | "Suspended";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  orders: number;
  spend: number;
  joined: string;
}

const users: UserRow[] = [
  {
    id: "u1",
    name: "Alice Martin",
    email: "alice.martin@northwind.io",
    role: "Owner",
    status: "Active",
    orders: 48,
    spend: 12480,
    joined: "2023-01-14",
  },
  {
    id: "u2",
    name: "Noah Dubois",
    email: "noah.dubois@northwind.io",
    role: "Admin",
    status: "Active",
    orders: 31,
    spend: 8460,
    joined: "2023-03-02",
  },
  {
    id: "u3",
    name: "Maya Chen",
    email: "maya.chen@northwind.io",
    role: "Designer",
    status: "Active",
    orders: 24,
    spend: 6180,
    joined: "2023-05-19",
  },
  {
    id: "u4",
    name: "Liam O'Connor",
    email: "liam.oconnor@northwind.io",
    role: "Engineer",
    status: "Invited",
    orders: 0,
    spend: 0,
    joined: "2026-09-30",
  },
  {
    id: "u5",
    name: "Sofia Rossi",
    email: "sofia.rossi@northwind.io",
    role: "Analyst",
    status: "Active",
    orders: 57,
    spend: 18920,
    joined: "2022-11-08",
  },
  {
    id: "u6",
    name: "Ethan Walker",
    email: "ethan.walker@northwind.io",
    role: "Support",
    status: "Active",
    orders: 19,
    spend: 4320,
    joined: "2024-02-21",
  },
  {
    id: "u7",
    name: "Amara Okafor",
    email: "amara.okafor@northwind.io",
    role: "Finance",
    status: "Active",
    orders: 36,
    spend: 10740,
    joined: "2023-07-11",
  },
  {
    id: "u8",
    name: "Hugo Laurent",
    email: "hugo.laurent@northwind.io",
    role: "Engineer",
    status: "Suspended",
    orders: 8,
    spend: 1640,
    joined: "2025-01-27",
  },
  {
    id: "u9",
    name: "Priya Sharma",
    email: "priya.sharma@northwind.io",
    role: "Manager",
    status: "Active",
    orders: 63,
    spend: 24800,
    joined: "2021-09-06",
  },
  {
    id: "u10",
    name: "Lucas Meyer",
    email: "lucas.meyer@northwind.io",
    role: "Designer",
    status: "Invited",
    orders: 0,
    spend: 0,
    joined: "2026-10-04",
  },
  {
    id: "u11",
    name: "Emma Thompson",
    email: "emma.thompson@northwind.io",
    role: "Support",
    status: "Active",
    orders: 27,
    spend: 7390,
    joined: "2024-06-17",
  },
  {
    id: "u12",
    name: "Kenji Sato",
    email: "kenji.sato@northwind.io",
    role: "Engineer",
    status: "Active",
    orders: 41,
    spend: 13560,
    joined: "2022-04-25",
  },
  {
    id: "u13",
    name: "Nadia Benali",
    email: "nadia.benali@northwind.io",
    role: "Analyst",
    status: "Active",
    orders: 15,
    spend: 3980,
    joined: "2025-08-12",
  },
  {
    id: "u14",
    name: "Oliver Grant",
    email: "oliver.grant@northwind.io",
    role: "Manager",
    status: "Suspended",
    orders: 6,
    spend: 1120,
    joined: "2025-03-03",
  },
];

type OrderStatus = "Paid" | "Shipped" | "Pending" | "Refunded";

interface OrderRow {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  placed: string;
}

const orders: OrderRow[] = [
  {
    id: "ORD-1042",
    customer: "Sofia Rossi",
    items: 3,
    total: 248.5,
    status: "Paid",
    placed: "2026-10-18",
  },
  {
    id: "ORD-1041",
    customer: "Kenji Sato",
    items: 1,
    total: 89,
    status: "Shipped",
    placed: "2026-10-18",
  },
  {
    id: "ORD-1040",
    customer: "Priya Sharma",
    items: 5,
    total: 512.75,
    status: "Paid",
    placed: "2026-10-17",
  },
  {
    id: "ORD-1039",
    customer: "Ethan Walker",
    items: 2,
    total: 64.9,
    status: "Refunded",
    placed: "2026-10-17",
  },
  {
    id: "ORD-1038",
    customer: "Alice Martin",
    items: 4,
    total: 318,
    status: "Paid",
    placed: "2026-10-16",
  },
  {
    id: "ORD-1037",
    customer: "Maya Chen",
    items: 1,
    total: 42,
    status: "Pending",
    placed: "2026-10-16",
  },
  {
    id: "ORD-1036",
    customer: "Noah Dubois",
    items: 2,
    total: 126.4,
    status: "Shipped",
    placed: "2026-10-15",
  },
  {
    id: "ORD-1035",
    customer: "Amara Okafor",
    items: 6,
    total: 734.2,
    status: "Paid",
    placed: "2026-10-15",
  },
  {
    id: "ORD-1034",
    customer: "Nadia Benali",
    items: 1,
    total: 29.99,
    status: "Refunded",
    placed: "2026-10-14",
  },
  {
    id: "ORD-1033",
    customer: "Lucas Meyer",
    items: 3,
    total: 187.5,
    status: "Pending",
    placed: "2026-10-14",
  },
  {
    id: "ORD-1032",
    customer: "Emma Thompson",
    items: 2,
    total: 96.8,
    status: "Paid",
    placed: "2026-10-13",
  },
  {
    id: "ORD-1031",
    customer: "Hugo Laurent",
    items: 1,
    total: 54,
    status: "Shipped",
    placed: "2026-10-13",
  },
];

/* =========================================
   FORMATTERS AND COLUMNS
========================================= */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const shortDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const userStatusVariant: Record<
  UserStatus,
  "success" | "warning" | "danger"
> = {
  Active: "success",
  Invited: "warning",
  Suspended: "danger",
};

const orderStatusVariant: Record<
  OrderStatus,
  "success" | "primary" | "warning" | "neutral"
> = {
  Paid: "success",
  Shipped: "primary",
  Pending: "warning",
  Refunded: "neutral",
};

const userColumns: PimoluDataTableColumn<UserRow>[] = [
  {
    id: "name",
    header: "Member",
    sortable: true,
    width: "20rem",
    searchValue: (row) => `${row.name} ${row.email}`,
    sortValue: (row) => row.name,
    cell: (row) => (
      <span className="pg-data-table-member">
        <Avatar name={row.name} size="sm" />

        <span className="pg-data-table-member__text">
          {row.name}
          <br />
          <span className="pg-meta pg-data-table-member__email">
            {row.email}
          </span>
        </span>
      </span>
    ),
  },
  {
    id: "role",
    header: "Role",
    sortable: true,
    width: "8rem",
    accessor: (row) => row.role,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    width: "8rem",
    sortValue: (row) => row.status,
    accessor: (row) => (
      <Badge
        variant={userStatusVariant[row.status]}
        appearance="soft"
        size="sm"
      >
        {row.status}
      </Badge>
    ),
  },
  {
    id: "orders",
    header: "Orders",
    align: "end",
    sortable: true,
    width: "6rem",
    accessor: (row) => row.orders,
  },
  {
    id: "spend",
    header: "Lifetime spend",
    align: "end",
    sortable: true,
    width: "9rem",
    sortValue: (row) => row.spend,
    accessor: (row) => currency.format(row.spend),
  },
  {
    id: "joined",
    header: "Joined",
    sortable: true,
    width: "8rem",
    sortValue: (row) => row.joined,
    accessor: (row) =>
      shortDate.format(new Date(`${row.joined}T00:00:00`)),
  },
];

const orderColumns: PimoluDataTableColumn<OrderRow>[] = [
  {
    id: "id",
    header: "Order",
    sortable: true,
    width: "8rem",
    accessor: (row) => row.id,
  },
  {
    id: "customer",
    header: "Customer",
    sortable: true,
    accessor: (row) => row.customer,
  },
  {
    id: "items",
    header: "Items",
    align: "end",
    width: "5rem",
    accessor: (row) => row.items,
  },
  {
    id: "total",
    header: "Total",
    align: "end",
    sortable: true,
    width: "7rem",
    sortValue: (row) => row.total,
    accessor: (row) => currency.format(row.total),
  },
  {
    id: "status",
    header: "Status",
    width: "7rem",
    accessor: (row) => (
      <Badge
        variant={orderStatusVariant[row.status]}
        appearance="soft"
        size="sm"
      >
        {row.status}
      </Badge>
    ),
  },
  {
    id: "placed",
    header: "Placed",
    sortable: true,
    width: "8rem",
    sortValue: (row) => row.placed,
    accessor: (row) =>
      shortDate.format(new Date(`${row.placed}T00:00:00`)),
  },
];

/* =========================================
   EXAMPLES
========================================= */

function ControlledSelectionTable() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([
    "u2",
  ]);

  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          {selectedRowIds.length > 0
            ? `Selection: ${selectedRowIds.join(", ")}`
            : "No member selected"}
        </span>

        <Button
          size="sm"
          variant="primary"
          appearance="outline"
          disabled={selectedRowIds.length === 0}
        >
          Archive members
        </Button>
      </div>

      <DataTable
        data={users}
        columns={userColumns}
        getRowId={(row) => row.id}
        getRowLabel={(row) => `Select ${row.name}`}
        caption="Members with controlled selection"
        selectable
        pageSize={5}
        selectedRowIds={selectedRowIds}
        onSelectionChange={setSelectedRowIds}
      />
    </div>
  );
}

function LoadingTable() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button
          size="sm"
          variant="neutral"
          appearance="outline"
          onClick={() => setLoading((value) => !value)}
        >
          {loading ? "Finish loading" : "Reload"}
        </Button>

        <span className="pg-meta">
          The table stays rendered and announces its busy state.
        </span>
      </div>

      <DataTable
        data={users.slice(0, 4)}
        columns={userColumns}
        getRowId={(row) => row.id}
        caption="Loading members"
        filterable={false}
        pagination={false}
        loading={loading}
      />
    </div>
  );
}

function EmptyTable() {
  return (
    <DataTable
      data={[]}
      columns={userColumns}
      getRowId={(row) => row.id}
      caption="Empty workspace"
      filterable={false}
      pagination={false}
      emptyState={
        <div className="pg-stack">
          <strong>No members yet</strong>

          <span className="pg-meta">
            Invite your first teammate to start
            assigning orders.
          </span>
        </div>
      }
    />
  );
}

export function DataTablePage() {
  return (
    <>
      <PageHeader
        title="DataTable"
        hint="A typed table with global filtering, column sorting, row selection, pagination, an empty state and an optional loading overlay. It composes the Table primitives with Input, Checkbox, Button and Pagination; styles come from @pimolu/web-styles/data-table.css."
      />

      <Section
        title="Team directory"
        hint="Filter across every column, sort by any sortable header, select a page of rows and paginate. The header checkbox reflects the visible page and becomes indeterminate when only some rows are selected."
      >
        <DataTable
          data={users}
          columns={userColumns}
          getRowId={(row) => row.id}
          getRowLabel={(row) => `Select ${row.name}`}
          caption="Workspace members"
          selectable
          stickyHeader
          pageSize={7}
        />
      </Section>

      <Section
        title="Controlled selection"
        hint="selectedRowIds and onSelectionChange keep the selection in the page so a bulk action can react to it. The table still owns the select-all checkbox and the indeterminate state."
      >
        <ControlledSelectionTable />
      </Section>

      <Section
        title="Recent orders"
        hint="The same API drives a denser order table: currency and date cells are formatted with custom accessors while sortValue keeps the raw numeric and ISO values."
      >
        <DataTable
          data={orders}
          columns={orderColumns}
          getRowId={(row) => row.id}
          caption="Recent orders"
          pageSize={5}
        />
      </Section>

      <Section
        title="States"
        hint="A loading overlay for refetches and a custom empty state for a workspace without members."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <LoadingTable />
          <EmptyTable />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
