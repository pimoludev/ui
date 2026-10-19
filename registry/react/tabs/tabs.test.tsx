import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./tabs";

import type { PimoluTabsProps } from "./tabs.types";

function Example(props: Partial<PimoluTabsProps> = {}) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">
          Account
        </TabsTrigger>

        <TabsTrigger value="billing">
          Billing
        </TabsTrigger>

        <TabsTrigger value="team" disabled>
          Team
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        Account panel
      </TabsContent>

      <TabsContent value="billing">
        Billing panel
      </TabsContent>

      <TabsContent value="team">
        Team panel
      </TabsContent>
    </Tabs>
  );
}

describe("Pimolu Tabs", () => {
  it("renders a named tablist and selects defaultValue", () => {
    render(<Example />);

    expect(
      screen.getByRole("tablist", { name: "Settings" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: "Account" })
    ).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByRole("tab", { name: "Billing" })
    ).toHaveAttribute("aria-selected", "false");

    expect(
      screen.getByRole("tabpanel")
    ).toHaveTextContent("Account panel");
  });

  it("selects the first enabled tab when no default is given", () => {
    render(
      <Tabs>
        <TabsList aria-label="Sections">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>

        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
    );

    expect(
      screen.getByRole("tab", { name: "One" })
    ).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByRole("tabpanel")
    ).toHaveTextContent("First panel");
  });

  it("skips a disabled first tab when choosing the fallback", () => {
    render(
      <Tabs>
        <TabsList aria-label="Sections">
          <TabsTrigger value="one" disabled>
            One
          </TabsTrigger>

          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>

        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
    );

    expect(
      screen.getByRole("tab", { name: "Two" })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("names the tablist from an external element", () => {
    render(
      <>
        <span id="tabs-label">Sections</span>

        <Tabs defaultValue="one">
          <TabsList aria-labelledby="tabs-label">
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>

          <TabsContent value="one">
            First panel
          </TabsContent>
        </Tabs>
      </>
    );

    expect(
      screen.getByRole("tablist", { name: "Sections" })
    ).toBeInTheDocument();
  });

  it("switches tab and panel on click", () => {
    const onValueChange = vi.fn();

    render(<Example onValueChange={onValueChange} />);

    fireEvent.click(
      screen.getByRole("tab", { name: "Billing" })
    );

    expect(onValueChange).toHaveBeenCalledWith("billing");

    expect(
      screen.getByRole("tab", { name: "Billing" })
    ).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByRole("tabpanel")
    ).toHaveTextContent("Billing panel");

    expect(
      screen.getByText("Account panel")
    ).not.toBeVisible();
  });

  it("does not report the same value twice", () => {
    const onValueChange = vi.fn();

    render(<Example onValueChange={onValueChange} />);

    fireEvent.click(
      screen.getByRole("tab", { name: "Account" })
    );

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("follows the value prop when controlled", () => {
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Example
        value="account"
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(
      screen.getByRole("tab", { name: "Billing" })
    );

    expect(onValueChange).toHaveBeenCalledWith("billing");

    /* The parent has not changed the prop yet. */
    expect(
      screen.getByRole("tab", { name: "Account" })
    ).toHaveAttribute("aria-selected", "true");

    rerender(
      <Example
        value="billing"
        onValueChange={onValueChange}
      />
    );

    expect(
      screen.getByRole("tab", { name: "Billing" })
    ).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByRole("tabpanel")
    ).toHaveTextContent("Billing panel");
  });

  it("keeps a roving tab stop on the selected tab", () => {
    render(<Example />);

    expect(
      screen.getByRole("tab", { name: "Account" })
    ).toHaveAttribute("tabindex", "0");

    expect(
      screen.getByRole("tab", { name: "Billing" })
    ).toHaveAttribute("tabindex", "-1");

    expect(
      screen.getByRole("tab", { name: "Team" })
    ).toHaveAttribute("tabindex", "-1");
  });

  it("wires each tab to its panel", () => {
    render(<Example />);

    const tab = screen.getByRole("tab", {
      name: "Billing",
    });

    fireEvent.click(tab);

    const panel = screen.getByRole("tabpanel");

    expect(tab).toHaveAttribute(
      "aria-controls",
      panel.id
    );

    expect(panel).toHaveAttribute(
      "aria-labelledby",
      tab.id
    );

    expect(panel).toHaveAttribute("tabindex", "0");
  });

  it("keeps every panel mounted but hides the inactive ones", () => {
    render(<Example />);

    expect(
      screen.getByText("Billing panel")
    ).not.toBeVisible();

    expect(
      screen.getByText("Billing panel")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Account panel")
    ).toBeVisible();
  });

  it("moves and selects with the horizontal arrows", () => {
    render(<Example />);

    const account = screen.getByRole("tab", {
      name: "Account",
    });

    const billing = screen.getByRole("tab", {
      name: "Billing",
    });

    account.focus();

    fireEvent.keyDown(account, {
      key: "ArrowRight",
    });

    expect(billing).toHaveFocus();
    expect(billing).toHaveAttribute(
      "aria-selected",
      "true"
    );

    /* The disabled Team tab is skipped and the focus wraps. */
    fireEvent.keyDown(billing, {
      key: "ArrowRight",
    });

    expect(account).toHaveFocus();
    expect(account).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(account, {
      key: "ArrowLeft",
    });

    expect(billing).toHaveFocus();
  });

  it("supports Home and End", () => {
    render(<Example />);

    const account = screen.getByRole("tab", {
      name: "Account",
    });

    const billing = screen.getByRole("tab", {
      name: "Billing",
    });

    billing.focus();

    fireEvent.keyDown(billing, { key: "Home" });

    expect(account).toHaveFocus();

    fireEvent.keyDown(account, { key: "End" });

    expect(billing).toHaveFocus();
  });

  it("uses vertical arrows when the orientation is vertical", () => {
    render(<Example orientation="vertical" />);

    const tablist = screen.getByRole("tablist");

    expect(tablist).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );

    const account = screen.getByRole("tab", {
      name: "Account",
    });

    const billing = screen.getByRole("tab", {
      name: "Billing",
    });

    account.focus();

    fireEvent.keyDown(account, {
      key: "ArrowDown",
    });

    expect(billing).toHaveFocus();

    fireEvent.keyDown(billing, {
      key: "ArrowUp",
    });

    expect(account).toHaveFocus();

    fireEvent.keyDown(account, {
      key: "ArrowRight",
    });

    expect(account).toHaveFocus();
  });

  it("moves focus only in manual activation mode", () => {
    render(<Example activationMode="manual" />);

    const account = screen.getByRole("tab", {
      name: "Account",
    });

    const billing = screen.getByRole("tab", {
      name: "Billing",
    });

    account.focus();

    fireEvent.keyDown(account, {
      key: "ArrowRight",
    });

    expect(billing).toHaveFocus();

    expect(billing).toHaveAttribute(
      "aria-selected",
      "false"
    );

    fireEvent.click(billing);

    expect(billing).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("never selects a disabled tab", () => {
    const onValueChange = vi.fn();

    render(<Example onValueChange={onValueChange} />);

    fireEvent.click(
      screen.getByRole("tab", { name: "Team" })
    );

    expect(onValueChange).not.toHaveBeenCalled();

    expect(
      screen.getByRole("tab", { name: "Team" })
    ).toHaveAttribute("aria-selected", "false");
  });

  it("applies the variant, size and orientation classes", () => {
    render(
      <Example
        variant="segmented"
        size="lg"
        orientation="vertical"
        className="custom-tabs"
      />
    );

    const root =
      screen.getByRole("tablist").parentElement!
        .parentElement!;

    expect(root).toHaveClass(
      "pimolu-tabs",
      "pimolu-tabs--segmented",
      "pimolu-tabs--lg",
      "pimolu-tabs--vertical",
      "custom-tabs"
    );
  });

  it("flags a segmented list that uses dividers", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList
          aria-label="Segments"
          dividers
        >
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>

        <TabsContent value="one">First</TabsContent>
        <TabsContent value="two">Second</TabsContent>
      </Tabs>
    );

    expect(
      screen.getByRole("tablist")
    ).toHaveAttribute("data-dividers", "true");
  });

  it("adds scroll buttons only when a scrollable list overflows", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList
          aria-label="Sections"
          scrollable
          scrollPreviousLabel="Previous"
          scrollNextLabel="Next"
        >
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>

        <TabsContent value="one">First</TabsContent>
        <TabsContent value="two">Second</TabsContent>
        <TabsContent value="three">Third</TabsContent>
      </Tabs>
    );

    const list = screen.getByRole("tablist");

    expect(list.parentElement).toHaveClass(
      "pimolu-tabs__list-wrap--scrollable"
    );
    expect(list).toHaveAttribute(
      "data-scrollable",
      "true"
    );

    expect(
      screen.queryByRole("button", { name: "Next" })
    ).toBeNull();

    Object.defineProperty(list, "scrollWidth", {
      configurable: true,
      value: 600,
    });

    Object.defineProperty(list, "clientWidth", {
      configurable: true,
      value: 200,
    });

    fireEvent.scroll(list);

    const next = screen.getByRole("button", {
      name: "Next",
    });

    const scrollBy = vi.fn();

    list.scrollBy = scrollBy;

    fireEvent.click(next);

    expect(scrollBy).toHaveBeenCalledWith({
      left: 140,
      behavior: "smooth",
    });
  });

  it("shows the previous button once the list is scrolled", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList
          aria-label="Sections"
          scrollable
          scrollPreviousLabel="Previous"
        >
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>

        <TabsContent value="one">First</TabsContent>
        <TabsContent value="two">Second</TabsContent>
      </Tabs>
    );

    const list = screen.getByRole("tablist");

    Object.defineProperty(list, "scrollWidth", {
      configurable: true,
      value: 600,
    });

    Object.defineProperty(list, "clientWidth", {
      configurable: true,
      value: 200,
    });

    Object.defineProperty(list, "scrollLeft", {
      configurable: true,
      value: 100,
      writable: true,
    });

    fireEvent.scroll(list);

    expect(
      screen.getByRole("button", {
        name: "Previous",
      })
    ).toBeInTheDocument();
  });

  it("applies classes on the list, trigger and panel", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList
          aria-label="Sections"
          className="custom-list"
        >
          <TabsTrigger
            value="one"
            className="custom-trigger"
          >
            One
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="one"
          className="custom-panel"
        >
          First panel
        </TabsContent>
      </Tabs>
    );

    expect(
      screen.getByRole("tablist")
    ).toHaveClass("custom-list");

    expect(
      screen.getByRole("tab", { name: "One" })
    ).toHaveClass("custom-trigger");

    expect(
      screen.getByRole("tabpanel")
    ).toHaveClass("custom-panel");
  });

  it("keeps ids stable for values with spaces", () => {
    render(
      <Tabs defaultValue="account settings">
        <TabsList aria-label="Sections">
          <TabsTrigger value="account settings">
            Account settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account settings">
          Settings panel
        </TabsContent>
      </Tabs>
    );

    const tab = screen.getByRole("tab", {
      name: "Account settings",
    });

    const panel = screen.getByRole("tabpanel");

    expect(tab.id).toContain("account-settings");
    expect(tab).toHaveAttribute(
      "aria-controls",
      panel.id
    );
    expect(panel).toHaveAttribute(
      "aria-labelledby",
      tab.id
    );
  });
});
