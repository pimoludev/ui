import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Link } from "@/components/ui";
import { ReleasesNavigation } from "@/components/editorial/releases-navigation";
import { ScrollOutline } from "@/components/scroll-outline";
import { releaseNotes } from "@/content/releases";
import "../../editorial.css";
import "../releases.css";

type Props = { params: Promise<{ slug: string }> };
function findRelease(slug: string) {
  const entry = releaseNotes.find((release) => release.slug === slug);
  if (!entry) notFound();
  return entry;
}
export function generateStaticParams() { return releaseNotes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = findRelease((await params).slug);
  return { title: `${entry.title} — release notes`, description: entry.summary, alternates: { canonical: `/releases/${entry.slug}` } };
}
export default async function ReleasePage({ params }: Props) {
  const entry = findRelease((await params).slug);
  return <main id="main-content" tabIndex={-1} className="releases-page">
    <div className="release-layout">
      <ReleasesNavigation currentSlug={entry.slug} />
      <article className="release-main release-detail">
        <Link href="/releases" variant="muted">← All releases</Link>
        <header><Badge appearance="soft" variant="neutral">Workspace development</Badge><h1>{entry.title}</h1><p>{entry.summary}</p></header>
        <p className="release-status-note">These changes are available in the source workspace. This is not a published package version or a tagged release.</p>
        {entry.sections.map((section) => <section key={section.id} id={section.id}>
          <span className="editorial-eyebrow">{section.label}</span><h2>{section.title}</h2><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>)}
        <div className="release-entry-links"><Link href="/components">Explore components →</Link><Link href="/docs/installation">Installation guide →</Link></div>
      </article>
      <aside className="editorial-outline"><ScrollOutline items={entry.sections.map(({ id, title }) => ({ id, label: title }))} /><Link href="https://github.com/pimoludev/ui/commits/dev" external>Source history</Link></aside>
    </div>
  </main>;
}
