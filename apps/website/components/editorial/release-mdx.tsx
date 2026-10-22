import type { ReactNode } from "react";
import { Alert, Badge, Button, CodeBlock, Link } from "@/components/ui";
import { ReleaseCodeBlock } from "./release-code-block";

function ReleaseSection({ id, title, label, children }: {
  id: string; title: string; label: string; children: ReactNode;
}) {
  return <section id={id}><span className="editorial-eyebrow">{label}</span><h2>{title}</h2>{children}</section>;
}

// Components are supplied to compiled local MDX, never to remote/evaluated content.
export const releaseMDXComponents = {
  ReleaseSection, Alert, Badge, Button, CodeBlock,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => <Link href={href} external={/^https?:\/\//.test(href ?? "")}>{children}</Link>,
  pre: ReleaseCodeBlock,
};
