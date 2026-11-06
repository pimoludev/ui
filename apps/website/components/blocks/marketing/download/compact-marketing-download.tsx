"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function CompactMarketingDownloadBlock() {
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState("Markdown");
  function download() {
    const text = [
      "# Pimolu project checklist",
      "",
      "- Define the audience",
      "- Review keyboard and mobile behavior",
      "- Verify forms and errors",
      "- Replace all sample data",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], {
        type: "text/plain",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "Markdown" ? "pimolu-checklist.md" : "pimolu-checklist.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Checklist downloaded. This is an editable document, not an app installer.",
    );
  }
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          App downloads
        </h2>
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <h3 className="text-3xl">
            Small toolkit.
            <br />
            Clear next steps.
          </h3>
          <p className="text-muted">
            Use the checklist for a website, store or internal application.
          </p>
          <Select
            label="Download format"
            value={format}
            onValueChange={setFormat}
            fullWidth
          >
            <option>Markdown</option>
            <option>Plain text</option>
          </Select>
          <Button onClick={download} fullWidth>
            Download project checklist
          </Button>
          <p className="text-sm text-muted">
            A real editable file. No account or email required.
          </p>
        </div>
        <Card className="space-y-4 p-6">
          <Badge>WHAT IS INCLUDED</Badge>
          <ul className="list-inside list-disc space-y-3">
            <li>Audience and scope</li>
            <li>Keyboard and mobile review</li>
            <li>Form validation</li>
            <li>Sample data replacement</li>
          </ul>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
