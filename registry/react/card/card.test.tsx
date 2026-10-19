
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Pimolu Card", () => {
  it("renders composed components", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Build with Pimolu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p>Main content</p>
        </CardContent>

        <CardFooter>
          <button>Continue</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card")).toHaveClass(
      "pimolu-card"
    );

    expect(
      screen.getByRole("heading", {
        name: "Welcome",
        level: 3,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Build with Pimolu")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Main content")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Continue",
      })
    ).toBeInTheDocument();
  });

  it("applies variant, appearance and size", () => {
    render(
      <Card
        data-testid="card"
        variant="primary"
        appearance="elevated"
        size="lg"
        fullWidth
      />
    );

    expect(screen.getByTestId("card")).toHaveClass(
      "pimolu-card--primary",
      "pimolu-card--elevated",
      "pimolu-card--lg",
      "pimolu-card--full-width"
    );
  });

  it("supports semantic heading levels", () => {
    render(
      <Card>
        <CardTitle as="h2">Account settings</CardTitle>
      </Card>
    );

    expect(
      screen.getByRole("heading", {
        name: "Account settings",
        level: 2,
      })
    ).toBeInTheDocument();
  });

  it("supports accessible region labeling", () => {
    render(
      <Card
        role="region"
        aria-labelledby="account-title"
      >
        <CardHeader>
          <CardTitle id="account-title">
            Account details
          </CardTitle>
        </CardHeader>
      </Card>
    );

    expect(
      screen.getByRole("region", {
        name: "Account details",
      })
    ).toBeInTheDocument();
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toHaveClass("pimolu-card");
  });

  it("preserves native HTML attributes", () => {
    render(
      <Card
        data-testid="card"
        id="profile-card"
        className="custom-card"
        title="Profile information"
      />
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveAttribute("id", "profile-card");
    expect(card).toHaveAttribute(
      "title",
      "Profile information"
    );
    expect(card).toHaveClass("custom-card");
  });
});
