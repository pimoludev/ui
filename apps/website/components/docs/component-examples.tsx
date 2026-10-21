"use client";

import "./demo-compositions.css";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { readyExample } from "./example-ready";
import { extendedExamples } from "@/content/generated/example-loaders";
import { additionalExamples } from "@/content/generated/additional-loaders";
import { PimoluProvider, usePimoluTheme, type PimoluStylePreset, type PimoluThemeMode, type PimoluRadius, type PimoluDensity } from "@pimolu/react";

function LoadingExample() { return <p role="status">Loading the interactive example?</p>; }

export const componentExamples = {
  ...extendedExamples,
  "button": dynamic(() => import("./examples/button").then((module) => readyExample(module.ButtonExample)), { loading: LoadingExample }),
  "input": dynamic(() => import("./examples/input").then((module) => readyExample(module.InputExample)), { loading: LoadingExample }),
  "select": dynamic(() => import("./examples/select").then((module) => readyExample(module.SelectExample)), { loading: LoadingExample }),
  "dialog": dynamic(() => import("./examples/dialog").then((module) => readyExample(module.DialogExample)), { loading: LoadingExample }),
  "tabs": dynamic(() => import("./examples/tabs").then((module) => readyExample(module.TabsExample)), { loading: LoadingExample }),
  "card": dynamic(() => import("./examples/card").then((module) => readyExample(module.CardExample)), { loading: LoadingExample }),
  "data-table": dynamic(() => import("./examples/data-table").then((module) => readyExample(module.DataTableExample)), { loading: LoadingExample }),
  "data-grid": dynamic(() => import("./examples/data-grid").then((module) => readyExample(module.DataGridExample)), { loading: LoadingExample }),
  "form": dynamic(() => import("./examples/form").then((module) => readyExample(module.FormExample)), { loading: LoadingExample }),
  "navbar": dynamic(() => import("./examples/navbar").then((module) => readyExample(module.NavbarExample)), { loading: LoadingExample }),
  "sidebar": dynamic(() => import("./examples/sidebar").then((module) => readyExample(module.SidebarExample)), { loading: LoadingExample }),
  "dashboard-layout": dynamic(() => import("./examples/dashboard-layout").then((module) => readyExample(module.DashboardLayoutExample)), { loading: LoadingExample }),
  "chart": dynamic(() => import("./examples/chart").then((module) => readyExample(module.ChartExample)), { loading: LoadingExample }),
  "date-picker": dynamic(() => import("./examples/date-picker").then((module) => readyExample(module.DatePickerExample)), { loading: LoadingExample }),
  "toast": dynamic(() => import("./examples/toast").then((module) => readyExample(module.ToastExample)), { loading: LoadingExample }),
  "command": dynamic(() => import("./examples/command").then((module) => readyExample(module.CommandExample)), { loading: LoadingExample }),
  "table": dynamic(() => import("./examples/table").then((module) => readyExample(module.TableExample)), { loading: LoadingExample }),
  "badge": dynamic(() => import("./examples/badge").then((module) => readyExample(module.BadgeExample)), { loading: LoadingExample }),
  "alert": dynamic(() => import("./examples/alert").then((module) => readyExample(module.AlertExample)), { loading: LoadingExample }),
  "tooltip": dynamic(() => import("./examples/tooltip").then((module) => readyExample(module.TooltipExample)), { loading: LoadingExample }),
};

export function ComponentExample({ family, direction = "ltr" }: { family: string; direction?: "ltr" | "rtl" }) {
  const { resolvedTheme, stylePreset, radius, density, brandColor } = usePimoluTheme();
  if (["dashboard-layout", "app-shell", "docs-layout", "table-of-contents", "anchor"].includes(family)) {
    const query = new URLSearchParams({ theme: resolvedTheme, preset: stylePreset, direction });
    if (radius) query.set("radius", radius);
    if (density) query.set("density", density);
    if (brandColor) query.set("brand", brandColor);
    return <iframe className="docs-example-frame" title={`Interactive ${family} example`} src={"/preview/" + family + "?" + query.toString()} loading="lazy" />;
  }
  const Example = componentExamples[family as keyof typeof componentExamples];
  return Example ? <Example /> : null;
}

export function StandaloneExample({ family, exampleId, theme, preset, radius, density, brandColor, direction = "ltr" }: { family: string; exampleId?: string; theme: PimoluThemeMode; preset: PimoluStylePreset; radius?: PimoluRadius; density?: PimoluDensity; brandColor?: string; direction?: "ltr" | "rtl" }) {
  const key = `${family}/${exampleId}`;
  const Example = exampleId ? additionalExamples[key as keyof typeof additionalExamples] : componentExamples[family as keyof typeof componentExamples];
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = content.current;
    if (!node || window.parent === window) return;
    const observer = new ResizeObserver(() => window.parent.postMessage({ type: "pimolu-example-height", height: node.getBoundingClientRect().height + 64 }, window.location.origin));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const layout = ["dashboard-layout", "app-shell", "docs-layout"].includes(family);
  return <div dir={direction}><PimoluProvider theme={theme} stylePreset={preset} radius={radius} density={density} brandColor={brandColor} className="docs-standalone"><div ref={content} className={`demo-composition demo-composition--${family}`} data-example-ready={family}>{layout ? <Example /> : <main><Example /></main>}</div></PimoluProvider></div>;
}
