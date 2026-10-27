import { render, screen, within, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Card, CardHeader, CardTitle, CardContent } from "../card/card";
import { Stack } from "../stack/stack";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs/tabs";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "../navbar/navbar";
import { Stat } from "../stat/stat";
import { BarChart, LineChart, AreaChart, DonutChart, Sparkline } from "../chart/chart";
import { Popover } from "../popover/popover";
import { Badge } from "../badge/badge";
import { CircularProgress } from "../circular-progress/circular-progress";
import type { PimoluClassNames } from "../customization/customization.types";
import { VirtualList } from "../virtual-list/virtual-list";
import { Toaster, toast, dismissAllToasts } from "../toast/toast";
import { Input } from "../input/input";
import { FormField, FormControl } from "../form-field/form-field";
import { CodeBlock } from "../code-block/code-block";

describe("family-wide named parts", () => {
  it("keeps unstyled code tokens free of an empty class attribute", () => {
    const { container } = render(<CodeBlock code={'import { Button } from "@pimolu/react";'} language="tsx" />);
    const space = [...container.querySelectorAll("span")].find((node) => node.textContent === " ");
    expect(space).toBeTruthy();
    expect(space).not.toHaveAttribute("class");
  });
  it("reaches FormField's composed label and message without forwarding its root", () => {
    render(<FormField label="Email" helperText="Account notices only" classNames={{ root: "field-root", label: "field-label", message: "field-message" }}><FormControl><Input type="email" /></FormControl></FormField>);
    expect(screen.getByText("Email")).toHaveClass("field-label");
    expect(screen.getByText("Account notices only")).toHaveClass("field-message");
    expect(screen.getByText("Email")).not.toHaveClass("field-root");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription("Account notices only");
  });
  it("keeps live DOM, focus and uncontrolled state when a part map appears or disappears", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Card><CardContent><Input label="Draft" defaultValue="Initial" /></CardContent></Card>);
    const input = screen.getByRole("textbox", { name: "Draft" });
    await user.type(input, " edited");
    rerender(<Card classNames={{ content: "custom-content" }}><CardContent><Input label="Draft" defaultValue="Initial" /></CardContent></Card>);
    expect(screen.getByRole("textbox", { name: "Draft" })).toBe(input);
    expect(input).toHaveValue("Initial edited");
    expect(input).toHaveFocus();
    rerender(<Card><CardContent><Input label="Draft" defaultValue="Initial" /></CardContent></Card>);
    expect(screen.getByRole("textbox", { name: "Draft" })).toBe(input);
    expect(input).toHaveFocus();
  });
  it("keeps family and part keys checked by TypeScript", () => {
    const valid: PimoluClassNames<"card"> = { title: "title-hook" };
    // @ts-expect-error Unknown parts must not silently become a string index.
    const invalid: PimoluClassNames<"card"> = { inventedPart: "wrong" };
    // @ts-expect-error Family names are part of the public typed contract.
    type UnknownFamily = PimoluClassNames<"invented-family">;
    expect(valid.title).toBe("title-hook");
    expect(invalid).toBeTruthy();
    const typeOnly: UnknownFamily | undefined = undefined;
    expect(typeOnly).toBeUndefined();
  });
  it("types and applies generic VirtualList viewport and item hooks", () => {
    render(<VirtualList items={[{ id: "one", label: "First" }]} itemHeight={32} height={100} renderItem={(item) => item.label} classNames={{ root: "virtual-root", item: "virtual-item" }} />);
    expect(screen.getByText("First").closest(".pimolu-virtual-list")).toHaveClass("virtual-root");
    expect(document.querySelector(".virtual-item")).toHaveTextContent("First");
  });

  it("isolates toast overrides and keeps the global Toaster root off cards", () => {
    render(<Toaster classNames={{ root: "toast-region", title: "global-title", toast: "global-card" }} />);
    act(() => {
      toast({ title: "Custom", duration: 0, classNames: { root: "local-card", title: "local-title" } });
      toast({ title: "Default", duration: 0 });
    });
    expect(screen.getByRole("region")).toHaveClass("toast-region");
    expect(screen.getByText("Custom")).toHaveClass("local-title");
    expect(screen.getByText("Custom").closest(".pimolu-toast")).toHaveClass("local-card");
    expect(screen.getByText("Default")).toHaveClass("global-title");
    expect(screen.getByText("Default").closest(".pimolu-toast")).toHaveClass("global-card");
    expect(screen.getByText("Default").closest(".pimolu-toast")).not.toHaveClass("toast-region", "local-card");
    act(() => dismissAllToasts());
  });
  it("distributes compound parts through other families without leaking root classes", () => {
    render(<Card classNames={{ root: "card-root-hook", header: "header-hook", title: "title-hook", content: "content-hook" }}><CardHeader className="legacy-header"><Stack classNames={{ root: "stack-hook" }}><CardTitle>Title</CardTitle></Stack></CardHeader><CardContent>Body</CardContent></Card>);
    expect(screen.getByText("Title")).toHaveClass("title-hook");
    expect(screen.getByText("Title").closest(".pimolu-card")).toHaveClass("card-root-hook");
    expect(document.querySelector(".legacy-header")).toHaveClass("header-hook");
    expect(document.querySelector(".legacy-header")).not.toHaveClass("card-root-hook");
    expect(screen.getByText("Body")).toHaveClass("content-hook");
    expect(document.querySelector(".stack-hook")).not.toHaveAttribute("classNames");
  });

  it("resets nested roots while allowing explicit local overrides on compound parts", () => {
    render(<Card classNames={{ root: "outer-root", title: "outer-title", content: "outer-content" }}><CardTitle classNames={{ title: "local-title", root: "local-root" }}>Outer</CardTitle><CardContent><Card><CardTitle>Nested</CardTitle><CardContent>Nested body</CardContent></Card></CardContent></Card>);
    expect(screen.getByText("Outer")).toHaveClass("local-title", "local-root");
    expect(screen.getByText("Outer")).not.toHaveClass("outer-title", "outer-root");
    expect(screen.getByText("Nested")).not.toHaveClass("outer-title", "local-title");
    expect(screen.getByText("Nested body")).not.toHaveClass("outer-content");
    expect(screen.getByText("Nested").closest(".pimolu-card")).not.toHaveClass("outer-root");
  });

  it("can remove a parent's map without leaving stale classes", () => {
    const { rerender } = render(<Card classNames={{ title: "temporary" }}><CardTitle>Title</CardTitle></Card>);
    expect(screen.getByText("Title")).toHaveClass("temporary");
    rerender(<Card><CardTitle>Title</CardTitle></Card>);
    expect(screen.getByText("Title")).not.toHaveClass("temporary");
  });

  it("retains Tabs keyboard behavior and disabled states with inherited parts", async () => {
    const user = userEvent.setup();
    render(<Tabs defaultValue="one" classNames={{ root: "tabs-root", list: "tabs-list", trigger: "tabs-trigger", panel: "tabs-panel" }}><TabsList aria-label="Views"><TabsTrigger value="one">First</TabsTrigger><TabsTrigger value="disabled" disabled>Disabled</TabsTrigger><TabsTrigger value="two">Second</TabsTrigger></TabsList><TabsContent value="one">First panel</TabsContent><TabsContent value="two">Second panel</TabsContent></Tabs>);
    expect(screen.getByRole("tablist")).toHaveClass("tabs-list");
    expect(screen.getByRole("tab", { name: "First" })).toHaveClass("tabs-trigger");
    expect(screen.getByRole("tab", { name: "First" })).not.toHaveClass("tabs-root");
    screen.getByRole("tab", { name: "First" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveClass("tabs-panel");
    expect(screen.getByRole("tab", { name: "Disabled" })).toBeDisabled();
  });

  it("keeps a Navbar's root map off its Link wrappers", () => {
    render(<Navbar classNames={{ root: "nav-root", brand: "nav-brand", content: "nav-content", item: "nav-item" }}><NavbarBrand href="/">Pimolu</NavbarBrand><NavbarContent><NavbarItem href="/docs">Docs</NavbarItem></NavbarContent></Navbar>);
    expect(screen.getByRole("banner")).toHaveClass("nav-root");
    expect(screen.getByRole("link", { name: "Pimolu" })).toHaveClass("nav-brand");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveClass("nav-item");
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveClass("nav-root");
  });

  it("reaches private SVG helpers and repeated badge parts", () => {
    render(<><Stat label="Revenue" value="$24k" delta="+8%" trend="up" classNames={{ trendIcon: "trend-hook", value: "value-hook" }} /><Badge dot classNames={{ root: "badge-root", dot: "badge-dot", label: "badge-label" }}>Live</Badge><CircularProgress value={45} classNames={{ indicator: "ring-indicator", track: "ring-track" }} /></>);
    expect(document.querySelector(".trend-hook")).toHaveClass("pimolu-stat__trend-icon");
    expect(screen.getByText("$24k")).toHaveClass("value-hook");
    expect(document.querySelector(".badge-dot")).not.toHaveClass("badge-root");
    expect(screen.getByText("Live")).toHaveClass("badge-label");
    expect(document.querySelector(".ring-indicator")).toHaveClass("pimolu-circular-progress__indicator");
    expect(document.querySelector(".ring-track")).not.toHaveClass("ring-indicator");
  });

  it.each(["bar", "line", "area", "donut"] as const)("styles %s chart geometry and private surfaces", (kind) => {
    const classes: PimoluClassNames<"chart"> = { root: "chart-hook", svg: "svg-hook", bar: "bar-hook", line: "line-hook", area: "area-hook", segment: "segment-hook", legend: "legend-hook" };
    const data = [{ label: "Jan", value: 10 }, { label: "Feb", value: 20 }];
    const series = [{ name: "Revenue", values: [10, 20] }];
    const { container } = render(kind === "bar" ? <BarChart data={data} aria-label="Revenue" classNames={classes} /> : kind === "line" ? <LineChart series={series} labels={["Jan", "Feb"]} aria-label="Revenue" classNames={classes} /> : kind === "area" ? <AreaChart series={series} labels={["Jan", "Feb"]} aria-label="Revenue" classNames={classes} /> : <DonutChart data={data} aria-label="Revenue" classNames={classes} />);
    expect(container.querySelector(".chart-hook")).toBeTruthy();
    expect(container.querySelector(".svg-hook")).toBeTruthy();
    expect(container.querySelector(`.${kind === "donut" ? "segment" : kind}-hook`)).toBeTruthy();
    expect(container.querySelector(`.${kind === "donut" ? "segment" : kind}-hook`)).not.toHaveClass("chart-hook");
  });

  it("styles Sparkline without changing its SVG semantics", () => {
    const { container } = render(<Sparkline data={[1, 3, 2]} aria-label="Trend" classNames={{ root: "spark-root", line: "spark-line", svg: "spark-svg" }} />);
    expect(screen.getByRole("img", { name: "Trend" })).toHaveClass("spark-svg");
    expect(container.querySelector(".spark-root")).toHaveClass("pimolu-chart");
    expect(container.querySelector(".spark-line")).toBeTruthy();
  });

  it("follows a portal and preserves the trigger focus contract", async () => {
    const user = userEvent.setup();
    render(<Popover label="Details" classNames={{ root: "popover-hook" }} content={<button>Panel action</button>}><button>Open</button></Popover>);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const panel = await screen.findByRole("dialog");
    expect(panel).toHaveClass("popover-hook");
    expect(within(panel).getByRole("button", { name: "Panel action" })).toHaveFocus();
    fireEvent.keyDown(panel, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });
});
