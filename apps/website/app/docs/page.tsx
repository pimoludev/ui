import type { Metadata } from "next";
import { DocArticle } from "@/components/docs/doc-article";
export const metadata: Metadata = { title: "Introduction", alternates: { canonical: "/docs" } };
export default function Documentation() {
  return <DocArticle slug="" />;
}
