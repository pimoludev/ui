
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluBreadcrumbsProps
  extends HTMLAttributes<HTMLElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"breadcrumbs">;

  /** Accessible name of the navigation landmark. */
  label?: string;

  children: ReactNode;
}

export interface PimoluBreadcrumbItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"breadcrumbs">;

  children: ReactNode;
  className?: string;
}

export interface PimoluBreadcrumbLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"breadcrumbs">;

  children: ReactNode;
}

export interface PimoluBreadcrumbSeparatorProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"breadcrumbs">;

  /** Separator content. Defaults to "/". */
  children?: ReactNode;
  className?: string;
}

export interface PimoluBreadcrumbPageProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"breadcrumbs">;

  children: ReactNode;
  className?: string;
}
