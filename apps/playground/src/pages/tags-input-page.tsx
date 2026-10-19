import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TagsInput,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ArticleTags() {
  const [tags, setTags] = useState([
    "design systems",
    "accessibility",
  ]);

  const [published, setPublished] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish an article</CardTitle>

        <CardDescription>
          Add up to five topics. Enter or comma commits a
          tag; Backspace removes the last one.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <TagsInput
            label="Topics"
            placeholder="Add a topic"
            value={tags}
            onValueChange={(next: string[]) => {
              setTags(next);
              setPublished(false);
            }}
            maxTags={5}
            fullWidth
            error={tags.length === 0}
            errorMessage={
              tags.length === 0
                ? "An article needs at least one topic."
                : undefined
            }
            helperText={`${tags.length} of 5 topics selected.`}
          />

          <div className="pg-row">
            <Badge variant="primary">
              {tags.length} topics
            </Badge>

            <Button
              size="sm"
              disabled={tags.length === 0}
              onClick={() => setPublished(true)}
            >
              Publish
            </Button>

            {published ? (
              <span className="pg-meta">
                Published with {tags.join(", ")}.
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TagsInputPage() {
  return (
    <>
      <PageHeader
        title="Tags Input"
        hint="Controlled or uncontrolled string arrays with Enter/comma delimiters, paste splitting, Backspace removal, maxTags, duplicate handling and accessible remove buttons. Styles come from @pimolu/web-styles/tags-input.css."
      />

      <Section
        title="Sizes"
        hint="sm, md and lg follow the shared field scale."
      >
        <div className="pg-grid pg-grid--start">
          {(["sm", "md", "lg"] as const).map(
            (size) => (
              <TagsInput
                key={size}
                size={size}
                label={`Size ${size}`}
                placeholder="Add a tag"
                defaultValue={["pimolu"]}
              />
            )
          )}
        </div>
      </Section>

      <Section
        title="Delimiters and paste"
        hint="Enter always commits. A custom delimiters list replaces the default comma. Pasting a list splits, trims and deduplicates it."
      >
        <div className="pg-grid pg-grid--start">
          <TagsInput
            label="Skills"
            placeholder="react, vue, svelte"
            helperText="Try typing react, vue and pressing Enter."
          />

          <TagsInput
            label="Custom delimiters"
            delimiters={[";"]}
            placeholder="design; research"
            helperText="Semicolons commit a tag here."
          />

          <TagsInput
            label="Full width"
            fullWidth
            placeholder="Paste a comma-separated list"
            helperText="Paste fills several tags at once."
          />
        </div>
      </Section>

      <Section
        title="Limits and duplicates"
        hint="maxTags ignores extra values. Duplicates are rejected unless allowDuplicates is true."
      >
        <div className="pg-grid pg-grid--start">
          <TagsInput
            label="Up to three"
            maxTags={3}
            defaultValue={["one", "two"]}
            placeholder="One more"
            helperText="The fourth tag is ignored."
          />

          <TagsInput
            label="Duplicates allowed"
            allowDuplicates
            defaultValue={["urgent", "urgent"]}
            placeholder="Add another"
          />
        </div>
      </Section>

      <Section
        title="States"
        hint="Invalid, disabled and read-only fields keep the tags visible while preventing edits."
      >
        <div className="pg-grid pg-grid--start">
          <TagsInput
            label="Invalid"
            errorMessage="Choose at least one topic."
            placeholder="No topic yet"
          />

          <TagsInput
            label="Disabled"
            defaultValue={["locked", "archived"]}
            disabled
          />

          <TagsInput
            label="Read only"
            defaultValue={["published", "reviewed"]}
            readOnly
          />
        </div>
      </Section>

      <Section
        title="Example"
        hint="A publishing form pairs the tag list with a limit, inline validation and a completion action."
      >
        <ArticleTags />
      </Section>
    </>
  );
}
