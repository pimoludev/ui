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
  Mentions,
  type PimoluMentionsOption,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const teammates: PimoluMentionsOption[] = [
  {
    id: "alice",
    label: "Alice Martin",
    description: "Product designer · Paris",
    avatar: <Avatar name="Alice Martin" size="xs" />,
  },
  {
    id: "bob",
    label: "Bob Chen",
    description: "Front-end engineer · Lyon",
    avatar: <Avatar name="Bob Chen" size="xs" />,
  },
  {
    id: "carol",
    label: "Carol Diallo",
    description: "Engineering manager · Dakar",
    avatar: <Avatar name="Carol Diallo" size="xs" />,
  },
  {
    id: "dana",
    label: "Dana Novak",
    description: "Data analyst · Prague",
    avatar: <Avatar name="Dana Novak" size="xs" />,
  },
];

const channels: PimoluMentionsOption[] = [
  {
    id: "design",
    label: "design-system",
    description: "Design system announcements",
  },
  {
    id: "frontend",
    label: "frontend",
    description: "Web platform team",
  },
  {
    id: "releases",
    label: "releases",
    description: "Release notes and deployments",
  },
];

function ProjectUpdateExample() {
  const [value, setValue] = useState(
    "Hi @Alice Martin, the new tokens are ready for review. "
  );

  const [lastMention, setLastMention] = useState("");

  return (
    <div className="pg-stack">
      <Mentions
        label="Project update"
        placeholder="Write an update and mention a teammate…"
        options={teammates}
        value={value}
        onValueChange={setValue}
        onSelect={(option) =>
          setLastMention(option.label)
        }
        rows={4}
        fullWidth
      />

      <div className="pg-row pg-row--between">
        <span className="pg-meta">
          {lastMention
            ? `Last mention: ${lastMention}`
            : "No mention selected yet."}
        </span>

        <Button
          size="sm"
          disabled={value.trim() === ""}
        >
          Post update
        </Button>
      </div>
    </div>
  );
}

function SupportReplyExample() {
  const [value, setValue] = useState("");

  return (
    <div className="pg-stack">
      <Mentions
        label="Internal note"
        placeholder="Add context for the next agent, use @ to notify someone…"
        options={teammates}
        value={value}
        onValueChange={setValue}
        helperText="Only visible to the support team."
        fullWidth
      />

      <Mentions
        label="Disabled composer"
        options={teammates}
        defaultValue="This conversation is closed."
        disabled
        fullWidth
      />
    </div>
  );
}

function ChannelExample() {
  const [value, setValue] = useState("");

  return (
    <Mentions
      label="Channel announcement"
      placeholder="Type # to pick a channel…"
      options={channels}
      trigger="#"
      value={value}
      onValueChange={setValue}
      allowCreate
      helperText="Unknown channels can be created on the fly."
      fullWidth
    />
  );
}

export function MentionsPage() {
  return (
    <>
      <PageHeader
        title="Mentions"
        hint="A plain textarea with an @ trigger, a filtered suggestion list anchored below the field, and keyboard selection. Mentions stay plain text, so the submitted value is exactly what the user typed."
      />

      <Section
        title="Basic"
        hint="Type @ and keep typing to filter; ArrowUp/Down move, Enter or Tab insert, Escape closes."
      >
        <Card>
          <CardHeader>
            <CardTitle>Team update</CardTitle>
            <CardDescription>
              A controlled composer with a realistic starting
              value.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ProjectUpdateExample />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Custom trigger"
        hint="The trigger is configurable and allowCreate offers the current query as a new mention."
      >
        <ChannelExample />
      </Section>

      <Section
        title="States and suggestions"
        hint="Helper text, a limited number of suggestions, several mentions in one text, and a disabled composer."
      >
        <div className="pg-stack">
          <Mentions
            label="Limited suggestions"
            placeholder="Type @…"
            options={teammates}
            maxSuggestions={2}
            helperText="Only the two best matches are shown."
            fullWidth
          />

          <Mentions
            label="Several mentions"
            options={teammates}
            defaultValue="Thanks @Alice Martin and @Bob Chen for the review."
            fullWidth
          />

          <SupportReplyExample />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="The same field used in two real communication flows."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Release note</CardTitle>
              <CardDescription>
                Mention the owners of the packages included in
                the release.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Mentions
                label="Message"
                options={teammates}
                placeholder="v2.4 ships today. @…"
                defaultValue="v2.4 ships today. "
                rows={3}
                fullWidth
              />
            </CardContent>

            <CardFooter>
              <div className="pg-row">
                <Badge variant="success">
                  Ready to send
                </Badge>
                <span className="pg-meta">
                  4 teammates available
                </span>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Design review</CardTitle>
              <CardDescription>
                A short note that asks a designer to look at a
                component before it ships.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Mentions
                label="Review request"
                options={teammates}
                defaultValue="@Alice Martin could you check the new "
                rows={3}
                fullWidth
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
