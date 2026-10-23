import { createElement, createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import * as Motion from "../../packages/motion/dist/index.js";
import { Button, PimoluProvider, DialogContent, DialogTitle } from "@pimolu/react";

describe("@pimolu/motion built package", () => {
  it("renders initial styles on the server without a mounted driver", () => {
    const markup = renderToString(<Motion.MotionButton initial={{ opacity: 0.7 }}>Server action</Motion.MotionButton>);
    expect(markup).toContain("opacity:0.7");
    expect(markup).toContain("pimolu-button");
    expect(markup).not.toContain("whileHover=");
  });
  it("exports a typed adapter for every discovered public component", () => {
    for (const name of Object.keys(Motion.motionComponentModes)) expect(Motion[name as keyof typeof Motion]).toBeDefined();
    expect(Motion.motionComponentModes.MotionButton).toBe("dom");
    expect(Motion.motionComponentModes.MotionCombobox).toBe("container");
    expect(Motion.motionComponentModes.MotionDialog).toBe("engine");
  });

  it("preserves the actual button ref, disabled/loading behavior and consumes Motion props", () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    const view = render(<Motion.MotionButton ref={ref} initial={{ x: 12, opacity: 0.7 }} animate={{ x: 12, opacity: 0.7 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring" }} onClick={click}>Save</Motion.MotionButton>);
    const button = screen.getByRole("button");
    expect(ref.current).toBe(button);
    expect(button.style.transform).toContain("12px");
    expect(button).toHaveAttribute("data-pimolu-motion-explicit");
    expect(button).not.toHaveAttribute("whileHover");
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    view.rerender(<Motion.MotionButton ref={ref} loading onClick={click} whileTap={{ scale: 0.95 }}>Save</Motion.MotionButton>);
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    view.unmount();
    expect(ref.current).toBeNull();
  });

  it("animates a composite surface without moving its public ref away from the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Motion.MotionCombobox ref={ref} label="Team" options={[{ value: "design", label: "Design" }]} initial={{ opacity: 0.7 }} animate={{ opacity: 0.7 }} />);
    const input = screen.getByRole("combobox");
    expect(ref.current).toBe(input);
    expect(input.closest<HTMLElement>("[data-pimolu-motion-explicit-container]")?.style.opacity).toBe("0.7");
    expect(input.style.opacity).toBe("");
  });

  it("preserves context across a real portalled MotionDialog", () => {
    render(<Motion.MotionDialog defaultOpen><DialogContent><DialogTitle>Real portal</DialogTitle></DialogContent></Motion.MotionDialog>);
    expect(screen.getByRole("dialog").closest("[data-pimolu-animation-scope=motion]")).not.toBeNull();
  });

  it("scopes the global driver, restores styles and ignores a nested CSS override", () => {
    const view = render(<PimoluProvider animationEngine={Motion.motionEngine}><Button>Motion feedback</Button><PimoluProvider animationEngine="css"><Button>CSS feedback</Button></PimoluProvider></PimoluProvider>);
    const motion = screen.getByRole("button", { name: "Motion feedback" });
    const css = screen.getByRole("button", { name: "CSS feedback" });
    fireEvent.pointerOver(motion);
    fireEvent.pointerOver(css);
    expect(motion).toHaveAttribute("data-pimolu-animation", "motion");
    expect(css).not.toHaveAttribute("data-pimolu-animation");
    view.unmount();
    expect(motion.style.animation).toBe("");
    expect(motion).not.toHaveAttribute("data-pimolu-animation");
  });

  it("provides matching native ref and style targets on upgraded compound parts", () => {
    // Context-free parts exercise headings, separators, layout and data surfaces.
    const cases = [Motion.MotionCardTitle, Motion.MotionFormField, Motion.MotionBreadcrumbs, Motion.MotionNavbar, Motion.MotionTimeline, Motion.MotionToolbar];
    for (const Component of cases) {
      const ref = createRef<HTMLElement>();
      const view = render(createElement(Component as typeof Motion.MotionBox, { ref: ref as React.Ref<HTMLDivElement>, style: { opacity: 0.6 }, children: "Surface" }));
      expect(ref.current).not.toBeNull();
      expect(ref.current?.style.opacity).toBe("0.6");
      expect(ref.current?.className).toContain("pimolu-");
      view.unmount();
    }
  });

  it("rejects invalid global animation durations", () => {
    expect(() => Motion.createMotionEngine({ exitDuration: -1 })).toThrow(RangeError);
    expect(() => Motion.createMotionEngine({ enterDuration: Infinity })).toThrow(RangeError);
  });
});
