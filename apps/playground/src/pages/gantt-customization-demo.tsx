"use client";

import { useState } from "react";
import {
  type PimoluGanttScale,
  type PimoluGanttTask,
  Gantt,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge
} from "@pimolu/react";

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
        classNames={{
          root: "custom-gantt-root",
          row: "custom-gantt-row"
        }}
      />
      <div className="pg-grid pg-grid--two">
        <Card>
          <CardHeader>
            <CardTitle>
              {selected?.name ?? "Select a task"}
            </CardTitle>
            <CardDescription>
              {
                selected
                  ? `${dateFormat.format(selected.start)} – ${dateFormat.format(selected.end)}`
                  : "Click a bar or a task name to inspect it."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pg-stack">
            {
              selected
                ? (
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
                      {
                        selected.dependencies?.length
                          ? selected.dependencies.join(", ")
                          : "none"
                      }
                    </p>
                  </>
                )
                : (
                  <p className="pg-muted">
                    No task selected yet.
                  </p>
                )
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Timeline controls</CardTitle>
            <CardDescription>
              Scale, zoom and navigation are controlled by the page.
            </CardDescription>
          </CardHeader>
          <CardContent className="pg-stack">
            <div className="pg-row pg-row--between">
              <span className="pg-muted">Scale</span>
              <Badge variant="neutral">
                {scale}
              </Badge>
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

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <RoadmapExample />
        </>)
      }
      <style>
        {
          `
.custom-gantt-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-gantt-row {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
