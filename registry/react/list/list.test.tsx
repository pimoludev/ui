import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { List, ListItem } from "./list";

describe("Pimolu List", () => {
  it("renders a list with title, description and slots", () => {
    render(
      <List>
        <ListItem
          title="Design tokens"
          description="Colours, spacing and type"
          start={<span>★</span>}
          end={<span>12</span>}
        />
      </List>
    );

    expect(
      screen.getByRole("list")
    ).toHaveClass(
      "pimolu-list",
      "pimolu-list--divided",
      "pimolu-list--md"
    );

    expect(
      screen.getByText("Design tokens")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Colours, spacing and type")
    ).toBeInTheDocument();

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("applies the variant and size axes", () => {
    render(
      <List variant="bordered" size="lg">
        <ListItem title="One" />
      </List>
    );

    expect(
      screen.getByRole("list")
    ).toHaveClass(
      "pimolu-list--bordered",
      "pimolu-list--lg"
    );
  });

  it("renders an interactive row", () => {
    const onClick = vi.fn();

    render(
      <List>
        <ListItem title="Open" onClick={onClick} />
      </List>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Open" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks the active and disabled states", () => {
    render(
      <List>
        <ListItem title="Active" active onClick={() => {}} />

        <ListItem
          title="Disabled"
          disabled
          onClick={() => {}}
        />
      </List>
    );

    expect(
      screen.getByText("Active").closest("li")
    ).toHaveAttribute("data-state", "active");

    expect(
      screen.getByText("Active").closest("li")
    ).toHaveAttribute("aria-current", "true");

    expect(
      screen.getByText("Disabled").closest("li")
    ).toHaveAttribute("data-state", "disabled");

    expect(
      screen.getByRole("button", { name: "Disabled" })
    ).toBeDisabled();
  });

  it("renders children when no title is given", () => {
    render(
      <List>
        <ListItem>
          <span>Custom content</span>
        </ListItem>
      </List>
    );

    expect(
      screen.getByText("Custom content")
    ).toBeInTheDocument();
  });
});
