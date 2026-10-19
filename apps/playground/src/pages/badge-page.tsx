import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pimolu/react";

import {
  badgeAppearances,
  badgeRadii,
  badgeSizes,
  badgeVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function BadgePage() {
  return (
    <>
      <PageHeader
        title="Badge"
        hint="A compact status or category label. Sizes, semantic variants, appearances and radius are enumerated from badgeVariantMap; the styles come from @pimolu/web-styles/badge.css."
      />

      <Section title="Sizes" hint="sm, md and lg.">
        <div className="pg-row">
          {badgeSizes.map((size) => (
            <Badge key={size} size={size}>
              {size}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the label."
      >
        <div className="pg-row">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="Solid, soft, outline and glass."
      >
        <div className="pg-row">
          {badgeAppearances.map((appearance) => (
            <Badge key={appearance} appearance={appearance}>
              {appearance}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Radius"
        hint="From square to fully rounded."
      >
        <div className="pg-row">
          {badgeRadii.map((radius) => (
            <Badge key={radius} radius={radius} appearance="outline">
              {radius}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Dot and icons"
        hint="A status dot, a leading icon, a trailing icon; both are hidden from assistive technology."
      >
        <div className="pg-row">
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="danger" dot>
            Offline
          </Badge>
          <Badge variant="primary" startIcon={<span>✓</span>}>
            Verified
          </Badge>
          <Badge appearance="outline" endIcon={<span>→</span>}>
            Next
          </Badge>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>
                Status of the last three orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">#4821 · Amélie B.</span>
                  <Badge variant="success" dot>
                    Delivered
                  </Badge>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">#4820 · Lucas M.</span>
                  <Badge variant="primary" dot>
                    In transit
                  </Badge>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">#4819 · Sofia R.</span>
                  <Badge variant="danger" dot>
                    Refunded
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Categories, next to a result count.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <Badge appearance="outline" radius="full">
                  Design
                </Badge>
                <Badge appearance="outline" radius="full">
                  Tokens
                </Badge>
                <Badge appearance="outline" radius="full">
                  Native
                </Badge>
                <Badge variant="primary" appearance="solid" radius="full">
                  12 results
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Presence and plan at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Status</span>
                  <Badge variant="success" dot>
                    Online
                  </Badge>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Plan</span>
                  <Badge variant="primary" appearance="solid">
                    Pro
                  </Badge>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Seats</span>
                  <Badge appearance="outline">4 / 10</Badge>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Invoices</span>
                  <Badge variant="warning" appearance="soft">
                    Overdue
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
