
import { createRef, useState } from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Textarea } from "./textarea";

describe("Pimolu Textarea", () => {
  it("renders with default properties", () => {
    render(<Textarea label="Description" />);

    const field = screen.getByRole("textbox", {
      name: "Description",
    });

    expect(field).toHaveAttribute("rows", "4");

    expect(
      field.closest(".pimolu-textarea")
    ).toHaveClass(
      "pimolu-textarea--md",
      "pimolu-textarea--neutral",
      "pimolu-textarea--outline",
      "pimolu-textarea--resize-vertical"
    );
  });

  it("supports uncontrolled typing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onChange = vi.fn();

    render(
      <Textarea
        label="Message"
        defaultValue="Hello"
        onChange={onChange}
        onValueChange={onValueChange}
      />
    );

    const field = screen.getByRole("textbox", {
      name: "Message",
    });

    await user.type(field, " World");

    expect(field).toHaveValue("Hello World");

    expect(onValueChange).toHaveBeenLastCalledWith(
      "Hello World"
    );

    expect(onChange).toHaveBeenCalled();
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useState("Initial");

      return (
        <Textarea
          label="Controlled message"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Example />);

    const field = screen.getByRole("textbox", {
      name: "Controlled message",
    });

    await user.type(field, "!");

    expect(field).toHaveValue("Initial!");
  });

  it("connects helper text", () => {
    render(
      <Textarea
        label="Biography"
        helperText="Write a short biography."
      />
    );

    expect(
      screen.getByRole("textbox", {
        name: "Biography",
      })
    ).toHaveAccessibleDescription(
      "Write a short biography."
    );
  });

  it("shows error instead of helper text", () => {
    render(
      <Textarea
        label="Message"
        helperText="Write your message."
        errorMessage="Message is required."
      />
    );

    const field = screen.getByRole("textbox", {
      name: "Message",
    });

    expect(field).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Message is required.");

    expect(
      screen.queryByText("Write your message.")
    ).toBeNull();
  });

  it("supports invalid without an error message", () => {
    render(
      <Textarea
        label="Description"
        invalid
      />
    );

    expect(
      screen.getByRole("textbox", {
        name: "Description",
      })
    ).toHaveAttribute("aria-invalid", "true");

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows the character counter", async () => {
    const user = userEvent.setup();

    render(
      <Textarea
        label="Message"
        showCount
        maxLength={20}
      />
    );

    const field = screen.getByRole("textbox", {
      name: "Message",
    });

    expect(screen.getByText("0/20")).toBeInTheDocument();

    await user.type(field, "Pimolu");

    expect(screen.getByText("6/20")).toBeInTheDocument();
  });

  it("supports counting without maxLength", async () => {
    const user = userEvent.setup();

    render(
      <Textarea label="Notes" showCount />
    );

    await user.type(
      screen.getByRole("textbox", { name: "Notes" }),
      "Hello"
    );

    expect(
      screen.getByText("5")
    ).toBeInTheDocument();
  });

  it("respects native maxLength", async () => {
    const user = userEvent.setup();

    render(
      <Textarea
        label="Short message"
        maxLength={5}
        showCount
      />
    );

    const field = screen.getByRole("textbox", {
      name: "Short message",
    });

    await user.type(field, "HelloWorld");

    expect(field).toHaveValue("Hello");
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("restores its counter on native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Textarea
          label="Message"
          name="message"
          defaultValue="Pimolu"
          maxLength={20}
          showCount
        />

        <button type="reset">Reset</button>
      </form>
    );

    const field = screen.getByRole("textbox", {
      name: "Message",
    });

    await user.type(field, " UI");

    expect(screen.getByText("9/20")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(field).toHaveValue("Pimolu");
    expect(screen.getByText("6/20")).toBeInTheDocument();
  });

  it("preserves external accessible descriptions", () => {
    render(
      <>
        <p id="external-hint">External hint.</p>

        <Textarea
          label="Notes"
          defaultValue="Hi"
          helperText="Additional details."
          maxLength={12}
          showCount
          aria-describedby="external-hint"
        />
      </>
    );

    expect(
      screen.getByRole("textbox", {
        name: "Notes",
      })
    ).toHaveAccessibleDescription(
      "External hint. Additional details. 2/12"
    );
  });

  it("supports disabled and readOnly", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Textarea
          label="Disabled field"
          disabled
        />

        <Textarea
          label="Read only field"
          readOnly
          defaultValue="Original"
        />
      </>
    );

    expect(
      screen.getByRole("textbox", {
        name: "Disabled field",
      })
    ).toBeDisabled();

    const readOnlyField = screen.getByRole("textbox", {
      name: "Read only field",
    });

    expect(readOnlyField).toHaveAttribute("readonly");

    await user.type(readOnlyField, "Changed");

    expect(readOnlyField).toHaveValue("Original");
  });

  it("supports native FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Contact">
        <Textarea
          label="Message"
          name="message"
          required
        />
      </form>
    );

    const field = screen.getByRole("textbox", {
      name: "Message",
    }) as HTMLTextAreaElement;

    expect(field.checkValidity()).toBe(false);

    await user.type(field, "Hello Pimolu!");

    expect(field.checkValidity()).toBe(true);

    const form = screen.getByRole("form", {
      name: "Contact",
    }) as HTMLFormElement;

    expect(
      new FormData(form).get("message")
    ).toBe("Hello Pimolu!");
  });

  it("supports appearance, size and resize", () => {
    render(
      <Textarea
        data-testid="textarea"
        size="xl"
        variant="success"
        appearance="glass"
        resize="none"
        fullWidth
        containerClassName="custom-wrapper"
      />
    );

    expect(
      screen.getByTestId("textarea")
        .closest(".pimolu-textarea")
    ).toHaveClass(
      "pimolu-textarea--xl",
      "pimolu-textarea--success",
      "pimolu-textarea--glass",
      "pimolu-textarea--resize-none",
      "pimolu-textarea--full-width",
      "custom-wrapper"
    );
  });

  it("forwards its ref to the native textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea ref={ref} label="Notes" />
    );

    expect(ref.current?.tagName).toBe("TEXTAREA");
    expect(ref.current).toHaveClass(
      "pimolu-textarea__control"
    );
  });

  it("supports an accessible name without visible label", () => {
    render(
      <Textarea
        aria-label="Internal notes"
        placeholder="Write here..."
      />
    );

    expect(
      screen.getByRole("textbox", {
        name: "Internal notes",
      })
    ).toBeInTheDocument();
  });
});
