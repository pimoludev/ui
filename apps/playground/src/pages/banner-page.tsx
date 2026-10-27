import { CustomizationExample } from "./banner-customization-demo";
import { useState } from "react";

import {
  Banner,
  bannerVariantMap,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type PimoluBannerVariant,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function BannerIcon({
  variant,
}: {
  variant: PimoluBannerVariant;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (variant === "success") {
    return (
      <svg {...common}>
        <path d="M4 12.5 9 17.5 20 6.5" />
      </svg>
    );
  }

  if (variant === "warning") {
    return (
      <svg {...common}>
        <path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (variant === "danger") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }

  if (variant === "neutral") {
    return (
      <svg {...common}>
        <path d="M5 21V8l7-5 7 5v13" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function DismissibleBannerDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="pg-row">
        <span className="pg-meta">The banner has been dismissed.</span>

        <Button
          size="sm"
          appearance="outline"
          onClick={() => setVisible(true)}
        >
          Show it again
        </Button>
      </div>
    );
  }

  return (
    <Banner
      variant="success"
      icon={<BannerIcon variant="success" />}
      title="Your workspace is on the Pro plan"
      description="The upgrade is active for every member, with no restart required."
      onDismiss={() => setVisible(false)}
    />
  );
}

export function BannerPage() {
  return (
    <>
      <PageHeader
        title="Banner"
        hint="A page-level message that spans the content area while keeping its text aligned to the regular content width. Variants are enumerated from bannerVariantMap; danger is announced as an alert, the other tones as a polite status. Styles come from @pimolu/web-styles/banner.css."
      />

      <Section
        title="Variants"
        hint="Each tone tints the whole surface and colours the icon."
      >
        <div className="pg-stack">
          {Object.keys(bannerVariantMap.variant).map(
            (variant) => {
              const tone =
                variant as PimoluBannerVariant;

              return (
                <Banner
                  key={tone}
                  variant={tone}
                  icon={<BannerIcon variant={tone} />}
                  title={`${tone} banner`}
                  description="A page-level message with a regular content width."
                />
              );
            }
          )}
        </div>
      </Section>

      <Section
        title="Actions and dismissal"
        hint="The close button is accessible and the consumer controls visibility."
      >
        <div className="pg-stack">
          <Banner
            variant="warning"
            icon={<BannerIcon variant="warning" />}
            title="Scheduled maintenance on Sunday"
            description="Deployments will be paused between 02:00 and 04:00 UTC."
            actions={
              <>
                <Button size="sm">
                  View the maintenance window
                </Button>

                <Button size="sm" appearance="outline">
                  Subscribe to updates
                </Button>
              </>
            }
          />

          <DismissibleBannerDemo />
        </div>
      </Section>

      <Section
        title="Sticky"
        hint="sticky keeps the banner at the top of its scrolling container; the page shell provides the offset in a real app."
      >
        <div
          style={{
            maxHeight: 240,
            overflowY: "auto",
            border: "1px solid var(--pimolu-border)",
            borderRadius: "var(--pimolu-radius-md)",
          }}
        >
          <Banner
            variant="info"
            sticky
            icon={<BannerIcon variant="info" />}
            title="You are editing a shared draft"
            description="Changes are visible to the team as soon as they are saved."
          />

          <div style={{ padding: 24 }}>
            <p className="pg-copy">
              Scroll this panel. The banner stays pinned above the
              content, while the paragraph below moves under it.
            </p>

            <p className="pg-copy" style={{ marginTop: 160 }}>
              End of the scrolling content.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="A banner belongs to the page shell, above the content it qualifies."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Account verification</CardTitle>
              <CardDescription>
                A persistent reminder above a settings page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Banner
                  variant="warning"
                  icon={<BannerIcon variant="warning" />}
                  title="Verify your email to keep publishing"
                  description="We sent a link to amelie@example.com."
                  actions={
                    <Button size="sm" appearance="outline">
                      Resend the email
                    </Button>
                  }
                />

                <p className="pg-copy">
                  Settings content would continue here, directly
                  under the banner.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident notice</CardTitle>
              <CardDescription>
                A danger banner for an outage that affects the
                whole account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Banner
                  variant="danger"
                  icon={<BannerIcon variant="danger" />}
                  title="API requests are failing"
                  description="We are investigating elevated error rates in the EU region."
                  actions={
                    <Button
                      size="sm"
                      variant="danger"
                      appearance="soft"
                    >
                      Open the status page
                    </Button>
                  }
                />

                <div className="pg-row pg-row--between">
                  <span className="pg-meta">
                    Last incident: 12 days ago
                  </span>

                  <span className="pg-meta">
                    EU · degraded
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product announcement</CardTitle>
              <CardDescription>
                A neutral banner that introduces an option without
                blocking the task.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <Banner
                  variant="neutral"
                  icon={<BannerIcon variant="neutral" />}
                  title="Dark mode is now available"
                  description="Choose a theme in the toolbar; system follows your operating system."
                  dismissible
                  onDismiss={() => {}}
                />

                <p className="pg-copy">
                  The announcement sits above the page content and
                  can be dismissed once it has been read.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
