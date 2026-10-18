
import { describe, expect, it, vi } from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Pimolu Input — Native Forms", () => {
  it("submits its value through FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Registration">
        <Input
          label="Email"
          name="email"
          type="email"
          required
        />
      </form>
    );

    const input = screen.getByRole("textbox", {
      name: "Email",
    }) as HTMLInputElement;

    expect(input.checkValidity()).toBe(false);

    await user.type(input, "hello@pimolu.com");

    expect(input.checkValidity()).toBe(true);

    const form = screen.getByRole("form", {
      name: "Registration",
    }) as HTMLFormElement;

    const data = new FormData(form);

    expect(data.get("email")).toBe(
      "hello@pimolu.com"
    );
  });

  it("restores the native default value on reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Input
          label="Username"
          name="username"
          defaultValue="pimolu"
          clearable
        />

        <button type="reset">Reset</button>
      </form>
    );

    const input = screen.getByRole("textbox", {
      name: "Username",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Clear Username",
      })
    );

    expect(input).toHaveValue("");

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(input).toHaveValue("pimolu");

    expect(
      screen.getByRole("button", {
        name: "Clear Username",
      })
    ).toBeInTheDocument();
  });

  it("does not submit when input actions are clicked", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    const onAction = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <Input
          label="Search"
          defaultValue="Pimolu"
          clearable
          endAction={{
            icon: <span>→</span>,
            label: "Search options",
            onClick: onAction,
          }}
        />
      </form>
    );

    await user.click(
      screen.getByRole("button", {
        name: "Search options",
      })
    );

    expect(onAction).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", {
        name: "Clear Search",
      })
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("excludes disabled fields from FormData", () => {
    render(
      <form aria-label="Account">
        <Input
          label="Enabled"
          name="enabled"
          defaultValue="yes"
        />

        <Input
          label="Disabled"
          name="disabled"
          defaultValue="no"
          disabled
        />

        <Input
          label="Readonly"
          name="readonly"
          defaultValue="visible"
          readOnly
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Account",
    }) as HTMLFormElement;

    const data = new FormData(form);

    expect(data.get("enabled")).toBe("yes");
    expect(data.has("disabled")).toBe(false);
    expect(data.get("readonly")).toBe("visible");
  });

  it("supports an accessible name without a visible label", () => {
    render(
      <Input
        aria-label="Search components"
        placeholder="Search..."
      />
    );

    expect(
      screen.getByRole("textbox", {
        name: "Search components",
      })
    ).toBeInTheDocument();
  });
});
