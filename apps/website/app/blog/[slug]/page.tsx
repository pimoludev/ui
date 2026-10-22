import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock, Link } from "@/components/ui";
import { EditorialArtwork } from "@/components/editorial/artwork";
import { ScrollOutline } from "@/components/scroll-outline";
import { journalPosts, readingMinutes, formatJournalDate } from "@/content/journal";
import "../../editorial.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return journalPosts.map(({ slug }) => ({ slug })); }
function findPost(slug: string) {
  const post = journalPosts.find((entry) => entry.slug === slug);
  if (!post) notFound();
  return post;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPost((await params).slug);
  return { title: post.title, description: post.description, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: "article", publishedTime: post.date, title: post.title, description: post.description } };
}
export default async function JournalArticle({ params }: Props) {
  const post = findPost((await params).slug);
  return <main id="main-content" tabIndex={-1} className="journal-page journal-article-page">
    <Link href="/blog" variant="muted">← All articles</Link>
    <header className="journal-article-header">
      <span className="editorial-eyebrow">{post.category}</span>
      <h1>{post.title}</h1><p>{post.description}</p>
      <div className="editorial-meta"><span>Pimolu editorial</span><span>·</span><time dateTime={post.date}>{formatJournalDate(post.date)}</time><span>·</span>{readingMinutes(post)} min read</div>
    </header>
    <div className="journal-reading-layout">
      <article className="journal-article">
        <EditorialArtwork kind={post.artwork} />
        {post.sections.map((section) => <section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.code && <CodeBlock code={section.code} language={section.language} wrap />}
        </section>)}
        <nav className="journal-related" aria-label="More articles"><h2>Keep exploring</h2>{journalPosts.filter((entry) => entry.slug !== post.slug).map((entry) => <Link key={entry.slug} href={`/blog/${entry.slug}`}>{entry.title} <span aria-hidden="true">↗</span></Link>)}</nav>
      </article>
      <aside className="editorial-outline"><ScrollOutline items={post.sections.map(({ id, title }) => ({ id, label: title }))} /><Link href="/docs">Build with Pimolu →</Link></aside>
    </div>
  </main>;
}
