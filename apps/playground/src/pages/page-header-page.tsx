import { CustomizationExample } from "./page-header-customization-demo";
import {
  Badge,
  Button,
  PageHeader as DocsPageHeader,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function PageHeaderPage() {
  return (
    <>
      <PageHeader
        title="PageHeader"
        hint="A structured introduction for documentation and marketing pages: breadcrumbs, an eyebrow, the page title, a lead description, metadata and actions. The title is always the single h1 of the page. Styles come from @pimolu/web-styles/page-header.css."
      />

      <Section
        title="Compact application header"
        hint="Use size='sm' inside dashboards and narrow panels. Heading size follows the container rather than the browser width."
      >
        <div className="pg-panel"><DocsPageHeader titleAs="h2" size="sm" eyebrow="Workspace" title="Project overview"
          description="Review delivery, ownership and the next milestones."
          meta={<Badge variant="success">On track</Badge>} /></div>
      </Section>

      <Section
        title="Documentation header"
        hint="Breadcrumbs use the shared Breadcrumbs primitives; the last entry is the current page and carries aria-current. Actions wrap under the title on narrow screens."
      >
        <div className="pg-panel">
          <DocsPageHeader
            titleAs="h2"
            eyebrow="Components · Layout"
            title="PageHeader"
            description="Introduce a documentation or marketing page with a clear hierarchy: where the reader is, what the page covers, and what they can do next."
            breadcrumbs={[
              { label: "Docs", href: "#/overview" },
              {
                label: "Components",
                href: "#/page-header",
              },
              { label: "PageHeader" },
            ]}
            meta={
              <>
                <span>Updated 21 October 2026</span>
                <span>2 min read</span>
                <Badge variant="success" size="sm">
                  Stable
                </Badge>
              </>
            }
            actions={
              <>
                <Button
                  appearance="outline"
                  size="sm"
                >
                  View source
                </Button>

                <Button size="sm">Copy install</Button>
              </>
            }
          />
        </div>
      </Section>

      <Section
        title="Centered marketing header"
        hint='align="center" centers the content, the breadcrumbs and the actions; it suits a landing page better than a reference page.'
      >
        <div className="pg-panel">
          <DocsPageHeader
            titleAs="h2"
            align="center"
            size="lg"
            eyebrow="Pimolu UI 1.0"
            title="One design system for every surface"
            description="Design tokens, accessible React components and native-ready data. Build the web and the app from the same contract instead of translating a design twice."
            actions={
              <>
                <Button size="lg">Get started</Button>

                <Button
                  appearance="outline"
                  size="lg"
                >
                  Browse components
                </Button>
              </>
            }
            meta={
              <span>
                MIT licensed · 120+ components · Web and
                native
              </span>
            }
          />
        </div>
      </Section>

      <Section
        title="Compact introduction"
        hint="Eyebrow, title and description are enough for a guide or a changelog page; every optional slot can be omitted."
      >
        <DocsPageHeader
          titleAs="h2"
          eyebrow="Guides"
          title="Theming"
          description="Switch a palette, adjust the visual tokens and keep both light and dark readable."
        />
      </Section>

      <Section
        title="Complete composition"
        hint="A realistic docs page opening: the trail places the page, the metadata builds trust, and the actions offer the next step."
      >
        <div className="pg-panel">
          <DocsPageHeader
            titleAs="h2"
            eyebrow="Getting started"
            title="Install Pimolu UI"
            description="Add the design tokens, the web styles bundle and the React package to a new project. The same tokens power the native renderer."
            breadcrumbs={[
              { label: "Pimolu UI", href: "#/overview" },
              {
                label: "Getting started",
                href: "#/page-header",
              },
              { label: "Installation" },
            ]}
            meta={
              <>
                <span>pnpm · npm · yarn</span>
                <span>React 18 and 19</span>
              </>
            }
            actions={
              <Button size="sm">Read the guide</Button>
            }
          />
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
