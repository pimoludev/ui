import type { Metadata } from "next";
import { Badge, Link, PageHeader } from "@/components/ui";
import { ReleasesNavigation } from "@/components/editorial/releases-navigation";
import { ScrollOutline } from "@/components/scroll-outline";
import { releaseNotes } from "@/content/releases";
import "../editorial.css";
import "./releases.css";

export const metadata: Metadata = { title: "Releases", description: "The development and release status of Pimolu UI, with links to the source history.", alternates: { canonical: "/releases" } };

export default function Releases() {
  return <main id="main-content" tabIndex={-1} className="releases-page">
    <div className="release-layout">
      <ReleasesNavigation />
      <div className="release-main">
        <PageHeader eyebrow="The project, in progress" title="Releases" description="What's taking shape in Pimolu. Follow the improvements, understand the changes and see what is ready to try." />
        <div className="release-status-note"><span className="release-nav-dot" aria-hidden="true" /><p>Currently in development. These notes describe the workspace, not a published npm version.</p></div>
        {releaseNotes.map((entry) => <article key={entry.slug} id={entry.slug} className="release-entry">
          <div className="release-entry-heading"><div><span className="editorial-eyebrow">Current development</span><h2>{entry.title}</h2></div><Badge appearance="soft" variant="neutral">Unreleased · Development</Badge></div>
          <p className="release-entry-summary">{entry.summary}</p>
          <div className="release-highlights">{entry.sections.slice(0, 3).map((section) => <section key={section.id}>
            <span className="editorial-eyebrow">{section.label}</span><h3>{section.title}</h3><p>{section.items[0]}</p>
          </section>)}</div>
          <div className="release-entry-links"><Link href={`/releases/${entry.slug}`}>Read the full development notes <span aria-hidden="true">→</span></Link><Link href="https://github.com/pimoludev/ui/commits/dev" external variant="muted">Source history</Link></div>
        </article>)}
        <section id="release-policy" className="release-policy"><span className="editorial-eyebrow">What comes next</span><h2>A version should mean something.</h2><p>Published entries will include a real version, publication date, changes and migration guidance backed by a tag. Until then, use the workspace integration guide to try the current library.</p><div className="release-entry-links"><Link href="/docs/installation">Workspace installation →</Link><Link href="https://github.com/pimoludev/ui/releases" external variant="muted">GitHub releases</Link></div></section>
      </div>
      <aside className="editorial-outline"><ScrollOutline items={[{ id: "unreleased", label: "Current development" }, { id: "release-policy", label: "Release policy" }]} /><Link href="/blog">Read the journal →</Link></aside>
    </div>
  </main>;
}
