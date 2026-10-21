import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../button/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "./button-group";

describe("Pimolu ButtonGroup", () => {
  it("groups its buttons with an accessible label", () => {
    render(
      <ButtonGroup aria-label="Text formatting">
        <Button>Bold</Button>
        <Button>Italic</Button>
      </ButtonGroup>
    );

    const group = screen.getByRole("group", {
      name: "Text formatting",
    });

    expect(group).toHaveClass(
      "pimolu-button-group",
      "pimolu-button-group--horizontal",
      "pimolu-button-group--attached"
    );

    expect(group).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("supports a vertical orientation", () => {
    render(
      <ButtonGroup
        orientation="vertical"
        aria-label="View"
      >
        <Button>List</Button>
        <Button>Grid</Button>
      </ButtonGroup>
    );

    const group = screen.getByRole("group", {
      name: "View",
    });

    expect(group).toHaveClass(
      "pimolu-button-group--vertical"
    );

    expect(group).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("can be detached", () => {
    render(
      <ButtonGroup attached={false} aria-label="Actions">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );

    const group = screen.getByRole("group", {
      name: "Actions",
    });

    expect(group).not.toHaveClass(
      "pimolu-button-group--attached"
    );

    expect(group).toHaveAttribute(
      "data-attached",
      "false"
    );
  });

  it("renders a separator perpendicular to the group", () => {
    render(
      <ButtonGroup aria-label="Clipboard">
        <Button>Cut</Button>
        <ButtonGroupSeparator />
        <Button>Paste</Button>
      </ButtonGroup>
    );

    const separator = screen.getByRole("separator");

    expect(separator).toHaveClass(
      "pimolu-button-group__separator",
      "pimolu-button-group__separator--vertical"
    );

    expect(separator).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("derives the separator direction in a vertical group", () => {
    render(
      <ButtonGroup
        orientation="vertical"
        aria-label="Clipboard"
      >
        <Button>Cut</Button>
        <ButtonGroupSeparator />
        <Button>Paste</Button>
      </ButtonGroup>
    );

    expect(
      screen.getByRole("separator")
    ).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("keeps the native buttons interactive", async () => {
    const user = userEvent.setup();
    const onBold = vi.fn();

    render(
      <ButtonGroup aria-label="Text formatting">
        <Button type="button" onClick={onBold}>
          Bold
        </Button>
      </ButtonGroup>
    );

    await user.click(
      screen.getByRole("button", { name: "Bold" })
    );

    expect(onBold).toHaveBeenCalledOnce();
  });

  it("merges a custom class name", () => {
    render(
      <ButtonGroup
        className="toolbar-group"
        aria-label="Actions"
      >
        <Button>One</Button>
      </ButtonGroup>
    );

    expect(
      screen.getByRole("group", { name: "Actions" })
    ).toHaveClass(
      "pimolu-button-group",
      "toolbar-group"
    );
  });
});
