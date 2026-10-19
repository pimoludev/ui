import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  PimoluListSize,
  PimoluListVariant,
} from "./list.variants";

export type {
  PimoluListSize,
  PimoluListVariant,
};

export interface PimoluListProps
  extends HTMLAttributes<HTMLUListElement> {
  /** Visual treatment. Defaults to "divided". */
  variant?: PimoluListVariant;

  /** Row density. Defaults to "md". */
  size?: PimoluListSize;

  children: ReactNode;
}

export interface PimoluListItemProps
  extends Omit<
    HTMLAttributes<HTMLLIElement>,
    "onClick" | "title"
  > {
  title?: ReactNode;

  description?: ReactNode;

  /** Content shown before the main text. */
  start?: ReactNode;

  /** Content shown at the trailing edge. */
  end?: ReactNode;

  active?: boolean;

  disabled?: boolean;

  /** Make the row a button. */
  onClick?: () => void;

  children?: ReactNode;
}
