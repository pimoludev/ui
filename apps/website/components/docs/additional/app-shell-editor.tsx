"use client";

import { AppShell, Navbar, NavbarBrand, Footer, Prose } from "@pimolu/react";

export function DemoExample() {

return (<AppShell header={<Navbar appearance="transparent"><NavbarBrand>Orbit editor</NavbarBrand></Navbar>} footer={<Footer columns={[]} appearance="transparent" copyright="All changes saved locally" />}><Prose><h2>Project brief</h2><p>Use the shell for application-wide chrome. Compose the editor content independently.</p></Prose></AppShell>);
}
