import {
  describe,
  expect,
  it,
} from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { FocusScope } from "./focus-scope";

describe("Pimolu FocusScope", () => {
  it("moves focus to the first control when active", () => {
    render(
      <FocusScope data-testid="scope">
        <button>First</button>
        <button>Second</button>
      </FocusScope>
    );

    expect(screen.getByTestId("scope")).toHaveAttribute(
      "data-active",
      "true"
    );

    expect(screen.getByTestId("scope")).toHaveAttribute(
      "data-trapped",
      "true"
    );

    expect(
      screen.getByRole("button", { name: "First" })
    ).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the scope", () => {
    render(
      <FocusScope>
        <button>First</button>
        <button>Second</button>
      </FocusScope>
    );

    const first = screen.getByRole("button", {
      name: "First",
    });

    const last = screen.getByRole("button", {
      name: "Second",
    });

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(first).toHaveFocus();

    fireEvent.keyDown(document, {
      key: "Tab",
      shiftKey: true,
    });

    expect(last).toHaveFocus();
  });

  it("does nothing while inactive", () => {
    render(
      <>
        <button>Outside</button>

        <FocusScope active={false}>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    const outside = screen.getByRole("button", {
      name: "Outside",
    });

    outside.focus();

    expect(outside).toHaveFocus();

    const inside = screen.getByRole("button", {
      name: "Inside",
    });

    expect(inside).not.toHaveFocus();

    inside.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(inside).toHaveFocus();
  });

  it("restores the previous focus on deactivation", () => {
    const { rerender } = render(
      <>
        <button>Trigger</button>

        <FocusScope active={false}>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    const trigger = screen.getByRole("button", {
      name: "Trigger",
    });

    trigger.focus();

    rerender(
      <>
        <button>Trigger</button>

        <FocusScope active>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    const inside = screen.getByRole("button", {
      name: "Inside",
    });

    expect(inside).toHaveFocus();

    rerender(
      <>
        <button>Trigger</button>

        <FocusScope active={false}>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    expect(trigger).toHaveFocus();
  });

  it("keeps focus in place when restoreFocus is false", () => {
    const { rerender } = render(
      <>
        <button>Trigger</button>

        <FocusScope
          active={false}
          restoreFocus={false}
        >
          <button>Inside</button>
        </FocusScope>
      </>
    );

    const trigger = screen.getByRole("button", {
      name: "Trigger",
    });

    trigger.focus();

    rerender(
      <>
        <button>Trigger</button>

        <FocusScope active restoreFocus={false}>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    const inside = screen.getByRole("button", {
      name: "Inside",
    });

    expect(inside).toHaveFocus();

    rerender(
      <>
        <button>Trigger</button>

        <FocusScope active={false} restoreFocus={false}>
          <button>Inside</button>
        </FocusScope>
      </>
    );

    expect(trigger).not.toHaveFocus();
  });

  it("focuses the container itself with initialFocus", () => {
    render(
      <FocusScope
        data-testid="scope"
        initialFocus="container"
      >
        <button>Inside</button>
      </FocusScope>
    );

    expect(screen.getByTestId("scope")).toHaveFocus();
  });

  it("can own the initial focus without trapping Tab", () => {
    render(
      <FocusScope trapped={false}>
        <button>First</button>
        <button>Second</button>
      </FocusScope>
    );

    const first = screen.getByRole("button", {
      name: "First",
    });

    const last = screen.getByRole("button", {
      name: "Second",
    });

    expect(first).toHaveFocus();

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(last).toHaveFocus();
  });
});
