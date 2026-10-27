
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* Public axes */

export type PimoluStatSize = "sm" | "md" | "lg";

export type PimoluStatTrend = "up" | "down" | "neutral";

/* Public props */

export interface PimoluStatProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"stat">;


  /** Metric name, also used to label the group. */
  label: string;

  /** Main metric value. */
  value: ReactNode;

  /** Change value, for example "+12.4%". */
  delta?: ReactNode;

  /** Direction of the change. Defaults to "neutral". */
  trend?: PimoluStatTrend;

  /** Supporting context under the value. */
  description?: ReactNode;

  /** Decorative leading icon. */
  icon?: ReactNode;

  /** Visual size. Defaults to "md". */
  size?: PimoluStatSize;
}
