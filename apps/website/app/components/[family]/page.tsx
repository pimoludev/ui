import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocArticle } from "@/components/docs/doc-article";
import catalog from "@/content/generated/catalog.json";
import { parsePreviewSettings } from "@/lib/preview-settings";

type Props = { params: Promise<{ family: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateStaticParams() { return catalog.map(({ family }) => ({ family })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { family } = await params;
  const entry = catalog.find((entry) => entry.family === family);
  return entry ? { title: `React ${entry.title}: examples and API`, description: entry.description, alternates: { canonical: entry.href } } : {};
}
export default async function ComponentReference({ params, searchParams }: Props) {
  const { family } = await params;
  if (!catalog.some((entry) => entry.family === family)) notFound();
  return <DocArticle slug={`components/${family}`} initialSettings={parsePreviewSettings(await searchParams)} />;
}
