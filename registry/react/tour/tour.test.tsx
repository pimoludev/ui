import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  useRef,
  useState,
} from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tour } from "./tour";

afterEach(() => {
  document.getElementById("tour-target")?.remove();
});

const missing = "#pimolu-tour-target-that-does-not-exist";

describe("Pimolu Tour", () => {
  it("renders nothing while closed", () => {
    render(
      <Tour
        steps={[
          { target: missing, title: "Welcome" },
        ]}
      />
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the first step as a focused dialog", () => {
    render(
      <Tour
        open
        steps={[
          {
            target: missing,
            title: "Welcome aboard",
            description: "A short tour of the workspace.",
          },
          {
            target: missing,
            title: "Invite your team",
          },
        ]}
      />
    );

    const dialog = screen.getByRole("dialog", {
      name: "Welcome aboard",
    });

    expect(dialog).toHaveTextContent(
      "A short tour of the workspace."
    );

    expect(dialog).toHaveTextContent("Step 1 of 2");
    expect(dialog).toHaveFocus();

    expect(
      screen.getByRole("button", { name: "Back" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Skip" })
    ).toBeInTheDocument();
  });

  it("highlights a selector target and scrolls it into view", () => {
    const target = document.createElement("button");

    target.id = "tour-target";
    target.textContent = "Target";

    target.getBoundingClientRect = () =>
      ({
        top: 100,
        bottom: 140,
        left: 100,
        right: 200,
        width: 100,
        height: 40,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;

    target.scrollIntoView = vi.fn();

    document.body.appendChild(target);

    render(
      <Tour
        open
        steps={[
          {
            target: "#tour-target",
            title: "This is highlighted",
          },
        ]}
      />
    );

    expect(target.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({
        block: "center",
        inline: "nearest",
      })
    );

    const spotlight = document.querySelector(
      ".pimolu-tour__spotlight"
    ) as HTMLElement;

    expect(spotlight).not.toBeNull();
    expect(spotlight.style.top).toBe("92px");
    expect(spotlight.style.left).toBe("92px");
    expect(spotlight.style.width).toBe("116px");
    expect(spotlight.style.height).toBe("56px");

    expect(
      document.querySelector(".pimolu-tour")
    ).toHaveAttribute("data-missing-target", "false");
  });

  it("moves between steps and reports the new index", () => {
    const onStepChange = vi.fn();

    render(
      <Tour
        open
        initialStep={0}
        onStepChange={onStepChange}
        nextLabel="Continue"
        prevLabel="Previous"
        steps={[
          { target: missing, title: "First" },
          { target: missing, title: "Second" },
          { target: missing, title: "Third" },
        ]}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Continue" })
    );

    expect(
      screen.getByRole("dialog", { name: "Second" })
    ).toBeInTheDocument();

    expect(onStepChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(
      screen.getByRole("button", { name: "Previous" })
    );

    expect(
      screen.getByRole("dialog", { name: "First" })
    ).toBeInTheDocument();

    fireEvent.keyDown(
      screen.getByRole("dialog", { name: "First" }),
      { key: "ArrowRight" }
    );

    expect(
      screen.getByRole("dialog", { name: "Second" })
    ).toBeInTheDocument();

    fireEvent.keyDown(
      screen.getByRole("dialog", { name: "Second" }),
      { key: "ArrowLeft" }
    );

    expect(
      screen.getByRole("dialog", { name: "First" })
    ).toBeInTheDocument();
  });

  it("finishes on the last step and closes when controlled", () => {
    const onFinish = vi.fn();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [isOpen, setIsOpen] = useState(true);

      return (
        <Tour
          open={isOpen}
          steps={[
            { target: missing, title: "First" },
            { target: missing, title: "Last" },
          ]}
          finishLabel="Done"
          onFinish={onFinish}
          onOpenChange={(next) => {
            onOpenChange(next);
            setIsOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);

    fireEvent.click(
      screen.getByRole("button", { name: "Next" })
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Done" })
    );

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape without finishing", () => {
    const onOpenChange = vi.fn();
    const onFinish = vi.fn();

    render(
      <Tour
        open
        steps={[{ target: missing, title: "First" }]}
        onOpenChange={onOpenChange}
        onFinish={onFinish}
      />
    );

    fireEvent.keyDown(
      screen.getByRole("dialog"),
      { key: "Escape" }
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("skips with a custom label", () => {
    const onSkip = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Tour
        open
        steps={[{ target: missing, title: "First" }]}
        skipLabel="Not now"
        onSkip={onSkip}
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Not now" })
    );

    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("centres the card when the target is missing", () => {
    render(
      <Tour
        open
        steps={[
          {
            target: "#pimolu-missing-tour-target",
            title: "Still useful",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("dialog", { name: "Still useful" })
    ).toBeInTheDocument();

    expect(
      document.querySelector(".pimolu-tour")
    ).toHaveAttribute("data-missing-target", "true");

    expect(
      document.querySelector(".pimolu-tour__spotlight")
    ).toBeNull();
  });

  it("accepts a ref target", () => {
    function RefExample() {
      const targetRef =
        useRef<HTMLButtonElement | null>(null);

      return (
        <div>
          <button
            ref={(node) => {
              targetRef.current = node;

              if (node) {
                node.getBoundingClientRect = () =>
                  ({
                    top: 200,
                    bottom: 240,
                    left: 200,
                    right: 300,
                    width: 100,
                    height: 40,
                    x: 200,
                    y: 200,
                    toJSON: () => ({}),
                  }) as DOMRect;
              }
            }}
            type="button"
          >
            Anchor
          </button>

          <Tour
            open
            steps={[
              {
                target: targetRef,
                title: "Ref target",
              },
            ]}
          />
        </div>
      );
    }

    render(<RefExample />);

    expect(
      screen.getByRole("dialog", { name: "Ref target" })
    ).toBeInTheDocument();

    expect(
      document.querySelector(".pimolu-tour__spotlight")
    ).not.toBeNull();
  });
});
