import type { HTMLAttributes } from "react";

/**
 * Languages understood by the lightweight tokenizer. The list is also the
 * public enumeration used by the playground and the documentation.
 */
export const codeBlockLanguages = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "css",
  "json",
  "html",
  "bash",
  "text",
] as const;

export type PimoluCodeBlockLanguage =
  (typeof codeBlockLanguages)[number];

export interface PimoluCodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Raw source. It is always rendered as text, never as HTML. */
  code: string;

  /** Language used for the label and the tokenizer. Defaults to "ts". */
  language?: PimoluCodeBlockLanguage;

  /** Optional file name shown next to the language label. */
  filename?: string;

  /** Prefix each line with its 1-based number. Defaults to false. */
  showLineNumbers?: boolean;

  /** Render the copy button. Defaults to true. */
  copyable?: boolean;

  /** Copy button label while idle. Defaults to "Copy". */
  copyLabel?: string;

  /** Copy button label and live message after a successful copy. */
  copiedLabel?: string;

  /** 1-based line numbers to emphasise. */
  highlightLines?: readonly number[];

  /** Cap the scrollable code area. Numbers are read as pixels. */
  maxHeight?: number | string;

  /** Wrap long lines instead of scrolling horizontally. Defaults to false. */
  wrap?: boolean;
}
