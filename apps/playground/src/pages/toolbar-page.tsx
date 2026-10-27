import { CustomizationExample } from "./toolbar-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

type Alignment = "left" | "center" | "right";

function AlignLeftIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 5h14M3 9h8M3 13h14M3 17h6" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 5h14M6 9h8M3 13h14M7 17h6" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 5h14M9 9h8M3 13h14M11 17h6" />
    </svg>
  );
}

function TextPreview({
  formats,
  alignment,
}: {
  formats: string[];
  alignment: Alignment;
}) {
  return (
    <div
      className="pg-copy"
      style={{
        minHeight: 96,
        padding: 16,
        border: "1px solid var(--pimolu-border)",
        borderRadius: "var(--pimolu-radius-md)",
        background: "var(--pimolu-surface)",
        fontWeight: formats.includes("bold") ? 700 : 400,
        fontStyle: formats.includes("italic")
          ? "italic"
          : "normal",
        textDecoration: formats.includes("underline")
          ? "underline"
          : "none",
        textAlign: alignment,
      }}
    >
      The release is ready. Toggle the controls above to apply
      formatting to this paragraph.
    </div>
  );
}

function EditorToolbar({
  formats,
  alignment,
  onFormatsChange,
  onAlignmentChange,
  onAction,
}: {
  formats: string[];
  alignment: Alignment;
  onFormatsChange: (value: string[]) => void;
  onAlignmentChange: (value: string) => void;
  onAction: (action: string) => void;
}) {
  return (
    <Toolbar aria-label="Editor toolbar">
      <ToolbarGroup aria-label="History">
        <ToolbarButton
          aria-label="Undo"
          title="Undo"
          onClick={() => onAction("Undo")}
        >
          <span aria-hidden="true">↶</span>
        </ToolbarButton>

        <ToolbarButton
          aria-label="Redo"
          title="Redo"
          onClick={() => onAction("Redo")}
        >
          <span aria-hidden="true">↷</span>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarToggleGroup
        type="multiple"
        aria-label="Text formatting"
        value={formats}
        onValueChange={onFormatsChange}
      >
        <ToolbarToggleItem value="bold" aria-label="Bold">
          <strong aria-hidden="true">B</strong>
        </ToolbarToggleItem>

        <ToolbarToggleItem
          value="italic"
          aria-label="Italic"
        >
          <em aria-hidden="true">I</em>
        </ToolbarToggleItem>

        <ToolbarToggleItem
          value="underline"
          aria-label="Underline"
        >
          <span
            aria-hidden="true"
            style={{ textDecoration: "underline" }}
          >
            U
          </span>
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <ToolbarSeparator />

      <ToolbarToggleGroup
        type="single"
        aria-label="Alignment"
        value={alignment}
        onValueChange={onAlignmentChange}
      >
        <ToolbarToggleItem
          value="left"
          aria-label="Align left"
        >
          <AlignLeftIcon />
        </ToolbarToggleItem>

        <ToolbarToggleItem
          value="center"
          aria-label="Align center"
        >
          <AlignCenterIcon />
        </ToolbarToggleItem>

        <ToolbarToggleItem
          value="right"
          aria-label="Align right"
        >
          <AlignRightIcon />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <ToolbarSeparator />

      <ToolbarButton
        aria-label="Insert link"
        onClick={() => onAction("Insert link")}
      >
        Link
      </ToolbarButton>

      <ToolbarButton disabled>Share</ToolbarButton>
    </Toolbar>
  );
}

