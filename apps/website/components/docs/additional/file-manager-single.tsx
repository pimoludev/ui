"use client";

import { useState } from "react";
import { FileManager } from "@pimolu/react";

export function DemoExample() {
const [selection, setSelection] = useState("Select a file.");
return (<div className="pg-stack"><FileManager entries={[{id:"guides",name:"Guides",type:"folder" as const,children:[{id:"install",name:"installation.md",type:"file" as const,size:2048}]},{id:"logo",name:"pimolu.svg",type:"file" as const,size:640}]} selectionMode="single" onSelect={(files) => setSelection(files.map(file => file.name).join(", "))} /><p role="status">{selection}</p></div>);
}
