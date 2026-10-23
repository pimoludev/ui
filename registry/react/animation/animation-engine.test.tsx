import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PimoluProvider } from "../provider/pimolu-provider";
import { PimoluAnimationProvider, usePimoluAnimationEngine, type PimoluAnimationEngine } from "./animation-engine";
import { Dialog, DialogContent, DialogTitle } from "../dialog/dialog";
import { useMergedRefs } from "../internal/use-merged-refs";
import { useRetainedItems } from "../internal/use-retained-items";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs/tabs";

function driver(duration = 300) {
  const cleanup = vi.fn();
  const engine: PimoluAnimationEngine = { name: "test", exitDuration: duration, mount: vi.fn(() => cleanup) };
  return { engine, cleanup };
}
function Report() { return <span>{usePimoluAnimationEngine()?.name ?? "css"}</span>; }
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("optional animation engine", () => {
  it("keeps CSS as the default and inherits or overrides nested scopes", () => {
    const { engine, cleanup } = driver();
    const css = render(<PimoluProvider><Report /></PimoluProvider>);
    expect(screen.getByText("css")).toBeInTheDocument();
    expect(css.container.querySelector("[data-pimolu-animation-scope]")).toBeNull();
    css.unmount();
    const view = render(<PimoluProvider animationEngine={engine}><Report /><PimoluProvider><Report /></PimoluProvider><PimoluProvider animationEngine="css"><Report /></PimoluProvider></PimoluProvider>);
    expect(screen.getAllByText("test")).toHaveLength(2);
    expect(screen.getByText("css").closest("[data-pimolu-animation-block]")).not.toBeNull();
    expect(engine.mount).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it("retains portals for the driver exit and cancels an obsolete exit on reopen", () => {
    vi.useFakeTimers();
    const { engine } = driver();
    const content = (open: boolean) => <PimoluProvider animationEngine={engine}><Dialog open={open}><DialogContent><DialogTitle>Motion lifecycle</DialogTitle></DialogContent></Dialog></PimoluProvider>;
    const view = render(content(true));
    expect(screen.getByRole("dialog").closest("[data-pimolu-animation-scope]")).not.toBeNull();
    view.rerender(content(false));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
    const retainedPanel = screen.getByRole("dialog");
    retainedPanel.inert = true;
    view.rerender(content(true));
    expect(retainedPanel.inert).toBe(false);
    expect(retainedPanel).toHaveFocus();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
    view.rerender(content(false));
    act(() => vi.advanceTimersByTime(334));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("retains tab panels visually while removing the old panel from the accessibility tree", () => {
    vi.useFakeTimers();
    const { engine } = driver();
    render(<PimoluAnimationProvider engine={engine}><Tabs defaultValue="a"><TabsList><TabsTrigger value="a">One</TabsTrigger><TabsTrigger value="b">Two</TabsTrigger></TabsList><TabsContent value="a">First panel</TabsContent><TabsContent value="b">Second panel</TabsContent></Tabs></PimoluAnimationProvider>);
    fireEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("First panel")).not.toHaveAttribute("hidden");
    expect(screen.getByText("First panel")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    act(() => vi.advanceTimersByTime(334));
    expect(screen.getByText("First panel")).toHaveAttribute("hidden");
  });

  it("cleans callback refs once and preserves the internal ref", () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);
    const internal = createRef<HTMLButtonElement>();
    function Probe() {
      const local = useRef<HTMLButtonElement>(null);
      const merged = useMergedRefs(callback, local);
      return <button ref={useMergedRefs(merged, internal)}>Probe</button>;
    }
    const view = render(<Probe />);
    expect(internal.current).toBe(screen.getByRole("button"));
    view.unmount();
    expect(internal.current).toBeNull();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("ends an in-flight portal exit immediately when reduced motion is enabled", () => {
    vi.useFakeTimers();
    let reduced = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal("matchMedia", () => ({ get matches() { return reduced; }, addEventListener: (_: string, listener: () => void) => listeners.add(listener), removeEventListener: (_: string, listener: () => void) => listeners.delete(listener) }));
    const { engine } = driver(1000);
    const content = (open: boolean) => <PimoluProvider animationEngine={engine}><Dialog open={open}><DialogContent><DialogTitle>Reduced exit</DialogTitle></DialogContent></Dialog></PimoluProvider>;
    const view = render(content(true));
    view.rerender(content(false));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => { reduced = true; for (const listener of listeners) listener(); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("retains removed notifications once and cancels removal when an id returns", () => {
    vi.useFakeTimers();
    const { engine } = driver();
    const first = { id: "one", title: "First" };
    function Items({ items }: { items: typeof first[] }) { return useRetainedItems(items).map(({ item, closing }) => <span key={item.id} data-state={closing ? "closing" : "open"}>{item.title}</span>); }
    const content = (items: typeof first[]) => <PimoluAnimationProvider engine={engine}><Items items={items} /></PimoluAnimationProvider>;
    const view = render(content([first]));
    view.rerender(content([]));
    expect(screen.getByText("First")).toHaveAttribute("data-state", "closing");
    act(() => vi.advanceTimersByTime(200));
    view.rerender(content([first]));
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText("First")).toHaveAttribute("data-state", "open");
    view.rerender(content([]));
    act(() => vi.advanceTimersByTime(334));
    expect(screen.queryByText("First")).toBeNull();
  });
});
