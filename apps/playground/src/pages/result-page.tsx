import { CustomizationExample } from "./result-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Result,
  resultVariantMap,
  type PimoluResultStatus,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ResultIcon({
  status,
}: {
  status: PimoluResultStatus;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (status === "success") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16.5 9" />
      </svg>
    );
  }

  if (status === "error") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }

  if (status === "warning") {
    return (
      <svg {...common}>
        <path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
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

export function ResultPage() {
  const statuses = Object.keys(
    resultVariantMap.status
  ) as PimoluResultStatus[];

  return (
    <>
      <PageHeader
        title="Result"
        hint="A prominent, centered outcome after a task completes, a payment fails or a page cannot be shown. Statuses are enumerated from resultVariantMap; error is announced as an alert, every other status politely. Styles come from @pimolu/web-styles/result.css."
      />

      <Section
        title="Statuses"
        hint="The status drives the icon surface, the accent and the live role."
      >
        <div className="pg-grid pg-grid--start">
          {statuses.map((status) => (
            <Card key={status}>
              <CardContent>
                <Result
                  status={status}
                  icon={<ResultIcon status={status} />}
                  title={`${status} result`}
                  description="A short explanation of what happened and what the reader can do next."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="With actions"
        hint="Primary and secondary actions sit under the description."
      >
        <Card>
          <CardContent>
            <Result
              status="success"
              icon={<ResultIcon status="success" />}
              title="Deployment complete"
              description="production · fde3d86 was live in 42 seconds. Every health check passed."
              actions={
                <>
                  <Button>Open the site</Button>

                  <Button appearance="outline">
                    View the logs
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>
                A success screen that confirms the order and gives
                one obvious next step.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Result
                status="success"
                icon={<ResultIcon status="success" />}
                title="Order confirmed"
                description="Order #4822 is being prepared. A confirmation was sent to amelie@example.com."
                actions={
                  <>
                    <Button>Track the order</Button>

                    <Button appearance="ghost">
                      Continue shopping
                    </Button>
                  </>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                The error variant is announced immediately and
                offers a way to recover.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Result
                status="error"
                icon={<ResultIcon status="error" />}
                title="Payment declined"
                description="Your bank rejected the transaction. No money was taken and the seats are still reserved for 30 minutes."
                actions={
                  <>
                    <Button variant="danger">
                      Try another card
                    </Button>

                    <Button appearance="outline">
                      Contact support
                    </Button>
                  </>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>
                A warning result explains a temporary limitation
                without treating it as a failure.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Result
                status="warning"
                icon={<ResultIcon status="warning" />}
                title="Read-only mode"
                description="We are migrating the database. You can browse everything, but changes are paused until 04:00 UTC."
                actions={
                  <Button appearance="outline">
                    Follow the status page
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invitation</CardTitle>
              <CardDescription>
                A neutral information result for an expired link.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Result
                status="info"
                icon={<ResultIcon status="info" />}
                title="This invitation has expired"
                description="Ask an administrator to send a new invitation; the workspace has not changed."
                actions={
                  <Button appearance="outline">
                    Back to sign in
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
