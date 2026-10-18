
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Pimolu Input", () => {
  it("associates the label with the input", () => {
    render(
      <Input label="Email" placeholder="you@example.com" />
    );

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    expect(input).toHaveAttribute(
      "placeholder",
      "you@example.com"
    );
  });

  it("supports native HTML attributes", () => {
    render(
      <Input
        label="Password"
        type="password"
        name="password"
        required
      />
    );

    const input = screen.getByLabelText(/^Password\s*\*?$/);

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toBeRequired();
  });

  it("accepts uncontrolled user input", async () => {
    const user = userEvent.setup();

    render(<Input label="Username" />);

    const input = screen.getByRole("textbox", {
      name: "Username",
    });

    await user.type(input, "pimolu");

    expect(input).toHaveValue("pimolu");
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();

    function ControlledInput() {
      const [value, setValue] = useState("");

      return (
        <Input
          label="Username"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      );
    }

    render(<ControlledInput />);

    const input = screen.getByLabelText("Username");

    await user.type(input, "hello");

    expect(input).toHaveValue("hello");
  });

  it("associates helper text with the input", () => {
    render(
      <Input
        label="Email"
        helperText="We never share your email."
      />
    );

    const input = screen.getByLabelText("Email");
    const helper = screen.getByText(
      "We never share your email."
    );

    expect(input).toHaveAttribute(
      "aria-describedby",
      helper.id
    );

    expect(helper).not.toHaveAttribute("role", "alert");
  });

  it("preserves custom aria-describedby", () => {
    render(
      <Input
        label="Email"
        aria-describedby="external-help"
        helperText="Local help"
      />
    );

    const input = screen.getByLabelText("Email");
    const helper = screen.getByText("Local help");

    const ids = (
      input.getAttribute("aria-describedby") ?? ""
    ).split(" ");

    expect(ids).toContain("external-help");
    expect(ids).toContain(helper.id);
  });

  it("connects error messages to the input", () => {
    render(
      <Input
        label="Email"
        errorMessage="Invalid email address"
      />
    );

    const input = screen.getByLabelText("Email");
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(input).toHaveAttribute(
      "aria-describedby",
      error.id
    );

    expect(error).toHaveTextContent(
      "Invalid email address"
    );
  });

  it("does not announce helper text as an error", () => {
    render(
      <Input
        label="Email"
        invalid
        helperText="Enter a valid email address."
      />
    );

    expect(
      screen.getByLabelText("Email")
    ).toHaveAttribute("aria-invalid", "true");

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("supports disabled and readOnly states", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Input label="Disabled" disabled />
        <Input
          label="Read only"
          readOnly
          defaultValue="pimolu"
        />
      </>
    );

    const disabled = screen.getByLabelText("Disabled");
    const readonly = screen.getByLabelText("Read only");

    expect(disabled).toBeDisabled();
    expect(readonly).toHaveAttribute("readonly");

    await user.type(readonly, "123");

    expect(readonly).toHaveValue("pimolu");
  });

  it("forwards the input ref", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input label="Email" ref={ref} />);

    ref.current?.focus();

    expect(document.activeElement).toBe(ref.current);
  });

  it("applies size, appearance and variant classes", () => {
    render(
      <Input
        label="Search"
        size="lg"
        appearance="soft"
        variant="primary"
        fullWidth
      />
    );

    const input = screen.getByLabelText("Search");
    const container = input.closest(".pimolu-input");

    expect(container).toHaveClass(
      "pimolu-input--lg",
      "pimolu-input--soft",
      "pimolu-input--primary",
      "pimolu-input--full-width"
    );
  });

    
  it("clears an uncontrolled input", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Input
        label="Email"
        defaultValue="hello@pimolu.com"
        clearable
        onClear={onClear}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Clear Email",
      })
    );

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();

    expect(onClear).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("");

    expect(
      screen.queryByRole("button", {
        name: "Clear Email",
      })
    ).toBeNull();
  });

  it("clears a controlled input", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("pimolu");

      return (
        <Input
          label="Username"
          value={value}
          onValueChange={setValue}
          clearable
        />
      );
    }

    render(<Controlled />);

    await user.click(
      screen.getByRole("button", {
        name: "Clear Username",
      })
    );

    expect(
      screen.getByRole("textbox", {
        name: "Username",
      })
    ).toHaveValue("");
  });

  it("supports keyboard clearing", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Search"
        defaultValue="components"
        clearable
      />
    );

    const button = screen.getByRole("button", {
      name: "Clear Search",
    });

    button.focus();

    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("textbox", {
        name: "Search",
      })
    ).toHaveValue("");
  });

  it("hides clear action when unavailable", () => {
    render(
      <>
        <Input label="Disabled" defaultValue="A" disabled clearable />
        <Input label="Readonly" defaultValue="B" readOnly clearable />
        <Input label="Number" type="number" defaultValue="12" clearable />
      </>
    );

    expect(
      screen.queryByRole("button", {
        name: /Clear/,
      })
    ).toBeNull();
  });

    
  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Password"
        type="password"
        defaultValue="Pimolu123!"
        passwordToggle
      />
    );

    const input = screen.getByLabelText("Password");

    expect(input).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", {
        name: "Show password",
      })
    );

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("Pimolu123!");
    expect(input).toHaveFocus();

    await user.click(
      screen.getByRole("button", {
        name: "Hide password",
      })
    );

    expect(input).toHaveAttribute("type", "password");
  });

  it("does not change the value when toggling visibility", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Input
        label="Password"
        type="password"
        defaultValue="Secret123"
        passwordToggle
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Show password",
      })
    );

    expect(
      screen.getByLabelText("Password")
    ).toHaveValue("Secret123");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports clearable and password toggle together", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Password"
        type="password"
        defaultValue="Secret123"
        clearable
        passwordToggle
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Clear Password",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Show password",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Clear Password",
      })
    );

    expect(
      screen.getByLabelText("Password")
    ).toHaveValue("");

    expect(
      screen.queryByRole("button", {
        name: "Clear Password",
      })
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Show password",
      })
    ).toBeInTheDocument();
  });

  it("does not show visibility control for other types", () => {
    render(
      <>
        <Input label="Email" type="email" passwordToggle />
        <Input
          label="Disabled password"
          type="password"
          passwordToggle
          disabled
        />
      </>
    );

    expect(
      screen.queryByRole("button", {
        name: "Show password",
      })
    ).toBeNull();
  });

  it("supports keyboard password visibility toggle", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Password"
        type="password"
        passwordToggle
      />
    );

    const toggle = screen.getByRole("button", {
      name: "Show password",
    });

    toggle.focus();

    await user.keyboard("{Enter}");

    expect(
      screen.getByLabelText("Password")
    ).toHaveAttribute("type", "text");
  });

  
  it("supports start and end actions with keyboard", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const onEnd = vi.fn();

    render(
      <Input
        label="Search"
        startAction={{
          icon: <span>⚙</span>,
          label: "Search options",
          onClick: onStart,
        }}
        endAction={{
          icon: <span>→</span>,
          label: "Run search",
          onClick: onEnd,
        }}
      />
    );

    const start = screen.getByRole("button", {
      name: "Search options",
    });

    const end = screen.getByRole("button", {
      name: "Run search",
    });

    await user.tab();
    expect(start).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onStart).toHaveBeenCalledOnce();

    await user.tab();
    expect(screen.getByRole("textbox", {
      name: "Search",
    })).toHaveFocus();

    await user.tab();
    expect(end).toHaveFocus();

    await user.keyboard(" ");
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it("does not submit a form when an action is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const onAction = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <Input
          label="Search"
          endAction={{
            icon: <span>→</span>,
            label: "Open options",
            onClick: onAction,
          }}
        />
      </form>
    );

    await user.click(
      screen.getByRole("button", {
        name: "Open options",
      })
    );

    expect(onAction).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables custom actions with the input", () => {
    render(
      <Input
        label="Disabled search"
        disabled
        endAction={{
          icon: <span>→</span>,
          label: "Run search",
          onClick: vi.fn(),
        }}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Run search",
      })
    ).toBeDisabled();
  });

  it("supports custom actions with clearable", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <Input
        label="Search"
        defaultValue="Pimolu"
        clearable
        endAction={{
          icon: <span>→</span>,
          label: "Run search",
          onClick: onAction,
        }}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Clear Search",
      })
    );

    expect(screen.getByLabelText("Search")).toHaveValue("");

    await user.click(
      screen.getByRole("button", {
        name: "Run search",
      })
    );

    expect(onAction).toHaveBeenCalledOnce();
  });



});
