"use client";

import { useState } from "react";
import { Badge, Card, Avatar, Select } from "@pimolu/react";

export function CompactApplicationLeaderboardBlock() {
  const [message] = useState("");
  const [period, setPeriod] = useState("This week");
  const [scope, setScope] = useState("Everyone");
  const members = [
    {
      name: "Maya Chen",
      team: "Design",
      week: 420,
      month: 1800,
    },
    {
      name: "Noah Dubois",
      team: "Engineering",
      week: 390,
      month: 2100,
    },
    {
      name: "Alex Martin",
      team: "Design",
      week: 360,
      month: 1600,
    },
    {
      name: "Robin Lee",
      team: "Engineering",
      week: 310,
      month: 1400,
    },
  ];
  const ranked = members
    .filter((m) => scope === "Everyone" || m.team === scope)
    .sort((a, b) => (period === "This week" ? b.week - a.week : b.month - a.month));
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Leaderboard
        </h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Leaderboard period"
          value={period}
          onValueChange={setPeriod}
          fullWidth
        >
          <option>This week</option>
          <option>This month</option>
        </Select>
        <Select
          label="Leaderboard team"
          value={scope}
          onValueChange={setScope}
          fullWidth
        >
          <option>Everyone</option>
          <option>Design</option>
          <option>Engineering</option>
        </Select>
      </div>
      <Card className="divide-y divide-border p-5">
        {ranked.map((m, i) => (
          <div
            key={m.name}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <Badge>{"#" + (i + 1)}</Badge>
            <div className="flex items-center gap-3">
              <Avatar name={m.name} />
              <div>
                <h3>{m.name}</h3>
                <p className="text-sm text-muted">{m.team}</p>
              </div>
            </div>
            <span className="text-xl">{period === "This week" ? m.week : m.month}</span>
          </div>
        ))}
      </Card>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
