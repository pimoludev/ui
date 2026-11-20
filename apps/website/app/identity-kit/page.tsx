import type { Metadata } from "next";
import { BreadcrumbData, StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import { IdentityKit } from "./identity-kit-client";
import "./identity-kit.css";

export const metadata: Metadata = {
  title: "Identity Kit: Preview and Export a Pimolu Identity",
  description: "Choose a Pimolu preset, adjust the brand colour, radius and density, preview real React components, then export CSS variables or JSON.",
  alternates: { canonical: "/identity-kit" },
};

export default function IdentityKitPage() {
  return (
    <main id="main-content" tabIndex={-1} className="identity-kit-page">
      <BreadcrumbData items={[{ name: "Identity Kit", path: "/identity-kit" }]} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Pimolu Identity Kit",
        url: `${siteUrl}/identity-kit`,
        applicationCategory: "DesignApplication",
        operatingSystem: "Any",
        description: "Preview a Pimolu preset with a brand colour, radius and density, then export CSS variables or JSON.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      <IdentityKit />
    </main>
  );
}
