import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group";

describe("Pimolu InputGroup", () => {
  it("groups an input with addons", () => {
    render(
      <InputGroup aria-label="Website">
        <InputGroupAddon align="inline-start">
          https://
        </InputGroupAddon>

        <InputGroupInput
          aria-label="Website address"
          defaultValue="pimolu.dev"
        />
      </InputGroup>
    );

    expect(
      screen.getByRole("group", { name: "Website" })
    ).toHaveClass(
      "pimolu-input-group",
      "pimolu-input-group--horizontal"
    );

    expect(
      screen.getByRole("textbox", {
        name: "Website address",
      })
    ).toHaveValue("pimolu.dev");

    expect(
      screen.getByText("https://")
    ).toHaveClass(
      "pimolu-input-group__addon--inline-start"
    );
  });

  it("supports addons on both edges", () => {
    render(
      <InputGroup aria-label="Price">
        <InputGroupAddon align="inline-start">
          $
        </InputGroupAddon>

        <InputGroupInput aria-label="Amount" />

        <InputGroupAddon align="inline-end">
          USD
        </InputGroupAddon>
      </InputGroup>
    );

    expect(screen.getByText("$")).toHaveClass(
      "pimolu-input-group__addon--inline-start"
    );

    expect(screen.getByText("USD")).toHaveClass(
      "pimolu-input-group__addon--inline-end"
    );
  });

  it("forwards native input props and typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();

    render(
      <InputGroup aria-label="Search">
        <InputGroupInput
          ref={ref}
          aria-label="Search query"
          name="query"
          type="search"
          placeholder="Search components"
          required
          onChange={onChange}
        />
      </InputGroup>
    );

    const input = screen.getByRole("searchbox", {
      name: "Search query",
    });

    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("name", "query");
    expect(input).toHaveAttribute("type", "search");
    expect(input).toBeRequired();

    await user.type(input, "button");

    expect(input).toHaveValue("button");
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("");

      return (
        <InputGroup aria-label="Email">
          <InputGroupInput
            aria-label="Email address"
            value={value}
            onChange={(event) =>
              setValue(event.currentTarget.value)
            }
          />
        </InputGroup>
      );
    }

    render(<Controlled />);

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    await user.type(input, "hi@pimolu.dev");

    expect(input).toHaveValue("hi@pimolu.dev");
  });

  it("renders text affixes", () => {
    render(
      <InputGroup aria-label="Amount">
        <InputGroupInput aria-label="Amount value" />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
    );

    expect(screen.getByText("USD")).toHaveClass(
      "pimolu-input-group__text"
    );
  });

  it("supports vertical, full width and size variants", () => {
    render(
      <InputGroup
        aria-label="Stacked"
        orientation="vertical"
        size="lg"
        fullWidth
      >
        <InputGroupAddon>Label</InputGroupAddon>
        <InputGroupInput aria-label="Stacked value" />
      </InputGroup>
    );

    const group = screen.getByRole("group", {
      name: "Stacked",
    });

    expect(group).toHaveClass(
      "pimolu-input-group--vertical",
      "pimolu-input-group--full-width",
      "pimolu-input--lg"
    );

    expect(group).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("propagates the disabled state to the input and buttons", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <InputGroup aria-label="Search" disabled>
        <InputGroupInput aria-label="Search query" />
        <InputGroupButton
          aria-label="Run search"
          onClick={onClick}
        >
          Go
        </InputGroupButton>
      </InputGroup>
    );

    const group = screen.getByRole("group", {
      name: "Search",
    });

    const input = screen.getByRole("textbox", {
      name: "Search query",
    });

    const button = screen.getByRole("button", {
      name: "Run search",
    });

    expect(group).toHaveAttribute(
      "data-disabled",
      "true"
    );
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks the input invalid with the group", () => {
    render(
      <InputGroup aria-label="Email" invalid>
        <InputGroupInput aria-label="Email address" />
      </InputGroup>
    );

    expect(
      screen.getByRole("group", { name: "Email" })
    ).toHaveAttribute("data-invalid", "true");

    expect(
      screen.getByRole("textbox", {
        name: "Email address",
      })
    ).toHaveAttribute("aria-invalid", "true");
  });

  it("does not submit a form from an InputGroupButton", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) =>
      event.preventDefault()
    );
    const onClick = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <InputGroup aria-label="Search">
          <InputGroupInput aria-label="Search query" />
          <InputGroupButton
            aria-label="Run search"
            onClick={onClick}
          >
            Go
          </InputGroupButton>
        </InputGroup>
      </form>
    );

    const button = screen.getByRole("button", {
      name: "Run search",
    });

    expect(button).toHaveAttribute("type", "button");

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
