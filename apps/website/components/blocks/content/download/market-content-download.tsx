"use client";

import { useState } from "react";
import { Button, Card, Select, Image } from "@pimolu/react";

export function MarketContentDownloadBlock() {
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
          Resource downloads
        </h2>
      </header>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <Image
          src="/images/pimolu-atmosphere.webp"
          alt="Pimolu workspace illustration"
          aspectRatio="4 / 3"
          containerStyle={{
            width: "100%",
          }}
        />
        <Card className="space-y-5 p-6">
          <h3 className="font-serif text-3xl">A useful starting point.</h3>
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
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
