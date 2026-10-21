"use client";

import { Gantt } from "@pimolu/react";

export function DemoExample() {
const selected = "Weekly scale; dependency links are visible.";
return (<div className="pg-stack"><Gantt tasks={[{id:"draft",name:"Draft the guide",start:new Date(2026,9,19),end:new Date(2026,9,23),progress:75},{id:"review",name:"Review and publish",start:new Date(2026,9,26),end:new Date(2026,9,30),dependencies:["draft"],progress:0}]} defaultScale="week" showToday={false} maxHeight={360} aria-label="Guide publication schedule" /><p role="status">{selected}</p></div>);
}
