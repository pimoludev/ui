"use client";

import { useState } from "react";
import { Avatar, Badge, Button, Card, Select } from "@pimolu/react";

export function CommunityCtaBlock() {
  const [interest, setInterest] = useState("Design");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mx-auto grid max-w-5xl gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
      <header className="space-y-5">
        <Badge>THE MAKERS CIRCLE</Badge>
        <h2 className="font-serif text-3xl sm:text-5xl">
          Good ideas
          <br />
          like company.
        </h2>
        <p className="text-muted">
          A community for people who design, build and share what they learn.
        </p>
        <div className="flex gap-3">
          {["Maya Chen", "Robin Lee", "Ada Martin"].map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </div>
      </header>
      <Card className="space-y-5 p-8">
        <h3 className="text-2xl">What brings you here?</h3>
        <Select
          label="Your interest"
          value={interest}
          onValueChange={(v) => {
            setInterest(v);
            setJoined(false);
          }}
          fullWidth
        >
          {["Design", "Engineering", "Writing"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Button fullWidth onClick={() => setJoined(true)}>
          Find my circle
        </Button>
        <p role="status" className="text-sm text-muted">
          {joined
            ? "Your " +
              interest.toLowerCase() +
              " circle is selected. Connect your membership service."
            : "Choose an interest to personalize your invitation."}
        </p>
      </Card>
    </section>
  );
}
