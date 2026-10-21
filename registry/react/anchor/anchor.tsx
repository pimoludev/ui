"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { PimoluAnchorProps } from "./anchor.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

function sectionUrl(id: string) {
  if (typeof window === "undefined") {
    return `#${id}`;
  }

  const withoutHash = window.location.href.split("#")[0];

  return `${withoutHash}#${id}`;
}

export function Anchor({
  id,
  level = 2,
  children,
  copyLabel = "Copy link to section",
  href,
  onCopy,
  className,
  ...props
}: PimoluAnchorProps) {
  const [copied, setCopied] = useState(false);
  const feedbackTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  useEffect(
    () => () => {
      if (feedbackTimer.current !== undefined) {
        clearTimeout(feedbackTimer.current);
      }
    },
    []
  );

  async function handleCopy() {
    if (typeof navigator === "undefined") return;

    const value = sectionUrl(id);
    const clipboard = navigator.clipboard;

    if (!clipboard?.writeText) return;

    try {
      await clipboard.writeText(value);
    } catch {
      return;
    }

    onCopy?.(value);
    setCopied(true);

    if (feedbackTimer.current !== undefined) {
      clearTimeout(feedbackTimer.current);
    }

    feedbackTimer.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const Tag = `h${level}` as
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

  const labelId = `${id}-anchor-label`;

  /* Naming the heading from the label span keeps its accessible name
     equal to the heading text, without the "copy link" label of the
     nested link. An explicit heading label always wins. */
  const labelledBy =
    props["aria-labelledby"] ??
    (props["aria-label"] != null ? undefined : labelId);

  return (
    <div
      data-level={level}
      className={classes("pimolu-anchor", className)}
    >
      <Tag
        {...props}
        id={id}
        aria-labelledby={labelledBy}
        className="pimolu-anchor__heading"
      >
        <span
          id={labelId}
          className="pimolu-anchor__label"
        >
          {children}
        </span>

        <a
          href={href ?? `#${id}`}
          aria-label={copyLabel}
          aria-describedby={labelId}
          className="pimolu-anchor__link"
          onClick={() => {
            void handleCopy();
          }}
        >
          <span aria-hidden="true">#</span>
        </a>
      </Tag>

      <span
        role="status"
        aria-live="polite"
        data-visible={copied || undefined}
        className="pimolu-anchor__feedback"
      >
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}

Anchor.displayName = "PimoluAnchor";
