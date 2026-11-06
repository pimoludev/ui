"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Navbar,
  NavbarActions,
  SearchInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pimolu/react";

const pages = [
  {
    id: "overview",
    title: "Overview",
    description: "A clear picture of your workspace.",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Atlas website, Studio identity and Orbit launch.",
  },
  {
    id: "team",
    title: "Team",
    description: "A shared place for the people behind the work.",
  },
];

export function WorkspaceBarBlock() {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const matches = pages.filter((page) =>
    `${page.title} ${page.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-5xl space-y-6 p-5 sm:p-8">
      <Navbar appearance="transparent" bordered aria-label="Studio workspace">
        <span className="text-xl font-medium">pimolu / studio</span>
        <NavbarActions>
          <Badge variant="success">Workspace</Badge>
        </NavbarActions>
      </Navbar>
      <SearchInput
        label="Find a workspace page"
        value={query}
        onValueChange={setQuery}
        autoComplete="off"
      />
      {query && (
        <nav aria-label="Workspace search results" className="flex flex-wrap gap-3">
          {matches.map((page) => (
            <Button
              key={page.id}
              appearance="outline"
              onClick={() => {
                setActive(page.id);
                setQuery("");
                setMessage(`${page.title} opened.`);
              }}
            >
              {page.title}
            </Button>
          ))}
          {!matches.length && <p>No matching pages.</p>}
        </nav>
      )}
      <Tabs
        value={active}
        onValueChange={(value) => {
          setActive(value);
          setMessage("");
        }}
      >
        <TabsList aria-label="Workspace pages">
          {pages.map((page) => (
            <TabsTrigger key={page.id} value={page.id}>
              {page.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {pages.map((page) => (
          <TabsContent key={page.id} value={page.id}>
            <Card size="lg">
              <CardContent className="space-y-3">
                <h2 className="text-2xl font-medium">{page.title}</h2>
                <p className="text-muted">{page.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <p role="status" className="text-sm text-muted">
        {message ||
          "Navigation stays inside this preview. Replace local state with your application router."}
      </p>
    </section>
  );
}
