import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  Heading,
  Paragraph,
  Text,
} from "@pimolu/react";

import {
  typographySizes,
  typographyTones,
  typographyWeights,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        hint="Text, Paragraph and Heading share one size, weight and tone scale. Heading keeps its semantic level while choosing the visual size, and every component renders a real HTML element. Styles come from @pimolu/web-styles/typography.css."
      />

      <Section
        title="Scale"
        hint="Enumerated from typographyVariantMap: xs to 3xl."
      >
        <div className="pg-stack">
          {typographySizes.map((size) => (
            <div key={size} className="pg-row">
              <span className="pg-meta">{size}</span>

              <Text size={size}>
                The quick brown fox jumps over the lazy dog.
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Weights"
        hint="normal, medium, semibold and bold."
      >
        <div className="pg-stack">
          {typographyWeights.map((weight) => (
            <div key={weight} className="pg-row">
              <span className="pg-meta">{weight}</span>

              <Text size="lg" weight={weight}>
                A heavier line changes the hierarchy, not the
                meaning.
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Tones"
        hint="Semantic colours that stay readable in light, dark and every preset."
      >
        <div className="pg-stack">
          {typographyTones.map((tone) => (
            <div key={tone} className="pg-row">
              <span className="pg-meta">{tone}</span>

              <Text size="md" tone={tone}>
                The same sentence, a different semantic tone.
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Headings"
        hint="The level sets the tag and the default size; size overrides the visual scale without changing the tag."
      >
        <div className="pg-stack">
          <Heading level={2}>
            Level 2 — section title
          </Heading>

          <Heading level={3}>
            Level 3 — subsection
          </Heading>

          <Heading level={4}>
            Level 4 — small section
          </Heading>

          <Heading level={5}>
            Level 5 — label-like heading
          </Heading>

          <Heading level={6}>
            Level 6 — smallest heading
          </Heading>

          <Heading level={2} size="lg" tone="muted">
            Level 2 with the lg visual size and a muted tone
          </Heading>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Article</CardTitle>
              <CardDescription>
                A title, a lead, a paragraph and inline code.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Heading level={2}>
                  A design system is a contract
                </Heading>

                <Text size="lg" tone="muted">
                  Components agree on spacing, colour and
                  behaviour before anyone writes a screen.
                </Text>

                <Paragraph>
                  The token pipeline turns the primitives into
                  CSS variables, then the provider exposes them
                  to every component through{" "}
                  <Code>data-pimolu-theme</Code> and{" "}
                  <Code>data-pimolu-style</Code>.
                </Paragraph>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hierarchy</CardTitle>
              <CardDescription>
                Size and weight communicate structure; the
                semantic tag keeps the document outline honest.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Heading level={3}>Release notes</Heading>

                <Text weight="semibold">
                  Version 0.1.0 is ready.
                </Text>

                <Paragraph size="sm" tone="muted">
                  The package adds the typography primitives,
                  the form field wrapper and the new overlay
                  components.
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
