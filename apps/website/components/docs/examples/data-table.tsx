"use client";

import { useState } from "react";
import { DataTable } from "@pimolu/react";

export function DataTableExample() {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [{ id: "atlas", name: "Atlas", owner: "Maya" }, { id: "orbit", name: "Orbit", owner: "Noah" }, { id: "forma", name: "Forma", owner: "Alice" }];
  return <div className="space-y-4">
    <DataTable data={rows} columns={[{ id: "name", header: "Project", sortable: true }, { id: "owner", header: "Owner", sortable: true }]} getRowId={(row) => row.id} getRowLabel={(row) => `Select ${row.name}`} caption="Project portfolio" pageSize={2} selectable selectedRowIds={selected} onSelectionChange={setSelected} />
    <p role="status">{selected.length} project{selected.length === 1 ? "" : "s"} selected.</p>
  </div>;
}
