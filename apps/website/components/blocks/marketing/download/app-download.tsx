"use client";

import { useState } from "react";
import { Badge, Button, Card, Select } from "@pimolu/react";

export function AppDownloadBlock() {
  const [platform, setPlatform] = useState("macOS");
  const [message, setMessage] = useState("");
  function download() {
    const text =
      "Pimolu workspace demo\nPlatform: " +
      platform +
      ("\nThis is a setup checklist, not an application installer.\n1. " +
        "Install your chosen application.\n2. Sign in to your " +
        "workspace.\n3. Review notification preferences.\n");
    const url = URL.createObjectURL(
      new Blob([text.replaceAll("\\n", "\n")], {
        type: "text/plain",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "workspace-" + platform.toLowerCase() + "-checklist.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(platform + " demo checklist downloaded. No installer is provided.");
  }
  return (
    <section className="mx-auto grid max-w-5xl gap-10 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <header className="space-y-5">
        <Badge variant="primary">WORKSPACE / DESKTOP</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          Your next idea.
          <br />
          Always within reach.
        </h2>
        <p className="text-muted">
          A download page composition for your application. This preview downloads a
          text checklist, never a real installer.
        </p>
        <Select
          label="Your platform"
          value={platform}
          onValueChange={(v) => {
            setPlatform(v);
            setMessage("");
          }}
          fullWidth
        >
          {["macOS", "Windows", "Linux"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Button onClick={download}>Download demo checklist</Button>
        <p role="status" className="text-sm text-muted">
          {message || "Replace the sample file with your verified release URL."}
        </p>
      </header>
      <Card className="space-y-5 p-6">
        <div className="flex justify-between">
          <span>pimolu / workspace</span>
          <Badge>Preview</Badge>
        </div>
        <h3 className="text-2xl">A calmer place to work.</h3>
        {["Today's focus", "Your active projects", "The people behind the work"].map(
          (x) => (
            <Card key={x} className="p-4">
              {x}
            </Card>
          ),
        )}
      </Card>
    </section>
  );
}
