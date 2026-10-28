import type { Metadata } from "next";
import { Link, PageHeader } from "@/components/ui";
import { BreadcrumbData, StructuredData } from "@/components/structured-data";
import { ShowcaseGallery } from "@/components/showcase-gallery";
import { showcaseProjects } from "@/content/showcase";
import { siteUrl } from "@/lib/site";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Showcase: Projects Built with Pimolu UI",
  description: "Explore real websites and applications built with Pimolu UI. A growing collection of projects using the library's React components and design tokens.",
  alternates: { canonical: "/showcase" },
};

export default function ShowcasePage() {
  return <main id="main-content" tabIndex={-1} className="showcase-page">
    <BreadcrumbData items={[{ name: "Showcase", path: "/showcase" }]} />
    <StructuredData data={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Built with Pimolu UI",
      url: `${siteUrl}/showcase`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: showcaseProjects.length,
        itemListElement: showcaseProjects.map((project, index) => ({
          "@type": "ListItem", position: index + 1,
          item: { "@type": "WebSite", name: project.name, description: project.description, url: new URL(project.url, siteUrl).href },
        })),
      },
    }} />
    <div className="showcase-intro">
      <PageHeader eyebrow="The Pimolu showcase" title="Built with Pimolu." description="Real projects. Different ideas. One shared foundation. Explore the websites and applications taking shape with Pimolu UI." />
      <p className="showcase-intro-note">A growing collection of work by the creator of Pimolu UI.</p>
    </div>

    <ShowcaseGallery />

    <section className="showcase-next" aria-labelledby="showcase-next-title">
      <div><p className="showcase-eyebrow">From components to your next idea</p><h2 id="showcase-next-title">Make something of your own.</h2><p>Start with the same pieces. Give them your own point of view.</p></div>
      <div className="showcase-next-links"><Link href="/docs/quick-start">Start building <span aria-hidden="true">→</span></Link><Link href="/components" variant="muted">Explore components</Link></div>
    </section>
  </main>;
}
