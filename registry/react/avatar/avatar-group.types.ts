
import type { PimoluClassNames } from "../customization/customization.types";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluAvatarSize,
  PimoluAvatarShape,
} from "./avatar.variants";

import type {
  PimoluAvatarGroupSpacing,
} from "./avatar-group.variants";

/* The axes are derived from the variant maps, never re-declared. */

export type {
  PimoluAvatarGroupSpacing,
};

/* Public props */

export interface PimoluAvatarGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"avatar">;

  /**
   * Direct Avatar children. Any other element is ignored:
   * a fragment or a wrapper around the avatars is not supported.
   */
  children?: ReactNode;

  /** Maximum number of visible avatars. */
  max?: number;

  /** Size applied to every visible Avatar. */
  size?: PimoluAvatarSize;

  /** Shape applied to every visible Avatar. */
  shape?: PimoluAvatarShape;

  /** Controls how much avatars overlap. */
  spacing?: PimoluAvatarGroupSpacing;

  /** Accessible label for the overflow counter. */
  getOverflowLabel?: (hiddenCount: number) => string;
}
