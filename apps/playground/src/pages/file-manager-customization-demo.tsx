"use client";

import { useState } from "react";
import {
  type PimoluFileEntry,
  type PimoluFileManagerView,
  FileManager,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge
} from "@pimolu/react";

const initialEntries: PimoluFileEntry[] = [
  {
    id: "brand",
    name: "Brand",
    type: "folder",
    modified: new Date(2026, 9, 14),
    children: [
      {
        id: "logo-suite",
        name: "logo-suite.svg",
        type: "file",
        size: 84_000,
        mime: "image/svg+xml",
        modified: new Date(2026, 9, 12),
      },
      {
        id: "guidelines",
        name: "brand-guidelines.pdf",
        type: "file",
        size: 4_800_000,
        mime: "application/pdf",
        modified: new Date(2026, 9, 14),
      },
      {
        id: "tokens",
        name: "color-tokens.json",
        type: "file",
        size: 18_400,
        mime: "application/json",
        modified: new Date(2026, 9, 9),
      },
    ],
  },
  {
    id: "deliverables",
    name: "Deliverables",
    type: "folder",
    modified: new Date(2026, 8, 30),
    children: [
      {
        id: "q4-report",
        name: "Q4-research.pdf",
        type: "file",
        size: 6_200_000,
        mime: "application/pdf",
        modified: new Date(2026, 9, 3),
      },
      {
        id: "budget",
        name: "budget.xlsx",
        type: "file",
        size: 312_000,
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        modified: new Date(2026, 9, 8),
      },
      {
        id: "demo",
        name: "product-demo.mp4",
        type: "file",
        size: 48_000_000,
        mime: "video/mp4",
        modified: new Date(2026, 9, 16),
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    type: "folder",
    modified: new Date(2026, 9, 18),
    children: [
      {
        id: "architecture",
        name: "architecture.md",
        type: "file",
        size: 12_600,
        mime: "text/markdown",
        modified: new Date(2026, 9, 18),
      },
      {
        id: "sdk",
        name: "sdk-release.zip",
        type: "file",
        size: 2_100_000,
        mime: "application/zip",
        modified: new Date(2026, 9, 17),
      },
    ],
  },
  {
    id: "readme",
    name: "README.md",
    type: "file",
    size: 2_400,
    mime: "text/markdown",
    modified: new Date(2026, 9, 19),
  },
  {
    id: "roadmap",
    name: "roadmap-2027.pdf",
    type: "file",
    size: 980_000,
    mime: "application/pdf",
    modified: new Date(2026, 9, 20),
  },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function removeEntries(
  entries: PimoluFileEntry[],
  ids: Set<string>
): PimoluFileEntry[] {
  return entries
    .filter((entry) => !ids.has(entry.id))
    .map((entry) =>
      entry.children
        ? {
          ...entry,
          children: removeEntries(
            [...entry.children],
            ids
          ),
        }
        : entry
    );
}

function ProjectAssetsExample() {
  const [entries, setEntries] =
    useState<PimoluFileEntry[]>(initialEntries);
  const [view, setView] =
    useState<PimoluFileManagerView>("list");
  const [selected, setSelected] = useState<
    PimoluFileEntry[]
  >([]);
  const [opened, setOpened] =
    useState<PimoluFileEntry | null>(null);

  return (
    <div className="pg-stack">
      <FileManager
        aria-label="Project assets"
        entries={entries}
        view={view}
        onViewChange={setView}
        onSelect={setSelected}
        onOpen={setOpened}
        onDelete={(deleted) => {
          const ids = new Set(
            deleted.map((entry) => entry.id)
          );

          setEntries((current) =>
            removeEntries(current, ids)
          );
          setSelected((current) =>
            current.filter(
              (entry) => !ids.has(entry.id)
            )
          );
        }}
        classNames={{
          root: "custom-file-manager-root",
          item: "custom-file-manager-item"
        }}
      />
      <div className="pg-grid pg-grid--two">
        <Card>
          <CardHeader>
            <CardTitle>Selection</CardTitle>
            <CardDescription>
              Ctrl/Cmd click adds entries; Shift click selects a range.
            </CardDescription>
          </CardHeader>
          <CardContent className="pg-stack">
            <div className="pg-row">
              <Badge variant="neutral">
                {view} view
              </Badge>
              <Badge variant="primary">
                {selected.length} selected
              </Badge>
            </div>
            {
              selected.length > 0
                ? (
                  <ul className="pg-stack">
                    {
                      selected.map((entry) => (
                        <li key={entry.id}>
                          {entry.name}
                        </li>
                      ))
                    }
                  </ul>
                )
                : (
                  <p className="pg-muted">
                    Nothing selected yet.
                  </p>
                )
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last opened</CardTitle>
            <CardDescription>
              Select an entry and use Open, or double click it. Folders
              navigate; files are handed to the host application.
            </CardDescription>
          </CardHeader>
          <CardContent className="pg-stack">
            {
              opened
                ? (
                  <>
                    <p>{opened.name}</p>
                    <div className="pg-row">
                      <Badge variant="neutral">
                        {opened.type}
                      </Badge>
                      <Badge variant="neutral">
                        {
                          opened.modified
                            ? dateFormat.format(opened.modified)
                            : "No date"
                        }
                      </Badge>
                    </div>
                  </>
                )
                : (
                  <p className="pg-muted">
                    No entry opened yet.
                  </p>
                )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <ProjectAssetsExample />
        </>)
      }
      <style>
        {
          `
.custom-file-manager-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-file-manager-item {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
