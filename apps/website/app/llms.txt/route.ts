import { guides } from "@/content/docs";
import catalog from "@/content/generated/catalog.json";
import { documentationMap } from "@/lib/text-resources";

export function GET() {
  return new Response(documentationMap(guides, catalog), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
