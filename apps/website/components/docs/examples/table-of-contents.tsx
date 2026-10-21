"use client";

import { useState } from "react";
import { TableOfContents, Prose } from "@pimolu/react";

export function DemoExample() {
  const [active, setActive] = useState("outline-intro");
  const items = [{ id: "outline-intro", label: "Overview" }, { id: "outline-install", label: "Integration" }, { id: "outline-theme", label: "Appearance" }];
  return <div className="pg-stack">
    <TableOfContents items={items} activeId={active} onNavigate={(item) => setActive(item.id)} />
    <Prose>
      <h2 id="outline-intro">Overview</h2><p>This outline links to real headings inside this preview document.</p>
      <h2 id="outline-install">Integration</h2><p>Import components from the workspace and load the generated shared CSS once.</p>
      <h2 id="outline-theme">Appearance</h2><p>Use PimoluProvider to choose a preset, then keep application refinements scoped.</p>
    </Prose>
  </div>;
}
