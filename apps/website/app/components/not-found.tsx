import { Link, PageHeader } from "@/components/ui";

export default function ComponentNotFound() {
  return <div className="space-y-8"><PageHeader eyebrow="404" title="We could not find that component." description="Browse the catalog or search for an exported family." /><Link href="/components">Return to the catalog</Link></div>;
}
