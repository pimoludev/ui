import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SplitButton } from "./split-button";

afterEach(() => {
  vi.useRealTimers();
});

const items = [
  { id: "draft", label: "Save as draft" },
  { id: "duplicate", label: "Duplicate" },
  { id: "archive", label: "Archive", disabled: true },
];

describe("Pimolu SplitButton", () => {
  it("renders a primary action and an accessible menu trigger", () => {
    render(
      <SplitButton
        aria-label="Publish"
        items={items}
      >
        Publish changes
      </SplitButton>
    );

    expect(
      screen.getByRole("button", {
        name: "Publish changes",
      })
    ).toBeInTheDocument();

    const trigger = screen.getByRole("button", {
      name: "More actions",
    });

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "menu"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(
      screen.getByRole("group", { name: "Publish" })
    ).toHaveClass("pimolu-split-button");
  });

  it("runs the primary action", () => {
    const onClick = vi.fn();

    render(
      <SplitButton
        label="Publish"
        onClick={onClick}
        items={items}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Publish" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("opens the menu with its items", () => {
    render(
      <SplitButton items={items}>Publish</SplitButton>
    );

    const trigger = screen.getByRole("button", {
      name: "More actions",
    });

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: "Save as draft",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: "Archive",
      })
    ).toBeDisabled();
  });

  it("selects an item, closes the menu and returns focus", () => {
    vi.useFakeTimers();

    const onSelect = vi.fn();

    render(
      <SplitButton
        items={[
          {
            id: "duplicate",
            label: "Duplicate",
            onSelect,
          },
        ]}
      >
        Publish
      </SplitButton>
    );

    const trigger = screen.getByRole("button", {
      name: "More actions",
    });

    fireEvent.click(trigger);

    fireEvent.click(
      screen.getByRole("menuitem", {
        name: "Duplicate",
      })
    );

    expect(onSelect).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("does not select a disabled item", () => {
    const onSelect = vi.fn();

    render(
      <SplitButton
        items={[
          {
            id: "archive",
            label: "Archive",
            onSelect,
            disabled: true,
          },
        ]}
      >
        Publish
      </SplitButton>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "More actions",
      })
    );

    fireEvent.click(
      screen.getByRole("menuitem", {
        name: "Archive",
      })
    );

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("disables both buttons when disabled", () => {
    render(
      <SplitButton disabled items={items}>
        Publish
      </SplitButton>
    );

    expect(
      screen.getByRole("button", { name: "Publish" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "More actions",
      })
    ).toBeDisabled();
  });

  it("forwards button styling and custom content", () => {
    render(
      <SplitButton
        className="publish-control"
        items={[
          {
            id: "duplicate",
            label: "Duplicate",
            icon: <span data-testid="duplicate-icon">⧉</span>,
            shortcut: "⌘D",
          },
        ]}
        variant="success"
        appearance="soft"
        size="lg"
        menuLabel="Publish options"
      >
        Publish
      </SplitButton>
    );

    const primary = screen.getByRole("button", {
      name: "Publish",
    });

    const trigger = screen.getByRole("button", {
      name: "Publish options",
    });

    for (const button of [primary, trigger]) {
      expect(button).toHaveClass(
        "pimolu-button--success",
        "pimolu-button--soft",
        "pimolu-button--lg"
      );
    }

    expect(
      screen.getByRole("group")
    ).toHaveClass("publish-control");

    fireEvent.click(trigger);

    expect(
      screen.getByTestId("duplicate-icon")
    ).toBeInTheDocument();

    expect(
      screen.getByText("⌘D")
    ).toBeInTheDocument();
  });
});
