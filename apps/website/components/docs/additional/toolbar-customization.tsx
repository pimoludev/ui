"use client";

import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarSeparator,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div
            className="flex flex-wrap items-center gap-3 min-w-0"
            style={{
              alignItems: "flex-start"
            }}
          >
            <Toolbar
              aria-label="Canvas tools"
              orientation="vertical"
              classNames={{
                root: "custom-toolbar-root"
              }}
            >
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
                  A vertical toolbar suits a drawing rail or a narrow mobile
                  control strip.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    minHeight: 150,
                    border: "1px dashed var(--pimolu-border)",
                    borderRadius: "var(--pimolu-radius-md)",
                    background: "var(--pimolu-surface)",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-toolbar-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
