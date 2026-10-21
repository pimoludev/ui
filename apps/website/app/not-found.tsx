import { PageHeader, Link } from "@/components/ui";
export default function NotFound() {
  return <main id="main-content" className="site-main mx-auto max-w-7xl space-y-6 px-6 py-16"><PageHeader eyebrow="404" title="This page is not here." description="Return to the documentation to find your way." /><Link href="/docs">Open documentation →</Link></main>;
}
