
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/** Radius choices aligned with the `data-pimolu-radius` dimension. */
export const themeBuilderRadiusOptions = [
  { value: "sharp", label: "Sharp" },
  { value: "medium", label: "Medium" },
  { value: "round", label: "Round" },
] as const;

/** Density choices aligned with the `data-pimolu-density` dimension. */
export const themeBuilderDensityOptions = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
] as const;

export const DEFAULT_THEME_BUILDER_BRAND_COLOR = "#5B55E7";

export type PimoluThemeBuilderTheme = "light" | "dark";

export interface PimoluThemeBuilderPreset {
  /** Stable identifier passed to `onValueChange`. */
  id: string;

  /** Visible preset name. */
  label: string;

  /** Optional supporting copy under the name. */
  description?: string;

  /** Swatches shown on the card, for example a palette preview. */
  colors?: readonly string[];
}

export interface PimoluThemeBuilderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"theme-builder">;

  /** Preset cards, in display order. */
  presets: readonly PimoluThemeBuilderPreset[];

  /** Controlled preset id. */
  value?: string;

  /** Initial preset id when uncontrolled. Defaults to the first preset. */
  defaultValue?: string;

  /** Called with the next preset id. */
  onValueChange?: (presetId: string) => void;

  /** Controlled colour mode. Defaults to "light" when uncontrolled. */
  theme?: PimoluThemeBuilderTheme;

  /** Called with the next colour mode. */
  onThemeChange?: (theme: PimoluThemeBuilderTheme) => void;

  /** Controlled brand colour. Defaults to #5B55E7 when uncontrolled. */
  brandColor?: string;

  /** Called with the colour emitted by the native colour input. */
  onBrandColorChange?: (color: string) => void;

  /** Controlled radius dimension. Defaults to "medium". */
  radius?: string;

  /** Called with the next radius dimension. */
  onRadiusChange?: (radius: string) => void;

  /** Controlled density dimension. Defaults to "comfortable". */
  density?: string;

  /** Called with the next density dimension. */
  onDensityChange?: (density: string) => void;

  /** Custom preview surface. A small component sample is rendered without it. */
  preview?: ReactNode;

  /** Optional heading for the builder. */
  title?: string;
}
