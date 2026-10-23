"use client";

import { useState } from "react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@pimolu/react";

export function DemoExample() {
const [action, setAction] = useState("No command selected.");
return (<div className="pg-stack"><ContextMenu><ContextMenuTrigger><div tabIndex={0} className="pg-panel">Project brief.md. Open the context menu.</div></ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={() => setAction("Document duplicated locally.")}>Duplicate</ContextMenuItem><ContextMenuItem disabled>Publish</ContextMenuItem></ContextMenuContent></ContextMenu><p role="status">{action}</p></div>);
}
