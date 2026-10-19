import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Link,
  Paragraph,
  Text,
} from "@pimolu/react";

import {
  linkUnderlines,
  linkVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function LinkPage() {
  return (
    <>
      <PageHeader
        title="Link"
        hint="A styled anchor with three colour treatments and three underline modes. External links open in a new tab with a safe rel and a small icon, and a disabled link keeps its semantics without navigating. Styles come from @pimolu/web-styles/link.css."
      />

      <Section
        title="Variants"
        hint="Enumerated from linkVariantMap: primary, muted and inherit."
      >
        <div className="pg-stack">
          {linkVariants.map((variant) => (
            <div key={variant} className="pg-row">
              <span className="pg-meta">{variant}</span>

              <Link href="#/link" variant={variant}>
                Read the documentation
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Underline"
        hint="Enumerated from linkVariantMap: hover, always and none."
      >
        <div className="pg-stack">
          {linkUnderlines.map((underline) => (
            <div key={underline} className="pg-row">
              <span className="pg-meta">{underline}</span>

              <Link
                href="#/link"
                underline={underline}
              >
                Read the documentation
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="External and disabled"
        hint="external adds target and rel plus the arrow; disabled removes href and blocks the click handler."
      >
        <div className="pg-row">
          <Link href="https://example.com" external>
            Open example.com
          </Link>

          <Link
            href="https://example.com"
            external
            showExternalIcon={false}
          >
            Without the arrow
          </Link>

          <Link href="#/link" disabled>
            Disabled link
          </Link>
        </div>
      </Section>

      <Section
        title="In text"
        hint="A link inherits the typography around it and stays readable in a paragraph."
      >
        <Paragraph>
          The design tokens are documented in{" "}
          <Link href="#/link">the token reference</Link>, and the
          component inventory lives in{" "}
          <Link href="#/link" variant="muted" underline="always">
            the component guide
          </Link>
          . Both links keep the paragraph rhythm.
        </Paragraph>

        <Text>
          Inline links also work inside a{" "}
          <Link href="#/link">Text</Link> fragment.
        </Text>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                A list of links with a muted description.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div className="pg-stack">
                  <Link href="#/link">Getting started</Link>

                  <Text tone="muted" size="sm">
                    Install the packages and open the playground.
                  </Text>
                </div>

                <div className="pg-stack">
                  <Link href="#/link">Themes and presets</Link>

                  <Text tone="muted" size="sm">
                    Pick a palette, a radius and a density.
                  </Text>
                </div>

                <div className="pg-stack">
                  <Link href="#/link">Component inventory</Link>

                  <Text tone="muted" size="sm">
                    Every family, its tests and its playground page.
                  </Text>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>
                Muted links for secondary destinations.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Link href="#/link" variant="muted">
                  Privacy
                </Link>

                <Link href="#/link" variant="muted">
                  Terms
                </Link>

                <Link
                  href="https://github.com/pimoludev/ui"
                  external
                  variant="muted"
                >
                  GitHub
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
