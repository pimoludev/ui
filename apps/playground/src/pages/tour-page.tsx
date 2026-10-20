import { useRef, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Tour,
  type PimoluTourStep,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const activity = [
  { name: "Ada Lovelace", action: "shipped the Q3 report" },
  { name: "Noah Dubois", action: "invited two teammates" },
  { name: "Maya Chen", action: "connected a data source" },
];

export function TourPage() {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const activityRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("Tour not started");

  const [missingOpen, setMissingOpen] = useState(false);

  const [stringOpen, setStringOpen] = useState(false);

  const steps: PimoluTourStep[] = [
    {
      target: searchRef,
      title: "Find anything",
      description:
        "Search projects, documents and teammates from one field.",
      placement: "bottom",
    },
    {
      target: actionsRef,
      title: "Start something new",
      description:
        "Create a project or invite a teammate without leaving the page.",
      placement: "left",
    },
    {
      target: activityRef,
      title: "Stay in the loop",
      description:
        "Recent activity lands here, with a link to the full feed.",
      placement: "top",
    },
  ];

  function startTour() {
    setStep(0);
    setStatus("Tour running");
    setOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Tour"
        hint="A multi-step onboarding overlay. Each step highlights a DOM target — a selector, a ref or a resolver — with a spotlight cutout and a portalled card. The card takes focus, traps Tab, supports Escape and the arrow keys, scrolls the target into view and stays usable when a target is missing. Styles come from @pimolu/web-styles/tour.css."
      />

      <Section
        title="Guided product tour"
        hint="Three steps target elements in the demo below. The card is a modal dialog named by each step title; the overlay blocks the page while the spotlight keeps the target visible."
      >
        <div className="pg-stack">
          <div
            className="pg-row pg-row--between"
            style={{ flexWrap: "wrap" }}
          >
            <div className="pg-row">
              <Button onClick={startTour}>
                Start tour
              </Button>

              <Badge variant="neutral">{status}</Badge>

              {open && (
                <Badge variant="primary">
                  step {step + 1} of {steps.length}
                </Badge>
              )}
            </div>

            <span className="pg-meta">
              ArrowLeft / ArrowRight also move between steps.
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                The highlighted regions are ordinary components;
                the tour only reads their rectangles.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div ref={searchRef}>
                  <Input
                    label="Search the workspace"
                    placeholder="Projects, people, files…"
                  />
                </div>

                <div
                  ref={actionsRef}
                  className="pg-row"
                >
                  <Button size="sm">New project</Button>

                  <Button size="sm" appearance="outline">
                    Invite teammate
                  </Button>
                </div>

                <div
                  ref={activityRef}
                  className="pg-stack"
                  style={{
                    padding: 14,
                    border:
                      "1px solid var(--pimolu-border)",
                    borderRadius:
                      "var(--pimolu-radius-md)",
                  }}
                >
                  <strong className="pg-section__title">
                    Recent activity
                  </strong>

                  {activity.map((item) => (
                    <div
                      key={item.name}
                      className="pg-row pg-row--between"
                    >
                      <span>{item.name}</span>
                      <span className="pg-meta">
                        {item.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tour
            open={open}
            steps={steps}
            onOpenChange={(next) => {
              setOpen(next);

              if (!next) {
                setStatus((current) =>
                  current === "Tour running"
                    ? "Tour closed"
                    : current
                );
              }
            }}
            onStepChange={setStep}
            onFinish={() => setStatus("Tour completed")}
            onSkip={() => setStatus("Tour skipped")}
            nextLabel="Continue"
            prevLabel="Go back"
            finishLabel="Got it"
            skipLabel="Maybe later"
          />
        </div>
      </Section>

      <Section
        title="String selector and custom labels"
        hint="target=&quot;#landing-readiness&quot; resolves after mount. showSkip turns off the skip control and finishLabel names the last action."
      >
        <div className="pg-stack">
          <Card>
            <CardHeader>
              <CardTitle>Launch readiness</CardTitle>
              <CardDescription>
                This card is targeted by a CSS selector.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div
                id="landing-readiness"
                className="pg-row pg-row--between"
              >
                <span>Documentation review</span>
                <Badge variant="success">Complete</Badge>
              </div>
            </CardContent>
          </Card>

          <div>
            <Button
              appearance="outline"
              onClick={() => {
                setStringOpen(true);
                setStatus("Readiness tour running");
              }}
            >
              Tour this card
            </Button>
          </div>

          <Tour
            open={stringOpen}
            steps={[
              {
                target: "#landing-readiness",
                title: "Ready to launch",
                description:
                  "A string selector is resolved after mount, so the card can be rendered anywhere.",
                placement: "bottom",
              },
            ]}
            onOpenChange={(next) => {
              setStringOpen(next);

              if (!next) {
                setStatus((current) =>
                  current === "Readiness tour running"
                    ? "Readiness tour closed"
                    : current
                );
              }
            }}
            onFinish={() => setStatus("Readiness tour done")}
            showSkip={false}
            finishLabel="Close"
          />
        </div>
      </Section>

      <Section
        title="Missing target"
        hint="A target that does not exist is not an error: the card is centred, the cutout is omitted and the overlay still blocks the page. This is also what renders during server-side rendering."
      >
        <div className="pg-row">
          <Button
            appearance="outline"
            onClick={() => {
              setMissingOpen(true);
              setStatus("Missing-target tour running");
            }}
          >
            Open tour without a target
          </Button>

          <Button
            appearance="ghost"
            onClick={() => {
              setOpen(false);
              setMissingOpen(false);
              setStringOpen(false);
              setStatus("Tour not started");
              setStep(0);
            }}
          >
            Reset demo
          </Button>
        </div>

        <Tour
          open={missingOpen}
          steps={[
            {
              target: "#a-target-that-does-not-exist",
              title: "Nothing to highlight",
              description:
                "The tour still explains the step and closes cleanly.",
            },
          ]}
          onOpenChange={(next) => {
            setMissingOpen(next);

            if (!next) {
              setStatus((current) =>
                current === "Missing-target tour running"
                  ? "Missing-target tour closed"
                  : current
              );
            }
          }}
          onFinish={() => setStatus("Missing-target tour done")}
          nextLabel="Close"
          finishLabel="Close"
          skipLabel="Skip"
        />

        <p className="pg-meta">
          Current status: {status}
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Target shapes</CardTitle>
            <CardDescription>
              Use a selector for content rendered elsewhere, a
              ref for local elements, or a function for dynamic
              lookups.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <code>
                target: &quot;#landing-readiness&quot;
              </code>
              <code>target: searchRef</code>
              <code>
                target: () =&gt; document.querySelector(&quot;[data-tour]&quot;)
              </code>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
