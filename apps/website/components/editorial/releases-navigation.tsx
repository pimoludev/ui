import { Link } from "@/components/ui";
import { releaseNotes } from "@/content/releases";

export function ReleasesNavigation({ currentSlug }: { currentSlug?: string }) {
  return <nav className="release-navigation" aria-label="Release navigation">
    <span className="editorial-eyebrow">Overview</span>
    <Link href="/releases" aria-current={!currentSlug ? "page" : undefined}>All releases</Link>
    <span className="editorial-eyebrow">In development</span>
    {releaseNotes.map((entry) => <Link key={entry.slug} href={`/releases/${entry.slug}`} aria-current={currentSlug === entry.slug ? "page" : undefined}>{entry.title}<span className="release-nav-dot" aria-hidden="true" /></Link>)}
    <div className="release-navigation-foot"><span>Follow the source</span><Link href="https://github.com/pimoludev/ui" external>GitHub</Link></div>
  </nav>;
}
