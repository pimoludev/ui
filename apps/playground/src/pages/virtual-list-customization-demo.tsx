"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  CardContent,
  VirtualList
} from "@pimolu/react";

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

export function CustomizationExample() {

  return (
    <>
      {
        (<>
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
                        #{index + 1} · 10:{
                          String(
                            event.minute
                          ).padStart(
                            2,
                            "0"
                          )
                        }
                      </p>
                    </div>
                    <Badge variant={event.status}>
                      {event.status}
                    </Badge>
                  </div>
                )}
                classNames={{
                  root: "custom-virtual-list-root",
                  item: "custom-virtual-list-item"
                }}
              />
            </CardContent>
          </Card>
        </>)
      }
      <style>
        {
          `
.custom-virtual-list-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-virtual-list-item {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
