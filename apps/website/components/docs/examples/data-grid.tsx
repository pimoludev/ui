"use client";

import { DataGrid } from "@pimolu/react";

export function DataGridExample() {
  const rows = [{ id: "1", name: "Maya Chen", team: "Design" }, { id: "2", name: "Noah Dubois", team: "Engineering" }, { id: "3", name: "Alice Martin", team: "Design" }, { id: "4", name: "Sofia Rossi", team: "Research" }];
  return <DataGrid mode="client" data={rows} columns={[{ id: "name", header: "Name", label: "Member name", sortable: true, resizable: true, width: 220 }, { id: "team", header: "Team", sortable: true, resizable: true, width: 160 }]} getRowId={(row) => row.id} getRowLabel={(row) => `Select ${row.name}`} caption="Workspace members" selectable defaultPageSize={2} pageSizeOptions={[2, 4]} />;
}
