
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

  it("replaces the loading visual without changing the button name or busy state", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button loading loadingIndicator={<svg data-testid="custom-loader" />} classNames={{ spinner: "my-loader" }} onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    const loader = screen.getByTestId("custom-loader");
    expect(loader.parentElement).toHaveClass("my-loader");
    expect(loader.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector(".pimolu-button__spinner")).toBeNull();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toHaveAttribute("loadingIndicator");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("only renders the custom indicator while loading and restores the default when omitted", () => {
    const indicator = <span data-testid="custom-loader">Please wait</span>;
    const { rerender } = render(<Button loadingIndicator={indicator} startIcon={<span data-testid="start">+</span>}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(screen.queryByTestId("custom-loader")).toBeNull();
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(button).toBeEnabled();
    rerender(<Button loading loadingIndicator={indicator}>Save</Button>);
    expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    expect(screen.queryByTestId("start")).toBeNull();
    rerender(<Button loading>Save</Button>);
    expect(screen.queryByTestId("custom-loader")).toBeNull();
    expect(button.querySelector(".pimolu-button__spinner")).not.toBeNull();
  });

  it.each([null, false])("allows hiding the loading visual with %s while keeping submission blocked", (loadingIndicator) => {
    render(<Button loading loadingIndicator={loadingIndicator}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".pimolu-button__spinner, .pimolu-button__loading-indicator")).toBeNull();
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
