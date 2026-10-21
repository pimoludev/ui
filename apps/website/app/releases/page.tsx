import type { Metadata } from "next";
import { Badge, Card, CardHeader, CardTitle, CardContent, Link, PageHeader } from "@/components/ui";
import "./releases.css";

export const metadata: Metadata = { title: "Releases", description: "The development and release status of Pimolu UI, with links to the source history.", alternates: { canonical: "/releases" } };

export default function Releases() {
  return <main id="main-content" tabIndex={-1} className="releases-page">
    <PageHeader eyebrow="Project updates" title="Built in the open." description="Follow the progress of Pimolu UI. Published versions will have their own notes here when the project is ready for release." />
    <div className="releases-grid">
      <section aria-labelledby="development-title"><Card fullWidth><CardHeader><Badge appearance="soft" className="self-start">Unreleased · Development</Badge><CardTitle as="h2" id="development-title">The current workspace</CardTitle></CardHeader><CardContent><p>The library and this website are being refined locally. This entry describes development work; it is not a published package version.</p><ul><li>A React component catalog with interactive examples and source-derived API references.</li><li>Shared design tokens, light and dark modes, and customizable visual presets.</li><li>Next.js integration, documentation guides and an isolated preview workbench.</li></ul><Link href="https://github.com/pimoludev/ui/commits/dev" external>Explore source history</Link></CardContent></Card></section>
      <aside><h2>Release policy</h2><p>No public version is announced on this page. The core React, themes and shared-style packages are currently private workspace packages.</p><p>Future entries should name the version, publication date, changes, breaking changes and migration steps, backed by a real tag and changelog.</p><div className="flex flex-wrap gap-5"><Link href="https://github.com/pimoludev/ui/releases" external>GitHub releases</Link><Link href="/docs/installation">Current installation guide</Link></div></aside>
    </div>
  </main>;
}
