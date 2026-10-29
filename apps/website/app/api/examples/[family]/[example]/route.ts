import sources from "@/content/generated/additional-sources.json";
import setupSources from "@/content/generated/setup-sources.json";

/** Only generated, reviewed examples are addressable. No filesystem paths. */
export async function GET(_request: Request, context: { params: Promise<{ family: string; example: string }> }) {
  const { family, example } = await context.params;
  const key = `${family}/${example}`;
  const source = Object.hasOwn(sources, key) ? sources[key as keyof typeof sources]
    : Object.hasOwn(setupSources, key) ? setupSources[key as keyof typeof setupSources] : undefined;
  return source ? Response.json({ source }, { headers: { "Cache-Control": "public, max-age=300" } }) : Response.json({ error: "Example not found" }, { status: 404 });
}
