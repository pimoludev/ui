import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs/docs-shell";
import "../docs/docs.css";
import "./catalog.css";
export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <DocsShell section="components">{children}</DocsShell>;
}
