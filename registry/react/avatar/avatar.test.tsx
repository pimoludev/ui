
import { createRef } from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  Avatar,
  getAvatarInitials,
} from "./avatar";

describe("Pimolu Avatar", () => {
  it("generates initials", () => {
    expect(getAvatarInitials("Jean Dupont")).toBe("JD");
    expect(getAvatarInitials("Marie")).toBe("M");
    expect(getAvatarInitials("  Pimolu Dev  ")).toBe("PD");
    expect(getAvatarInitials("")).toBe("?");
  });

  it("renders initials without an image", () => {
    render(
      <Avatar name="Jean Dupont" />
    );

    const avatar = screen.getByRole("img", {
      name: "Jean Dupont",
    });

    expect(avatar).toHaveAttribute(
      "data-state",
      "fallback"
    );

    expect(avatar).toHaveTextContent("JD");
  });

  it("supports custom fallback content", () => {
    render(
      <Avatar
        name="Pimolu"
        fallback={<span data-testid="fallback">P</span>}
      />
    );

    expect(
      screen.getByTestId("fallback")
    ).toHaveTextContent("P");
  });

  it("handles successful image loading", () => {
    render(
      <Avatar
        name="Marie Laurent"
        src="/avatars/marie.png"
      />
    );

    const avatar = screen.getByRole("img", {
      name: "Marie Laurent",
    });

    expect(avatar).toHaveAttribute(
      "data-state",
      "loading"
    );

    const image = avatar.querySelector("img");

    expect(image).not.toBeNull();

    fireEvent.load(image!);

    expect(avatar).toHaveAttribute(
      "data-state",
      "loaded"
    );

    expect(
      avatar.querySelector(".pimolu-avatar__fallback")
    ).toBeNull();
  });

  it("displays initials when an image fails", () => {
    const onImageError = vi.fn();

    render(
      <Avatar
        name="Jean Dupont"
        src="/missing-image.png"
        onImageError={onImageError}
      />
    );

    const avatar = screen.getByRole("img", {
      name: "Jean Dupont",
    });

    const image = avatar.querySelector("img");

    fireEvent.error(image!);

    expect(avatar).toHaveAttribute(
      "data-state",
      "error"
    );

    expect(avatar).toHaveTextContent("JD");
    expect(onImageError).toHaveBeenCalledOnce();
  });

  it("resets loading state when src changes", () => {
    const { rerender } = render(
      <Avatar name="Jean Dupont" src="/first.png" />
    );

    const avatar = screen.getByRole("img", {
      name: "Jean Dupont",
    });

    fireEvent.load(avatar.querySelector("img")!);

    expect(avatar).toHaveAttribute(
      "data-state",
      "loaded"
    );

    rerender(
      <Avatar name="Jean Dupont" src="/second.png" />
    );

    expect(avatar).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("applies size and shape classes", () => {
    render(
      <Avatar
        name="Pimolu"
        size="xl"
        shape="rounded"
      />
    );

    expect(
      screen.getByRole("img", { name: "Pimolu" })
    ).toHaveClass(
      "pimolu-avatar--xl",
      "pimolu-avatar--rounded"
    );
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Avatar
        name="Pimolu"
        ref={ref}
      />
    );

    expect(ref.current?.tagName).toBe("SPAN");
    expect(ref.current).toHaveClass("pimolu-avatar");
  });

  it("supports accessible name overrides", () => {
    render(
      <Avatar
        name="Jean Dupont"
        aria-label="Profil de Jean Dupont"
      />
    );

    expect(
      screen.getByRole("img", {
        name: "Profil de Jean Dupont",
      })
    ).toBeInTheDocument();
  });
});
