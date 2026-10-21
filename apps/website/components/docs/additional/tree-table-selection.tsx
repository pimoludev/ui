"use client";

import { useState } from "react";
import { TreeTable } from "@pimolu/react";

export function DemoExample() {
const [selected, setSelected] = useState<string[]>([]);
return (<div className="pg-stack"><TreeTable nodes={[{id:"root",label:"Design",children:[{id:"tokens",label:"Tokens"},{id:"components",label:"Components"}]}]} columns={[{id:"label",header:"Package"}]} selectable defaultExpandAll selectedIds={selected} onSelectionChange={setSelected} caption="Design system packages" /><p role="status">Selected: {selected.join(", ") || "none"}</p></div>);
}
