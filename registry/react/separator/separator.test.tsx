
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

import userEvent from "@testing-library/user-event";

import { Separator } from "./separator";

describe("Pimolu Separator", () => {
  it("renders with default classes", () => {
    render(
      <Separator data-testid="separator" />
    );

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveClass(
      "pimolu-separator",
      "pimolu-separator--horizontal",
      "pimolu-separator--solid",
      "pimolu-separator--thin",
      "pimolu-separator--neutral"
    );
  });

  it("is decorative by default", () => {
    render(
      <Separator data-testid="separator" />
    );

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute(
      "role",
      "none"
    );

    expect(separator).toHaveAttribute(
      "aria-hidden",
      "true"
    );

    expect(
      screen.queryByRole("separator")
    ).toBeNull();
  });

  it("supports a semantic horizontal separator", () => {
    render(
      <Separator
        decorative={false}
        aria-label="Section divider"
      />
    );

    const separator = screen.getByRole(
      "separator",
      { name: "Section divider" }
    );

    expect(separator).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );

    expect(separator).not.toHaveAttribute(
      "aria-hidden"
    );
  });

  it("supports a semantic vertical separator", () => {
    render(
      <Separator
        orientation="vertical"
        decorative={false}
        aria-label="Navigation divider"
      />
    );

    const separator = screen.getByRole(
      "separator",
      { name: "Navigation divider" }
    );

    expect(separator).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );

    expect(separator).toHaveClass(
      "pimolu-separator--vertical"
    );
  });

  it("supports appearance, thickness and variant", () => {
    render(
      <Separator
        data-testid="separator"
        appearance="dashed"
        thickness="thick"
        variant="primary"
      />
    );

    expect(
      screen.getByTestId("separator")
    ).toHaveClass(
      "pimolu-separator--dashed",
      "pimolu-separator--thick",
      "pimolu-separator--primary"
    );
  });

  it("supports dotted appearance", () => {
    render(
      <Separator
        data-testid="separator"
        appearance="dotted"
      />
    );

    expect(
      screen.getByTestId("separator")
    ).toHaveClass(
      "pimolu-separator--dotted"
    );
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Separator ref={ref} />
    );

    expect(ref.current?.tagName).toBe("DIV");

    expect(ref.current).toHaveClass(
      "pimolu-separator"
    );
  });

  it("preserves native HTML attributes", () => {
    render(
      <Separator
        data-testid="separator"
        id="settings-divider"
        title="Settings separator"
        className="custom-separator"
      />
    );

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute(
      "id",
      "settings-divider"
    );

    expect(separator).toHaveAttribute(
      "title",
      "Settings separator"
    );

    expect(separator).toHaveClass(
      "custom-separator"
    );
  });

  it("does not interrupt keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button>Previous</button>

        <Separator decorative={false} />

        <button>Next</button>
      </>
    );

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Previous",
      })
    ).toHaveFocus();

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Next",
      })
    ).toHaveFocus();
  });

  it("supports aria-labelledby", () => {
    render(
      <>
        <h2 id="security-title">
          Security
        </h2>

        <Separator
          decorative={false}
          aria-labelledby="security-title"
        />
      </>
    );

    expect(
      screen.getByRole("separator", {
        name: "Security",
      })
    ).toBeInTheDocument();
  });
});
