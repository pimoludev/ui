import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluTypographySize,
  PimoluTypographyTone,
  PimoluTypographyWeight,
} from "./typography.variants";

export type {
  PimoluTypographySize,
  PimoluTypographyTone,
  PimoluTypographyWeight,
};

export type PimoluHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface PimoluTextProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PimoluTypographySize;
  weight?: PimoluTypographyWeight;
  tone?: PimoluTypographyTone;
}

export interface PimoluParagraphProps
  extends HTMLAttributes<HTMLParagraphElement> {
  size?: PimoluTypographySize;
  weight?: PimoluTypographyWeight;
  tone?: PimoluTypographyTone;
}

export interface PimoluHeadingProps
  extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level, also the default visual size. Defaults to 2. */
  level?: PimoluHeadingLevel;

  /** Override the visual size that follows the level. */
  size?: PimoluTypographySize;
  weight?: PimoluTypographyWeight;
  tone?: PimoluTypographyTone;

  children: ReactNode;
}
