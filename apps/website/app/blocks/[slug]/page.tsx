import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Badge, Link, PageHeader } from "@/components/ui";
import { BreadcrumbData } from "@/components/structured-data";
import { BlockExample } from "@/components/blocks/_catalog/block-example";
import { BlockBackLink } from "@/components/blocks/_catalog/block-back-link";
import { blocks, blockClassification, findBlock } from "@/content/blocks";
import sources from "@/content/generated/block-sources.json";
import "../blocks.css";

export function generateStaticParams() { return blocks.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const block = findBlock((await params).slug);
  if (!block) return { title: "Block not found" };
  return { title: block.title + ": Free React UI Block", description: block.description, alternates: { canonical: "/blocks/" + block.slug } };
}
export default async function BlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const block = findBlock((await params).slug);
  if (!block) notFound();
  const source = (sources as Record<string, string>)[block.slug];
  const classification = blockClassification(block);
  return <main id="main-content" tabIndex={-1} className="blocks-page blocks-detail">
    <BreadcrumbData items={[{ name: "Blocks", path: "/blocks" }, { name: block.title, path: "/blocks/" + block.slug }]} />
    <Suspense fallback={null}><BlockBackLink category={block.category} /></Suspense>
    <div className="block-detail-heading"><Badge variant="success">Free block</Badge>
      <PageHeader classNames={{ eyebrow: "text-muted" }} eyebrow={classification.category.label + " / " + classification.subcategory.label} title={block.title} description={block.description} />
    </div>
    <BlockExample block={block} source={source} />
    <div className="blocks-guide"><div><h2>Make it part of your product.</h2>
      <p>This is the source used by the preview, with Pimolu components and Tailwind layout utilities. Load the shared Pimolu stylesheet and your own Tailwind setup. Replace sample destinations with your routes. Form and billing previews use local sample state; connect your own application services.</p>
      <p className="block-used-components">Built with {block.components.join(" · ")}</p>
      {source.includes("/images/blocks/studio-office.jpg") && <p>Photo by <Link href="https://unsplash.com/photos/modern-office-interior-with-glass-walls-and-plants-B74lBYC3PXI" variant="inherit">Caroline Badran on Unsplash</Link>. <Link href="/images/blocks/studio-office.jpg" variant="inherit" download>Download the demo photo</Link> into <code>public/images/blocks/studio-office.jpg</code>, or replace the image URL with your own photograph.</p>}
      {source.includes("/images/pimolu-studio.webp") && <p><Link href="/images/pimolu-studio.webp" variant="inherit" download>Download the Pimolu demo artwork</Link> into <code>public/images/pimolu-studio.webp</code>, or replace it with your product photograph.</p>}
      {source.includes("/images/pimolu-atmosphere.webp") && <p><Link href="/images/pimolu-atmosphere.webp" variant="inherit" download>Download the Pimolu landscape artwork</Link> into <code>public/images/pimolu-atmosphere.webp</code>, or use your own illustration.</p>}
    </div><Link href="/docs/quick-start" variant="inherit">Integration guide →</Link></div>
  </main>;
}
