"use client";

import {
  Button,
  Badge,
  type PimoluTourStep,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Tour
} from "@pimolu/react";
import { useState, useRef } from "react";

const activity = [
  { name: "Ada Lovelace", action: "shipped the Q3 report" },
  { name: "Noah Dubois", action: "invited two teammates" },
  { name: "Maya Chen", action: "connected a data source" },
];

export function DemoExample() {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const activityRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Tour not started");
  const steps: PimoluTourStep[] = [
    {
      target: searchRef,
      title: "Find anything",
      description: "Search projects, documents and teammates from one field.",
      placement: "bottom",
    },
    {
      target: actionsRef,
      title: "Start something new",
      description: "Create a project or invite a teammate without leaving the page.",
      placement: "left",
    },
    {
      target: activityRef,
      title: "Stay in the loop",
      description: "Recent activity lands here, with a link to the full feed.",
      placement: "top",
    },
  ];
  function startTour() {
    setStep(0);
    setStatus("Tour running");
    setOpen(true);
  }
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div
              className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
              style={{
                flexWrap: "wrap"
              }}
            >
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <Button onClick={startTour}>Start tour</Button>
                <Badge variant="neutral">
                  {status}
                </Badge>
                {
                  open && (<Badge variant="primary">
                    step {step + 1} of {steps.length}
                  </Badge>)
                }
              </div>
              <span className="text-sm text-muted leading-relaxed">ArrowLeft / ArrowRight also move between steps.</span>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
                <CardDescription>
                  The highlighted regions are ordinary components; the tour only
                  reads their rectangles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 min-w-0">
                  <div ref={searchRef}>
                    <Input
                      label="Search the workspace"
                      placeholder="Projects, people, files…"
                    />
                  </div>
                  <div
                    ref={actionsRef}
                    className="flex flex-wrap items-center gap-3 min-w-0"
                  >
                    <Button size="sm">New project</Button>
                    <Button size="sm" appearance="outline">Invite teammate</Button>
                  </div>
                  <div
                    ref={activityRef}
                    className="grid gap-5 min-w-0"
                    style={{
                      padding: 14,
                      border: "1px solid var(--pimolu-border)",
                      borderRadius: "var(--pimolu-radius-md)",
                    }}
                  >
                    <strong className="mb-2 text-lg">Recent activity</strong>
                    {
                      activity.map((item) => (<div
                        key={item.name}
                        className="flex flex-wrap items-center gap-3 min-w-0 justify-between"
                      >
                        <span>{item.name}</span>
                        <span className="text-sm text-muted leading-relaxed">
                          {item.action}
                        </span>
                      </div>))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
            <Tour
              open={open}
              steps={steps}
              onOpenChange={(next) => {
                setOpen(next);
                if(!next) {
                  setStatus((current) => current === "Tour running"
                    ? "Tour closed"
                    : current);
                }
              }}
              onStepChange={setStep}
              onFinish={() => setStatus("Tour completed")}
              onSkip={() => setStatus("Tour skipped")}
              nextLabel="Continue"
              prevLabel="Go back"
              finishLabel="Got it"
              skipLabel="Maybe later"
              classNames={{
                root: "custom-tour-root",
                title: "custom-tour-title"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-tour-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tour-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
