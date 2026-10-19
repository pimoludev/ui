import { useState } from "react";

import {
  Alert,
  alertVariantMap,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type PimoluAlertVariant,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function AlertIcon({
  variant,
}: {
  variant: PimoluAlertVariant;
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
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16.5h.01" />
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

function DismissibleAlertDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="pg-row">
        <span className="pg-meta">The alert has been dismissed.</span>

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
    <Alert
      variant="info"
      title="A new version of the app is available"
      description="Dismiss this notice, or reload when your work is saved."
      icon={<AlertIcon variant="info" />}
      onDismiss={() => setVisible(false)}
      actions={
        <Button
          size="sm"
          appearance="outline"
          onClick={() => setVisible(false)}
        >
          Later
        </Button>
      }
    />
  );
}

export function AlertPage() {
  return (
    <>
      <PageHeader
        title="Alert"
        hint="An inline message attached to a section or a form. Variants are enumerated from alertVariantMap; danger is announced as an alert while the other tones use a polite status. Styles come from @pimolu/web-styles/alert.css."
      />

      <Section
        title="Variants"
        hint="The semantic tone drives the icon, the border and the tinted surface."
      >
        <div className="pg-stack">
          {Object.keys(alertVariantMap.variant).map(
            (variant) => {
              const tone =
                variant as PimoluAlertVariant;

              return (
                <Alert
                  key={tone}
                  variant={tone}
                  icon={<AlertIcon variant={tone} />}
                  title={`${tone} alert`}
                  description="A short message that stays close to the content it describes."
                />
              );
            }
          )}
        </div>
      </Section>

      <Section
        title="Anatomy"
        hint="An optional title, description, body, actions and a dismiss button."
      >
        <Alert
          variant="warning"
          icon={<AlertIcon variant="warning" />}
          title="Your trial ends in three days"
          description="Add a payment method to keep the workspace and its history."
          actions={
            <>
              <Button size="sm">Add payment method</Button>

              <Button size="sm" appearance="outline">
                Compare plans
              </Button>
            </>
          }
          onDismiss={() => {}}
        >
          <p className="pg-copy">
            Usage continues normally until the trial ends.
          </p>
        </Alert>
      </Section>

      <Section
        title="Dismissible"
        hint="The component is controlled: the consumer hides it when onDismiss fires."
      >
        <DismissibleAlertDemo />
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Payment failed</CardTitle>
              <CardDescription>
                A blocking form error keeps its context and offers
                a recovery action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Alert
                variant="danger"
                icon={<AlertIcon variant="danger" />}
                title="We could not charge your card"
                description="The bank declined the transaction. Your workspace is still active for 24 hours."
                actions={
                  <>
                    <Button
                      size="sm"
                      variant="danger"
                      appearance="soft"
                    >
                      Update card
                    </Button>

                    <Button
                      size="sm"
                      appearance="ghost"
                    >
                      Contact support
                    </Button>
                  </>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import finished</CardTitle>
              <CardDescription>
                A success message that summarises the work and
                points at the result.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Alert
                variant="success"
                icon={<AlertIcon variant="success" />}
                title="48 contacts imported"
                description="Two rows were skipped because their email address was invalid."
                actions={
                  <Button size="sm" appearance="outline">
                    Review skipped rows
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deprecation notice</CardTitle>
              <CardDescription>
                A neutral message documents an upcoming change
                without alarming the reader.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Alert
                variant="neutral"
                icon={<AlertIcon variant="neutral" />}
                title="The v1 tokens are deprecated"
                description="They keep working until June, then the build will fail with a migration hint."
              >
                <p className="pg-copy">
                  Replace them with the semantic tokens listed in
                  the migration guide.
                </p>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
