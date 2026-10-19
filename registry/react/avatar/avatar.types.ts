
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluAvatarSize,
  PimoluAvatarShape,
} from "./avatar.variants";

/* The variant axes are derived from avatar.variants.ts, never re-declared. */

export type {
  PimoluAvatarSize,
  PimoluAvatarShape,
};

/* Public props */

export interface PimoluAvatarProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children" | "onError"
  > {
  /** Accessible name and source for initials. */
  name: string;

  /** Image URL. */
  src?: string;

  /** Avatar size. */
  size?: PimoluAvatarSize;

  /** Avatar shape. */
  shape?: PimoluAvatarShape;

  /** Custom fallback instead of initials. */
  fallback?: ReactNode;

  /** Native image loading strategy. */
  loading?: "eager" | "lazy";

  /** Called when the image fails to load. */
  onImageError?: () => void;
}
