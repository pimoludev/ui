"use client";

import {
  Fragment,
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { Badge } from "../badge/badge";
import { Button } from "../button/button";

import type {
  PimoluCodeBlockLanguage,
  PimoluCodeBlockProps,
} from "./code-block.types";

export type {
  PimoluCodeBlockLanguage,
  PimoluCodeBlockProps,
} from "./code-block.types";

export { codeBlockLanguages } from "./code-block.types";

/* =========================================
   TOKENS
========================================= */

type TokenType =
  | "plain"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "type"
  | "punctuation";

interface Token {
  type: TokenType;
  value: string;
}

interface LanguageRules {
  lineComments: readonly string[];
  blockComments: readonly (readonly [string, string])[];
  strings: readonly string[];
  keywords: ReadonlySet<string>;
  types: ReadonlySet<string>;
  /** Highlight capitalised identifiers as types (React components, …). */
  uppercaseTypes?: boolean;
  /** Skip tokenisation entirely ("text"). */
  plain?: boolean;
}

const TS_KEYWORDS = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "is",
  "keyof",
  "let",
  "module",
  "namespace",
  "new",
  "null",
  "of",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "satisfies",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "unique",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

const TS_TYPES = new Set([
  "Array",
  "Boolean",
  "Date",
  "Element",
  "Error",
  "HTMLElement",
  "JSX",
  "Map",
  "Math",
  "Number",
  "Object",
  "Omit",
  "Partial",
  "Pick",
  "Promise",
  "React",
  "ReactNode",
  "Readonly",
  "Record",
  "Set",
  "String",
  "Symbol",
  "any",
  "bigint",
  "boolean",
  "never",
  "number",
  "object",
  "string",
  "symbol",
  "unknown",
]);

const JS_KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "of",
  "return",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

const CSS_KEYWORDS = new Set([
  "absolute",
  "align-content",
  "align-items",
  "align-self",
  "animation",
  "appearance",
  "background",
  "background-color",
  "block",
  "border",
  "border-color",
  "border-radius",
  "border-width",
  "bottom",
  "box-shadow",
  "box-sizing",
  "center",
  "color",
  "column-gap",
  "content",
  "cursor",
  "display",
  "fill",
  "flex",
  "flex-direction",
  "flex-wrap",
  "font",
  "font-family",
  "font-size",
  "font-weight",
  "gap",
  "grid",
  "grid-template-columns",
  "grid-template-rows",
  "height",
  "inline",
  "inset",
  "justify-content",
  "left",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-block",
  "margin-inline",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "none",
  "opacity",
  "outline",
  "overflow",
  "padding",
  "padding-block",
  "padding-inline",
  "position",
  "relative",
  "right",
  "row-gap",
  "solid",
  "sticky",
  "stroke",
  "text-align",
  "text-decoration",
  "text-transform",
  "top",
  "transparent",
  "transform",
  "transition",
  "uppercase",
  "vertical-align",
  "white-space",
  "width",
  "z-index",
]);

const HTML_KEYWORDS = new Set([
  "a",
  "article",
  "aside",
  "audio",
  "body",
  "button",
  "canvas",
  "code",
  "div",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "html",
  "img",
  "input",
  "label",
  "li",
  "link",
  "main",
  "meta",
  "nav",
  "ol",
  "option",
  "p",
  "path",
  "pre",
  "script",
  "section",
  "select",
  "small",
  "span",
  "strong",
  "style",
  "svg",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "ul",
  "video",
]);

const HTML_TYPES = new Set([
  "alt",
  "aria-label",
  "class",
  "className",
  "data-testid",
  "disabled",
  "for",
  "height",
  "href",
  "id",
  "lang",
  "name",
  "placeholder",
  "role",
  "src",
  "style",
  "target",
  "title",
  "type",
  "value",
  "width",
]);

const BASH_KEYWORDS = new Set([
  "alias",
  "break",
  "case",
  "cd",
  "continue",
  "declare",
  "do",
  "done",
  "echo",
  "elif",
  "else",
  "esac",
  "exit",
  "export",
  "false",
  "fi",
  "for",
  "function",
  "if",
  "in",
  "local",
  "printf",
  "pwd",
  "read",
  "readonly",
  "return",
  "select",
  "set",
  "shift",
  "source",
  "test",
  "then",
  "time",
  "true",
  "typeset",
  "unset",
  "until",
  "while",
]);

const BASH_TYPES = new Set([
  "git",
  "node",
  "npm",
  "npx",
  "pnpm",
  "tsc",
  "vitest",
]);

const RULES: Record<
  PimoluCodeBlockLanguage,
  LanguageRules
> = {
  ts: {
    lineComments: ["//"],
    blockComments: [["/*", "*/"]],
    strings: ['"', "'", "`"],
    keywords: TS_KEYWORDS,
    types: TS_TYPES,
    uppercaseTypes: true,
  },

  tsx: {
    lineComments: ["//"],
    blockComments: [["/*", "*/"]],
    strings: ['"', "'", "`"],
    keywords: TS_KEYWORDS,
    types: TS_TYPES,
    uppercaseTypes: true,
  },

  js: {
    lineComments: ["//"],
    blockComments: [["/*", "*/"]],
    strings: ['"', "'", "`"],
    keywords: JS_KEYWORDS,
    types: new Set(),
    uppercaseTypes: true,
  },

  jsx: {
    lineComments: ["//"],
    blockComments: [["/*", "*/"]],
    strings: ['"', "'", "`"],
    keywords: JS_KEYWORDS,
    types: new Set(),
    uppercaseTypes: true,
  },

  css: {
    lineComments: [],
    blockComments: [["/*", "*/"]],
    strings: ['"', "'"],
    keywords: CSS_KEYWORDS,
    types: new Set(),
  },

  json: {
    lineComments: [],
    blockComments: [],
    strings: ['"'],
    keywords: new Set(["true", "false", "null"]),
    types: new Set(),
  },

  html: {
    lineComments: [],
    blockComments: [["<!--", "-->"]],
    strings: ['"', "'"],
    keywords: HTML_KEYWORDS,
    types: HTML_TYPES,
  },

  bash: {
    lineComments: ["#"],
    blockComments: [],
    strings: ['"', "'"],
    keywords: BASH_KEYWORDS,
    types: BASH_TYPES,
  },

  text: {
    lineComments: [],
    blockComments: [],
    strings: [],
    keywords: new Set(),
    types: new Set(),
    plain: true,
  },
};

const NUMBER_PATTERN =
  /^(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/;

const PUNCTUATION = "{}[]()<>,.;:=+-*/%!?&|^~@#";

/* =========================================
   TOKENIZER
========================================= */

function isDigit(character: string) {
  return character >= "0" && character <= "9";
}

function isIdentifierStart(character: string) {
  return /[A-Za-z_$]/.test(character);
}

function isIdentifierPart(character: string) {
  return /[A-Za-z0-9_$-]/.test(character);
}

function isLineCommentStart(
  code: string,
  index: number,
  marker: string
) {
  if (!code.startsWith(marker, index)) return false;

  /* In bash, "#" only starts a comment at the beginning of a line or
     after whitespace; a "#" inside a word is not a comment. */
  if (
    marker === "#" &&
    index > 0 &&
    !/\s/.test(code[index - 1])
  ) {
    return false;
  }

  return true;
}

function readQuoted(
  code: string,
  start: number,
  quote: string
) {
  let index = start + 1;

  while (index < code.length) {
    const character = code[index];

    if (character === "\\") {
      index += 2;
      continue;
    }

    if (character === quote) {
      return index + 1;
    }

    /* A single or double quoted string stops at the line break. */
    if (character === "\n" && quote !== "`") {
      return index;
    }

    index += 1;
  }

  return index;
}

function tokenize(
  code: string,
  language: PimoluCodeBlockLanguage
): Token[] {
  const rules = RULES[language] ?? RULES.ts;

  if (rules.plain) {
    return [{ type: "plain", value: code }];
  }

  const tokens: Token[] = [];
  let index = 0;

  while (index < code.length) {
    const character = code[index];

    if (/\s/.test(character)) {
      let end = index + 1;

      while (end < code.length && /\s/.test(code[end])) {
        end += 1;
      }

      tokens.push({
        type: "plain",
        value: code.slice(index, end),
      });

      index = end;
      continue;
    }

    const blockComment = rules.blockComments.find(
      ([start]) => code.startsWith(start, index)
    );

    if (blockComment) {
      const [start, endMarker] = blockComment;
      const found = code.indexOf(
        endMarker,
        index + start.length
      );

      const end =
        found === -1 ? code.length : found + endMarker.length;

      tokens.push({
        type: "comment",
        value: code.slice(index, end),
      });

      index = end;
      continue;
    }

    const lineComment = rules.lineComments.find((marker) =>
      isLineCommentStart(code, index, marker)
    );

    if (lineComment) {
      const newline = code.indexOf("\n", index);
      const end = newline === -1 ? code.length : newline;

      tokens.push({
        type: "comment",
        value: code.slice(index, end),
      });

      index = end;
      continue;
    }

    if (rules.strings.includes(character)) {
      const end = readQuoted(code, index, character);

      tokens.push({
        type: "string",
        value: code.slice(index, end),
      });

      index = end;
      continue;
    }

    if (isDigit(character)) {
      const match = NUMBER_PATTERN.exec(code.slice(index));

      if (match) {
        tokens.push({
          type: "number",
          value: match[0],
        });

        index += match[0].length;
        continue;
      }
    }

    if (isIdentifierStart(character)) {
      let end = index + 1;

      while (
        end < code.length &&
        isIdentifierPart(code[end])
      ) {
        end += 1;
      }

      const word = code.slice(index, end);

      let type: TokenType = "plain";

      if (rules.keywords.has(word)) {
        type = "keyword";
      } else if (
        rules.types.has(word) ||
        (rules.uppercaseTypes && /^[A-Z]/.test(word))
      ) {
        type = "type";
      }

      tokens.push({ type, value: word });

      index = end;
      continue;
    }

    if (PUNCTUATION.includes(character)) {
      tokens.push({
        type: "punctuation",
        value: character,
      });

      index += 1;
      continue;
    }

    tokens.push({ type: "plain", value: character });
    index += 1;
  }

  return tokens;
}

/**
 * Splits tokens at line breaks. A multi-line comment or template string keeps
 * its token type on every line, so the highlighting stays correct without a
 * second pass over the source.
 */
function tokenizeLines(
  code: string,
  language: PimoluCodeBlockLanguage
): Token[][] {
  const lines: Token[][] = [[]];

  for (const token of tokenize(code, language)) {
    const parts = token.value.split("\n");

    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);

      if (part) {
        lines[lines.length - 1].push({
          type: token.type,
          value: part,
        });
      }
    });
  }

  if (
    lines.length > 1 &&
    lines[lines.length - 1].length === 0
  ) {
    lines.pop();
  }

  return lines;
}

