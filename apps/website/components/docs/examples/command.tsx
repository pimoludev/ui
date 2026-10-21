"use client";

import { useState } from "react";
import { Command } from "@pimolu/react";

export function CommandExample() {
  const [selected, setSelected] = useState("No action selected.");
  return <div className="space-y-4">
    <Command autoFocus={false} aria-label="Example workspace commands" items={[{ id: "project", label: "Create project", group: "Workspace", keywords: ["new", "start"] }, { id: "theme", label: "Change theme", group: "Preferences", keywords: ["appearance", "dark"] }, { id: "archive", label: "Archive workspace", disabled: true }]} onSelect={(item) => setSelected(`${item.label} selected.`)} />
    <p role="status">{selected}</p>
  </div>;
}
