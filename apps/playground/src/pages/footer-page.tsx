import { MotionCompatibilityExample } from "../motion-compatibility-example";
import {
  footerVariantMap,
  Button,
  Footer,
  Link,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const hugeColumns = [
  {
    title: "Product",
    links: [
      { label: "Components", href: "#/overview" },
      { label: "Themes", href: "#/overview" },
      { label: "Design tokens", href: "#/overview" },
      { label: "Changelog", href: "#/overview" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#/overview" },
      { label: "Examples", href: "#/overview" },
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Figma kit", href: "https://figma.com", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#/overview" },
      { label: "Careers", href: "#/overview" },
      { label: "Contact", href: "#/overview" },
    ],
  },
];

export function FooterPage() {
  return (
    <>
      <PageHeader
        title="Footer"
        hint="A data-driven site footer with a brand block, named navigation columns, optional actions, a copyright line and a legal row. External links open in a new tab with rel=noopener noreferrer. Styles come from @pimolu/web-styles/footer.css."
      />


      <Section title="Surface treatments" hint="Choose a surface, blend into the page, or use a floating frame. The transparent appearance avoids side edges caused by an inset background."><div className="pg-stack">{Object.keys(footerVariantMap.appearance).map((value) => { const appearance = value as keyof typeof footerVariantMap.appearance; return <div key={value} className="pg-stack"><span className="pg-meta">{value}</span><Footer appearance={appearance} bordered={appearance !== "transparent"} brand="Pimolu" description="One system. Your identity." columns={[{ title: "Explore", links: [{ label: "Components", href: "#/button" }, { label: "Documentation", href: "#/overview" }] }]} copyright="Example workspace" /></div>; })}</div></Section>
      <Section
        title="Complete footer"
        hint="Each column is its own navigation landmark, named by its visible heading. The grid wraps from three columns to one on narrow screens."
      >
        <Footer
          brand={
            <span className="pg-brand">
              <span className="pg-brand__mark">P</span>

              <span>
                <strong className="pg-brand__name">
                  Pimolu UI
                </strong>
                <span className="pg-brand__tag">
                  Design system
                </span>
              </span>
            </span>
          }
          description="One design system shared by the web, the playground and native applications. Built on tokens, plain CSS and accessible React primitives."
          actions={
            <Button size="sm" appearance="outline">
              Star on GitHub
            </Button>
          }
          columns={hugeColumns}
          copyright="© 2026 Pimolu UI. MIT licensed."
          bottom={
            <>
              <Link
                href="#/overview"
                variant="muted"
                underline="hover"
              >
                Privacy
              </Link>

              <Link
                href="#/overview"
                variant="muted"
                underline="hover"
              >
                Terms
              </Link>

              <Link
                href="#/overview"
                variant="muted"
                underline="hover"
              >
                Status
              </Link>
            </>
          }
        />
      </Section>

      <Section
        title="Minimal footer"
        hint="Only the columns are required; the brand, the actions and the bottom row are optional."
      >
        <Footer
          columns={[
            {
              title: "Documentation",
              links: [
                {
                  label: "Overview",
                  href: "#/overview",
                },
                {
                  label: "Button",
                  href: "#/button",
                },
                {
                  label: "Themes",
                  href: "#/overview",
                },
              ],
            },
            {
              title: "Project",
              links: [
                {
                  label: "License",
                  href: "#/overview",
                },
                {
                  label: "Contributing",
                  href: "#/overview",
                },
              ],
            },
          ]}
        />
      </Section>

      <Section
        title="Copyright and legal row"
        hint="The bottom row separates the copyright from the legal links and wraps when the container is narrow."
      >
        <Footer
          brand={<strong>Pimolu UI</strong>}
          description="A cross-platform design system for teams that ship on several surfaces."
          columns={[
            {
              title: "Support",
              links: [
                {
                  label: "Issues",
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
          copyright="© 2026 Pimolu UI"
          bottom={
            <span>
              Made in the open · MIT License
            </span>
          }
        />
      </Section>
      <MotionCompatibilityExample target="Footer" />
    </>
  );
}
