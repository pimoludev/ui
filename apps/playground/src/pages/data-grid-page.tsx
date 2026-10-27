import { CustomizationExample } from "./data-grid-customization-demo";
import { useMemo, useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  DataGrid,
  type PimoluDataGridColumn,
  type PimoluDataGridSort,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DATA
========================================= */

type OrderStatus =
  | "Paid"
  | "Pending"
  | "Shipped"
  | "Refunded";

interface Order {
  id: string;
  customer: string;
  email: string;
  region: string;
  status: OrderStatus;
  total: number;
  placed: string;
}

const customers = [
  {
    name: "Sofia Rossi",
    email: "sofia.rossi@northwind.io",
  },
  {
    name: "Kenji Sato",
    email: "kenji.sato@northwind.io",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@northwind.io",
  },
  {
    name: "Alice Martin",
    email: "alice.martin@northwind.io",
  },
  {
    name: "Noah Dubois",
    email: "noah.dubois@northwind.io",
  },
  {
    name: "Maya Chen",
    email: "maya.chen@northwind.io",
  },
  {
    name: "Ethan Walker",
    email: "ethan.walker@northwind.io",
  },
  {
    name: "Amara Okafor",
    email: "amara.okafor@northwind.io",
  },
];

const regions = [
  "Europe",
  "North America",
  "Asia-Pacific",
  "LATAM",
];

const orderStatuses: OrderStatus[] = [
  "Paid",
  "Shipped",
  "Pending",
  "Paid",
  "Refunded",
];

const orders: Order[] = Array.from(
  { length: 42 },
  (_, index) => {
    const customer =
      customers[index % customers.length];

    return {
      id: `ORD-${1200 + index}`,
      customer: customer.name,
      email: customer.email,
      region: regions[index % regions.length],
      status:
        orderStatuses[index % orderStatuses.length],
      total: 48 + ((index * 173) % 1800) / 2,
      placed: new Date(
        Date.UTC(2026, 9, 18 - (index % 20))
      )
        .toISOString()
        .slice(0, 10),
    };
  }
);

type MemberStatus =
  | "Active"
  | "Invited"
  | "Suspended";

interface Member {
  id: string;
  name: string;
  email: string;
  team: string;
  role: string;
  status: MemberStatus;
  joined: string;
  spend: number;
}

const members: Member[] = [
  {
    id: "m1",
    name: "Alice Martin",
    email: "alice@northwind.io",
    team: "Design",
    role: "Design lead",
    status: "Active",
    joined: "2023-01-14",
    spend: 12480,
  },
  {
    id: "m2",
    name: "Maya Chen",
    email: "maya@northwind.io",
    team: "Design",
    role: "Product designer",
    status: "Active",
    joined: "2023-05-19",
    spend: 6180,
  },
  {
    id: "m3",
    name: "Lucas Meyer",
    email: "lucas@northwind.io",
    team: "Design",
    role: "Brand designer",
    status: "Invited",
    joined: "2026-10-04",
    spend: 0,
  },
  {
    id: "m4",
    name: "Noah Dubois",
    email: "noah@northwind.io",
    team: "Engineering",
    role: "Staff engineer",
    status: "Active",
    joined: "2023-03-02",
    spend: 8460,
  },
  {
    id: "m5",
    name: "Kenji Sato",
    email: "kenji@northwind.io",
    team: "Engineering",
    role: "Frontend engineer",
    status: "Active",
    joined: "2022-04-25",
    spend: 13560,
  },
  {
    id: "m6",
    name: "Hugo Laurent",
    email: "hugo@northwind.io",
    team: "Engineering",
    role: "Platform engineer",
    status: "Suspended",
    joined: "2025-01-27",
    spend: 1640,
  },
  {
    id: "m7",
    name: "Priya Sharma",
    email: "priya@northwind.io",
    team: "Growth",
    role: "Growth manager",
    status: "Active",
    joined: "2021-09-06",
    spend: 24800,
  },
  {
    id: "m8",
    name: "Emma Thompson",
    email: "emma@northwind.io",
    team: "Growth",
    role: "Lifecycle marketer",
    status: "Active",
    joined: "2024-06-17",
    spend: 7390,
  },
  {
    id: "m9",
    name: "Nadia Benali",
    email: "nadia@northwind.io",
    team: "Growth",
    role: "Content strategist",
    status: "Active",
    joined: "2025-08-12",
    spend: 3980,
  },
  {
    id: "m10",
    name: "Sofia Rossi",
    email: "sofia@northwind.io",
    team: "Support",
    role: "Support lead",
    status: "Active",
    joined: "2022-11-08",
    spend: 18920,
  },
  {
    id: "m11",
    name: "Ethan Walker",
    email: "ethan@northwind.io",
    team: "Support",
    role: "Support specialist",
    status: "Active",
    joined: "2024-02-21",
    spend: 4320,
  },
  {
    id: "m12",
    name: "Amara Okafor",
    email: "amara@northwind.io",
    team: "Finance",
    role: "Finance manager",
    status: "Active",
    joined: "2023-07-11",
    spend: 10740,
  },
  {
    id: "m13",
    name: "Liam O'Connor",
    email: "liam@northwind.io",
    team: "Finance",
    role: "Analyst",
    status: "Invited",
    joined: "2026-09-30",
    spend: 0,
  },
  {
    id: "m14",
    name: "Oliver Grant",
    email: "oliver@northwind.io",
    team: "Support",
    role: "Support specialist",
    status: "Suspended",
    joined: "2025-03-03",
    spend: 1120,
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

function formatDate(value: string) {
  return shortDate.format(
    new Date(`${value}T00:00:00`)
  );
}

const orderStatusVariant: Record<
  OrderStatus,
  "success" | "primary" | "warning" | "neutral"
> = {
  Paid: "success",
  Shipped: "primary",
  Pending: "warning",
  Refunded: "neutral",
};

const memberStatusVariant: Record<
  MemberStatus,
  "success" | "warning" | "danger"
> = {
  Active: "success",
  Invited: "warning",
  Suspended: "danger",
};

const orderColumns: PimoluDataGridColumn<Order>[] = [
  {
    id: "id",
    header: "Order",
    label: "order",
    sortable: true,
    width: 110,
    minWidth: 90,
    resizable: true,
  },
  {
    id: "customer",
    header: "Customer",
    label: "customer",
    sortable: true,
    width: 230,
    minWidth: 180,
    resizable: true,
    cell: (order) => (
      <span className="pg-member-cell">
        <Avatar name={order.customer} size="sm" />

        <span className="pg-member-cell__text">
          {order.customer}
          <br />
          <span className="pg-meta pg-member-cell__email">
            {order.email}
          </span>
        </span>
      </span>
    ),
  },
  {
    id: "region",
    header: "Region",
    label: "region",
    sortable: true,
    width: 130,
    resizable: true,
  },
  {
    id: "status",
    header: "Status",
    label: "status",
    sortable: true,
    width: 120,
    cell: (order) => (
      <Badge
        variant={orderStatusVariant[order.status]}
        appearance="soft"
        size="sm"
      >
        {order.status}
      </Badge>
    ),
  },
  {
    id: "total",
    header: "Total",
    label: "total",
    align: "end",
    sortable: true,
    width: 120,
    resizable: true,
    cell: (order) => currency.format(order.total),
  },
  {
    id: "placed",
    header: "Placed",
    label: "placed",
    sortable: true,
    width: 130,
    resizable: true,
    cell: (order) => formatDate(order.placed),
  },
];

const memberColumns: PimoluDataGridColumn<Member>[] = [
  {
    id: "name",
    header: "Member",
    label: "member",
    sortable: true,
    width: 250,
    minWidth: 180,
    resizable: true,
    searchValue: (member) =>
      `${member.name} ${member.email}`,
    cell: (member) => (
      <span className="pg-member-cell">
        <Avatar name={member.name} size="sm" />

        <span className="pg-member-cell__text">
          {member.name}
          <br />
          <span className="pg-meta pg-member-cell__email">{member.email}</span>
        </span>
      </span>
    ),
  },
  {
    id: "team",
    header: "Team",
    sortable: true,
    width: 140,
    resizable: true,
    groupValue: (member) => member.team,
  },
  {
    id: "role",
    header: "Role",
    width: 190,
    minWidth: 140,
    resizable: true,
  },
  {
    id: "status",
    header: "Status",
    width: 120,
    cell: (member) => (
      <Badge
        variant={memberStatusVariant[member.status]}
        appearance="soft"
        size="sm"
      >
        {member.status}
      </Badge>
    ),
  },
  {
    id: "joined",
    header: "Joined",
    width: 130,
    sortable: true,
    cell: (member) => formatDate(member.joined),
  },
  {
    id: "spend",
    header: "Lifetime spend",
    align: "end",
    sortable: true,
    width: 140,
    cell: (member) => currency.format(member.spend),
  },
];

/* =========================================
   SERVER MODE
========================================= */

function orderSortValue(
  order: Order,
  columnId: string
): string | number {
  switch (columnId) {
    case "customer":
      return order.customer;
    case "region":
      return order.region;
    case "status":
      return order.status;
    case "total":
      return order.total;
    case "placed":
      return order.placed;
    default:
      return order.id;
  }
}

function ServerOrdersGrid() {
  const [sort, setSort] =
    useState<PimoluDataGridSort | null>({
      columnId: "placed",
      direction: "desc",
    });

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  const [selectedOrderIds, setSelectedOrderIds] =
    useState<string[]>([]);

  const matchingOrders = useMemo(() => {
    const query = filter.trim().toLowerCase();

    const filtered = query
      ? orders.filter((order) =>
          [
            order.id,
            order.customer,
            order.email,
            order.region,
            order.status,
          ].some((value) =>
            value.toLowerCase().includes(query)
          )
        )
      : orders;

    if (!sort) return filtered;

    return [...filtered].sort((left, right) => {
      const leftValue = orderSortValue(
        left,
        sort.columnId
      );

      const rightValue = orderSortValue(
        right,
        sort.columnId
      );

      const comparison =
        typeof leftValue === "number" &&
        typeof rightValue === "number"
          ? leftValue - rightValue
          : String(leftValue).localeCompare(
              String(rightValue),
              undefined,
              { numeric: true }
            );

      return sort.direction === "asc"
        ? comparison
        : -comparison;
    });
  }, [filter, sort]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;

    return matchingOrders.slice(
      start,
      start + pageSize
    );
  }, [matchingOrders, page, pageSize]);

  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <div className="pg-row">
          <Button
            size="sm"
            variant="neutral"
            appearance="outline"
            onClick={() =>
              setLoading((value) => !value)
            }
          >
            {loading
              ? "Finish request"
              : "Simulate request"}
          </Button>

          <span className="pg-meta">
            {selectedOrderIds.length > 0
              ? `${selectedOrderIds.length} order(s) selected across pages`
              : "Sort, filter and paginate through callbacks"}
          </span>
        </div>

        <Button
          size="sm"
          variant="primary"
          appearance="outline"
          disabled={selectedOrderIds.length === 0}
        >
          Export selection
        </Button>
      </div>

      <DataGrid
        data={pageRows}
        columns={orderColumns}
        getRowId={(order) => order.id}
        getRowLabel={(order) =>
          `Select order ${order.id}`
        }
        caption="Server-driven order queue"
        mode="server"
        totalRows={matchingOrders.length}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        pageSizeOptions={[6, 12, 24]}
        loading={loading}
        selectable
        selectedRowIds={selectedOrderIds}
        onSelectionChange={setSelectedOrderIds}
        stickyHeader
      />
    </div>
  );
}

/* =========================================
   CLIENT MODE
========================================= */

function GroupedMembersGrid() {
  const [hiddenColumns, setHiddenColumns] = useState<
    string[]
  >(["spend"]);

  return (
    <div className="pg-stack">
      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          Hidden columns:{" "}
          {hiddenColumns.length > 0
            ? hiddenColumns.join(", ")
            : "none"}
        </span>

        <span className="pg-meta">
          Drag a separator, or focus it and use the
          arrow keys.
        </span>
      </div>

      <DataGrid
        data={members}
        columns={memberColumns}
        getRowId={(member) => member.id}
        getRowLabel={(member) =>
          `Select ${member.name}`
        }
        caption="Members grouped by team"
        groupBy="team"
        selectable
        pageSize={8}
        pageSizeOptions={[8, 16]}
        hiddenColumns={hiddenColumns}
        onHiddenColumnsChange={setHiddenColumns}
        defaultColumnWidths={{ name: 250, role: 190 }}
        stickyHeader
      />
    </div>
  );
}

/* =========================================
   PAGE
========================================= */

export function DataGridPage() {
  return (
    <>
      <PageHeader
        title="DataGrid"
        hint="An advanced typed grid: manual server mode, sortable and resizable columns, a column-visibility menu, grouping, selection and page-size control. It reuses the Table primitives with Checkbox, Input, Button, Popover, Pagination and EmptyState; styles come from @pimolu/web-styles/data-grid.css."
      />

      <Section
        title="Server-driven order queue"
        hint="The page plays the server: it filters, sorts and slices the rows itself, then feeds only the current page to the grid. The grid reports intent through onSortChange, onFilterChange, onPageChange and onPageSizeChange, and sizes pagination from totalRows. Selection is kept across pages because the parent owns selectedRowIds."
      >
        <ServerOrdersGrid />
      </Section>

      <Section
        title="Grouping, resizing and column visibility"
        hint="groupBy collects the filtered and sorted rows into expandable groups with their counts. The separators resize columns with the pointer and from the keyboard; columnWidths stays uncontrolled here while hiddenColumns is controlled by the page. The Columns menu keeps at least one column visible."
      >
        <GroupedMembersGrid />
      </Section>

      <Section
        title="Empty result"
        hint="When a manual request returns nothing, the grid still renders its headers and the empty state instead of collapsing."
      >
        <DataGrid
          data={[]}
          columns={memberColumns}
          getRowId={(member) => member.id}
          caption="No members match this filter"
          filterable={false}
          pagination={false}
          emptyState={
            <div className="pg-stack">
              <strong>No members found</strong>

              <span className="pg-meta">
                Invite a teammate or clear the filters to
                see rows again.
              </span>
            </div>
          }
        />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
