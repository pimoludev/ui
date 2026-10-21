"use client";

import { TableOfContents, Prose } from "@pimolu/react";

export function DemoExample() {

return (<div className="pg-stack"><TableOfContents items={[{id:"outline-setup",label:"Setup",level:2},{id:"outline-provider",label:"Provider",level:3},{id:"outline-usage",label:"Usage",level:3}]} /><Prose><h2 id="outline-setup">Setup</h2><p>Load the shared styles and choose your appearance.</p><h3 id="outline-provider">Provider</h3><p>Use PimoluProvider at your application boundary.</p><h3 id="outline-usage">Usage</h3><p>Compose components and keep local state in your application.</p></Prose></div>);
}
