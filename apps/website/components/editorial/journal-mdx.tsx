import type { ReactNode } from "react";
import { Alert, Badge, Button, CodeBlock, Link } from "@/components/ui";
import { ReleaseCodeBlock } from "./release-code-block";

function JournalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id}><h2>{title}</h2>{children}</section>;
}

// Only trusted local MDX is compiled and rendered with these components.
export const journalMDXComponents = {
  JournalSection, Alert, Badge, Button, CodeBlock,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => <Link href={href} external={/^https?:\/\//.test(href ?? "")}>{children}</Link>,
  pre: ReleaseCodeBlock,
};
