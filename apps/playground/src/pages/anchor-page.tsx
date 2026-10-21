import type {
  MouseEvent,
  ReactNode,
} from "react";
import { useState } from "react";

import { Anchor, Prose } from "@pimolu/react";

import { PageHeader, Section } from "../section";

/**
 * The playground hash doubles as its router; keep plain "#section"
 * links on this page so the demo does not navigate away.
 */
function InPageLinkGuard({
  children,
}: {
  children: ReactNode;
}) {
  function handleClickCapture(
    event: MouseEvent<HTMLDivElement>
  ) {
    const anchor = (
      event.target as HTMLElement
    ).closest?.("a[href^='#']");

    const href = anchor?.getAttribute("href");

    if (href && !href.startsWith("#/")) {
      event.preventDefault();
    }
  }

  return (
    <div onClickCapture={handleClickCapture}>
      {children}
    </div>
  );
}

export function AnchorPage() {
  const [copiedUrl, setCopiedUrl] = useState<
    string | null
  >(null);

  return (
    <>
      <PageHeader
        title="Anchor"
        hint="A section heading with a self-link. The correct heading tag is rendered from level, the id is the hash target, and the # link copies the absolute section URL to the clipboard with an announced confirmation. Styles come from @pimolu/web-styles/anchor.css."
      />

      <Section
        title="Heading levels"
        hint="level accepts 1 to 6 and defaults to 2. The visual scale changes, the heading role stays semantic."
      >
        <InPageLinkGuard>
          <div className="pg-panel">
            <div className="pg-stack">
              <Anchor id="anchor-level-1" level={2}>
                Level 2 - section title
              </Anchor>

              <Anchor id="anchor-level-2" level={2}>
                Level 2 — section
              </Anchor>

              <Anchor id="anchor-level-3" level={3}>
                Level 3 — subsection
              </Anchor>

              <Anchor id="anchor-level-4" level={4}>
                Level 4 — detail
              </Anchor>

              <Anchor id="anchor-level-5" level={5}>
                Level 5 — label
              </Anchor>

              <Anchor id="anchor-level-6" level={6}>
                Level 6 — smallest heading
              </Anchor>
            </div>
          </div>
        </InPageLinkGuard>
      </Section>

      <Section
        title="Copy feedback"
        hint="Activating the # link writes location.href#id to the clipboard and announces the result through a polite status. onCopy receives the exact URL."
      >
        <InPageLinkGuard>
          <div className="pg-stack">
            <Anchor
              id="clipboard-feedback"
              onCopy={(value) => {
                setCopiedUrl(value);
              }}
            >
              Copy feedback
            </Anchor>

            <p className="pg-meta" role="status">
              {copiedUrl
                ? `Copied ${copiedUrl}`
                : "Activate the # link to copy this section URL."}
            </p>
          </div>
        </InPageLinkGuard>
      </Section>

      <Section
        title="Custom destination and label"
        hint="href replaces the default #id destination without changing the copied URL. copyLabel names the link for assistive technology."
      >
        <InPageLinkGuard>
          <div className="pg-panel">
            <Anchor
              id="custom-destination"
              href="#/anchor"
              copyLabel="Copy the custom section link"
            >
              Custom destination
            </Anchor>

            <p className="pg-copy">
              The link navigates to{" "}
              <code>#/anchor</code> while the clipboard still
              receives the absolute URL ending in{" "}
              <code>#custom-destination</code>.
            </p>
          </div>
        </InPageLinkGuard>
      </Section>

      <Section
        title="Inside Prose"
        hint="Anchor composes with Prose: the wrapper keeps its flow spacing and the heading keeps its scroll margin."
      >
        <InPageLinkGuard>
          <Prose>
            <p>
              Anchors are most useful in long articles where
              each section should be linkable without editing
              the heading markup by hand.
            </p>

            <Anchor id="prose-anchor" level={2}>
              A linked section
            </Anchor>

            <p>
              The heading id is the target, and{" "}
              <code>scroll-margin-top</code> keeps it clear of
              a sticky header when the browser jumps to it.
            </p>
          </Prose>
        </InPageLinkGuard>
      </Section>
    </>
  );
}
