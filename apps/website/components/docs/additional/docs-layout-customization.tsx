"use client";

import { ReactNode } from "react";
import {
  DocsLayout,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  Badge,
  Link,
  TableOfContents,
  Footer,
  Prose,
  Anchor,
  ApiTable
} from "@pimolu/react";

function InPageLinkGuard({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

function DocsNavbar() {
  return (
    <Navbar bordered={false} itemsPosition="center">
      <NavbarBrand href="#/docs-layout">Pimolu Docs</NavbarBrand>
      <NavbarContent aria-label="Documentation">
        <NavbarItem href="#/docs-layout" active>Guide</NavbarItem>
        <NavbarItem href="#/page-header">Components</NavbarItem>
        <NavbarItem href="#/api-table">API</NavbarItem>
      </NavbarContent>
      <NavbarActions>
        <Badge variant="neutral" size="sm">v1.0</Badge>
      </NavbarActions>
    </Navbar>
  );
}

function DocsSidebar() {
  return (
    <div className="grid gap-5 min-w-0">
      <p className="text-sm text-muted leading-relaxed">Getting started</p>
      <nav
        aria-label="Guide sections"
        className="grid gap-5 min-w-0"
        style={{ gap: 6 }}
      >
        <Link href="#/docs-layout" aria-current="page" underline="none" variant="muted">Introduction</Link>
        <Link href="#/overview" underline="none" variant="muted">Installation</Link>
        <Link href="#/button" underline="none" variant="muted">Project structure</Link>
        <Link href="#/page-header" underline="none" variant="muted">PageHeader</Link>
        <Link href="#/api-table" underline="none" variant="muted">ApiTable</Link>
      </nav>
      <p className="text-sm text-muted leading-relaxed">Reference</p>
      <nav
        aria-label="Reference sections"
        className="grid gap-5 min-w-0"
        style={{
          gap: 6
        }}
      >
        <Link href="#/overview" underline="none" variant="muted">Tokens</Link>
        <Link href="#/overview" underline="none" variant="muted">Theming</Link>
        <Link href="#/overview" underline="none" variant="muted">Accessibility</Link>
      </nav>
    </div>
  );
}

const tocItems = [
  { id: "overview-custom-parts", label: "Overview" },
  { id: "install-custom-parts", label: "Installation" },
  { id: "pnpm-custom-parts", label: "With pnpm", level: 3 as const },
  { id: "npm-custom-parts", label: "With npm", level: 3 as const },
  { id: "usage-custom-parts", label: "Usage" },
  { id: "props-custom-parts", label: "Props" },
];
const propRows = [
  {
    name: "sidebar",
    type: "ReactNode",
    required: true,
    description: "Navigation rendered in the left aside.",
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
    description: "Keep the sidebar and TOC visible while the page scrolls.",
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
      <Anchor id="overview-custom-parts" level={2}>Overview</Anchor>
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
      <Anchor id="install-custom-parts" level={2}>Installation</Anchor>
      <p>
        Install the packages, then import the styles once at the root of
        the application:
      </p>
      <pre>
        <code>{`pnpm add @pimolu/react @pimolu/web-styles`}</code>
      </pre>
      <Anchor id="pnpm-custom-parts" level={3}>With pnpm</Anchor>
      <p>
        pnpm is the reference package manager for the
        workspace. The lockfile is committed, so a fresh clone
        only needs <code>pnpm install</code>.
      </p>
      <Anchor id="npm-custom-parts" level={3}>With npm</Anchor>
      <p>
        npm works too; the generated CSS and the TypeScript sources are
        the same files.
      </p>
      <Anchor id="usage-custom-parts" level={2}>Usage</Anchor>
      <blockquote>
        <p>
          A docs shell should make the navigation obvious without
          competing with the article.
        </p>
      </blockquote>
      <p>
        Pass any navigation to <code>sidebar</code> and any
        table of contents to <code>toc</code>. The layout does
        not own the active state; the consumer does.
      </p>
      <Anchor id="props-custom-parts" level={2}>Props</Anchor>
      <ApiTable
        density="sm"
        rows={propRows}
        caption="DocsLayout props used on this page."
      />
    </Prose>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="min-w-0 rounded-lg border border-border p-6">
            <InPageLinkGuard>
              <DocsLayout
                header={<DocsNavbar />}
                sidebar={<DocsSidebar />}
                toc={<TableOfContents
                  items={tocItems}
                  activeId="install-custom-parts"
                />}
                footer={<DocsFooter />}
                sidebarWidth="11rem"
                tocWidth="9.5rem"
                sticky
                style={{
                  minHeight: 720
                }}
                classNames={{
                  root: "custom-docs-layout-root",
                  body: "custom-docs-layout-body"
                }}
              >
                <DocsArticle />
              </DocsLayout>
            </InPageLinkGuard>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-docs-layout-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-docs-layout-body {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
