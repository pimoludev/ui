import { journalFeed } from "@/lib/text-resources";

export function GET() {
  return new Response(journalFeed(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
