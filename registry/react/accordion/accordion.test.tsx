import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function Example(
  props: {
    animated?: boolean;
    collapsible?: boolean;
    variant?: "default" | "separated" | "ghost";
    onValueChange?: (value: string | undefined) => void;
  } = {}
) {
  return (
    <Accordion
      type="single"
      defaultValue="one"
      animated={props.animated}
      collapsible={props.collapsible}
      variant={props.variant}
      onValueChange={props.onValueChange}
    >
      <AccordionItem value="one">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First content</AccordionContent>
      </AccordionItem>

      <AccordionItem value="two">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second content</AccordionContent>
      </AccordionItem>

      <AccordionItem value="three" disabled>
        <AccordionTrigger>Third</AccordionTrigger>
        <AccordionContent>Third content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Pimolu Accordion", () => {
  it("opens one item and closes the previous one", () => {
    const onValueChange = vi.fn();

    render(<Example animated={false} onValueChange={onValueChange} />);

    const first = screen.getByRole("button", {
      name: "First",
    });

    const second = screen.getByRole("button", {
      name: "Second",
    });

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("First content")
    ).toBeVisible();

    fireEvent.click(second);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Second content")
    ).toBeVisible();
    expect(
      screen.getByText("First content")
    ).not.toBeVisible();
  });

  it("keeps the open item open when collapsible is false", () => {
    const onValueChange = vi.fn();

    render(<Example onValueChange={onValueChange} />);

    fireEvent.click(
      screen.getByRole("button", { name: "First" })
    );

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "First" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the open item when collapsible is true", () => {
    render(<Example animated={false} collapsible />);

    fireEvent.click(
      screen.getByRole("button", { name: "First" })
    );

    expect(
      screen.getByRole("button", { name: "First" })
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByText("First content")
    ).not.toBeVisible();
  });

  it("opens several items in multiple mode", () => {
    render(
      <Accordion type="multiple" defaultValue={["one"]}>
        <AccordionItem value="one">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First content</AccordionContent>
        </AccordionItem>

        <AccordionItem value="two">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Second" })
    );

    expect(
      screen.getByRole("button", { name: "First" })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Second" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("wires trigger and content ids", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "First",
    });

    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? ""
    );

    expect(panel).not.toBeNull();

    expect(trigger).toHaveAttribute(
      "aria-controls",
      panel?.id
    );

    expect(panel).toHaveAttribute(
      "aria-labelledby",
      trigger.id
    );
  });

  it("disables one item", () => {
    render(<Example />);

    expect(
      screen.getByRole("button", { name: "Third" })
    ).toBeDisabled();
  });

  it("moves focus with the arrow keys", () => {
    render(<Example />);

    const first = screen.getByRole("button", {
      name: "First",
    });

    const second = screen.getByRole("button", {
      name: "Second",
    });

    first.focus();

    fireEvent.keyDown(first, { key: "ArrowDown" });

    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: "ArrowUp" });

    expect(first).toHaveFocus();
  });

  it("applies the variant class", () => {
    render(<Example variant="separated" />);

    expect(
      screen.getByRole("button", { name: "First" })
        .parentElement?.parentElement
    ).toHaveClass(
      "pimolu-accordion",
      "pimolu-accordion--separated"
    );
  });
});
