import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Example({ animated = true }: { animated?: boolean }) {
  return (
    <Accordion animated={animated} defaultValue="profile" collapsible>
      <AccordionItem value="profile">
        <AccordionTrigger>Profile</AccordionTrigger>
        <AccordionContent><input aria-label="Display name" /></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("Accordion motion", () => {
  it("removes closed controls from accessibility immediately while retaining a decorative exit", () => {
    vi.useFakeTimers();
    render(<Example />);
    const region = screen.getByRole("region", { name: "Profile" });
    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(region).toHaveAttribute("data-state", "closing");
    // `hidden` must be absent while the box animates; Tailwind Preflight
    // otherwise forces display:none !important and cancels the exit.
    expect(region).not.toHaveAttribute("hidden");
    expect(region).toHaveAttribute("aria-hidden", "true");
    expect(region).toHaveAttribute("inert");
    expect(screen.queryByRole("textbox", { name: "Display name" })).not.toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(220); });
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).toHaveAttribute("hidden");
  });

  it("cancels an interrupted exit without losing the input value or closing a reopened region", () => {
    vi.useFakeTimers();
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Display name" });
    fireEvent.change(input, { target: { value: "Ada" } });
    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.click(trigger);
    act(() => { vi.advanceTimersByTime(80); });
    fireEvent.click(trigger);
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByRole("textbox", { name: "Display name" })).toHaveValue("Ada");
    expect(screen.getByRole("region")).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("region")).not.toHaveAttribute("inert");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("disables exit presence when animated is false", () => {
    render(<Example animated={false} />);
    const region = screen.getByRole("region");
    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).not.toBeVisible();
  });

  it("skips the decorative exit when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<Example />);
    const region = screen.getByRole("region");
    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).not.toBeVisible();
  });
});
