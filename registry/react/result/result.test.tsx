import { createRef } from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { Result } from "./result";

describe("Pimolu Result", () => {
  it("renders a centered info result by default", () => {
    render(
      <Result
        data-testid="result"
        title="All caught up"
        description="You have read every notification."
      />
    );

    const result = screen.getByTestId("result");

    expect(result).toHaveClass(
      "pimolu-result",
      "pimolu-result--info"
    );

    expect(result).toHaveAttribute("role", "status");
    expect(result).toHaveAttribute("data-status", "info");
    expect(result).toHaveTextContent("All caught up");
    expect(result).toHaveTextContent(
      "You have read every notification."
    );
  });

  it("uses role=alert for errors", () => {
    render(
      <Result
        data-testid="result"
        status="error"
        title="Payment declined"
      />
    );

    const result = screen.getByTestId("result");

    expect(result).toHaveClass("pimolu-result--error");
    expect(result).toHaveAttribute("role", "alert");
  });

  it("supports every semantic status", () => {
    const { rerender } = render(
      <Result
        data-testid="result"
        status="success"
        title="Saved"
      />
    );

    expect(screen.getByTestId("result")).toHaveClass(
      "pimolu-result--success"
    );
    expect(screen.getByTestId("result")).toHaveAttribute(
      "role",
      "status"
    );

    rerender(
      <Result
        data-testid="result"
        status="warning"
        title="Check your plan"
      />
    );

    expect(screen.getByTestId("result")).toHaveClass(
      "pimolu-result--warning"
    );
    expect(screen.getByTestId("result")).toHaveAttribute(
      "role",
      "status"
    );
  });

  it("renders a decorative icon and actions", () => {
    render(
      <Result
        status="success"
        title="Deployment complete"
        icon={<svg data-testid="icon" />}
        actions={
          <>
            <button type="button">Open site</button>
            <button type="button">View logs</button>
          </>
        }
      />
    );

    expect(
      screen.getByTestId("icon").parentElement
    ).toHaveAttribute("aria-hidden", "true");

    expect(
      screen.getByRole("button", { name: "Open site" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "View logs" })
    ).toBeInTheDocument();
  });

  it("forwards its ref and merges native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Result
        ref={ref}
        id="result-screen"
        className="custom-result"
        title="Done"
      />
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveAttribute(
      "id",
      "result-screen"
    );
    expect(ref.current).toHaveClass(
      "pimolu-result",
      "custom-result"
    );
  });
});
