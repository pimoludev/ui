import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluDescriptionListLayout,
  PimoluDescriptionListSize,
  PimoluDescriptionListVariant,
} from "./description-list.variants";

export type {
  PimoluDescriptionListLayout,
  PimoluDescriptionListSize,
  PimoluDescriptionListVariant,
};

export interface PimoluDescriptionListProps
  extends HTMLAttributes<HTMLDListElement> {
  /** Layout of each term/details pair. Defaults to "stacked". */
  layout?: PimoluDescriptionListLayout;

  /** Visual treatment. Defaults to "divided". */
  variant?: PimoluDescriptionListVariant;

  /** Row density. Defaults to "md". */
  size?: PimoluDescriptionListSize;

  children: ReactNode;
}

export interface PimoluDescriptionItemProps {
  term: ReactNode;

  details: ReactNode;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
