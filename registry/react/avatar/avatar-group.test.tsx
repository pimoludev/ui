
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  render,
  screen,
  within,
} from "@testing-library/react";

import { Avatar } from "./avatar";
import { AvatarGroup } from "./avatar-group";

describe("Pimolu AvatarGroup", () => {
  it("renders all avatars when below max", () => {
    render(
      <AvatarGroup aria-label="Project team" max={5}>
        <Avatar name="Jean Dupont" />
        <Avatar name="Marie Laurent" />
      </AvatarGroup>
    );

    const group = screen.getByRole("group", {
      name: "Project team",
    });

    expect(
      within(group).getByRole("img", {
        name: "Jean Dupont",
      })
    ).toBeInTheDocument();

    expect(
      within(group).getByRole("img", {
        name: "Marie Laurent",
      })
    ).toBeInTheDocument();

    expect(
      group.querySelector(".pimolu-avatar-group__more")
    ).toBeNull();
  });

  it("limits visible avatars and shows overflow", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Jean Dupont" />
        <Avatar name="Marie Laurent" />
        <Avatar name="Pimolu Developer" />
        <Avatar name="Nicolas Martin" />
      </AvatarGroup>
    );

    expect(
      screen.getByRole("img", {
        name: "Jean Dupont",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "Marie Laurent",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("img", {
        name: "Pimolu Developer",
      })
    ).toBeNull();

    expect(
      screen.getByRole("img", {
        name: "2 more members",
      })
    ).toHaveTextContent("+2");
  });

  it("supports translated overflow labels", () => {
    render(
      <AvatarGroup
        max={1}
        getOverflowLabel={(count) =>
          `${count} personnes supplémentaires`
        }
      >
        <Avatar name="Jean Dupont" />
        <Avatar name="Marie Laurent" />
        <Avatar name="Nicolas Martin" />
      </AvatarGroup>
    );

    expect(
      screen.getByRole("img", {
        name: "2 personnes supplémentaires",
      })
    ).toBeInTheDocument();
  });

  it("applies group size and shape to children", () => {
    render(
      <AvatarGroup size="lg" shape="rounded">
        <Avatar
          name="Jean Dupont"
          size="xs"
          shape="square"
        />
      </AvatarGroup>
    );

    expect(
      screen.getByRole("img", {
        name: "Jean Dupont",
      })
    ).toHaveClass(
      "pimolu-avatar--lg",
      "pimolu-avatar--rounded"
    );
  });

  it("supports zero max", () => {
    render(
      <AvatarGroup max={0}>
        <Avatar name="Jean Dupont" />
        <Avatar name="Marie Laurent" />
      </AvatarGroup>
    );

    expect(
      screen.queryByRole("img", {
        name: "Jean Dupont",
      })
    ).toBeNull();

    expect(
      screen.getByRole("img", {
        name: "2 more members",
      })
    ).toHaveTextContent("+2");
  });

  it("ignores non-Avatar children", () => {
    render(
      <AvatarGroup max={1}>
        <Avatar name="Jean Dupont" />
        <span>Unrelated content</span>
        <Avatar name="Marie Laurent" />
      </AvatarGroup>
    );

    expect(
      screen.queryByText("Unrelated content")
    ).toBeNull();

    expect(
      screen.getByRole("img", {
        name: "1 more member",
      })
    ).toBeInTheDocument();
  });

  it("supports spacing classes", () => {
    render(
      <AvatarGroup
        data-testid="group"
        spacing="tight"
        size="sm"
      >
        <Avatar name="Jean Dupont" />
      </AvatarGroup>
    );

    expect(screen.getByTestId("group")).toHaveClass(
      "pimolu-avatar-group",
      "pimolu-avatar-group--spacing-tight",
      "pimolu-avatar-group--sm"
    );
  });

  it("supports aria-labelledby", () => {
    render(
      <>
        <h2 id="team-title">Development team</h2>

        <AvatarGroup aria-labelledby="team-title">
          <Avatar name="Jean Dupont" />
        </AvatarGroup>
      </>
    );

    expect(
      screen.getByRole("group", {
        name: "Development team",
      })
    ).toBeInTheDocument();
  });

  it("forwards its ref and native attributes", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <AvatarGroup
        ref={ref}
        id="pimolu-team"
        className="custom-group"
      >
        <Avatar name="Jean Dupont" />
      </AvatarGroup>
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveAttribute(
      "id",
      "pimolu-team"
    );
    expect(ref.current).toHaveClass(
      "pimolu-avatar-group",
      "custom-group"
    );
  });
});
