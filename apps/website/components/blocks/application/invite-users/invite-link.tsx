"use client";

import { useState } from "react";
import { Avatar, Badge, Button, Card, Input, Select } from "@pimolu/react";

export function InviteLinkBlock() {
  const [role, setRole] = useState("Viewer");
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");
  const link = "https://example.invalid/invite/demo-" + role.toLowerCase();
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Demo link copied. This address cannot join a real workspace.");
    } catch {
      setMessage("Clipboard unavailable. Select and copy the displayed link manually.");
    }
  }
  return (
    <section className="mx-auto grid max-w-4xl gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <header className="space-y-5">
        <Badge>TEAM / SHARE ACCESS</Badge>
        <h2 className="font-serif text-3xl sm:text-4xl">
          Make a little
          <br />
          room for someone.
        </h2>
        <div className="flex gap-3">
          {["Maya Chen", "Noah Dubois", "Robin Lee"].map((name) => (
            <Avatar name={name} key={name} />
          ))}
        </div>
      </header>
      <Card className="space-y-5 p-6">
        <h3 className="text-xl">Invite by link</h3>
        <Select
          label="Link permission"
          value={role}
          onValueChange={(v) => {
            setRole(v);
            setActive(false);
            setMessage("Permission changed. Prepare a new demo link.");
          }}
          fullWidth
        >
          <option>Viewer</option>
          <option>Member</option>
        </Select>
        {active ? (
          <>
            <Input label="Demo invitation URL" value={link} readOnly fullWidth />
            <div className="flex flex-wrap gap-3">
              <Button onClick={copy}>Copy demo link</Button>
              <Button
                appearance="outline"
                onClick={() => {
                  setActive(false);
                  setMessage("Demo link revoked locally.");
                }}
              >
                Revoke link
              </Button>
            </div>
          </>
        ) : (
          <Button
            onClick={() => {
              setActive(true);
              setMessage("Demo link ready. No server token was created.");
            }}
          >
            Prepare demo link
          </Button>
        )}
        <p role="status" className="text-sm text-muted">
          {message || "Choose the access level before creating a link."}
        </p>
      </Card>
    </section>
  );
}
