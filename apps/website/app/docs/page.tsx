import type { Metadata } from "next";
import { DocArticle } from "@/components/docs/doc-article";
export const metadata: Metadata = { title: "React UI Documentation & Getting Started", description: "Get started with Pimolu UI for React and Next.js. Learn setup, styling, themes, composition and accessibility with practical guides.", alternates: { canonical: "/docs" } };
export default function Documentation() {
  return <DocArticle slug="" />;
}
