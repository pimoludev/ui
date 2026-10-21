import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  TreeSelect,
  type PimoluTreeSelectOption,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const queues: PimoluTreeSelectOption[] = [
  {
    value: "billing",
    label: "Billing",
    children: [
      {
        value: "billing-invoices",
        label: "Invoices",
      },
      {
        value: "billing-refunds",
        label: "Refunds",
      },
      {
        value: "billing-plans",
        label: "Plans and upgrades",
      },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      {
        value: "product-desktop",
        label: "Desktop app",
      },
      {
        value: "product-mobile",
        label: "Mobile app",
        children: [
          {
            value: "product-mobile-ios",
            label: "iOS",
          },
          {
            value: "product-mobile-android",
            label: "Android",
          },
        ],
      },
      {
        value: "product-api",
        label: "API and integrations",
      },
    ],
  },
  {
    value: "trust",
    label: "Trust and safety",
    children: [
      {
        value: "trust-abuse",
        label: "Abuse reports",
      },
      {
        value: "trust-privacy",
        label: "Privacy requests",
      },
    ],
  },
  {
    value: "general",
    label: "General",
  },
];

const descriptors: PimoluTreeSelectOption[] = [
  {
    value: "billing",
    label: "Billing",
    children: [
      { value: "invoice", label: "Invoice question" },
      { value: "refund", label: "Refund request" },
      { value: "plan", label: "Plan change" },
    ],
  },
  {
    value: "account",
    label: "Account",
    children: [
      { value: "login", label: "Cannot sign in" },
      { value: "seats", label: "Seat management" },
      { value: "security", label: "Security review" },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      { value: "bug", label: "Bug report" },
      { value: "feature", label: "Feature request" },
    ],
  },
];

function ControlledRouting() {
  const [queue, setQueue] = useState<
    PimoluTreeSelectOption | undefined
  >({
    value: "product-mobile-ios",
    label: "iOS",
  });

  return (
    <div className="pg-stack">
      <TreeSelect
        label="Route to queue"
        options={queues}
        value={queue?.value}
        onValueChange={(_, option) => setQueue(option)}
        placeholder="Pick a team or sub-team"
        fullWidth
      />

      <div className="pg-row">
        <Badge variant="primary">
          {queue
            ? `Queue: ${queue.label}`
            : "Unassigned"}
        </Badge>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() =>
            setQueue({
              value: "trust-privacy",
              label: "Privacy requests",
            })
          }
        >
          Send to privacy
        </Button>

        <Button
          size="sm"
          appearance="ghost"
          disabled={queue === undefined}
          onClick={() => setQueue(undefined)}
        >
          Clear
        </Button>
      </div>

      <p className="pg-copy">
        Parent rows can be selected too. Expand a branch with the
        chevron or the Right arrow, and choose any level.
      </p>
    </div>
  );
}

function TicketRoutingExample() {
  const [descriptor, setDescriptor] = useState<
    PimoluTreeSelectOption | undefined
  >(undefined);

  return (
    <div className="pg-stack">
      <TreeSelect
        label="What can we help with?"
        options={descriptors}
        value={descriptor?.value}
        onValueChange={(_, option) => setDescriptor(option)}
        placeholder="Choose a topic"
        searchable
        fullWidth
      />

      <p className="pg-copy">
        {descriptor
          ? `We routed your message to the "${descriptor.label}" queue. A teammate replies within one business day.`
          : "Choose the closest topic so the message reaches the right team."}
      </p>
    </div>
  );
}

export function TreeSelectPage() {
  return (
    <>
      <PageHeader
        title="TreeSelect"
        hint="A single select over a nested tree. The trigger opens a portal panel with an optional search field; arrows, Right/Left, Home/End and typeahead move through the tree, and every level is selectable."
      />

      <Section
        title="Basic"
        hint="Click the trigger to open the panel, then expand a branch. The selected label is shown on the trigger."
      >
        <TreeSelect
          label="Support queue"
          options={queues}
          defaultValue="product-mobile-android"
          placeholder="Select a queue"
          fullWidth
        />
      </Section>

      <Section
        title="Controlled"
        hint="value is the selected node value; onValueChange receives the value and its option."
      >
        <Card>
          <CardHeader>
            <CardTitle>Conversation routing</CardTitle>
            <CardDescription>
              The badge mirrors the controlled queue. Any level in
              the hierarchy can be selected.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ControlledRouting />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Search"
        hint="Searchable adds a field at the top of the panel. Matching leaves stay visible under their ancestors."
      >
        <TicketRoutingExample />
      </Section>

      <Section
        title="States"
        hint="Helper context outside the field, a validation error, an empty data set, a read-only selection and a disabled control."
      >
        <div className="pg-stack">
          <TreeSelect
            label="Default selection"
            options={queues}
            defaultValue="trust-abuse"
            fullWidth
          />

          <TreeSelect
            label="Not clearable"
            options={queues}
            defaultValue="billing-refunds"
            clearable={false}
            fullWidth
          />

          <TreeSelect
            label="Required queue"
            options={queues}
            error="Choose where this conversation should go."
            fullWidth
          />

          <TreeSelect
            label="Empty"
            options={[]}
            emptyMessage="No queues are configured for this workspace."
            fullWidth
          />

          <TreeSelect
            label="Archived workspace"
            options={queues}
            defaultValue="general"
            disabled
            fullWidth
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Two concrete uses of the same nested control: a support router and a product feedback form."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Support router</CardTitle>
              <CardDescription>
                A searchable tree keeps a long taxonomy usable on a
                narrow screen.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TreeSelect
                label="Destination"
                options={queues}
                defaultValue="product-mobile"
                placeholder="Select a team"
                searchable
                fullWidth
              />
            </CardContent>

            <CardFooter>
              <Badge variant="success">
                SLA 4 hours
              </Badge>
              <Badge variant="secondary">
                Search enabled
              </Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback triage</CardTitle>
              <CardDescription>
                The same data shape works for product categories and
                issue types.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TreeSelect
                label="Category"
                options={descriptors}
                defaultValue="feature"
                placeholder="Choose a category"
                fullWidth
              />
            </CardContent>

            <CardFooter>
              <Badge variant="primary">
                Product feedback
              </Badge>
              <Badge variant="secondary">
                Routed
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </>
  );
}
