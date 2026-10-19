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

import { Alert } from "./alert";

describe("Pimolu Alert", () => {
  it("renders a title, description and the info tone by default", () => {
    render(
      <Alert
        data-testid="alert"
        title="New version available"
        description="Reload the page to get the latest fixes."
      />
    );

    const alert = screen.getByTestId("alert");

    expect(alert).toHaveClass(
      "pimolu-alert",
      "pimolu-alert--info"
    );

    expect(alert).toHaveAttribute("role", "status");
    expect(alert).toHaveTextContent("New version available");
    expect(alert).toHaveTextContent(
      "Reload the page to get the latest fixes."
    );
  });

  it("uses role=alert for danger and supports an explicit role", () => {
    const { rerender } = render(
      <Alert
        data-testid="alert"
        variant="danger"
        title="Payment failed"
      />
    );

    expect(screen.getByTestId("alert")).toHaveAttribute(
      "role",
      "alert"
    );
    expect(screen.getByTestId("alert")).toHaveClass(
      "pimolu-alert--danger"
    );

    rerender(
      <Alert
        data-testid="alert"
        variant="success"
        role="note"
        title="Saved"
      />
    );

    expect(screen.getByTestId("alert")).toHaveAttribute(
      "role",
      "note"
    );
  });

  it("renders a decorative icon, body content and actions", () => {
    render(
      <Alert
        title="Action required"
        icon={<svg data-testid="icon" />}
        actions={<button type="button">Review</button>}
      >
        <p>Confirm the billing details.</p>
      </Alert>
    );

    const icon = screen.getByTestId("icon");

    expect(icon.parentElement).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      screen.getByText("Confirm the billing details.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Review" })
    ).toBeInTheDocument();
  });

  it("dismisses through an accessibly named button", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    const { rerender } = render(
      <Alert
        title="Session expires soon"
        onDismiss={onDismiss}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Dismiss alert",
      })
    );

    expect(onDismiss).toHaveBeenCalledOnce();

    rerender(
      <Alert
        title="Session expires soon"
        onDismiss={onDismiss}
        dismissLabel="Close the warning"
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Close the warning",
      })
    ).toBeInTheDocument();
  });

  it("does not render a close button without onDismiss", () => {
    render(<Alert title="Saved" />);

    expect(
      screen.queryByRole("button")
    ).toBeNull();
  });

  it("forwards its ref and merges custom classes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert
        ref={ref}
        className="custom-alert"
        aria-label="Account notice"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveClass(
      "pimolu-alert",
      "custom-alert"
    );
    expect(ref.current).toHaveAttribute(
      "aria-label",
      "Account notice"
    );
  });
});
