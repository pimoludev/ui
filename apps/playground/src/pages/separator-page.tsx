import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@pimolu/react";

import {
  separatorAppearances,
  separatorThicknesses,
  separatorVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

export function SeparatorPage() {
  return (
    <>
      <PageHeader
        title="Separator"
        hint="A horizontal or vertical divider. Orientation, appearance, thickness and variant are enumerated from separatorVariantMap; the styles come from @pimolu/web-styles/separator.css."
      />

      <Section
        title="Orientation"
        hint="Horizontal fills its container; vertical stretches to the height of a flex or grid row."
      >
        <div className="pg-stack">
          <div className="pg-stack">
            <span className="pg-meta">horizontal</span>
            <Separator />
          </div>

          <div className="pg-separator-row">
            <span>Profile</span>
            <Separator orientation="vertical" />
            <span>Settings</span>
            <Separator orientation="vertical" />
            <span>Logout</span>
          </div>
        </div>
      </Section>

      <Section
        title="Appearances"
        hint="solid, dashed and dotted line styles."
      >
        <div className="pg-stack">
          {separatorAppearances.map((appearance) => (
            <div key={appearance} className="pg-demo-item">
              <span className="pg-meta">{appearance}</span>
              <Separator appearance={appearance} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Thickness"
        hint="Relative to the preset control border width."
      >
        <div className="pg-stack">
          {separatorThicknesses.map((thickness) => (
            <div key={thickness} className="pg-demo-item">
              <span className="pg-meta">{thickness}</span>
              <Separator thickness={thickness} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The semantic tone of the line."
      >
        <div className="pg-stack">
          {separatorVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <span className="pg-meta">{variant}</span>
              <Separator variant={variant} thickness="medium" />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Semantics"
        hint="Decorative by default: hidden from assistive technology. Set decorative to false to expose a real separator."
      >
        <div className="pg-stack">
          <div className="pg-demo-item">
            <span className="pg-meta">
              decorative (default) — role none, aria-hidden
            </span>
            <Separator />
          </div>

          <div className="pg-demo-item">
            <span className="pg-meta">
              semantic — role separator, labelled
            </span>
            <Separator
              decorative={false}
              aria-label="Security section divider"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Account settings</CardTitle>
              <CardDescription>
                Sections divided by separators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div>
                  <p>Profile</p>
                  <p className="pg-meta">Name, photo, email</p>
                </div>

                <Separator />

                <div>
                  <p>Security</p>
                  <p className="pg-meta">
                    Password, two-factor
                  </p>
                </div>

                <Separator appearance="dashed" />

                <div>
                  <p>Notifications</p>
                  <p className="pg-meta">Email and push</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toolbar</CardTitle>
              <CardDescription>
                Vertical separators between inline actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-separator-row">
                <span>Profile</span>
                <Separator orientation="vertical" />
                <span>Settings</span>
                <Separator orientation="vertical" />
                <span>Logout</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>
                The total is separated from the lines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Subtotal</span>
                  <span>€148</span>
                </div>
                <div className="pg-row pg-row--between">
                  <span className="pg-meta">Shipping</span>
                  <span>€9</span>
                </div>

                <Separator thickness="medium" />

                <div className="pg-row pg-row--between">
                  <strong>Total</strong>
                  <strong>€157</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
