import { CustomizationExample } from "./gantt-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Gantt,
  type PimoluGanttScale,
  type PimoluGanttTask,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DEMO DATA
========================================= */

const roadmap: PimoluGanttTask[] = [
  {
    id: "interviews",
    name: "Customer interviews",
    start: new Date(2026, 8, 28),
    end: new Date(2026, 9, 2),
    progress: 100,
    group: "Discovery",
    color: "#0ea5e9",
  },
  {
    id: "audit",
    name: "Interface audit",
    start: new Date(2026, 9, 1),
    end: new Date(2026, 9, 7),
    progress: 100,
    dependencies: ["interviews"],
    group: "Discovery",
    color: "#0ea5e9",
  },
  {
    id: "flows",
    name: "Core flows",
    start: new Date(2026, 9, 6),
    end: new Date(2026, 9, 16),
    progress: 72,
    dependencies: ["audit"],
    group: "Design",
    color: "#7c3aed",
  },
  {
    id: "tokens",
    name: "Token refresh",
    start: new Date(2026, 9, 12),
    end: new Date(2026, 9, 23),
    progress: 48,
    dependencies: ["audit"],
    group: "Design",
    color: "#7c3aed",
  },
  {
    id: "scheduler",
    name: "Scheduler + Gantt",
    start: new Date(2026, 9, 19),
    end: new Date(2026, 10, 1),
    progress: 24,
    dependencies: ["flows"],
    group: "Build",
    color: "#16a34a",
  },
  {
    id: "file-manager",
    name: "File manager",
    start: new Date(2026, 9, 22),
    end: new Date(2026, 10, 4),
    progress: 10,
    dependencies: ["tokens"],
    group: "Build",
    color: "#16a34a",
  },
  {
    id: "docs",
    name: "Docs and examples",
    start: new Date(2026, 9, 26),
    end: new Date(2026, 10, 8),
    progress: 0,
    dependencies: ["scheduler", "file-manager"],
    group: "Launch",
    color: "#d97706",
  },
  {
    id: "release",
    name: "Public release",
    start: new Date(2026, 10, 9),
    end: new Date(2026, 10, 13),
    progress: 0,
    dependencies: ["docs"],
    group: "Launch",
    color: "#dc2626",
  },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/* =========================================
   EXAMPLES
========================================= */

function RoadmapExample() {
  const [start, setStart] = useState(
    new Date(2026, 8, 28)
  );
  const [scale, setScale] =
    useState<PimoluGanttScale>("day");
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] =
    useState<PimoluGanttTask | null>(roadmap[2]);

  return (
    <div className="pg-stack">
      <Gantt
        aria-label="Design system roadmap"
        tasks={roadmap}
        start={start}
        onStartChange={setStart}
        scale={scale}
        onScaleChange={setScale}
        zoom={zoom}
        onZoomChange={setZoom}
        onTaskClick={setSelected}
        maxHeight={420}
      />

      <div className="pg-grid pg-grid--two">
        <Card>
          <CardHeader>
            <CardTitle>
              {selected?.name ?? "Select a task"}
            </CardTitle>
            <CardDescription>
              {selected
                ? `${dateFormat.format(selected.start)} – ${dateFormat.format(selected.end)}`
                : "Click a bar or a task name to inspect it."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pg-stack">
            {selected ? (
              <>
                <div className="pg-row">
                  <Badge variant="primary">
                    {selected.group ?? "Ungrouped"}
                  </Badge>
                  <Badge variant="neutral">
                    {selected.progress ?? 0}% complete
                  </Badge>
                </div>

                <p className="pg-muted">
                  Dependencies:{" "}
                  {selected.dependencies?.length
                    ? selected.dependencies.join(", ")
                    : "none"}
                </p>
              </>
            ) : (
              <p className="pg-muted">
                No task selected yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline controls</CardTitle>
            <CardDescription>
              Scale, zoom and navigation are controlled
              by the page.
            </CardDescription>
          </CardHeader>

          <CardContent className="pg-stack">
            <div className="pg-row pg-row--between">
              <span className="pg-muted">Scale</span>
              <Badge variant="neutral">{scale}</Badge>
            </div>

            <div className="pg-row pg-row--between">
              <span className="pg-muted">Zoom</span>
              <Badge variant="neutral">
                {Math.round(zoom * 100)}%
              </Badge>
            </div>

            <div className="pg-row pg-row--between">
              <span className="pg-muted">
                Visible start
              </span>
              <span>{dateFormat.format(start)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MonthScaleExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Month scale without dependencies</CardTitle>
        <CardDescription>
          An explicit range, month columns and no SVG
          links for a compact executive view.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Gantt
          aria-label="Quarter overview"
          tasks={roadmap}
          start={new Date(2026, 8, 1)}
          end={new Date(2026, 10, 30)}
          defaultScale="month"
          showDependencies={false}
          defaultZoom={1.25}
        />
      </CardContent>
    </Card>
  );
}

/* =========================================
   PAGE
========================================= */

export function GanttPage() {
  return (
    <>
      <PageHeader
        title="Gantt"
        hint="Task timeline with groups, progress, dependencies, a today marker and day, week or month scales."
      />

      <Section
        title="Product roadmap"
        hint="Use the arrow buttons to navigate and minus / plus to zoom from 50% to 200% in every scale. Bars expose their dates and completion to assistive technology."
      >
        <RoadmapExample />
      </Section>

      <Section
        title="Executive overview"
        hint="A month-scale variant with an explicit range and dependency links turned off."
      >
        <MonthScaleExample />
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
