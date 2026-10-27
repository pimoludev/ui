"use client";

import {
  type PimoluTabsVariant,
  type PimoluTabsSize,
  type PimoluTabsOrientation,
  type PimoluTabsActivationMode,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@pimolu/react";

function ProjectTabs({
  label = "Project sections",
  variant = "line",
  size = "md",
  orientation = "horizontal",
  activationMode = "automatic",
  compact = false,
}: {
  label?: string;
  variant?: PimoluTabsVariant;
  size?: PimoluTabsSize;
  orientation?: PimoluTabsOrientation;
  activationMode?: PimoluTabsActivationMode;
  compact?: boolean;
}) {
  return (
    <Tabs
      defaultValue="overview"
      variant={variant}
      size={size}
      orientation={orientation}
      activationMode={activationMode}
      classNames={{
        root: "custom-tabs-root",
        trigger: "custom-tabs-trigger"
      }}
    >
      <TabsList aria-label={label}>
        <TabsTrigger value="overview">
          {compact ? "One" : "Overview"}
        </TabsTrigger>
        <TabsTrigger value="activity">
          {compact ? "Two" : "Activity"}
        </TabsTrigger>
        <TabsTrigger value="settings" disabled>
          {compact ? "Three" : "Settings"}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-5 min-w-0">
          <p className="max-w-prose leading-relaxed">
            The selected tab owns the panel and names it through
            aria-labelledby; the panel points back with aria-controls.
          </p>
          <p className="max-w-prose leading-relaxed">
            Panels stay mounted while hidden, so a form keeps what the user
            typed after a switch.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="activity">
        <div className="grid gap-5 min-w-0">
          <p className="max-w-prose leading-relaxed">
            Three new deployments, two comments and one theme change
            happened this week.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <p className="max-w-prose leading-relaxed">
          This panel is unreachable because its trigger is disabled.
        </p>
      </TabsContent>
    </Tabs>
  );
}

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <ProjectTabs />
        </>)
      }
      <style>
        {
          `
.custom-tabs-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-tabs-trigger {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
