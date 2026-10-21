import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroEyebrow,
  HeroTitle,
  Stat,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function HeroPreview() {
  return (
    <Card>
      <CardHeader>
        <div className="pg-row pg-row--between">
          <Badge variant="secondary">Live preview</Badge>
          <span className="pg-meta">v1.0</span>
        </div>

        <CardTitle>Pimolu Studio</CardTitle>
        <CardDescription>
          A calmer surface for the design system.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <Stat
            label="Components"
            value="129"
            delta="+17"
            trend="up"
            description="this iteration"
          />

          <div className="pg-row">
            <Button size="sm">Open workspace</Button>
            <Button size="sm" appearance="outline">
              View source
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HeroPage() {
  return (
    <>
      <PageHeader
        title="Hero"
        hint="A marketing opener with eyebrow, title, description, actions and an optional media slot. It adapts its type scale, alignment and background treatment to the page. Styles come from @pimolu/web-styles/hero.css."
      />

      <Section
        title="Marketing hero"
        hint="The default composition pairs a left-aligned message with a visual on the right."
      >
        <Hero variant="gradient" media={<HeroPreview />}>
          <HeroContent>
            <HeroEyebrow>Pimolu UI 1.0</HeroEyebrow>

            <HeroTitle as="h2">
              One design system for every surface
            </HeroTitle>

            <HeroDescription>
              Build the web and the app from the same tokens,
              components and accessibility contract. No
              translation layer, no second visual system.
            </HeroDescription>

            <HeroActions>
              <Button>Get started</Button>
              <Button appearance="outline">
                Read the docs
              </Button>
            </HeroActions>
          </HeroContent>
        </Hero>
      </Section>

      <Section
        title="Centered and muted"
        hint="align='center' and variant='muted' create a quieter launch or announcement block."
      >
        <Hero
          variant="muted"
          align="center"
          size="md"
        >
          <HeroContent>
            <HeroEyebrow>Release notes</HeroEyebrow>

            <HeroTitle as="h2">
              A calmer way to ship interfaces
            </HeroTitle>

            <HeroDescription>
              Every new family is tested, documented and ready
              to compose. Start with the primitives and scale
              into a full product surface.
            </HeroDescription>

            <HeroActions>
              <Button>Explore components</Button>
              <Button appearance="ghost">View changelog</Button>
            </HeroActions>
          </HeroContent>
        </Hero>
      </Section>

      <Section
        title="Grid surface with bottom media"
        hint="mediaPosition='bottom' stacks the visual under the message; variant='grid' adds a technical backdrop."
      >
        <Hero
          variant="grid"
          size="sm"
          mediaPosition="bottom"
          media={<HeroPreview />}
        >
          <HeroContent>
            <HeroEyebrow>Built for teams</HeroEyebrow>

            <HeroTitle as="h2">
              Design, code and native in one place
            </HeroTitle>

            <HeroDescription>
              Use the same data contracts for React, native and
              future platform renderers.
            </HeroDescription>

            <HeroActions>
              <Button>Start building</Button>
              <Badge variant="neutral">Open source</Badge>
            </HeroActions>
          </HeroContent>
        </Hero>
      </Section>
    </>
  );
}
