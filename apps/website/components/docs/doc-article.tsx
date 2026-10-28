import { ColorReference } from "../color-reference";
import { Badge, CodeBlock, Link, PageHeader } from "@/components/ui";
import { PreviewWorkbench } from "./preview-workbench";
import { ApiReference } from "./api-reference";
import type { PreviewSettings } from "@/lib/preview-settings";
import { components, guides, docHref, docNavigation } from "@/content/docs";
import api from "@/content/generated/api.json";
import catalog from "@/content/generated/catalog.json";
import examples from "@/content/generated/examples.json";
import additionalExamples from "@/content/generated/additional-examples.json";
import { ScrollOutline } from "../scroll-outline";
import { AdditionalExamples } from "./additional-examples";
import { BreadcrumbData } from "../structured-data";
import { emphasizeGuideText } from "@/lib/guide-emphasis";

export function DocArticle({ slug, initialSettings }: { slug: string; initialSettings?: PreviewSettings }) {
  const guide = guides.find((entry) => entry.slug === slug);
  const component = components.find((entry) => `components/${entry.family}` === slug);
  if (!guide && !component) return null;
  const entry = (guide ?? component)!;
  const catalogEntry = catalog.find((item) => item.family === component?.family);
  const sections = guide ? guide.sections.map(({ id, title }) => ({ id, label: title })) : [
    { id: "preview", label: "Preview" }, { id: "examples", label: "More examples" }, { id: "usage", label: "Usage" },
    { id: "api", label: "API reference" }, { id: "accessibility", label: "Accessibility" },
    { id: "related", label: "Related components" },
  ];
  const pageNavigation = component ? catalog.map((item) => ({ slug: `components/${item.family}`, title: item.title })) : docNavigation.filter((item) => !item.slug.startsWith("components/"));
  const position = pageNavigation.findIndex((item) => item.slug === slug);
  const previous = pageNavigation[position - 1];
  const next = pageNavigation[position + 1];
  return <div className="docs-article-layout">
    <BreadcrumbData items={component
      ? [{ name: "Components", path: "/components" }, { name: catalogEntry?.title ?? entry.title, path: docHref(slug) }]
      : [{ name: "Documentation", path: "/docs" }, ...(slug ? [{ name: entry.title, path: docHref(slug) }] : [])]} />
    <article className="docs-article">
      <PageHeader eyebrow={guide ? docNavigation.find((item) => item.slug === slug)?.group ?? "Handbook" : "Component reference"} title={catalogEntry?.title ?? entry.title} description={entry.description} />
      {catalogEntry && <nav aria-label="Component sources" className="flex flex-wrap gap-5 mt-6 text-sm"><Link href={`https://github.com/pimoludev/ui/tree/dev/${catalogEntry.source}`} external>Implementation</Link>{catalogEntry.stylesheet && <Link href={`https://github.com/pimoludev/ui/blob/dev/${catalogEntry.stylesheet}`} external>Shared CSS</Link>}{catalogEntry.tests.map((file, index) => <Link key={file} href={`https://github.com/pimoludev/ui/blob/dev/${file}`} external>Source tests{catalogEntry.tests.length > 1 ? ` ${index + 1}` : ""}</Link>)}</nav>}
      {guide ? guide.sections.map((section) => <section key={section.id} id={section.id} className="docs-section docs-guide-section">
        <h2>{section.title}</h2>
        {section.paragraphs.map((text) => <p key={text}>{emphasizeGuideText(slug, text).map((part, index) => part.kind === "code" ? <code key={index}>{part.text}</code> : part.kind === "important" ? <strong key={index}>{part.text}</strong> : part.text)}</p>)}
        {slug === "colors" && section.id === "palette" && <ColorReference />}
        {slug === "agents" && section.id === "llms" && <Link href="/llms.txt">Open the documentation map →</Link>}
        {slug === "agents" && section.id === "context" && <Link href="https://github.com/pimoludev/ui/blob/dev/AGENTS.md" external>Repository agent instructions</Link>}
        {section.code && <CodeBlock code={section.code} language={section.language} filename={section.filename} wrap />}
      </section>) : component && <>
        <section id="preview" className="docs-section">
          <div className="flex flex-wrap justify-between items-center gap-3"><h2>Preview</h2><Badge className="docs-live-label" appearance="outline" size="sm"><span className="docs-live-dot" aria-hidden="true" />Live preview</Badge></div>
          <PreviewWorkbench key={`${component.family}:${JSON.stringify(initialSettings ?? {})}`} family={component.family} example={component.example} source={examples[component.family as keyof typeof examples]} initialSettings={initialSettings} />

        </section>
        <section id="examples" className="docs-section"><h2>More examples</h2><p>Different configurations and compositions using the real Pimolu API. Each preview runs independently and follows the site appearance.</p><AdditionalExamples family={component.family} examples={additionalExamples[component.family as keyof typeof additionalExamples]} /></section>
        <section id="usage" className="docs-section"><h2>Usage</h2>{component.usage.map((text) => <p key={text}>{text}</p>)}</section>
        <section id="api" className="docs-section">
          <h2>API reference</h2>
          <p>Generated from the public TypeScript declarations. Native HTML attributes are inherited where the component extends them; this reference includes Pimolu props and selected common native attributes.</p>
          <ApiReference groups={api[component.family as keyof typeof api]} />
        </section>
        <section id="accessibility" className="docs-section"><h2>Accessibility</h2><ul>{component.accessibility.map((text) => <li key={text}>{text}</li>)}</ul><Link href="/docs/accessibility">Read the accessibility guide →</Link></section>
        <section id="related" className="docs-section"><h2>Related components</h2><div className="flex flex-wrap gap-5">{component.related.map((target) => <Link key={target} href={docHref(target)}>{docNavigation.find((item) => item.slug === target)?.title}</Link>)}</div></section>
      </>}
      <nav className="docs-pagination" aria-label="Documentation pages">
        {previous ? <Link variant="muted" href={docHref(previous.slug)}><span className="text-xs text-muted">← Previous</span><span>{previous.title}</span></Link> : <span />}
        {next && <Link href={docHref(next.slug)}><span className="text-xs text-muted">Next →</span><span>{next.title}</span></Link>}
      </nav>
    </article>
    <aside className="docs-toc"><ScrollOutline key={slug} items={sections} /></aside>
  </div>;
}
