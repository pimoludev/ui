import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/button";
import { Input } from "../input/input";

import { Form, FormError, FormSubmit, useForm } from "./form";

interface EmailValues {
  email: string;
}

function EmailForm({
  onSubmit,
}: {
  onSubmit: (
    values: EmailValues
  ) => void | Promise<void>;
}) {
  const form = useForm<EmailValues>({
    defaultValues: { email: "" },

    validate: (values) =>
      values.email.trim()
        ? undefined
        : { email: "Email is required." },

    onSubmit,
  });

  return (
    <Form form={form}>
      <Input
        label="Email"
        type="email"
        {...form.register("email")}
      />

      <FormError name="email" />

      <FormSubmit>Save</FormSubmit>
    </Form>
  );
}

describe("Pimolu Form", () => {
  it("FormSubmit inherits a custom loading indicator and follows the pending submission", async () => {
    let finish: () => void = () => undefined;
    const pending = new Promise<void>((resolve) => { finish = resolve; });
    const onSubmit = vi.fn(() => pending);
    function CustomSubmitForm() {
      const form = useForm({ defaultValues: { name: "Ada" }, onSubmit });
      return <Form form={form}><FormSubmit
        loadingIndicator={<span data-testid="submit-loader">Working</span>}
        classNames={{ spinner: "custom-submit-spinner" }}
      >Save</FormSubmit></Form>;
    }
    render(<CustomSubmitForm />);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "submit");
    expect(screen.queryByTestId("submit-loader")).toBeNull();
    const user = userEvent.setup();
    await user.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("submit-loader").parentElement).toHaveClass("custom-submit-spinner");
    expect(screen.getByTestId("submit-loader").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector(".pimolu-button__spinner")).toBeNull();
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada" });
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => { finish(); });
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.queryByTestId("submit-loader")).toBeNull();
  });

  it("blocks submit and announces the error when invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<EmailForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: "Save" })
    );

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("Email is required.");
    expect(onSubmit).not.toHaveBeenCalled();

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      alert.id
    );
  });

  it("submits the current values once the form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<EmailForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "ada@example.com"
    );

    await user.click(
      screen.getByRole("button", { name: "Save" })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      email: "ada@example.com",
    });
  });

  it("clears a field error as soon as its value changes", async () => {
    const user = userEvent.setup();

    render(<EmailForm onSubmit={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Save" })
    );

    expect(
      await screen.findByRole("alert")
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "a"
    );

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });

    expect(
      screen.getByRole("textbox", { name: "Email" })
    ).not.toHaveAttribute("aria-invalid");
  });

  it("resets values and errors", async () => {
    const user = userEvent.setup();

    function ProfileForm() {
      const form = useForm<EmailValues>({
        defaultValues: { email: "ada@example.com" },

        validate: (values) =>
          values.email.trim()
            ? undefined
            : { email: "Email is required." },
      });

      return (
        <Form form={form}>
          <Input
            label="Email"
            {...form.register("email")}
          />

          <FormError name="email" />

          <Button
            type="button"
            onClick={() => form.reset()}
          >
            Reset
          </Button>

          <FormSubmit>Save</FormSubmit>
        </Form>
      );
    }

    render(<ProfileForm />);

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    await user.clear(input);
    await user.click(
      screen.getByRole("button", { name: "Save" })
    );

    await screen.findByRole("alert");

    await user.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(input).toHaveValue("ada@example.com");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("exposes the pending state during an async submit", async () => {
    const user = userEvent.setup();

    let resolveSubmit: () => void = () => {};

    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<EmailForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "ada@example.com"
    );

    const save = screen.getByRole("button", {
      name: "Save",
    });

    await user.click(save);

    await waitFor(() => {
      expect(save).toBeDisabled();
    });

    expect(save).toHaveAttribute("aria-busy", "true");

    resolveSubmit();

    await waitFor(() => {
      expect(save).not.toBeDisabled();
    });
  });

  it("updates registered controls through setValue and setValues", async () => {
    const user = userEvent.setup();

    function SettingsForm() {
      const form = useForm({
        defaultValues: {
          email: "",
          name: "",
        },
      });

      return (
        <Form form={form}>
          <Input
            label="Email"
            {...form.register("email")}
          />

          <Input
            label="Name"
            {...form.register("name")}
          />

          <Button
            type="button"
            onClick={() =>
              form.setValue("email", "grace@example.com")
            }
          >
            Set email
          </Button>

          <Button
            type="button"
            onClick={() =>
              form.setValues({
                email: "linus@example.com",
                name: "Linus",
              })
            }
          >
            Set both
          </Button>
        </Form>
      );
    }

    render(<SettingsForm />);

    await user.click(
      screen.getByRole("button", { name: "Set email" })
    );

    expect(
      screen.getByRole("textbox", { name: "Email" })
    ).toHaveValue("grace@example.com");

    await user.click(
      screen.getByRole("button", { name: "Set both" })
    );

    expect(
      screen.getByRole("textbox", { name: "Email" })
    ).toHaveValue("linus@example.com");

    expect(
      screen.getByRole("textbox", { name: "Name" })
    ).toHaveValue("Linus");
  });

  it("supports setError and clearErrors programmatically", async () => {
    const user = userEvent.setup();

    function ModerationForm() {
      const form = useForm({
        defaultValues: { email: "ada@example.com" },
      });

      return (
        <Form form={form}>
          <Input
            label="Email"
            {...form.register("email")}
          />

          <FormError name="email" />

          <Button
            type="button"
            onClick={() =>
              form.setError(
                "email",
                "This address is already in use."
              )
            }
          >
            Mark taken
          </Button>

          <Button
            type="button"
            onClick={() => form.clearErrors()}
          >
            Clear
          </Button>
        </Form>
      );
    }

    render(<ModerationForm />);

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    await user.click(
      screen.getByRole("button", { name: "Mark taken" })
    );

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent(
      "This address is already in use."
    );

    expect(input).toHaveAttribute("aria-invalid", "true");

    await user.click(
      screen.getByRole("button", { name: "Clear" })
    );

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });

    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("renders a native form with validation disabled by default", () => {
    function SimpleForm() {
      const form = useForm({
        defaultValues: { email: "" },
      });

      return (
        <Form form={form} aria-label="Contact">
          <Input
            label="Email"
            {...form.register("email")}
          />
        </Form>
      );
    }

    const { container } = render(<SimpleForm />);

    const formElement = container.querySelector("form");

    expect(formElement).not.toBeNull();
    expect(formElement).toHaveAttribute("novalidate");
    expect(formElement).toHaveClass("pimolu-form");
    expect(formElement).toHaveAttribute(
      "aria-label",
      "Contact"
    );
  });
});
