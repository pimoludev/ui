"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@pimolu/react";

export function DemoExample() {
  const [action, setAction] = useState("No command selected.");
  return <Card><CardHeader><CardTitle>Project Atlas</CardTitle></CardHeader><CardContent><div className="pg-stack">
    <p id="project-menu-help">Right-click the project or focus it and press Shift F10. The visible actions below provide an alternative.</p>
    <ContextMenu><ContextMenuTrigger><Button appearance="outline" aria-describedby="project-menu-help">Project Atlas · production</Button></ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={() => setAction("Project details opened locally.")}>Open details</ContextMenuItem><ContextMenuItem onSelect={() => setAction("Project removed from this demo's recent list.")}>Remove from recents</ContextMenuItem></ContextMenuContent></ContextMenu>
    <div className="pg-row"><Button size="sm" appearance="ghost" onClick={() => setAction("Project details opened locally.")}>Open details</Button><Button size="sm" appearance="ghost" onClick={() => setAction("Project removed from this demo's recent list.")}>Remove from recents</Button></div><p role="status">{action}</p>
  </div></CardContent></Card>;
}
