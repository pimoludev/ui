"use client";

import { useState } from "react";
import { TreeView } from "@pimolu/react";

export function DemoExample() {
const [selected, setSelected] = useState<string | undefined>("install");
return (<div className="pg-stack"><TreeView aria-label="Guides" items={[{id:"guides",label:"Guides",children:[{id:"install",label:"Installation"},{id:"theme",label:"Theming"}]}]} defaultExpandedIds={["guides"]} selectedId={selected} onSelectedChange={setSelected} /><p role="status">Document: {selected ?? "none"}</p></div>);
}
