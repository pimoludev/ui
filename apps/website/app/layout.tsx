import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { SiteProvider } from "@/components/site-provider";
import { SiteHeader } from "@/components/site-header";
import { Footer, Link } from "@/components/ui";
import { parsePreset, parseTheme, presetCookie, themeCookie } from "@/lib/preferences";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s · Pimolu UI" },
  description: siteDescription,
  openGraph: { type: "website", siteName: "Pimolu UI", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  return (
    <html lang="en">
      <body>
        <SiteProvider initialTheme={parseTheme(store.get(themeCookie)?.value)} initialPreset={parsePreset(store.get(presetCookie)?.value)}>
          <a className="site-skip" href="#main-content">Skip to content</a>
          <SiteHeader />
          {children}
          <div className="site-footer">
            <Footer appearance="transparent" bordered={false} brand={<Link href="/" variant="muted">Pimolu UI</Link>}
              description="One system. Your identity."
              columns={[{ title: "Explore", links: [{ label: "Documentation", href: "/docs" }, { label: "Components", href: "/components" }, { label: "Theming guide", href: "/docs/theming" }, { label: "Releases", href: "/releases" }, { label: "Blog", href: "/blog" }] }, { title: "Open source", links: [{ label: "GitHub", href: "https://github.com/pimoludev/ui", external: true }] }]}
              copyright="Pimolu UI · MIT License" />
          </div>
        </SiteProvider>
      </body>
    </html>
  );
}
