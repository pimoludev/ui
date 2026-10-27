import { CustomizationExample } from "./empty-state-customization-demo";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  emptyStateVariantMap,
  type PimoluEmptyStateSize,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

type Illustration =
  | "projects"
  | "search"
  | "inbox"
  | "billing";

function EmptyIllustration({
  kind,
}: {
  kind: Illustration;
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

  if (kind === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
        <path d="M8.5 11h5" />
      </svg>
    );
  }

  if (kind === "inbox") {
    return (
      <svg {...common}>
        <path d="M4 5h16l2 9v5H2v-5l2-9Z" />
        <path d="M2 14h5l1.5 2h7L17 14h5" />
      </svg>
    );
  }

  if (kind === "billing") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
      <path d="M4 12.5 12 17l8-4.5" />
      <path d="M4 17.5 12 22l8-4.5" />
    </svg>
  );
}

export function EmptyStatePage() {
  const sizes = Object.keys(
    emptyStateVariantMap.size
  ) as PimoluEmptyStateSize[];

  return (
    <>
      <PageHeader
        title="EmptyState"
        hint="A centered placeholder for a collection, a search or a whole page that has nothing to show yet. Sizes are enumerated from emptyStateVariantMap; the root is a labelled section with an h3 heading. Styles come from @pimolu/web-styles/empty-state.css."
      />

      <Section
        title="Sizes"
        hint="sm, md and lg scale the padding, the illustration and the typography."
      >
        <div className="pg-grid pg-grid--start">
          {sizes.map((size) => (
            <Card key={size}>
              <CardContent>
                <EmptyState
                  size={size}
                  icon={<EmptyIllustration kind="projects" />}
                  title={`${size} empty state`}
                  description="The size changes the rhythm, never the meaning."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Without an icon"
        hint="The illustration is optional; the heading and the description still carry the message."
      >
        <Card>
          <CardContent>
            <EmptyState
              title="No activity yet"
              description="Events appear here as soon as a teammate makes a change."
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
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                The first-run state of a workspace with a single
                primary action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EmptyState
                size="lg"
                icon={<EmptyIllustration kind="projects" />}
                title="Create your first project"
                description="Projects keep deployments, tokens and environments together. You can rename or archive one at any time."
                actions={
                  <>
                    <Button>New project</Button>

                    <Button appearance="outline">
                      Import from GitHub
                    </Button>
                  </>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                A result-less search that explains the filters and
                offers a way out.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EmptyState
                icon={<EmptyIllustration kind="search" />}
                title="No components match “modal”"
                description="Try a different term, or clear the filters to browse the whole library."
                actions={
                  <Button appearance="outline">
                    Clear filters
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>
                A positive empty state: there is nothing left to
                do.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EmptyState
                size="sm"
                icon={<EmptyIllustration kind="inbox" />}
                title="Inbox zero"
                description="You have read every notification."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                A neutral state with no action, for a section that
                fills itself later.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EmptyState
                icon={<EmptyIllustration kind="billing" />}
                title="No invoices yet"
                description="Your first invoice will be generated at the end of the billing period."
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
