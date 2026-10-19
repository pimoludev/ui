import type {
  ElementType,
  HTMLAttributes,
} from "react";

/**
 * Layout spacing scale. Numbers map to `--pimolu-spacing-<n>`
 * (0, 4, 8, 12, 16, 20, 24, 32, 40, 48px); the named aliases map to
 * `none` 0, `xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32, `2xl` 40,
 * `3xl` 48px.
 */
export type PimoluStackSpace =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type PimoluStackAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type PimoluStackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type PimoluStackDirection = "row" | "column";

export interface PimoluStackProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the stack. Defaults to `div`. */
  as?: ElementType;

  /** Main axis. Defaults to `column`; HStack/VStack fix it. */
  direction?: PimoluStackDirection;

  /** Gap between children. Defaults to `3` (12px). */
  gap?: PimoluStackSpace;

  /** Cross-axis alignment. */
  align?: PimoluStackAlign;

  /** Main-axis distribution. */
  justify?: PimoluStackJustify;

  /** Allow children to wrap onto several lines. */
  wrap?: boolean;

  /** Fill the available inline size. */
  fullWidth?: boolean;
}

/** HStack and VStack fix the direction, so it is not part of their API. */
export type PimoluHStackProps = Omit<
  PimoluStackProps,
  "direction"
>;

export type PimoluVStackProps = PimoluHStackProps;
