import type { Metadata } from "next";
import { PageHeader, Link } from "@/components/ui";
export const metadata: Metadata = { title: "Components" };
export default function Components() {
  return <main id="main-content" tabIndex={-1} className="site-main mx-auto max-w-7xl px-6 py-16">
    <PageHeader eyebrow="The library" title="Building blocks, shared principles." description="Explore the React registry by responsibility." />
    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[["Actions", "Button, ButtonGroup, SplitButton", "button"], ["Forms", "Input, Select, FormField", "input"], ["Navigation", "Navbar, Sidebar, Tabs", "navbar"], ["Data", "Table, DataTable, DataGrid", "data-table"], ["Feedback", "Alert, Dialog, Toast", "alert"], ["Layout", "Stack, Grid, DocsLayout", "docs-layout"]].map(([title, text, folder]) => <section className="space-y-3 border-t border-border pt-5" key={title}><h2 className="text-xl">{title}</h2><p className="text-muted">{text}</p><Link external href={`https://github.com/pimoludev/ui/tree/dev/registry/react/${folder}`}>Explore the source</Link></section>)}
    </div>
  </main>;
}
