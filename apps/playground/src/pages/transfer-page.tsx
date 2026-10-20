import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Transfer,
  type PimoluTransferItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const employees: PimoluTransferItem[] = [
  {
    key: "alice",
    label: "Alice Martin",
    description: "Product designer",
  },
  {
    key: "bob",
    label: "Bob Chen",
    description: "Front-end engineer",
  },
  {
    key: "carol",
    label: "Carol Diallo",
    description: "Engineering manager",
  },
  {
    key: "dana",
    label: "Dana Novak",
    description: "Data analyst",
  },
  {
    key: "eli",
    label: "Eli Moreau",
    description: "Platform engineer",
    disabled: true,
  },
  {
    key: "fatou",
    label: "Fatou Ndiaye",
    description: "Support lead",
  },
];

const roles: PimoluTransferItem[] = [
  {
    key: "design",
    label: "Design",
    description: "Product and brand",
  },
  {
    key: "frontend",
    label: "Front-end",
    description: "Web applications",
  },
  {
    key: "backend",
    label: "Back-end",
    description: "Services and data",
  },
  {
    key: "mobile",
    label: "Mobile",
    description: "iOS and Android",
  },
];

function AccessExample() {
  const [targets, setTargets] = useState<string[]>([
    "alice",
    "bob",
  ]);

  return (
    <div className="pg-stack">
      <Transfer
        data={employees}
        targetKeys={targets}
        onChange={setTargets}
        titles={["Available", "With access"]}
        searchable
        showCount
        listHeight={230}
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          {targets.length} teammate
          {targets.length === 1 ? "" : "s"} with access
        </span>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() => setTargets([])}
          disabled={targets.length === 0}
        >
          Revoke all
        </Button>
      </div>
    </div>
  );
}

function ReviewerExample() {
  const [targets, setTargets] = useState<string[]>([
    "carol",
  ]);

  return (
    <Transfer
      data={employees}
      targetKeys={targets}
      onChange={setTargets}
      titles={["Team", "Reviewers"]}
      searchable
      showCount
      showMoveAll={false}
      listHeight={190}
    />
  );
}

function TeamExample() {
  const [targets, setTargets] = useState<string[]>([
    "frontend",
  ]);

  return (
    <div className="pg-stack">
      <Transfer
        data={roles}
        targetKeys={targets}
        onChange={setTargets}
        titles={["Roles", "Selected roles"]}
        searchable
        showCount
        listHeight={200}
      />

      <div className="pg-row">
        {targets.map((key) => (
          <Badge key={key} variant="primary">
            {roles.find((role) => role.key === key)
              ?.label ?? key}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function TransferPage() {
  return (
    <>
      <PageHeader
        title="Transfer"
        hint="Two scrollable lists with checkboxes, per-list search and move controls. The target list is controlled by targetKeys, so the same source data can feed several transfers on one page."
      />

      <Section
        title="Basic"
        hint="Select items on either side, then move them with the arrow controls. Counts stay visible while searching."
      >
        <Card>
          <CardHeader>
            <CardTitle>Workspace access</CardTitle>
            <CardDescription>
              A controlled transfer with search, counts and a
              fixed list height.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AccessExample />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Search and bulk moves"
        hint="Each list filters independently; “move all” skips disabled items."
      >
        <Transfer
          data={employees}
          defaultTargetKeys={["fatou"]}
          titles={["Available", "Selected"]}
          searchable
          showCount
          listHeight={220}
          emptyMessage="Everyone is already selected."
        />
      </Section>

      <Section
        title="Custom rendering"
        hint="render replaces the default label and description while the checkbox keeps an accessible name."
      >
        <Transfer
          data={employees}
          titles={["People", "Assigned"]}
          showCount
          listHeight={210}
          render={(item) => (
            <span
              className="pg-row"
              style={{ gap: 8, flexWrap: "nowrap" }}
            >
              <Avatar name={item.label} size="xs" />

              <span className="pg-demo-item" style={{ gap: 0 }}>
                <strong
                  style={{ fontSize: "0.875rem" }}
                >
                  {item.label}
                </strong>

                <span className="pg-meta">
                  {item.description}
                </span>
              </span>
            </span>
          )}
        />
      </Section>

      <Section
        title="States"
        hint="A disabled transfer keeps its values visible but blocks every interaction; an empty target shows its empty state."
      >
        <div className="pg-stack">
          <Transfer
            data={employees}
            defaultTargetKeys={["alice", "carol"]}
            titles={["Available", "Selected"]}
            searchable
            showCount
            disabled
            listHeight={190}
          />

          <Transfer
            data={roles}
            titles={["Roles", "Selected roles"]}
            showCount
            listHeight={160}
            emptyMessage="No roles selected yet."
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="The same two-list control used for permissions, reviews and team composition."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer assignment</CardTitle>
              <CardDescription>
                A single reviewer is enough, but the control
                still allows a quick swap.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ReviewerExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team roles</CardTitle>
              <CardDescription>
                The selected keys are echoed as badges below the
                control.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TeamExample />
            </CardContent>

            <CardFooter>
              <Badge variant="success">
                Changes save automatically
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </>
  );
}
