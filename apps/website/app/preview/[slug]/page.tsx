import { notFound, permanentRedirect } from "next/navigation";
import { StandaloneExample } from "@/components/docs/component-examples";
import catalog from "@/content/generated/catalog.json";
import additionalExamples from "@/content/generated/additional-examples.json";
import "@/components/docs/demo-compositions.css";
import { parsePreset, parseTheme } from "@/lib/preferences";
import { parsePreviewSettings } from "@/lib/preview-settings";
import "../preview.css";

export const metadata = { title: "Component preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const family = (await params).slug;
  if (family === "chart") {
    const legacy = await searchParams;
    const target = legacy.example === "example-3" ? "bar-chart" : legacy.example === "example-4" ? "line-chart" : "area-chart";
    const query = new URLSearchParams(Object.entries(legacy).flatMap(([key, value]) => key !== "example" && typeof value === "string" ? [[key, value]] : []));
    permanentRedirect(`/preview/${target}${query.size ? `?${query}` : ""}`);
  }
  if (!catalog.some((entry) => entry.family === family)) notFound();
  const query = await searchParams;
  const exampleId = typeof query.example === "string" ? query.example : undefined;
  if (query.example !== undefined && (!exampleId || !additionalExamples[family as keyof typeof additionalExamples].some((item) => item.id === exampleId))) notFound();
  const settings = parsePreviewSettings(query);
  return <StandaloneExample family={family} exampleId={exampleId} theme={parseTheme(typeof query.theme === "string" ? query.theme : undefined)} preset={parsePreset(typeof query.preset === "string" ? query.preset : undefined)} radius={settings.radius === "inherit" ? undefined : settings.radius} density={settings.density === "inherit" ? undefined : settings.density} brandColor={settings.brand || undefined} direction={settings.direction} />;
}
