"use client";

import { isValidElement, type ReactNode } from "react";
import { CodeBlock, codeBlockLanguages, type PimoluCodeBlockLanguage } from "@pimolu/react";

export function ReleaseCodeBlock({ children }: { children?: ReactNode }) {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) return <pre>{children}</pre>;
  const language = children.props.className?.replace(/^language-/, "") ?? "text";
  return <CodeBlock code={String(children.props.children ?? "").replace(/\n$/, "")}
    language={codeBlockLanguages.includes(language as PimoluCodeBlockLanguage) ? language as PimoluCodeBlockLanguage : "text"} wrap />;
}
