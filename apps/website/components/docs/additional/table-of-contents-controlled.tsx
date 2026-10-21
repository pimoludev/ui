"use client";

import { useState } from "react";
import { TableOfContents, Prose } from "@pimolu/react";

export function DemoExample() {
const [active, setActive] = useState("outline-setup");
return (<div className="pg-stack"><TableOfContents items={[{id:"outline-setup",label:"Setup"},{id:"outline-provider",label:"Provider"},{id:"outline-usage",label:"Usage"}]} activeId={active} onNavigate={(item) => setActive(item.id)} /><Prose><h2 id="outline-setup">Setup</h2><p>Load the shared styles and choose your appearance.</p><h3 id="outline-provider">Provider</h3><p>Use PimoluProvider at your application boundary.</p><h3 id="outline-usage">Usage</h3><p>Compose components and keep local state in your application.</p></Prose></div>);
}
