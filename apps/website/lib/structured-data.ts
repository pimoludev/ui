import { siteDescription, siteUrl } from "./site.ts";
import type { JournalPost } from "../content/journal.ts";

export function serializeStructuredData(data: unknown): string {
  // Prevent content from closing the script element, including inside JSON strings.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Pimolu UI",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icon.svg`,
      sameAs: ["https://github.com/pimoludev/ui"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Pimolu UI",
      alternateName: "Pimolu",
      url: `${siteUrl}/`,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export function breadcrumbStructuredData(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: new URL(path, siteUrl).href,
    })),
  };
}

export function blogPostStructuredData(post: JournalPost) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "en",
    articleSection: post.category,
    author: { "@type": "Organization", name: "Pimolu editorial", url: `${siteUrl}/blog` },
    publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Pimolu UI", url: `${siteUrl}/` },
    isPartOf: { "@type": "Blog", "@id": `${siteUrl}/blog`, name: "Pimolu Journal" },
  };
}
