import { describe, expect, it, vi } from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeBuilder } from "./theme-builder";

const presets = [
  {
    id: "default",
    label: "Default",
    description: "Balanced indigo",
    colors: ["#5B55E7", "#8B5CF6", "#0EA5E9"],
  },
  {
    id: "monochrome",
    label: "Monochrome",
    description: "Neutral ink",
    colors: ["#111827", "#64748B", "#D1D5DB"],
  },
  {
    id: "glass",
    label: "Glass",
    description: "Translucent surfaces",
  },
];

describe("ThemeBuilder", () => {
  it("renders the title, every preset and the first selection", () => {
    const { container } = render(
      <ThemeBuilder
        title="Customize the theme"
        presets={presets}
      />
    );

    expect(
      screen.getByText("Customize the theme")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radiogroup", {
        name: "Style preset",
      })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("radio")).toHaveLength(5);

    expect(
      screen.getByRole("radio", { name: /Default/ })
    ).toHaveAttribute("aria-checked", "true");

    expect(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    ).toHaveAttribute("aria-checked", "false");

    expect(
      container.querySelectorAll(
        ".pimolu-theme-builder__swatch"
      ).length
    ).toBeGreaterThanOrEqual(3);
  });

  it("uses defaultValue as the initial preset", () => {
    render(
      <ThemeBuilder
        presets={presets}
        defaultValue="glass"
      />
    );

    expect(
      screen.getByRole("radio", { name: /Glass/ })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("selects a preset and reports the new id", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "monochrome"
    );

    expect(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("follows a controlled preset without changing it locally", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        value="glass"
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "monochrome"
    );

    expect(
      screen.getByRole("radio", { name: /Glass/ })
    ).toHaveAttribute("aria-checked", "true");

    expect(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    ).toHaveAttribute("aria-checked", "false");
  });

  it("moves the preset selection with the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        onValueChange={onValueChange}
      />
    );

    const current = screen.getByRole("radio", {
      name: /Default/,
    });

    current.focus();

    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(
      "monochrome"
    );

    expect(
      screen.getByRole("radio", {
        name: /Monochrome/,
      })
    ).toHaveFocus();
  });

  it("toggles the colour mode and updates the preview scope", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        onThemeChange={onThemeChange}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: "Dark" })
    );

    expect(onThemeChange).toHaveBeenCalledWith("dark");

    expect(
      screen.getByRole("radio", { name: "Dark" })
    ).toHaveAttribute("aria-checked", "true");

    expect(
      screen.getByRole("region", {
        name: "Theme preview",
      })
    ).toHaveAttribute("data-pimolu-theme", "dark");
  });

  it("reports a custom brand colour and applies it to the preview", () => {
    const onBrandColorChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        onBrandColorChange={onBrandColorChange}
      />
    );

    const color = screen.getByLabelText(
      "Brand color"
    ) as HTMLInputElement;

    fireEvent.change(color, {
      target: { value: "#ff0000" },
    });

    expect(onBrandColorChange).toHaveBeenCalledWith(
      "#ff0000"
    );

    expect(screen.getByText("#FF0000")).toBeInTheDocument();

    expect(
      screen.getByRole("region", {
        name: "Theme preview",
      })
    ).toHaveStyle({
      "--pimolu-primary": "#FF0000",
    });
  });

  it("reports radius and density changes from the selects", async () => {
    const user = userEvent.setup();
    const onRadiusChange = vi.fn();
    const onDensityChange = vi.fn();

    render(
      <ThemeBuilder
        presets={presets}
        onRadiusChange={onRadiusChange}
        onDensityChange={onDensityChange}
      />
    );

    await user.click(
      screen.getByRole("combobox", { name: "Radius" })
    );

    await user.click(
      await screen.findByRole("option", {
        name: "Round",
      })
    );

    expect(onRadiusChange).toHaveBeenCalledWith("round");

    expect(
      screen.getByRole("region", {
        name: "Theme preview",
      })
    ).toHaveAttribute("data-pimolu-radius", "round");

    await user.click(
      screen.getByRole("combobox", { name: "Density" })
    );

    await user.click(
      await screen.findByRole("option", {
        name: "Compact",
      })
    );

    expect(onDensityChange).toHaveBeenCalledWith(
      "compact"
    );

    expect(
      screen.getByRole("region", {
        name: "Theme preview",
      })
    ).toHaveAttribute("data-pimolu-density", "compact");
  });

  it("renders a default sample or a supplied preview", () => {
    const { rerender } = render(
      <ThemeBuilder presets={presets} />
    );

    expect(
      screen.getByText("A small surface, every token.")
    ).toBeInTheDocument();

    rerender(
      <ThemeBuilder
        presets={presets}
        preview={<p>Custom preview</p>}
      />
    );

    expect(
      screen.getByText("Custom preview")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("A small surface, every token.")
    ).toBeNull();
  });
});
