
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("displays its text", () => {
    render(<Button>Continue</Button>);

    expect(
      screen.getByRole("button", { name: "Continue" })
    ).toBeInTheDocument();
  });

  it("applies the correct appearance", () => {
    render(<Button appearance="outline">Annuler</Button>);

    expect(
      screen.getByRole("button")
    ).toHaveClass("pimolu-button--outline");
  });

  it("applies the correct size", () => {
    render(<Button size="lg">Large button</Button>);

    expect(
      screen.getByRole("button")
    ).toHaveClass("pimolu-button--lg");
  });

  it("triggers onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("bloque les clics quand disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables the button during loading", () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    expect(
      button.querySelector(".pimolu-button__spinner")
    ).not.toBeNull();
  });

  it("affiche les icônes", () => {
    render(
      <Button
        startIcon={<span data-testid="start-icon">+</span>}
        endIcon={<span data-testid="end-icon">→</span>}
      >
        Added
      </Button>
    );

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });
    
  it.each(["xs", "sm", "md", "lg", "xl", "xxl"] as const)(
    "applies size %s",
    (size) => {
      render(<Button size={size}>Test</Button>);

      expect(screen.getByRole("button")).toHaveClass(
        `pimolu-button--${size}`
      );
    }
  );

  it("supports fullWidth", () => {
    render(<Button fullWidth>Continue</Button>);

    expect(screen.getByRole("button")).toHaveClass(
      "pimolu-button--full-width"
    );
  });

  it("supports iconOnly with an accessible name", () => {
    render(
      <Button
        iconOnly
        aria-label="Add"
        startIcon={<span>+</span>}
      />
    );

    expect(
      screen.getByRole("button", { name: "Add" })
    ).toHaveClass("pimolu-button--icon-only");
  });

  it("prioritizes iconOnly over fullWidth", () => {
    render(
      <Button iconOnly fullWidth aria-label="Ajouter">
        Ajouter
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button).toHaveClass("pimolu-button--icon-only");
    expect(button).not.toHaveClass("pimolu-button--full-width");
  });

  it("supports rounded variants", () => {
    render(<Button radius="full">Rounded</Button>);

    expect(screen.getByRole("button")).toHaveClass(
      "pimolu-button--radius-full"
    );
  });

it("combines semantic variant and appearance", () => {
  render(
    <Button variant="secondary" appearance="soft">
      Secondary Soft
    </Button>
  );

  const button = screen.getByRole("button");

  expect(button).toHaveClass("pimolu-button--secondary");
  expect(button).toHaveClass("pimolu-button--soft");
});


it("supports glass appearance", () => {
  render(
    <Button appearance="glass">
      Glass
    </Button>
  );

  expect(
    screen.getByRole("button", { name: "Glass" })
  ).toHaveClass("pimolu-button--glass");
});



});
