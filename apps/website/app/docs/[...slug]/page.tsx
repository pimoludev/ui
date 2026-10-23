import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DocArticle } from "@/components/docs/doc-article";
import { docNavigation } from "@/content/docs";
import { parsePreviewSettings } from "@/lib/preview-settings";

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export function generateStaticParams() {
  return docNavigation.filter((entry) => entry.slug).map((entry) => ({ slug: entry.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const entry = docNavigation.find((item) => item.slug === slug);
  if (!entry) notFound();
  return { title: `${entry.title}: React UI guide`, description: entry.description, alternates: { canonical: slug.startsWith("components/") ? `/${slug}` : `/docs/${slug}` } };
}

export default async function DocumentationPage({ params, searchParams }: Props) {
  const slug = (await params).slug.join("/");
  if (!docNavigation.some((entry) => entry.slug === slug)) notFound();
  if (slug.startsWith("components/")) {
    const query = await searchParams;
    const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => typeof value === "string" ? [[key, value]] : []));
    permanentRedirect(`/${slug}${params.size ? `?${params}` : ""}`);
  }
  return <DocArticle slug={slug} initialSettings={parsePreviewSettings(await searchParams)} />;
}
