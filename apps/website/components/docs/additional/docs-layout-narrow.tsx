"use client";

import { DocsLayout, Link, Prose } from "@pimolu/react";

export function DemoExample() {

return (<DocsLayout sidebar={<nav aria-label="Guide navigation" className="pg-stack"><Link href="/docs/quick-start" target="_top">Quick start</Link><Link href="/docs/theming" target="_top">Theming</Link></nav>} sidebarWidth="12rem" sticky><Prose><h2 id="contract">The contract</h2><p>Components own behavior; shared tokens own appearance.</p><h2 id="integration">Integration</h2><p>Import the generated styles once at the application boundary.</p></Prose></DocsLayout>);
}
