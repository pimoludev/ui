import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Link } from "@/components/ui";
import { ReleasesNavigation } from "@/components/editorial/releases-navigation";
import { ScrollOutline } from "@/components/scroll-outline";
import { releaseNotes } from "@/content/releases";
import { releaseContents } from "@/content/generated/releases/contents";
import { releaseMDXComponents } from "@/components/editorial/release-mdx";
import { BreadcrumbData } from "@/components/structured-data";
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
  return { title: `${entry.title}: release notes`, description: entry.summary, alternates: { canonical: `/releases/${entry.slug}` } };
}
export default async function ReleasePage({ params }: Props) {
  const entry = findRelease((await params).slug);
  const Content = releaseContents[entry.slug];
  return <main id="main-content" tabIndex={-1} className="releases-page">
    <BreadcrumbData items={[{ name: "Releases", path: "/releases" }, { name: entry.title, path: `/releases/${entry.slug}` }]} />
    <div className="release-layout">
      <ReleasesNavigation currentSlug={entry.slug} />
      <article className="release-main release-detail">
        <Link href="/releases" variant="muted">← All releases</Link>
        <header><Badge appearance="soft" variant="neutral">{entry.status}</Badge><h1>{entry.title}</h1>{entry.tag ? <code className="release-tag">{entry.tag}</code> : null}<p>{entry.summary}</p></header>
        <p className="release-status-note">{entry.notice}</p>
        <Content components={releaseMDXComponents} />
        <div className="release-entry-links"><Link href="/components">Explore components →</Link><Link href="/docs/quick-start">Quick start guide →</Link></div>
      </article>
      <aside className="editorial-outline"><ScrollOutline items={entry.sections.map(({ id, title }) => ({ id, label: title }))} /><Link href="https://github.com/pimoludev/ui/commits/dev" external>Source history</Link></aside>
    </div>
  </main>;
}
