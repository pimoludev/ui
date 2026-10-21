import { DocsLayout, Link } from "@/components/ui";
import type { ReactNode } from "react";

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return <div className="site-main mx-auto max-w-7xl px-6 py-12">
    <DocsLayout className="site-docs" sidebarWidth="13rem" sidebar={<nav className="site-doc-nav" aria-label="Documentation"><span className="text-sm text-muted">GETTING STARTED</span><Link href="/docs">Introduction</Link><Link href="/themes">Themes and presets</Link><Link href="/components">Component families</Link></nav>}>
      <div id="main-content" tabIndex={-1} className="max-w-3xl space-y-8">{children}</div>
    </DocsLayout>
  </div>;
}
