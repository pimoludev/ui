import { useRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Portal } from "./portal";
import { useAnchoredPosition } from "./use-anchored-position";

let height = 60;
let anchorWidth = 180;
let layoutReads = 0;
let frames: Map<number, FrameRequestCallback>;
let resize: ResizeObserverCallback;
let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;
let commits: Array<{ visibility: string; top: string }>;

function Example({ open = true, mount = true, notify = false, placement = "bottom", anchorMissing = false }: { open?: boolean; mount?: boolean; notify?: boolean; placement?: "bottom" | "left" | "right"; anchorMissing?: boolean }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const anchorReady = useRef(!anchorMissing);
  const panel = useRef<HTMLDivElement>(null);
  const { style, side, onMount } = useAnchoredPosition(anchor, panel, open, { placement });
  return <>
    <button ref={(node) => {
      anchor.current = anchorReady.current ? node : null;
      if (node) node.getBoundingClientRect = () => {
        layoutReads++;
        return DOMRect.fromRect({ x: 100, y: 500, width: anchorWidth, height: 40 });
      };
    }} onClick={(event) => {
      anchorReady.current = true;
      anchor.current = event.currentTarget;
    }}>Open</button>
    {open && mount && <Portal anchorRef={anchor} onMount={notify ? onMount : undefined}>
      <div data-testid="panel" data-side={side} style={style} ref={(node) => {
        panel.current = node;
        if (node) {
          Object.defineProperty(node, "scrollHeight", { configurable: true, get: () => height });
          commits.push({ visibility: node.style.visibility, top: node.style.top });
        }
      }}>Menu</div>
    </Portal>}
  </>;
}

function nextFrame() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
}

beforeEach(() => {
  height = 60;
  anchorWidth = 180;
  layoutReads = 0;
  commits = [];
  frames = new Map();
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => frames.delete(key));
  observe = vi.fn();
  disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: ResizeObserverCallback) { resize = callback; }
    observe = observe;
    disconnect = disconnect;
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("anchored portal placement", () => {
  it("recovers an anchor assigned after opening without re-rendering the owner", () => {
    render(<Example notify anchorMissing />);
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "hidden" });
    nextFrame();
    nextFrame();
    expect(layoutReads).toBe(0);
    expect(frames.size).toBe(1);
    fireEvent.click(screen.getByRole("button"));
    nextFrame();
    nextFrame();
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "visible", top: "544px" });
    expect(observe).toHaveBeenCalledWith(screen.getByRole("button"));
    expect(frames.size).toBe(0);
  });

  it("cancels anchor waiting on close and on unmount", () => {
    const view = render(<Example anchorMissing />);
    expect(frames.size).toBe(1);
    view.rerender(<Example anchorMissing open={false} />);
    expect(frames.size).toBe(0);
    view.rerender(<Example anchorMissing />);
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalled();
  });

  it.each([false, true])("ignores unrelated owner renders when panel mounted=%s", (mount) => {
    const view = render(<Example notify mount={mount} />);
    nextFrame();
    nextFrame();
    const previousReads = layoutReads;
    view.rerender(<Example notify mount={mount} />);
    expect(layoutReads).toBe(previousReads);
  });

  it("observes the anchor as well as the mounted panel and follows local width changes", () => {
    render(<Example notify />);
    expect(observe).toHaveBeenCalledWith(screen.getByRole("button"));
    expect(observe).toHaveBeenCalledWith(screen.getByTestId("panel"));
    anchorWidth = 240;
    act(() => resize([], {} as ResizeObserver));
    expect(screen.getByTestId("panel")).toHaveStyle({ width: "240px" });
  });

  it.each(["left", "right"] as const)("limits tall content on the %s to the viewport and configured cap", (placement) => {
    vi.stubGlobal("innerHeight", 200);
    height = 1000;
    render(<Example notify placement={placement} />);
    expect(screen.getByTestId("panel")).toHaveStyle({ maxHeight: "184px", visibility: "visible" });
    vi.stubGlobal("innerHeight", 768);
    fireEvent.resize(window);
    expect(screen.getByTestId("panel")).toHaveStyle({ maxHeight: "320px" });
  });
  it("completes portal sizing before paint without waiting for an animation frame", () => {
    render(<Example notify />);
    expect(commits[0].visibility).toBe("hidden");
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "visible", top: "544px" });
    expect(commits.filter((commit) => commit.visibility === "visible").every((commit) => commit.top === "544px")).toBe(true);
    expect(frames.size).toBe(0);
  });

  it("never reveals the estimated top placement when the real short panel fits below", () => {
    render(<Example />);
    const panel = screen.getByTestId("panel");
    expect(commits[0].visibility).toBe("hidden");
    expect(commits.filter((commit) => commit.visibility === "visible").every((commit) => commit.top === "544px")).toBe(true);
    nextFrame();
    expect(panel).toHaveStyle({ visibility: "visible", top: "544px", width: "180px" });
    expect(panel).toHaveAttribute("data-side", "bottom");
    expect(observe).toHaveBeenCalledWith(panel);
  });

  it("waits for a delayed portal and observes its real node", () => {
    const view = render(<Example mount={false} />);
    nextFrame();
    view.rerender(<Example />);
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "hidden" });
    nextFrame();
    nextFrame();
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "visible" });
    expect(observe).toHaveBeenCalledWith(screen.getByTestId("panel"));
  });

  it("re-measures a reopened menu rather than revealing the previous geometry", () => {
    const view = render(<Example />);
    nextFrame();
    nextFrame();
    view.rerender(<Example open={false} />);
    height = 300;
    view.rerender(<Example />);
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "hidden" });
    nextFrame();
    nextFrame();
    expect(screen.getByTestId("panel")).toHaveStyle({ visibility: "visible", bottom: "272px" });
    expect(screen.getByTestId("panel")).toHaveAttribute("data-side", "top");
  });

  it("updates on content resize and viewport events, then cleans up on unmount", () => {
    const view = render(<Example />);
    nextFrame();
    nextFrame();
    height = 300;
    act(() => resize([], {} as ResizeObserver));
    expect(screen.getByTestId("panel")).toHaveAttribute("data-side", "top");
    height = 60;
    fireEvent.resize(window);
    expect(screen.getByTestId("panel")).toHaveAttribute("data-side", "bottom");
    height = 300;
    fireEvent.scroll(window);
    expect(screen.getByTestId("panel")).toHaveAttribute("data-side", "top");
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(frames.size).toBe(0);
  });
});