export function ToolbarPage() {
  const [formats, setFormats] = useState<string[]>([
    "bold",
  ]);

  const [alignment, setAlignment] =
    useState<Alignment>("left");

  const [lastAction, setLastAction] =
    useState("Nothing selected yet");

  return (
    <>
      <PageHeader
        title="Toolbar"
        hint="A compact bar of related controls with one roving tab stop. Arrow keys move across groups, toggles expose aria-pressed, and separators follow the toolbar's orientation. Styles come from @pimolu/web-styles/toolbar.css."
      />

      <Section
        title="Editor toolbar"
        hint="Tab enters the toolbar once; ArrowLeft and ArrowRight move between every control, including the two toggle groups. Formatting is controlled by the page."
      >
        <div className="pg-stack">
          <div
            className="pg-row pg-row--between"
            style={{ flexWrap: "wrap" }}
          >
            <EditorToolbar
              formats={formats}
              alignment={alignment}
              onFormatsChange={setFormats}
              onAlignmentChange={(value) =>
                setAlignment(value as Alignment)
              }
              onAction={setLastAction}
            />

            <div className="pg-row">
              <Badge variant="primary">
                {formats.length > 0
                  ? formats.join(" + ")
                  : "no formatting"}
              </Badge>

              <Badge variant="neutral">
                {alignment}
              </Badge>
            </div>
          </div>

          <TextPreview
            formats={formats}
            alignment={alignment}
          />

          <div className="pg-row pg-row--between">
            <span className="pg-meta">
              Last action: {lastAction}
            </span>

            <Button
              size="sm"
              appearance="ghost"
              onClick={() => {
                setFormats([]);
                setAlignment("left");
                setLastAction("Formatting cleared");
              }}
            >
              Reset formatting
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Vertical rail"
        hint="With orientation=&quot;vertical&quot;, the arrow axis turns and separators become horizontal. The toolbar still has a single tab stop."
      >
        <div
          className="pg-row"
          style={{ alignItems: "flex-start" }}
        >
          <Toolbar aria-label="Canvas tools" orientation="vertical">
            <ToolbarGroup aria-label="Selection">
              <ToolbarButton aria-label="Select">
                <span aria-hidden="true">↖</span>
              </ToolbarButton>

              <ToolbarButton aria-label="Pan">
                <span aria-hidden="true">✋</span>
              </ToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup aria-label="Shapes">
              <ToolbarButton aria-label="Rectangle">
                <span aria-hidden="true">▭</span>
              </ToolbarButton>

              <ToolbarButton aria-label="Ellipse">
                <span aria-hidden="true">◯</span>
              </ToolbarButton>

              <ToolbarButton aria-label="Line">
                <span aria-hidden="true">╱</span>
              </ToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarButton aria-label="Zoom in">
              <span aria-hidden="true">＋</span>
            </ToolbarButton>

            <ToolbarButton aria-label="Zoom out">
              <span aria-hidden="true">−</span>
            </ToolbarButton>
          </Toolbar>

          <Card>
            <CardHeader>
              <CardTitle>Canvas</CardTitle>
              <CardDescription>
                A vertical toolbar suits a drawing rail or a
                narrow mobile control strip.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div
                style={{
                  minHeight: 150,
                  border:
                    "1px dashed var(--pimolu-border)",
                  borderRadius:
                    "var(--pimolu-radius-md)",
                  background:
                    "var(--pimolu-surface)",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Links, disabled root and navigation"
        hint="ToolbarLink keeps link semantics. A disabled toolbar disables every control at once, including links."
      >
        <div className="pg-stack">
          <Toolbar aria-label="Document navigation">
            <ToolbarLink href="#/toolbar" current>
              Editor
            </ToolbarLink>

            <ToolbarLink href="#/menubar">
              Menu bar
            </ToolbarLink>

            <ToolbarSeparator />

            <ToolbarButton
              onClick={() => setLastAction("Published")}
            >
              Publish
            </ToolbarButton>
          </Toolbar>

          <Toolbar aria-label="Locked controls" disabled>
            <ToolbarButton>Undo</ToolbarButton>
            <ToolbarButton>Redo</ToolbarButton>

            <ToolbarSeparator />

            <ToolbarLink href="#/toolbar">
              Documentation
            </ToolbarLink>
          </Toolbar>

          <p className="pg-meta">
            Last action: {lastAction}
          </p>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
