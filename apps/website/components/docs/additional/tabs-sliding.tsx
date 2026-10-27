"use client";

import { useState } from "react";
import { Checkbox, Tabs, TabsContent, TabsList, TabsTrigger } from "@pimolu/react";

export function DemoExample() {
  const [animated, setAnimated] = useState(true);

  return (
    <div className="grid gap-6">
      <Checkbox
        label="Animate tabs"
        checked={animated}
        onCheckedChange={setAnimated}
      />
      <Tabs
        defaultValue="summary"
        animated={animated}
        className="report-tabs"
      >
        <TabsList aria-label="Project reports">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="reports">Detailed reports</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          Review the workspace at a glance.
        </TabsContent>
        <TabsContent value="reports">
          Explore performance and deployment history.
        </TabsContent>
        <TabsContent value="team">
          Manage members and permissions.
        </TabsContent>
      </Tabs>
      <style>{`
        .report-tabs {
          --pimolu-tabs-indicator-duration: 400ms;
          --pimolu-tabs-indicator-easing: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
}
