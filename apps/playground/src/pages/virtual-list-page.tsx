import { useState } from "react";

import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  VirtualList,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const actions = [
  "updated the primary token",
  "published a theme preset",
  "reviewed a component",
  "exported the release notes",
  "opened a pull request",
  "resolved an accessibility issue",
];

const actors = [
  "Amélie Bernard",
  "Lucas Moreau",
  "Sofia Rossi",
  "Jean Dupont",
  "Marie Laurent",
];

const auditRows = Array.from(
  { length: 10_000 },
  (_, index) => ({
    id: `event-${index}`,
    actor: actors[index % actors.length],
    action: actions[index % actions.length],
    minute: 59 - (index % 60),
    status:
      index % 7 === 0
        ? ("warning" as const)
        : ("success" as const),
  })
);

const firstNames = [
  "Amélie",
  "Lucas",
  "Sofia",
  "Jean",
  "Marie",
  "Nicolas",
  "Sophie",
];

const lastNames = [
  "Bernard",
  "Moreau",
  "Rossi",
  "Dupont",
  "Laurent",
  "Martin",
];

const members = Array.from(
  { length: 2000 },
  (_, index) => ({
    id: `member-${index}`,
    name: `${
      firstNames[index % firstNames.length]
    } ${lastNames[index % lastNames.length]}`,
    team: index % 3 === 0 ? "Design" : "Engineering",
  })
);

export function VirtualListPage() {
  const [query, setQuery] = useState("");

  const filteredMembers = query.trim()
    ? members.filter((member) =>
        member.name
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : members;

  return (
    <>
      <PageHeader
        title="VirtualList"
        hint="A fixed-height virtualized list: only the rows near the viewport are mounted, so 10,000 items cost the same as a dozen. The scroll container is focusable and keeps native wheel, touch and keyboard scrolling."
      />

      <Section
        title="Audit log"
        hint="10,000 events at a fixed 56 px row height with three rows of overscan. The spacer keeps the real scrollbar length."
      >
        <Card>
          <CardHeader>
            <div className="pg-row pg-row--between">
              <div>
                <CardTitle>Workspace activity</CardTitle>
                <CardDescription>
                  10,000 events · 56 px rows · overscan 3
                </CardDescription>
              </div>

              <Badge variant="success">Live</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <VirtualList
              items={auditRows}
              itemHeight={56}
              height={360}
              overscan={3}
              aria-label="Workspace activity"
              getKey={(event) => event.id}
              renderItem={(event, index) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    height: "100%",
                    padding: "0 14px",
                    borderBottom:
                      "1px solid var(--pimolu-border)",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>{event.actor}</strong>{" "}
                      {event.action}
                    </p>

                    <p className="pg-meta">
                      #{index + 1} · 10:{String(
                        event.minute
                      ).padStart(2, "0")}
                    </p>
                  </div>

                  <Badge variant={event.status}>
                    {event.status}
                  </Badge>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Item count without data"
        hint="When the rows are generated on demand, pass itemCount and a renderer that receives the index."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>50,000 log lines</CardTitle>
              <CardDescription>
                itemCount + renderItem(index)
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VirtualList
                itemCount={50_000}
                itemHeight={32}
                height={240}
                aria-label="Generated log lines"
                renderItem={(index) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: "100%",
                      padding: "0 12px",
                      borderBottom:
                        "1px solid var(--pimolu-border)",
                      fontFamily:
                        "ui-monospace, monospace",
                      fontSize: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    <span className="pg-meta">
                      {String(index + 1).padStart(5, "0")}
                    </span>

                    <span>
                      GET /api/v1/components/{index} · 200
                    </span>
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact rows</CardTitle>
              <CardDescription>
                24 px rows with eight rows of overscan
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VirtualList
                items={auditRows}
                itemHeight={24}
                height={240}
                overscan={8}
                aria-label="Compact activity"
                renderItem={(event) => (
                  <div
                    className="pg-meta"
                    style={{
                      height: "100%",
                      padding: "0 12px",
                      borderBottom:
                        "1px solid var(--pimolu-border)",
                      lineHeight: "24px",
                      boxSizing: "border-box",
                    }}
                  >
                    {event.actor} · {event.action}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Searchable directory"
        hint="Filtering replaces the data source; the list keeps its own scroll state and only re-renders the visible window."
      >
        <Card>
          <CardHeader>
            <CardTitle>Team directory</CardTitle>
            <CardDescription>
              2,000 people · search re-renders the window, not
              the list
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <Input
                label="Search people"
                placeholder="Type a name"
                value={query}
                clearable
                onValueChange={setQuery}
                helperText={`${filteredMembers.length} matching member(s)`}
              />

              {filteredMembers.length > 0 ? (
                <VirtualList
                  items={filteredMembers}
                  itemHeight={52}
                  height={300}
                  overscan={2}
                  aria-label="Team directory"
                  getKey={(member) => member.id}
                  renderItem={(member) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        height: "100%",
                        padding: "0 12px",
                        borderBottom:
                          "1px solid var(--pimolu-border)",
                        boxSizing: "border-box",
                      }}
                    >
                      <Avatar
                        name={member.name}
                        size="sm"
                      />

                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {member.name}
                        </p>
                        <p className="pg-meta">
                          {member.team}
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {member.team}
                      </Badge>
                    </div>
                  )}
                />
              ) : (
                <p className="pg-muted">
                  No member matches “{query}”.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
