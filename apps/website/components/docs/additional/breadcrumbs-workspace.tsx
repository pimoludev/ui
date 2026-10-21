"use client";

import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@pimolu/react";

export function DemoExample() {

return (<Breadcrumbs label="Workspace path"><BreadcrumbItem><BreadcrumbLink href="/docs" target="_top">Documentation</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator>→</BreadcrumbSeparator><BreadcrumbItem><BreadcrumbPage>Workspace</BreadcrumbPage></BreadcrumbItem></Breadcrumbs>);
}
