"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@pimolu/react";

export function ResourceDownloadBlock() {
  const [message, setMessage] = useState("");
  const resources = [
    {
      name: "Project brief",
      file: "project-brief.txt",
      body: "PROJECT BRIEF\nAudience:\nProblem:\nSuccess criteria:\nConstraints:\nNext steps:\n",
    },
    {
      name: "Launch checklist",
      file: "launch-checklist.txt",
      body:
        "LAUNCH CHECKLIST\n[ ] Test keyboard access\n[ ] Review mobile " +
        "layouts\n[ ] Check content and links\n[ ] Verify forms and errors\n",
    },
    {
      name: "Content outline",
      file: "content-outline.txt",
      body: "CONTENT OUTLINE\nTitle:\nReader:\nMain idea:\nSupporting examples:\nNext action:\n",
    },
  ];
  function download(resource: (typeof resources)[number]) {
    const url = URL.createObjectURL(
      new Blob([resource.body], {
        type: "text/plain",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.file;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(resource.name + " downloaded as a text file.");
  }
  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge>FREE RESOURCES</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">
          A good place
          <br />
          to begin.
        </h2>
        <p className="text-muted">
          Three small, editable text templates. No email required.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {resources.map((r, i) => (
          <Card key={r.file} className="space-y-6 p-6">
            <span className="text-3xl sm:text-4xl text-primary">0{i + 1}</span>
            <h3 className="text-xl font-medium">{r.name}</h3>
            <p className="text-sm text-muted">
              Plain text · editable · included in this example
            </p>
            <Button appearance="outline" onClick={() => download(r)}>
              Download {r.name}
            </Button>
          </Card>
        ))}
      </div>
      <p role="status" className="text-sm text-muted">
        {message || "Choose a resource to download."}
      </p>
    </section>
  );
}
