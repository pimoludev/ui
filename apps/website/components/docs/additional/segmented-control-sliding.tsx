"use client";

import { useState, type CSSProperties } from "react";
import { Checkbox, SegmentedControl, Select } from "@pimolu/react";

export function DemoExample() {
  const [animated, setAnimated] = useState(true);
  const [scrollable, setScrollable] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [duration, setDuration] = useState("240");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Checkbox label="Animate selection" checked={animated} onCheckedChange={setAnimated} />
        <Checkbox label="Enable scrolling" checked={scrollable} onCheckedChange={setScrollable} />
        <Checkbox label="Show scrollbar" checked={showScrollbar} onCheckedChange={setShowScrollbar} />
        <Checkbox label="Vertical layout" checked={vertical} onCheckedChange={setVertical} />
        <Select label="Animation duration" value={duration} onValueChange={setDuration}>
          <option value="120">120 ms</option>
          <option value="240">240 ms</option>
          <option value="600">600 ms</option>
        </Select>
      </div>
      <SegmentedControl
        aria-label="Animated workspace view"
        defaultValue="summary"
        animated={animated}
        scrollable={scrollable}
        showScrollbar={showScrollbar}
        orientation={vertical ? "vertical" : "horizontal"}
        classNames={{ indicator: "workspace-view-indicator" }}
        style={{
          maxWidth: 440,
          maxHeight: vertical && scrollable ? 144 : undefined,
          "--pimolu-segmented-indicator-duration": `${duration}ms`,
          "--pimolu-segmented-indicator-easing": "cubic-bezier(0.22, 1, 0.36, 1)",
        } as CSSProperties}
        options={[
          { value: "summary", label: "Summary" },
          { value: "reports", label: "Detailed reports" },
          { value: "team", label: "Team" },
          { value: "deployments", label: "Deployments" },
          { value: "activity", label: "Recent activity" },
          { value: "archive", label: "Archive", disabled: true },
        ]}
      />
      <style>{`.workspace-view-indicator { border-radius: 12px; }`}</style>
    </div>
  );
}
