import { CustomizationExample } from "./docs-layout-customization-demo";
import type {
  MouseEvent,
  ReactNode,
} from "react";

import {
  Anchor,
  ApiTable,
  Badge,
  DocsLayout,
  Footer,
  Link,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Prose,
  TableOfContents,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/**
 * The playground uses the URL hash as its router, so a plain "#section"
 * link would leave the current page. This guard keeps the in-page demo
 * on the page while leaving every real "#/route" link alone.
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

function DocsNavbar() {
  return (
    <Navbar bordered={false} itemsPosition="center">
      <NavbarBrand href="#/docs-layout">
        Pimolu Docs
      </NavbarBrand>

      <NavbarContent aria-label="Documentation">
        <NavbarItem href="#/docs-layout" active>
          Guide
        </NavbarItem>

        <NavbarItem href="#/page-header">
          Components
        </NavbarItem>

        <NavbarItem href="#/api-table">API</NavbarItem>
      </NavbarContent>

      <NavbarActions>
        <Badge variant="neutral" size="sm">
          v1.0
        </Badge>
      </NavbarActions>
    </Navbar>
  );
}

function DocsSidebar() {
  return (
    <div className="pg-stack">
      <p className="pg-meta">Getting started</p>

      <nav
        aria-label="Guide sections"
        className="pg-stack"
        style={{ gap: 6 }}
      >
        <Link
          href="#/docs-layout"
          aria-current="page"
          underline="none"
          variant="muted"
        >
          Introduction
        </Link>

        <Link
          href="#/overview"
          underline="none"
          variant="muted"
        >
          Installation
        </Link>

        <Link
          href="#/button"
          underline="none"
          variant="muted"
        >
          Project structure
        </Link>

        <Link
          href="#/page-header"
          underline="none"
          variant="muted"
        >
          PageHeader
        </Link>

        <Link
          href="#/api-table"
          underline="none"
          variant="muted"
        >
          ApiTable
        </Link>
      </nav>

      <p className="pg-meta">Reference</p>

      <nav
        aria-label="Reference sections"
        className="pg-stack"
        style={{ gap: 6 }}
      >
        <Link
          href="#/overview"
          underline="none"
          variant="muted"
        >
          Tokens
        </Link>

        <Link
          href="#/overview"
          underline="none"
          variant="muted"
        >
          Theming
        </Link>

        <Link
          href="#/overview"
          underline="none"
          variant="muted"
        >
          Accessibility
        </Link>
      </nav>
    </div>
  );
}

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Installation" },
  { id: "pnpm", label: "With pnpm", level: 3 as const },
  { id: "npm", label: "With npm", level: 3 as const },
  { id: "usage", label: "Usage" },
  { id: "props", label: "Props" },
];

const propRows = [
  {
    name: "sidebar",
    type: "ReactNode",
    required: true,
    description:
      "Navigation rendered in the left aside.",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Article content in the main region.",
  },
  {
    name: "toc",
    type: "ReactNode",
    description: "Optional table of contents in the right aside.",
  },
  {
    name: "sticky",
    type: "boolean",
    default: "false",
    description:
      "Keep the sidebar and TOC visible while the page scrolls.",
  },
];

function DocsFooter() {
  return (
    <Footer
      brand={<strong>Pimolu UI</strong>}
      description="Documentation built with the same primitives it describes."
      columns={[
        {
          title: "Learn",
          links: [
            {
              label: "Getting started",
              href: "#/overview",
            },
            {
              label: "Components",
              href: "#/page-header",
            },
          ],
        },
        {
          title: "Community",
          links: [
            {
              label: "GitHub",
              href: "https://github.com",
              external: true,
            },
            {
              label: "Discussions",
              href: "https://github.com",
              external: true,
            },
          ],
        },
      ]}
      copyright="© 2026 Pimolu UI. MIT licensed."
    />
  );
}

function DocsArticle() {
  return (
    <Prose>
      <Anchor id="overview" level={2}>
        Overview
      </Anchor>

      <p>
        <strong>DocsLayout</strong> is the shell behind a
        documentation page. It keeps five slots independent:
        a header, a sidebar, the article, a table of contents
        and a footer.
      </p>

      <p>
        The article lives in a{" "}
        <code>&lt;main&gt;</code> landmark. The sidebar and the
        TOC are labelled complementary landmarks, and the
        skip link targets the main region before anything
        else in the tab order.
      </p>

      <Anchor id="install" level={2}>
        Installation
      </Anchor>

      <p>
        Install the packages, then import the styles once at
        the root of the application:
      </p>

      <pre>
        <code>{`pnpm add @pimolu/react @pimolu/web-styles`}</code>
      </pre>

      <Anchor id="pnpm" level={3}>
        With pnpm
      </Anchor>

      <p>
        pnpm is the reference package manager for the
        workspace. The lockfile is committed, so a fresh clone
        only needs <code>pnpm install</code>.
      </p>

      <Anchor id="npm" level={3}>
        With npm
      </Anchor>

      <p>
        npm works too; the generated CSS and the TypeScript
        sources are the same files.
      </p>

      <Anchor id="usage" level={2}>
        Usage
      </Anchor>

      <blockquote>
        <p>
          A docs shell should make the navigation obvious
          without competing with the article.
        </p>
      </blockquote>

      <p>
        Pass any navigation to <code>sidebar</code> and any
        table of contents to <code>toc</code>. The layout does
        not own the active state; the consumer does.
      </p>

      <Anchor id="props" level={2}>
        Props
      </Anchor>

      <ApiTable
        density="sm"
        rows={propRows}
        caption="DocsLayout props used on this page."
      />
    </Prose>
  );
}

export function DocsLayoutPage() {
  return (
    <>
      <PageHeader
        title="DocsLayout"
        hint="A documentation shell with a header, a sidebar, an article, an optional table of contents and a footer. The skip link targets the main landmark, the sidebars are labelled asides, and the CSS grid stacks the TOC at tablet width and the whole shell at mobile width. Styles come from @pimolu/web-styles/docs-layout.css."
      />

      <Section
        title="Complete shell"
        hint="The header spans the page, the sidebar and TOC stick while the article scrolls, and every slot accepts an existing component."
      >
        <div className="pg-panel">
          <InPageLinkGuard>
            <DocsLayout
              header={<DocsNavbar />}
              sidebar={<DocsSidebar />}
              toc={
                <TableOfContents
                  items={tocItems}
                  activeId="install"
                />
              }
              footer={<DocsFooter />}
              sidebarWidth="11rem"
              tocWidth="9.5rem"
              sticky
              style={{ minHeight: 720 }}
            >
              <DocsArticle />
            </DocsLayout>
          </InPageLinkGuard>
        </div>
      </Section>

      <Section
        title="Article only"
        hint="Without toc or footer, the grid collapses to sidebar plus main; a numeric sidebarWidth is converted to pixels."
      >
        <div className="pg-panel">
          <InPageLinkGuard>
            <DocsLayout
              sidebar={<DocsSidebar />}
              sidebarWidth={220}
              style={{ minHeight: 420 }}
            >
              <Prose size="sm">
                <Anchor id="compact" level={2}>
                  Compact guide
                </Anchor>

                <p>
                  A short guide can use the same shell with
                  fewer slots. The sidebar keeps its named
                  complementary landmark and the main region
                  keeps its skip-link target.
                </p>
              </Prose>
            </DocsLayout>
          </InPageLinkGuard>
        </div>
      </Section>

      <Section
        title="Keyboard order"
        hint="Tab once from the top of the shell: the skip link appears before the header actions and the sidebar links. Activating it moves focus to the main region."
      >
        <div className="pg-stack">
          <p className="pg-copy">
            The skip link is visually hidden until it receives
            focus. The main region has{" "}
            <code>tabIndex="-1"</code>, so activating the link
            moves the reading position without adding a second
            tab stop.
          </p>

          <p className="pg-meta">
            The layout does not add a mobile toggle: at narrow
            widths the sidebar becomes a bounded scroll region
            above the article and the TOC moves under it.
          </p>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
