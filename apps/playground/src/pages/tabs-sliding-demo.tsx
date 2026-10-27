import { useState, type CSSProperties } from "react";
import { Checkbox, Select, Tabs, TabsContent, TabsList, TabsTrigger, type PimoluTabsVariant } from "@pimolu/react";
import { tabsVariants } from "../demo-data";

export function SlidingIndicatorTabs() {
  const [animated, setAnimated] = useState(true);
  const [vertical, setVertical] = useState(false);
  const [duration, setDuration] = useState("240");
  const [variant, setVariant] = useState<PimoluTabsVariant>("line");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Select label="Indicator variant" value={variant} onValueChange={(value) => setVariant(value as PimoluTabsVariant)}>
          {tabsVariants.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Select label="Indicator duration" value={duration} onValueChange={setDuration}>
          <option value="120">Quick · 120 ms</option>
          <option value="240">Default · 240 ms</option>
          <option value="600">Slow · 600 ms</option>
        </Select>
        <Checkbox label="Animate tabs" checked={animated} onCheckedChange={setAnimated} />
        <Checkbox label="Vertical tabs" checked={vertical} onCheckedChange={setVertical} />
      </div>
      <div style={{ "--pimolu-tabs-indicator-duration": `${duration}ms`, "--pimolu-tabs-indicator-easing": "cubic-bezier(0.22, 1, 0.36, 1)" } as CSSProperties}>
        <Tabs defaultValue="summary" variant={variant} animated={animated} orientation={vertical ? "vertical" : "horizontal"}>
          <TabsList aria-label="Sliding indicator example">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="reports">Detailed reports</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="archive" disabled>Archive</TabsTrigger>
          </TabsList>
          <TabsContent value="summary"><p>Review the workspace at a glance.</p></TabsContent>
          <TabsContent value="reports"><p>Explore performance and deployment history.</p></TabsContent>
          <TabsContent value="team"><p>Manage members and permissions.</p></TabsContent>
          <TabsContent value="archive"><p>Archived reports are unavailable.</p></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
