import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ThemeControls } from "@/components/theme-controls";
export const metadata: Metadata = { title: "Themes", description: "Explore Pimolu's visual presets and keep your brand independent from component behavior.", alternates: { canonical: "/themes" } };
export default function Themes() {
  return <main id="main-content" tabIndex={-1} className="site-main mx-auto max-w-7xl space-y-12 px-6 py-16">
    <PageHeader eyebrow="Personalization" title="Your style. The same system." description="Seven visual presets, light and dark modes, one shared component foundation." />
    <ThemeControls />
  </main>;
}
