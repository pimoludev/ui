"use client";

import { useState } from "react";
import { Badge, Card, Avatar, Select } from "@pimolu/react";

export function StudioApplicationLeaderboardBlock() {
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
      <div className="grid gap-5 md:grid-cols-3">
        {ranked.slice(0, 3).map((m, i) => (
          <Card key={m.name} className="space-y-5 p-6">
            <Badge variant={i === 0 ? "primary" : "neutral"}>{"#" + (i + 1)}</Badge>
            <Avatar name={m.name} />
            <h3 className="text-xl">{m.name}</h3>
            <p className="text-3xl">{period === "This week" ? m.week : m.month}</p>
            <p className="text-sm text-muted">Points</p>
          </Card>
        ))}
      </div>

      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
