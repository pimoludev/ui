
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
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Pimolu Card — Integration", () => {
  it("supports nested Cards", () => {
    render(
      <Card data-testid="parent">
        <CardHeader>
          <CardTitle as="h2">
            Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Card data-testid="child" appearance="soft">
            <CardHeader>
              <CardTitle as="h3">
                Statistics
              </CardTitle>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    );

    const parent = screen.getByTestId("parent");
    const child = screen.getByTestId("child");

    expect(parent).toContainElement(child);

    expect(
      within(parent).getByRole("heading", {
        name: "Dashboard",
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      within(child).getByRole("heading", {
        name: "Statistics",
        level: 3,
      })
    ).toBeInTheDocument();

    expect(child).toHaveClass("pimolu-card--soft");
  });

  it("supports accessible region labeling", () => {
    render(
      <Card
        role="region"
        aria-labelledby="profile-title"
      >
        <CardHeader>
          <CardTitle
            id="profile-title"
            as="h2"
          >
            Profile
          </CardTitle>

          <CardDescription>
            Manage your information
          </CardDescription>
        </CardHeader>
      </Card>
    );

    expect(
      screen.getByRole("region", {
        name: "Profile",
      })
    ).toBeInTheDocument();
  });

  it("does not create an unnecessary region", () => {
    render(
      <Card>
        <CardTitle>Simple Card</CardTitle>
      </Card>
    );

    expect(
      screen.queryByRole("region")
    ).toBeNull();

    expect(
      screen.getByRole("heading", {
        name: "Simple Card",
        level: 3,
      })
    ).toBeInTheDocument();
  });

  it("preserves keyboard navigation inside the footer", async () => {
    const user = userEvent.setup();

    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>

        <CardFooter>
          <button onClick={onSave}>
            Save
          </button>

          <button onClick={onCancel}>
            Cancel
          </button>
        </CardFooter>
      </Card>
    );

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Save",
      })
    ).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onSave).toHaveBeenCalledOnce();

    await user.tab();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toHaveFocus();

    await user.keyboard(" ");
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("forwards refs to composed elements", () => {
    const headerRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const contentRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <Card>
        <CardHeader ref={headerRef}>
          <CardTitle ref={titleRef}>
            Account
          </CardTitle>
        </CardHeader>

        <CardContent ref={contentRef}>
          Content
        </CardContent>

        <CardFooter ref={footerRef}>
          Footer
        </CardFooter>
      </Card>
    );

    expect(headerRef.current).toHaveClass(
      "pimolu-card__header"
    );

    expect(titleRef.current?.tagName).toBe("H3");

    expect(contentRef.current).toHaveClass(
      "pimolu-card__content"
    );

    expect(footerRef.current).toHaveClass(
      "pimolu-card__footer"
    );
  });

  it("preserves long content without truncation", () => {
    const longText = "Pimolu".repeat(100);

    render(
      <Card>
        <CardContent>
          <p>{longText}</p>
        </CardContent>
      </Card>
    );

    expect(
      screen.getByText(longText)
    ).toBeInTheDocument();
  });

  
});
