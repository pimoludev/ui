"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, Select } from "@pimolu/react";

export function InviteTeamBlock() {
  const [role, setRole] = useState("Member");
  const [invites, setInvites] = useState<
    {
      email: string;
      role: string;
    }[]
  >([]);
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <header className="space-y-4">
        <Badge variant="primary">WORKSPACE / PEOPLE</Badge>
        <h2 className="text-3xl sm:text-4xl font-medium">
          Better work,
          <br />
          together.
        </h2>
        <p className="text-muted">
          Prepare invitations locally. A real application must verify permissions and
          send invitations on the server.
        </p>
      </header>
      <Card className="space-y-6 p-6">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email") ?? "")
              .trim()
              .toLowerCase();
            if (invites.some((i) => i.email === email)) {
              setMessage("This email already has a prepared invitation.");
              return;
            }
            setInvites([
              ...invites,
              {
                email,
                role,
              },
            ]);
            setMessage("Invitation prepared for " + email + ". No email sent.");
            e.currentTarget.reset();
          }}
        >
          <Input label="Teammate email" name="email" type="email" required fullWidth />
          <Select
            label="Invitation role"
            value={role}
            onValueChange={setRole}
            fullWidth
          >
            <option>Member</option>
            <option>Viewer</option>
          </Select>
          <Button type="submit">Prepare invitation</Button>
        </form>
        <ul className="space-y-3">
          {invites.map((i) => (
            <li
              key={i.email}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
            >
              <span className="min-w-0 break-all">
                {i.email} <Badge>{i.role}</Badge>
              </span>
              <Button
                appearance="ghost"
                aria-label={"Remove invitation for " + i.email}
                onClick={() => {
                  setInvites(invites.filter((x) => x.email !== i.email));
                  setMessage("Invitation removed.");
                }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <p role="status" className="text-sm text-muted">
          {message || "No prepared invitations yet."}
        </p>
      </Card>
    </section>
  );
}
