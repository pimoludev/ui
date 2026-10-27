
import type { PimoluClassNames } from "../customization/customization.types";
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
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"description-list">;

  /** Layout of each term/details pair. Defaults to "stacked". */
  layout?: PimoluDescriptionListLayout;

  /** Visual treatment. Defaults to "divided". */
  variant?: PimoluDescriptionListVariant;

  /** Row density. Defaults to "md". */
  size?: PimoluDescriptionListSize;

  children: ReactNode;
}

export interface PimoluDescriptionItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"description-list">;

  term: ReactNode;

  details: ReactNode;

  className?: string;
}
