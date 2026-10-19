import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Fieldset,
  FormControl,
  FormField,
  FormGroup,
  FormMessage,
} from "./form-field";

describe("Pimolu FormField", () => {
  it("ties the label, control and helper together", () => {
    render(
      <FormField
        label="Email"
        helperText="We never share it."
        required
      >
        <FormControl>
          <input type="email" />
        </FormControl>
      </FormField>
    );

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute(
      "aria-describedby",
      screen.getByText("We never share it.").id
    );

    expect(
      screen.getByText("We never share it.")
    ).toHaveClass(
      "pimolu-form-message--helper"
    );
  });

  it("turns the error into an alert and marks the control invalid", () => {
    render(
      <FormField
        label="Email"
        errorMessage="Enter a valid email."
      >
        <FormControl>
          <input type="email" />
        </FormControl>
      </FormField>
    );

    const input = screen.getByRole("textbox", {
      name: "Email",
    });

    expect(input).toHaveAttribute("aria-invalid", "true");

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent(
      "Enter a valid email."
    );

    expect(error).toHaveClass(
      "pimolu-form-message--error"
    );

    expect(input).toHaveAttribute(
      "aria-describedby",
      error.id
    );
  });

  it("keeps an existing aria-describedby", () => {
    render(
      <>
        <p id="external-hint">External hint</p>

        <FormField
          label="Name"
          helperText="Local hint"
        >
          <FormControl>
            <input aria-describedby="external-hint" />
          </FormControl>
        </FormField>
      </>
    );

    const input = screen.getByRole("textbox", {
      name: "Name",
    });

    const describedBy =
      input.getAttribute("aria-describedby") ?? "";

    expect(describedBy).toContain("external-hint");
    expect(describedBy).toContain(
      screen.getByText("Local hint").id
    );
  });

  it("passes the explicit id and disabled state to the control", () => {
    render(
      <FormField
        label="Name"
        id="profile-name"
        disabled
      >
        <FormControl>
          <input />
        </FormControl>
      </FormField>
    );

    const input = screen.getByRole("textbox", {
      name: "Name",
    });

    expect(input).toHaveAttribute("id", "profile-name");
    expect(input).toBeDisabled();
    expect(input).not.toHaveAttribute(
      "aria-describedby"
    );
  });

  it("marks an optional field", () => {
    render(
      <FormField
        label="Phone"
        optional
        optionalLabel="Facultatif"
      >
        <FormControl>
          <input />
        </FormControl>
      </FormField>
    );

    expect(
      screen.getByText("Phone", { exact: false })
    ).toHaveTextContent("PhoneFacultatif");
  });

  it("renders a standalone message", () => {
    render(
      <FormMessage variant="error">
        Something went wrong.
      </FormMessage>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Something went wrong."
    );
  });

  it("groups fields with a name and orientation", () => {
    render(
      <FormGroup
        label="Contact"
        description="How we reach you."
        orientation="horizontal"
      >
        <FormField label="Email">
          <FormControl>
            <input type="email" />
          </FormControl>
        </FormField>
      </FormGroup>
    );

    const group = screen.getByRole("group", {
      name: "Contact",
    });

    expect(group).toHaveClass(
      "pimolu-form-group--horizontal"
    );

    expect(
      screen.getByText("How we reach you.")
    ).toBeInTheDocument();
  });

  it("renders a native fieldset with its legend and description", () => {
    render(
      <Fieldset
        legend="Notifications"
        description="Choose what we send."
        disabled
      >
        <FormField label="Email">
          <FormControl>
            <input type="email" />
          </FormControl>
        </FormField>
      </Fieldset>
    );

    const group = screen.getByRole("group", {
      name: "Notifications",
    });

    expect(group.tagName).toBe("FIELDSET");
    expect(group).toBeDisabled();
    expect(group).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Choose what we send.").id
    );

    expect(
      screen.getByRole("textbox", { name: "Email" })
    ).toBeDisabled();
  });
});
