"use client";

import { Mentions, type PimoluMentionsOption, Avatar } from "@pimolu/react";
import { useState } from "react";

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

function SupportReplyExample() {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-5 min-w-0">
      <Mentions
        label="Internal note"
        placeholder="Add context for the next agent, use @ to notify someone…"
        options={teammates}
        value={value}
        onValueChange={setValue}
        helperText="Only visible to the support team."
        fullWidth
        classNames={{
          root: "custom-mentions-root",
          label: "custom-mentions-label"
        }}
      />
      <Mentions
        label="Disabled composer"
        options={teammates}
        defaultValue="This conversation is closed."
        disabled
        fullWidth
        classNames={{
          root: "custom-mentions-root",
          label: "custom-mentions-label"
        }}
      />
    </div>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Mentions
              label="Limited suggestions"
              placeholder="Type @…"
              options={teammates}
              maxSuggestions={2}
              helperText="Only the two best matches are shown."
              fullWidth
              classNames={{
                root: "custom-mentions-root",
                label: "custom-mentions-label"
              }}
            />
            <Mentions
              label="Several mentions"
              options={teammates}
              defaultValue="Thanks @Alice Martin and @Bob Chen for the review."
              fullWidth
              classNames={{
                root: "custom-mentions-root",
                label: "custom-mentions-label"
              }}
            />
            <SupportReplyExample />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-mentions-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-mentions-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
