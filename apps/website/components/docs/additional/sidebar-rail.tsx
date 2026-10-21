"use client";

import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarFooter } from "@pimolu/react";

export function DemoExample() {

return (<div className="pg-stack"><Sidebar collapsible collapseOnMobile={false} defaultCollapsed aria-label="Project navigation"><SidebarHeader>Orbit</SidebarHeader><SidebarContent aria-label="Project sections"><SidebarGroup><SidebarItem href="/docs" target="_top" icon={<span aria-hidden="true">D</span>}>Documentation</SidebarItem><SidebarItem href="/components" target="_top" icon={<span aria-hidden="true">C</span>}>Components</SidebarItem></SidebarGroup></SidebarContent><SidebarFooter>Personal workspace</SidebarFooter></Sidebar></div>);
}
