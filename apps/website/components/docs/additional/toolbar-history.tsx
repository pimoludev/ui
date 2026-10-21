"use client";

import { useState } from "react";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@pimolu/react";

export function DemoExample() {
const [saved, setSaved] = useState(false);
return (<div className="pg-stack"><Toolbar label="Document history"><ToolbarButton disabled>Undo</ToolbarButton><ToolbarButton disabled>Redo</ToolbarButton><ToolbarSeparator /><ToolbarButton onClick={() => setSaved(true)}>Save draft</ToolbarButton></Toolbar><p role="status">{saved ? "Draft saved in this preview." : "No unsaved history to restore."}</p></div>);
}
