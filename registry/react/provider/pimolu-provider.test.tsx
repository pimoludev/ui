
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { PimoluProvider } from "./pimolu-provider";
import { Button } from "../button/button";

import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, afterEach } from "vitest";
import { usePimoluTheme } from "./pimolu-provider";

import { beforeEach } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PimoluProvider", () => {
  it("uses default theme and style", () => {
    const { container } = render(
      <PimoluProvider>
        <button>Test</button>
      </PimoluProvider>
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-theme",
      "light"
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-style",
      "default"
    );
  });

  it("supports dark cartoon style", () => {
    const { container } = render(
      <PimoluProvider theme="dark" stylePreset="cartoon">
        <button>Play</button>
      </PimoluProvider>
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-theme",
      "dark"
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-style",
      "cartoon"
    );

    expect(
      screen.getByRole("button", { name: "Play" })
    ).toBeInTheDocument();
  });

  
it("supports luxury dark preset", () => {
  const { container } = render(
    <PimoluProvider theme="dark" stylePreset="luxury">
      <Button>Explore</Button>
    </PimoluProvider>
  );

  expect(container.firstElementChild).toHaveAttribute(
    "data-pimolu-theme",
    "dark"
  );

  expect(container.firstElementChild).toHaveAttribute(
    "data-pimolu-style",
    "luxury"
  );
});


it("supports neo-brutalism preset", () => {
  const { container } = render(
    <PimoluProvider
      theme="dark"
      stylePreset="neo-brutalism"
    >
      <button>Let's go!</button>
    </PimoluProvider>
  );

  const provider = container.firstElementChild;

  expect(provider).toHaveAttribute(
    "data-pimolu-theme",
    "dark"
  );

  expect(provider).toHaveAttribute(
    "data-pimolu-style",
    "neo-brutalism"
  );
});


const themes = ["light", "dark"] as const;

const presets = [
  "default",
  "monochrome",
  "cartoon",
  "glass",
  "luxury",
  "neo-brutalism",
] as const;

const combinations = presets.flatMap((stylePreset) =>
  themes.map((theme) => ({ stylePreset, theme }))
);

it.each(combinations)(
  "supports $stylePreset with $theme",
  ({ stylePreset, theme }) => {
    const { container } = render(
      <PimoluProvider
        theme={theme}
        stylePreset={stylePreset}
      >
        <span>Content</span>
      </PimoluProvider>
    );

    const provider = container.firstElementChild;

    expect(provider).toHaveAttribute(
      "data-pimolu-theme",
      theme
    );

    expect(provider).toHaveAttribute(
      "data-pimolu-style",
      stylePreset
    );
  }
);


it("changes theme and style through the hook", async () => {
  const user = userEvent.setup();

  function Controls() {
    const { setTheme, setStylePreset } = usePimoluTheme();

    return (
      <>
        <button onClick={() => setTheme("dark")}>
          Dark
        </button>
        <button onClick={() => setStylePreset("cartoon")}>
          Cartoon
        </button>
      </>
    );
  }

  const { container } = render(
    <PimoluProvider>
      <Controls />
    </PimoluProvider>
  );

  await user.click(screen.getByRole("button", { name: "Dark" }));
  await user.click(screen.getByRole("button", { name: "Cartoon" }));

  expect(container.firstElementChild).toHaveAttribute(
    "data-pimolu-theme",
    "dark"
  );

  expect(container.firstElementChild).toHaveAttribute(
    "data-pimolu-style",
    "cartoon"
  );
});

it("inherits theme in nested providers", () => {
  render(
    <PimoluProvider theme="dark" stylePreset="cartoon">
      <PimoluProvider stylePreset="luxury">
        <span data-testid="content">Hello</span>
      </PimoluProvider>
    </PimoluProvider>
  );

  const innerProvider =
    screen.getByTestId("content").parentElement;

  expect(innerProvider).toHaveAttribute(
    "data-pimolu-theme",
    "dark"
  );

  expect(innerProvider).toHaveAttribute(
    "data-pimolu-style",
    "luxury"
  );
});


it("follows system theme changes", () => {
  let dark = false;
  const listeners = new Set<() => void>();

  vi.stubGlobal("matchMedia", () => ({
    matches: dark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_: string, fn: () => void) =>
      listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) =>
      listeners.delete(fn),
  }));

  function ThemeStatus() {
    const { resolvedTheme } = usePimoluTheme();

    return (
      <span data-testid="resolved-theme">
        {resolvedTheme}
      </span>
    );
  }

  const { container } = render(
    <PimoluProvider theme="system">
      <ThemeStatus />
    </PimoluProvider>
  );

  const provider = container.firstElementChild;

  // L'attribut HTML reste "system"
  expect(provider).toHaveAttribute(
    "data-pimolu-theme",
    "system"
  );

  // Le système commence en Light
  expect(
    screen.getByTestId("resolved-theme")
  ).toHaveTextContent("light");

  // Simulation d'un changement système vers Dark
  act(() => {
    dark = true;
    listeners.forEach((listener) => listener());
  });

  // L'attribut HTML reste toujours "system"
  expect(provider).toHaveAttribute(
    "data-pimolu-theme",
    "system"
  );

  // Mais React détecte bien le mode Dark
  expect(
    screen.getByTestId("resolved-theme")
  ).toHaveTextContent("dark");
});



it("restores saved preferences", async () => {
  window.localStorage.setItem(
    "pimolu:preferences",
    JSON.stringify({
      theme: "dark",
      stylePreset: "luxury",
    })
  );

  const { container } = render(
    <PimoluProvider persist>
      <span>Content</span>
    </PimoluProvider>
  );

  await waitFor(() => {
    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-theme",
      "dark"
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-pimolu-style",
      "luxury"
    );
  });

  window.localStorage.clear();
});

it("persists changes made with the hook", async () => {
  const user = userEvent.setup();

  function Controls() {
    const { setTheme, setStylePreset } = usePimoluTheme();

    return (
      <>
        <button onClick={() => setTheme("dark")}>
          Set dark
        </button>

        <button onClick={() => setStylePreset("cartoon")}>
          Set cartoon
        </button>
      </>
    );
  }

  render(
    <PimoluProvider persist>
      <Controls />
    </PimoluProvider>
  );

  await user.click(
    screen.getByRole("button", { name: "Set dark" })
  );

  await user.click(
    screen.getByRole("button", { name: "Set cartoon" })
  );

  await waitFor(() => {
    const saved = JSON.parse(
      window.localStorage.getItem(
        "pimolu:preferences"
      ) ?? "{}"
    );

    expect(saved).toEqual({
      theme: "dark",
      stylePreset: "cartoon",
    });
  });

  window.localStorage.clear();
});

  
});
