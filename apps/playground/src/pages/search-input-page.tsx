import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SearchInput,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const searchSizes = ["sm", "md", "lg"] as const;

const docEntries = [
  {
    title: "Installation",
    section: "Getting started",
    excerpt:
      "Install the workspace, build the generated tokens and start the playground.",
  },
  {
    title: "Theme builder",
    section: "Design system",
    excerpt:
      "Try a preset, a colour mode, a brand colour, a radius and a density.",
  },
  {
    title: "SearchInput",
    section: "Forms",
    excerpt:
      "A search field with a keyboard hint, a clear action and Enter to submit.",
  },
  {
    title: "CodeBlock",
    section: "Typography",
    excerpt:
      "Documentation samples with line numbers, highlights and copy feedback.",
  },
  {
    title: "Design tokens",
    section: "Design system",
    excerpt:
      "Primitive colours, spacing and radii feeding the semantic theme aliases.",
  },
];

function ControlledSearch() {
  const [value, setValue] = useState("Theme builder");

  return (
    <div className="pg-stack">
      <SearchInput
        label="Controlled query"
        value={value}
        onValueChange={setValue}
        shortcut="/"
      />

      <span className="pg-meta">
        value: &quot;{value}&quot;
      </span>
    </div>
  );
}

function DocumentationSearch() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(
    null
  );

  const normalized = query.trim().toLowerCase();

  const results = normalized
    ? docEntries.filter((entry) =>
        `${entry.title} ${entry.section} ${entry.excerpt}`
          .toLowerCase()
          .includes(normalized)
      )
    : docEntries;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search the documentation</CardTitle>
        <CardDescription>
          Results filter as you type. Enter records the query;
          Escape clears the field.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <SearchInput
            label="Search the documentation"
            placeholder="Search components, tokens, guides…"
            shortcut="/"
            value={query}
            onValueChange={(nextValue: string) => {
              setQuery(nextValue);

              if (!nextValue) setSubmitted(null);
            }}
            onSearch={(nextValue: string) =>
              setSubmitted(nextValue)
            }
          />

          <div className="pg-row pg-row--between">
            <span className="pg-meta">
              {results.length} result
              {results.length === 1 ? "" : "s"}
            </span>

            {submitted !== null && (
              <Badge
                variant="primary"
                appearance="soft"
                size="sm"
              >
                Searched: {submitted || "everything"}
              </Badge>
            )}
          </div>

          <div className="pg-stack">
            {results.map((entry) => (
              <Card key={entry.title} size="sm">
                <CardContent>
                  <div className="pg-row pg-row--between">
                    <strong>{entry.title}</strong>

                    <Badge
                      variant="neutral"
                      appearance="soft"
                      size="sm"
                    >
                      {entry.section}
                    </Badge>
                  </div>

                  <p className="pg-meta">
                    {entry.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}

            {results.length === 0 && (
              <p className="pg-meta">
                No page matches “{query}”. Try a component name
                or a token.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchInputPage() {
  return (
    <>
      <PageHeader
        title="SearchInput"
        hint="A styled search field for documentation and application search. It composes the Input control: visible label, optional shortcut hint, accessible clear action, Enter to search and Escape to clear, controlled or uncontrolled."
      />

      <Section
        title="Basic"
        hint="The shortcut is rendered as a Kbd; it is a hint, not a global key binding."
      >
        <SearchInput
          label="Search Pimolu UI"
          placeholder="Search components, tokens, guides…"
          shortcut="/"
        />
      </Section>

      <Section
        title="Sizes"
        hint="sm, md and lg reuse the Input height and type scale."
      >
        <div className="pg-stack">
          {searchSizes.map((size) => (
            <SearchInput
              key={size}
              size={size}
              label={`Search, ${size}`}
              placeholder="Search the docs…"
              shortcut={size === "lg" ? "⌘K" : undefined}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Controlled and states"
        hint="A controlled field follows its value; disabled, non-clearable and custom clear labels are supported."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <div className="pg-panel">
            <ControlledSearch />
          </div>

          <div className="pg-panel pg-stack">
            <SearchInput
              label="Disabled"
              defaultValue="Locked query"
              shortcut="/"
              disabled
            />

            <SearchInput
              label="Without clear action"
              defaultValue="No clear button"
              clearable={false}
            />

            <SearchInput
              label="Custom clear label"
              defaultValue="Reset me"
              clearLabel="Reset the documentation query"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Example: documentation search"
        hint="A realistic page-level composition. The component stays a field; the result list belongs to the page."
      >
        <DocumentationSearch />
      </Section>

      <Section
        title="Keyboard"
        hint="Enter calls onSearch with the current query. Escape clears and keeps focus. The clear button is reachable with Tab and named by clearLabel."
      >
        <Card>
          <CardContent>
            <div className="pg-stack">
              <div className="pg-row pg-row--between">
                <span>Submit the current query</span>
                <Badge
                  variant="neutral"
                  appearance="soft"
                  size="sm"
                >
                  Enter
                </Badge>
              </div>

              <div className="pg-row pg-row--between">
                <span>Clear and keep focus</span>
                <Badge
                  variant="neutral"
                  appearance="soft"
                  size="sm"
                >
                  Escape
                </Badge>
              </div>

              <div className="pg-row pg-row--between">
                <span>Shortcut hint</span>
                <Badge
                  variant="neutral"
                  appearance="soft"
                  size="sm"
                >
                  /
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