/* =========================================
   CLIPBOARD
========================================= */

async function copyToClipboard(text: string) {
  const clipboard =
    typeof navigator !== "undefined"
      ? navigator.clipboard
      : undefined;

  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      /* The fallback below covers a denied permission. */
    }
  }

  if (typeof document === "undefined") return false;

  let textarea: HTMLTextAreaElement | null = null;

  try {
    textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();

    const copied =
      typeof document.execCommand === "function"
        ? document.execCommand("copy")
        : false;

    return copied;
  } catch {
    return false;
  } finally {
    textarea?.remove();
  }
}

/* =========================================
   CODE BLOCK
========================================= */

type CopyStatus = "idle" | "copied" | "error";

export const CodeBlock = forwardRef<
  HTMLDivElement,
  PimoluCodeBlockProps
>(function CodeBlock(
  {
    code,
    language = "ts",
    filename,
    showLineNumbers = false,
    copyable = true,
    copyLabel = "Copy",
    copiedLabel = "Copied",
    highlightLines,
    maxHeight,
    wrap = false,
    className,
    ...props
  },
  ref
) {
  const [copyStatus, setCopyStatus] =
    useState<CopyStatus>("idle");

  const lines = useMemo(
    () => tokenizeLines(code, language),
    [code, language]
  );

  const highlighted = useMemo(
    () =>
      new Set(
        (highlightLines ?? []).filter(
          (line) => Number.isInteger(line) && line > 0
        )
      ),
    [highlightLines]
  );

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  async function handleCopy() {
    const copied = await copyToClipboard(code);

    setCopyStatus(copied ? "copied" : "error");
  }

  const preStyle: CSSProperties | undefined =
    maxHeight === undefined
      ? undefined
      : {
          maxHeight:
            typeof maxHeight === "number"
              ? `${maxHeight}px`
              : maxHeight,
        };

  const liveMessage =
    copyStatus === "copied"
      ? copiedLabel
      : copyStatus === "error"
        ? "Unable to copy"
        : "";

  return (
    <div
      {...props}
      ref={ref}
      className={[
        "pimolu-codeblock",
        wrap && "pimolu-codeblock--wrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-language={language}
    >
      <div className="pimolu-codeblock__header">
        <div className="pimolu-codeblock__meta">
          {filename && (
            <span className="pimolu-codeblock__filename">
              {filename}
            </span>
          )}

          <Badge
            className="pimolu-codeblock__language"
            variant="neutral"
            appearance="soft"
            size="sm"
          >
            {language}
          </Badge>
        </div>

        {copyable && (
          <Button
            className="pimolu-codeblock__copy"
            size="sm"
            appearance="ghost"
            onClick={handleCopy}
          >
            {copyStatus === "copied"
              ? copiedLabel
              : copyLabel}
          </Button>
        )}
      </div>

      <pre
        className="pimolu-codeblock__pre"
        style={preStyle}
        aria-label={
          filename
            ? `${language} code from ${filename}`
            : `${language} code sample`
        }
      >
        <code className="pimolu-codeblock__code">
          {lines.map((tokens, lineIndex) => (
            <Fragment key={lineIndex}>
              <span
                className={[
                  "pimolu-codeblock__line",
                  highlighted.has(lineIndex + 1) &&
                    "pimolu-codeblock__line--highlighted",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-line={lineIndex + 1}
              >
                {showLineNumbers && (
                  <span
                    className="pimolu-codeblock__line-number"
                    aria-hidden="true"
                  >
                    {lineIndex + 1}
                  </span>
                )}

                <span className="pimolu-codeblock__line-content">
                  {tokens.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      className={
                        token.type === "plain"
                          ? undefined
                          : `pimolu-codeblock__token pimolu-codeblock__token--${token.type}`
                      }
                    >
                      {token.value}
                    </span>
                  ))}
                </span>
              </span>

              {lineIndex < lines.length - 1 ? "\n" : null}
            </Fragment>
          ))}
        </code>
      </pre>

      <span
        className="pimolu-codeblock__status"
        role="status"
        aria-live="polite"
      >
        {liveMessage}
      </span>
    </div>
  );
});

CodeBlock.displayName = "PimoluCodeBlock";
