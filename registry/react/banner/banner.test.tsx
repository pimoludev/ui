import { createRef } from "react";

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

import { Banner } from "./banner";

describe("Pimolu Banner", () => {
  it("renders a page-level info message by default", () => {
    render(
      <Banner
        data-testid="banner"
        title="Scheduled maintenance"
        description="The service is read-only on Sunday."
      />
    );

    const banner = screen.getByTestId("banner");

    expect(banner).toHaveClass(
      "pimolu-banner",
      "pimolu-banner--info"
    );

    expect(banner).toHaveAttribute("role", "status");
    expect(banner).toHaveTextContent("Scheduled maintenance");
    expect(banner).toHaveTextContent(
      "The service is read-only on Sunday."
    );
  });

  it("uses the danger tone and role=alert", () => {
    render(
      <Banner
        data-testid="banner"
        variant="danger"
        title="Service unavailable"
      />
    );

    expect(screen.getByTestId("banner")).toHaveClass(
      "pimolu-banner--danger"
    );

    expect(screen.getByTestId("banner")).toHaveAttribute(
      "role",
      "alert"
    );
  });

  it("shows an accessible close button when onDismiss is provided", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Banner
        title="Trial ends soon"
        onDismiss={onDismiss}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Dismiss banner",
      })
    );

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("supports a custom label and an explicit dismissible=false", () => {
    const { rerender } = render(
      <Banner
        title="Trial ends soon"
        dismissLabel="Close the trial notice"
        onDismiss={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Close the trial notice",
      })
    ).toBeInTheDocument();

    rerender(
      <Banner
        title="Trial ends soon"
        dismissible={false}
        onDismiss={() => {}}
      />
    );

    expect(
      screen.queryByRole("button")
    ).toBeNull();
  });

  it("renders icons, actions and the sticky modifier", () => {
    render(
      <Banner
        data-testid="banner"
        title="Verify your email"
        icon={<svg data-testid="icon" />}
        actions={<button type="button">Resend</button>}
        sticky
      />
    );

    const banner = screen.getByTestId("banner");

    expect(banner).toHaveClass("pimolu-banner--sticky");
    expect(banner).toHaveAttribute("data-sticky", "true");

    expect(
      screen.getByTestId("icon").parentElement
    ).toHaveAttribute("aria-hidden", "true");

    expect(
      screen.getByRole("button", { name: "Resend" })
    ).toBeInTheDocument();
  });

  it("forwards its ref and accepts native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Banner
        ref={ref}
        id="account-banner"
        className="custom-banner"
        title="Account notice"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveAttribute(
      "id",
      "account-banner"
    );
    expect(ref.current).toHaveClass(
      "pimolu-banner",
      "custom-banner"
    );
  });
});
