"use client";

import { useState } from "react";
import { Badge, Button, Card, Textarea, Select } from "@pimolu/react";

export function CompactApplicationInviteUsersBlock() {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("Viewer");
  const [emails, setEmails] = useState("");
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Invite users
        </h2>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h3 className="font-serif text-3xl">
            A whole team.
            <br />
            One invitation list.
          </h3>
          <p className="text-sm text-muted">One email per line, up to ten people.</p>
          <Badge>Permissions are enforced on your server</Badge>
        </div>
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const list = [
                ...new Set(
                  emails
                    .split(/[\n,;]+/)
                    .map((x) => x.trim())
                    .filter(Boolean),
                ),
              ];
              if (
                !list.length ||
                list.length > 10 ||
                list.some((x) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x))
              ) {
                setMessage("Enter one to ten valid, unique email addresses.");
                return;
              }
              setMessage(
                list.length +
                  " " +
                  role +
                  " invitations prepared locally. No email sent.",
              );
            }}
          >
            <Textarea
              label="Team email addresses"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
              fullWidth
            />
            <Select
              label="Role for invitations"
              value={role}
              onValueChange={setRole}
              fullWidth
            >
              <option>Viewer</option>
              <option>Member</option>
            </Select>
            <Button type="submit" fullWidth>
              Prepare batch invitations
            </Button>
          </form>
        </Card>
      </div>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
