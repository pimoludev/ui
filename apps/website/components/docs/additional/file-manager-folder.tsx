"use client";

import { useState } from "react";
import { FileManager } from "@pimolu/react";

export function DemoExample() {
const [selection, setSelection] = useState("Double-click a file or press Enter.");
return (<div className="pg-stack"><FileManager entries={[{id:"guides",name:"Guides",type:"folder" as const,children:[{id:"install",name:"installation.md",type:"file" as const,size:2048}]},{id:"logo",name:"pimolu.svg",type:"file" as const,size:640}]} defaultPath={["guides"]} defaultView="grid" onOpen={(file) => setSelection(`Opened ${file.name}`)} /><p role="status">{selection}</p></div>);
}
