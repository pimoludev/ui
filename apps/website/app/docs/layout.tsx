import { DocsShell } from "@/components/docs/docs-shell";
import type { ReactNode } from "react";
import "./docs.css";

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
