"use client";

import { useState } from "react";
import { Select, Tabs, TabsContent, TabsList, TabsTrigger, tabsVariantMap } from "@pimolu/react";

export function TabsExample() {
  const [variant, setVariant] = useState<keyof typeof tabsVariantMap.variant>("line");
  return <div className="space-y-6">
    <Select label="Tab style" value={variant} onValueChange={(value) => setVariant(value as keyof typeof tabsVariantMap.variant)}>{Object.keys(tabsVariantMap.variant).map((value) => <option key={value} value={value}>{value}</option>)}</Select>
    <Tabs defaultValue="overview" variant={variant}>
      <TabsList aria-label="Project details"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="archive" disabled>Archive</TabsTrigger></TabsList>
      <TabsContent value="overview"><p className="py-5">One workspace for your next idea.</p></TabsContent>
      <TabsContent value="archive"><p className="py-5">Archived projects are unavailable in this example.</p></TabsContent>
      <TabsContent value="activity"><p className="py-5">The project was created. Your next step is yours to choose.</p></TabsContent>
    </Tabs>
  </div>;
}
