"use client";

import { useState } from "react";
import { SegmentedControl, Tabs, TabsContent, TabsList, TabsTrigger, tabsVariantMap, type PimoluTabsVariant } from "@pimolu/react";

export function TabsDemo() {
  const [variant, setVariant] = useState<PimoluTabsVariant>("line");
  return <div className="space-y-6">
    <div className="grid gap-3"><p className="text-sm text-muted">Tab style</p><SegmentedControl aria-label="Tab style" size="sm" value={variant} onValueChange={(value) => setVariant(value as PimoluTabsVariant)} options={Object.keys(tabsVariantMap.variant).map((value) => ({ value, label: value }))} /></div>
    <TabsExample variant={variant} />
  </div>;
}

export function TabsExample({ variant = "line" }: { variant?: PimoluTabsVariant }) {
  return (
    <Tabs defaultValue="overview" variant={variant}>
      <TabsList aria-label="Project details"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="archive" disabled>Archive</TabsTrigger></TabsList>
      <TabsContent value="overview"><p className="py-5">One workspace for your next idea.</p></TabsContent>
      <TabsContent value="archive"><p className="py-5">Archived projects are unavailable in this example.</p></TabsContent>
      <TabsContent value="activity"><p className="py-5">The project was created. Your next step is yours to choose.</p></TabsContent>
    </Tabs>
  );
}
