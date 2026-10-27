"use client";

import { DataTable, type PimoluDataTableColumn, Avatar, Badge } from "@pimolu/react";

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
const userStatusVariant: Record<UserStatus, "success" | "warning" | "danger"> = {
  Active: "success",
  Invited: "warning",
  Suspended: "danger",
};
const userColumns: PimoluDataTableColumn<UserRow>[] = [
  {
    id: "name",
    header: "Member",
    sortable: true,
    width: "20rem",
    searchValue: (row) => `${row.name} ${row.email}`,
    sortValue: (row) => row.name,
    cell: (row) => (<span className="flex items-center gap-3">
      <Avatar name={row.name} size="sm" />

      <span className="grid gap-1">
        {row.name}
        <br />
        <span className="text-sm text-muted leading-relaxed text-xs text-muted">
          {row.email}
        </span>
      </span>
    </span>),
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
    accessor: (row) => (<Badge
      variant={userStatusVariant[row.status]}
      appearance="soft"
      size="sm"
    >
      {row.status}
    </Badge>),
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
    accessor: (row) => shortDate.format(new Date(`${row.joined}T00:00:00`)),
  },
];

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <DataTable
            data={users}
            columns={userColumns}
            getRowId={(row) => row.id}
            getRowLabel={(row) => `Select ${row.name}`}
            caption="Workspace members"
            selectable
            stickyHeader
            pageSize={7}
            classNames={{
              root: "custom-data-table-root",
              row: "custom-data-table-row"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-data-table-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-data-table-row {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
