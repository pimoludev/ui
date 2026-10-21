"use client";

import { useState } from "react";
import { Button, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarFooter } from "@pimolu/react";

export function DemoExample() {
const [collapsed, setCollapsed] = useState(false);
return (<div className="pg-stack"><Button appearance="outline" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "Expand navigation" : "Collapse navigation"}</Button><Sidebar collapsible collapseOnMobile={false} collapsed={collapsed} onCollapsedChange={setCollapsed} aria-label="Project navigation"><SidebarHeader>Orbit</SidebarHeader><SidebarContent aria-label="Project sections"><SidebarGroup><SidebarItem href="/docs" target="_top" icon={<span aria-hidden="true">D</span>}>Documentation</SidebarItem><SidebarItem href="/components" target="_top" icon={<span aria-hidden="true">C</span>}>Components</SidebarItem></SidebarGroup></SidebarContent><SidebarFooter>Personal workspace</SidebarFooter></Sidebar></div>);
}
