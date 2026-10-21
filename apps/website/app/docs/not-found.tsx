import { Link, PageHeader } from "@/components/ui";

export default function DocumentationNotFound() {
  return <div className="space-y-8">
    <PageHeader eyebrow="404" title="We could not find that guide." description="Browse the handbook, or use Components to find a component reference." />
    <Link href="/docs">Return to the documentation →</Link>
  </div>;
}
