"use client";

import { useState } from "react";
import { Badge, Button, CodeBlock } from "@pimolu/react";

export function TechnicalPostBlock() {
  const [vote, setVote] = useState("");
  return (
    <article className="mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge variant="primary">ENGINEERING / PRACTICAL NOTES</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
          Small forms.
          <br />
          Clear responsibilities.
        </h2>
        <p className="text-muted">
          A short guide to reading values without hiding the important parts.
        </p>
      </header>
      <section className="space-y-4">
        <h3 className="text-2xl">1. Let the browser collect the values</h3>
        <p className="leading-relaxed text-muted">
          Give each field a name, validate the required inputs, then read the form in
          the submit handler. This example displays the entered value locally.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '"use client";\nimport { useState } from "react";\nimport { Button,' +
            ' Input } from "@pimolu/react";\n\nexport function NameForm() {\n  ' +
            'const [name, setName] = useState("");\n  return (\n    <form ' +
            "onSubmit={(event) => {\n      event.preventDefault();\n      " +
            "const values = new FormData(event.currentTarget);\n      " +
            'setName(String(values.get("name") ?? ""));\n    }}>\n      <Input ' +
            'label="Name" name="name" required />\n      <Button ' +
            'type="submit">Read value</Button>\n      <p role="status">' +
            "{name}</p>\n    </form>\n  );\n}"
          }
          wrap
        />
      </section>
      <section className="space-y-3">
        <h3 className="text-2xl">2. Make the result explicit</h3>
        <p className="leading-relaxed text-muted">
          Tell the user when work completes or fails. In production, validate on the
          server as well and show errors next to the relevant field.
        </p>
      </section>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <span>Was this useful?</span>
        {["Yes", "Not yet"].map((x) => (
          <Button
            key={x}
            appearance="outline"
            aria-pressed={vote === x}
            onClick={() => setVote(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <p role="status" className="text-sm text-muted">
        {vote
          ? "Thanks. Your feedback stays in this preview."
          : "Sample technical article."}
      </p>
    </article>
  );
}
