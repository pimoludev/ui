import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingOverlay,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ControlledLoadingDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button
          size="sm"
          appearance="outline"
          onClick={() => setLoading((value) => !value)}
        >
          {loading ? "Stop loading" : "Start loading"}
        </Button>

        <span className="pg-meta">
          aria-busy={String(loading)} · the covered button cannot be
          focused
        </span>
      </div>

      <LoadingOverlay
        loading={loading}
        label="Loading the dashboard"
        description="Metrics, invoices and activity arrive together."
      >
        <Card>
          <CardHeader>
            <CardTitle>Workspace overview</CardTitle>
            <CardDescription>
              The content underneath stays in the tree, inert and
              hidden from assistive technology.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-row">
              <Button size="sm">Open a report</Button>

              <span className="pg-meta">
                This button is behind the overlay.
              </span>
            </div>
          </CardContent>
        </Card>
      </LoadingOverlay>
    </div>
  );
}

function BlurDemo() {
  return (
    <LoadingOverlay
      loading
      blur
      label="Refreshing metrics"
      description="The blur modifier applies a filter to the covered content."
    >
      <Card>
        <CardHeader>
          <CardTitle>Traffic</CardTitle>
          <CardDescription>
            Last 24 hours, all environments.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="pg-metrics">
            <div className="pg-metric">
              <span className="pg-meta">Requests</span>
              <span className="pg-metric__value">184,204</span>
            </div>

            <div className="pg-metric">
              <span className="pg-meta">Error rate</span>
              <span className="pg-metric__value">0.12%</span>
            </div>

            <div className="pg-metric">
              <span className="pg-meta">P95</span>
              <span className="pg-metric__value">218 ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </LoadingOverlay>
  );
}

function FullscreenDemo() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setTimeout(
      () => setLoading(false),
      2200
    );

    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Button
          size="sm"
          onClick={() => setLoading(true)}
        >
          Show the fullscreen overlay
        </Button>

        <span className="pg-meta">
          It covers the viewport and closes itself after 2.2 seconds.
        </span>
      </div>

      <LoadingOverlay
        loading={loading}
        fullscreen
        label="Publishing changes"
        description="The production bundle is being uploaded."
      />
    </div>
  );
}

export function LoadingOverlayPage() {
  return (
    <>
      <PageHeader
        title="LoadingOverlay"
        hint="Covers a region or the whole viewport while work is in progress. The wrapper exposes aria-busy, the overlay is a polite status, and the covered content becomes inert and aria-hidden. The spinner is decorative to avoid a second live region. Styles come from @pimolu/web-styles/loading-overlay.css."
      />

      <Section
        title="Controlled"
        hint="loading defaults to true; when it becomes false the overlay disappears and the content is focusable again."
      >
        <ControlledLoadingDemo />
      </Section>

      <Section
        title="Blur"
        hint="blur filters the covered content and blurs the backdrop behind the message."
      >
        <BlurDemo />
      </Section>

      <Section
        title="Fullscreen"
        hint="fullscreen uses fixed positioning and covers the viewport until loading becomes false."
      >
        <FullscreenDemo />
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Saving settings</CardTitle>
              <CardDescription>
                A form is covered while the server persists it; the
                controls cannot be focused behind the overlay.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoadingOverlay
                label="Saving changes"
                description="Keep this tab open until the save completes."
              >
                <div className="pg-stack">
                  <div className="pg-stack">
                    <Label htmlFor="loading-overlay-name">
                      Workspace name
                    </Label>

                    <Input
                      id="loading-overlay-name"
                      defaultValue="Project Atlas"
                    />
                  </div>

                  <div className="pg-stack">
                    <Label htmlFor="loading-overlay-slug">
                      Slug
                    </Label>

                    <Input
                      id="loading-overlay-slug"
                      defaultValue="project-atlas"
                    />
                  </div>

                  <Button size="sm">Save changes</Button>
                </div>
              </LoadingOverlay>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preparing an export</CardTitle>
              <CardDescription>
                A small region with a custom description, without
                any covered content.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoadingOverlay
                label="Building the CSV"
                description="Rows are streamed from the archive."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>
                The exact same overlay closes over the payment
                summary.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoadingOverlay label="Processing payment">
                <div className="pg-stack">
                  <div className="pg-row pg-row--between">
                    <span className="pg-meta">Team plan · yearly</span>
                    <span className="pg-price">€240.00</span>
                  </div>

                  <div className="pg-row pg-row--between">
                    <span className="pg-meta">VAT (20%)</span>
                    <span className="pg-meta">€48.00</span>
                  </div>

                  <div className="pg-row pg-row--between">
                    <span>Total</span>
                    <span className="pg-price">€288.00</span>
                  </div>
                </div>
              </LoadingOverlay>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
