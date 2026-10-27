import { CustomizationExample } from "./card-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@pimolu/react";

import {
  cardAppearances,
  cardSizes,
  cardVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function CardPage() {
  return (
    <>
      <PageHeader
        title="Card"
        hint="A surface with a header, content and footer. Sizes, semantic variants and appearances are enumerated from cardVariantMap; the styles come from @pimolu/web-styles/card.css."
      />

      <Section
        title="Sizes"
        hint="sm, md and lg scale the padding, the gap and the title."
      >
        <div className="pg-grid">
          {cardSizes.map((size) => (
            <Card key={size} size={size}>
              <CardHeader>
                <CardTitle>{size}</CardTitle>
                <CardDescription>
                  Padding, gap and title size follow the size.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Body content for the {size} size.
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone consumed by the outline and soft appearances."
      >
        <div className="pg-grid">
          {cardVariants.map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardTitle>{variant}</CardTitle>
                <CardDescription>
                  Semantic tone: {variant}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                A short body so the surface is visible.
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Outline, soft, elevated and glass."
      >
        <div className="pg-grid">
          {cardAppearances.map((appearance) => (
            <Card key={appearance} appearance={appearance}>
              <CardHeader>
                <CardTitle>{appearance}</CardTitle>
                <CardDescription>
                  Appearance: {appearance}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                The same content under a different surface.
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Composition"
        hint="Header, content and footer with actions; the footer sticks to the bottom."
      >
        <div className="pg-grid">
          <Card>
            <CardHeader>
              <CardTitle>Deploy the release</CardTitle>
              <CardDescription>
                Everything is verified and ready to publish.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The footer is pushed down by the content, so
                actions stay aligned across cards of different
                heights.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Publish</Button>
              <Button size="sm" appearance="outline">
                Cancel
              </Button>
            </CardFooter>
          </Card>

          <Card variant="primary" appearance="soft">
            <CardHeader>
              <CardTitle>Primary and soft</CardTitle>
              <CardDescription>
                A variant combined with an appearance that
                consumes its tone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>The surface is tinted with the semantic tone.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary">
                Understand
              </Button>
            </CardFooter>
          </Card>

          <Card appearance="glass">
            <CardHeader>
              <CardTitle as="h2">Glass surface</CardTitle>
              <CardDescription>
                A heading level can be set with the as prop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Translucent surface, tokens from the glass preset.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <img
              className="pg-media"
              src="/product.svg"
              alt="Pimolu Runner sneaker"
            />
            <CardHeader>
              <CardTitle>Pimolu Runner</CardTitle>
              <CardDescription>
                Lightweight sneaker for everyday runs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div className="pg-row">
                  <span className="pg-price">€129</span>
                  <span className="pg-meta">4 colors · sizes 38–46</span>
                </div>
                <p className="pg-meta">★ 4.8 · 214 reviews</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" fullWidth>
                Add to cart
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="pg-row">
                <span className="pg-avatar" aria-hidden="true">
                  AB
                </span>
                <div>
                  <CardTitle>Amélie Bernard</CardTitle>
                  <CardDescription>
                    Product designer · Lyon
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <p className="pg-meta">
                  Designs the tokens and the theme system,
                  currently on the native registry.
                </p>

                <div className="pg-metrics">
                  <div className="pg-metric">
                    <span className="pg-metric__value">128</span>
                    <span className="pg-meta">projects</span>
                  </div>
                  <div className="pg-metric">
                    <span className="pg-metric__value">4.2k</span>
                    <span className="pg-meta">followers</span>
                  </div>
                  <div className="pg-metric">
                    <span className="pg-metric__value">12</span>
                    <span className="pg-meta">teams</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm">Follow</Button>
              <Button size="sm" appearance="outline">
                Message
              </Button>
            </CardFooter>
          </Card>

          <Card variant="primary" appearance="soft">
            <CardHeader>
              <CardDescription>Monthly revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div className="pg-row">
                  <span className="pg-stat">€24,180</span>
                  <span className="pg-meta">+12.4%</span>
                </div>

                <div className="pg-bars" aria-hidden="true">
                  {[38, 52, 44, 61, 57, 72, 66, 80, 74, 88, 83, 100].map(
                    (height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}%` }}
                        data-active={
                          index === 11 ? "true" : undefined
                        }
                      />
                    ),
                  )}
                </div>

                <div className="pg-metrics">
                  <div className="pg-metric">
                    <span className="pg-metric__value">€12,480</span>
                    <span className="pg-meta">Organic</span>
                  </div>
                  <div className="pg-metric">
                    <span className="pg-metric__value">€7,900</span>
                    <span className="pg-meta">Paid</span>
                  </div>
                  <div className="pg-metric">
                    <span className="pg-metric__value">€3,800</span>
                    <span className="pg-meta">Referral</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" appearance="ghost">
                View report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
