"use client";

import { DataGrid, type PimoluDataGridColumn, Avatar, Badge } from "@pimolu/react";

type MemberStatus = "Active" | "Invited" | "Suspended";
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
  return shortDate.format(new Date(`${value}T00:00:00`));
}

const memberStatusVariant: Record<MemberStatus, "success" | "warning" | "danger"> = {
  Active: "success",
  Invited: "warning",
  Suspended: "danger",
};
const memberColumns: PimoluDataGridColumn<Member>[] = [
  {
    id: "name",
    header: "Member",
    label: "member",
    sortable: true,
    width: 250,
    minWidth: 180,
    resizable: true,
    searchValue: (member) => `${member.name} ${member.email}`,
    cell: (member) => (<span className="flex items-center gap-3">
      <Avatar name={member.name} size="sm" />

      <span className="grid gap-1">
        {member.name}
        <br />
        <span className="text-sm text-muted leading-relaxed text-xs text-muted">{
          member.email
        }</span>
      </span>
    </span>),
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
    cell: (member) => (<Badge
      variant={memberStatusVariant[member.status]}
      appearance="soft"
      size="sm"
    >
      {member.status}
    </Badge>),
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

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <DataGrid
            data={[]}
            columns={memberColumns}
            getRowId={(member) => member.id}
            caption="No members match this filter"
            filterable={false}
            pagination={false}
            emptyState={<div
              className="grid gap-5 min-w-0"
            >
              <strong>No members found</strong>
              <span className="text-sm text-muted leading-relaxed">
                Invite a teammate or clear the filters to see rows again.
              </span>
            </div>}
            classNames={{
              root: "custom-data-grid-root",
              empty: "custom-data-grid-empty"
            }}
          />
        </>)
      }
      <style>
        {
          `
.custom-data-grid-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-data-grid-empty {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
