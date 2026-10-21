"use client";

import { useState } from "react";
import { Command } from "@pimolu/react";

export function DemoExample() {
const [selected, setSelected] = useState("unassigned");
return (<div className="pg-stack"><Command autoFocus={false} aria-label="Find teammate" placeholder="Search teammates…" items={[{id:"maya",label:"Maya Chen",description:"Design",keywords:["designer"]},{id:"noah",label:"Noah Dubois",description:"Engineering",keywords:["developer"]}]} onSelect={(item) => setSelected(item.label)} /><p role="status">Assignee: {selected}</p></div>);
}
