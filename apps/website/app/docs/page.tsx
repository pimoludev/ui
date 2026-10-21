import type { Metadata } from "next";
import { PageHeader, Link } from "@/components/ui";
export const metadata: Metadata = { title: "Documentation" };
export default function Documentation() {
  return <>
    <PageHeader eyebrow="Documentation" title="A shared foundation." description="Get to know the layers that make a Pimolu interface." />
    <section className="space-y-3"><h2 className="text-2xl">Components and styles</h2><p>React components provide behavior and typed APIs. Shared CSS provides the appearance. Design tokens connect colors, spacing, typography and visual presets.</p></section>
    <section className="space-y-3"><h2 className="text-2xl">Start from the workspace</h2><p>Pimolu is currently developed and consumed in this monorepo. The packages are not yet distributed as a public npm installation.</p><Link href="https://github.com/pimoludev/ui" external>Read the repository setup</Link></section>
    <section className="space-y-3"><h2 className="text-2xl">Choose your identity</h2><p>Light, dark and system modes work with the existing visual presets. Change the mode in the navigation, or explore the presets.</p><Link href="/themes">Explore themes →</Link></section>
  </>;
}
