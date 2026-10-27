import { CustomizationExample } from "./resizable-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Resizable,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const files = [
  "tokens.json",
  "themes.json",
  "button.css",
  "carousel.css",
  "resizable.css",
  "virtual-list.css",
];

const activity = [
  "Amélie updated the accent palette",
  "Lucas split the button variants",
  "Sofia reviewed the carousel keyboard flow",
  "Jean exported the release notes",
];

const splitFrame = {
  border: "1px solid var(--pimolu-border)",
  borderRadius: "var(--pimolu-radius-lg)",
  overflow: "hidden",
  background: "var(--pimolu-background)",
} as const;

export function ResizablePage() {
  const [sizes, setSizes] = useState<[number, number]>([
    40, 60,
  ]);

  return (
    <>
      <PageHeader
        title="Resizable"
        hint="Two panes split by a draggable separator. Drag with a pointer, or focus the separator and use the arrow keys, Home and End; double-click restores the default split. Sizes are percentages, with independent minimums and no extra dependency."
      />

      <Section
        title="Horizontal split"
        hint="A file list next to a read-only preview. The separator keeps pointer capture during a drag and exposes aria-valuenow."
      >
        <Resizable
          aria-label="Editor layout"
          paneClassName="pg-panel"
          style={{ ...splitFrame, height: 320 }}
          defaultSizes={[32, 68]}
        >
          <div className="pg-stack">
            <span className="pg-meta">FILES</span>

            {files.map((file, index) => (
              <div
                key={file}
                className="pg-row pg-row--between"
              >
                <span>{file}</span>
                <span className="pg-meta">
                  {index === 1 ? "edited" : ""}
                </span>
              </div>
            ))}
          </div>

          <pre
            style={{
              margin: 0,
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            {`{
  "primary": "{color.indigo.600}",
  "surface": "{color.neutral.50}",
  "surface-foreground": "{color.neutral.900}",
  "focus-ring": "{color.indigo.500}"
}

/* The preview grows with its pane;
   the separator never changes the theme. */`}
          </pre>
        </Resizable>
      </Section>

      <Section
        title="Vertical split"
        hint="The same component stacked: the separator becomes horizontal and the arrow keys follow the axis."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Resizable
            aria-label="Activity and preview"
            orientation="vertical"
            paneClassName="pg-panel"
            style={{ ...splitFrame, height: 360 }}
            defaultSizes={[55, 45]}
          >
            <div className="pg-stack">
              <CardTitle>Activity</CardTitle>

              {activity.map((entry) => (
                <p key={entry} className="pg-meta">
                  {entry}
                </p>
              ))}
            </div>

            <div className="pg-stack">
              <CardTitle>Preview</CardTitle>
              <p className="pg-muted">
                Vertical panes are useful for logs, diff views
                and editors with a console.
              </p>
            </div>
          </Resizable>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard</CardTitle>
              <CardDescription>
                Focus the separator, then use the listed keys.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <div className="pg-row pg-row--between">
                  <span>Horizontal</span>
                  <span className="pg-meta">
                    ← / → plus Home / End
                  </span>
                </div>

                <div className="pg-row pg-row--between">
                  <span>Vertical</span>
                  <span className="pg-meta">
                    ↑ / ↓ plus Home / End
                  </span>
                </div>

                <div className="pg-row pg-row--between">
                  <span>Coarse step</span>
                  <span className="pg-meta">
                    Hold Shift
                  </span>
                </div>

                <div className="pg-row pg-row--between">
                  <span>Reset</span>
                  <span className="pg-meta">
                    Double-click
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Constraints"
        hint="Each pane keeps its own minimum. The start pane also respects maxSize, so 100% is never reachable by accident."
      >
        <Resizable
          aria-label="Constrained panels"
          minSize={[20, 30]}
          maxSize={70}
          defaultSizes={[45, 55]}
          paneClassName="pg-panel"
          style={{ ...splitFrame, height: 240 }}
        >
          <div className="pg-stack">
            <Badge variant="secondary">
              min 20% · max 70%
            </Badge>
            <p className="pg-muted">
              This pane cannot shrink below a fifth of the
              container, nor grow past 70%.
            </p>
          </div>

          <div className="pg-stack">
            <Badge variant="secondary">
              min 30%
            </Badge>
            <p className="pg-muted">
              The second pane keeps at least 30% of the
              available width at all times.
            </p>
          </div>
        </Resizable>
      </Section>

      <Section
        title="Controlled sizes"
        hint="The parent owns the pair. Every drag, key press or reset is reported through onSizesChange."
      >
        <div className="pg-stack">
          <Resizable
            aria-label="Controlled split"
            sizes={sizes}
            onSizesChange={setSizes}
            paneClassName="pg-panel"
            style={{ ...splitFrame, height: 240 }}
          >
            <div className="pg-stack">
              <span className="pg-meta">START PANE</span>
              <span className="pg-stat">
                {Math.round(sizes[0])}%
              </span>
            </div>

            <div className="pg-stack">
              <span className="pg-meta">END PANE</span>
              <span className="pg-stat">
                {Math.round(sizes[1])}%
              </span>
            </div>
          </Resizable>

          <div className="pg-row pg-row--between">
            <span className="pg-meta">
              aria-valuetext: {Math.round(sizes[0])}% /{" "}
              {Math.round(sizes[1])}%
            </span>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSizes([50, 50])}
            >
              Reset split
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same two panes."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Inspector</CardTitle>
              <CardDescription>
                A canvas and a properties panel.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Resizable
                aria-label="Canvas and properties"
                defaultSizes={[64, 36]}
                minSize={25}
                paneClassName="pg-panel"
                style={{ ...splitFrame, height: 220 }}
              >
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    height: "100%",
                    minHeight: 120,
                    background:
                      "var(--pimolu-muted)",
                    borderRadius:
                      "var(--pimolu-radius-md)",
                  }}
                >
                  <span className="pg-meta">
                    Canvas
                  </span>
                </div>

                <div className="pg-stack">
                  <span className="pg-meta">PROPERTIES</span>
                  <span>Radius · md</span>
                  <span>Density · comfortable</span>
                  <span>Theme · light</span>
                </div>
              </Resizable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diff view</CardTitle>
              <CardDescription>
                Before and after, with a vertical split.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Resizable
                aria-label="Before and after"
                orientation="vertical"
                defaultSizes={[50, 50]}
                paneClassName="pg-panel"
                style={{ ...splitFrame, height: 220 }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color:
                      "var(--pimolu-muted-foreground)",
                  }}
                >
                  {`- border-radius: 8px;\n- box-shadow: none;`}
                </pre>

                <pre
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--pimolu-success)",
                  }}
                >
                  {`+ border-radius: var(--pimolu-radius-lg);\n+ box-shadow: var(--pimolu-shadow-md);`}
                </pre>
              </Resizable>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
