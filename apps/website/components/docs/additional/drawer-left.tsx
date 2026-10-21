"use client";

import { Button, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, Link } from "@pimolu/react";

export function DemoExample() {

return (<Drawer><DrawerTrigger><Button appearance="outline">Open navigation</Button></DrawerTrigger><DrawerContent side="left" size="sm"><DrawerHeader><DrawerTitle>Navigation</DrawerTitle><DrawerDescription>Explore the Pimolu handbook.</DrawerDescription></DrawerHeader><nav aria-label="Drawer navigation" className="pg-stack"><Link href="/docs" target="_top">Introduction</Link><Link href="/components" target="_top">Components</Link></nav><DrawerClose><Button appearance="outline">Close navigation</Button></DrawerClose></DrawerContent></Drawer>);
}
