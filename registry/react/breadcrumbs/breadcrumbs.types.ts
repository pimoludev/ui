import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface PimoluBreadcrumbsProps
  extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the navigation landmark. */
  label?: string;

  children: ReactNode;
}

export interface PimoluBreadcrumbItemProps {
  children: ReactNode;
  className?: string;
}

export interface PimoluBreadcrumbLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export interface PimoluBreadcrumbSeparatorProps {
  /** Separator content. Defaults to "/". */
  children?: ReactNode;
  className?: string;
}

export interface PimoluBreadcrumbPageProps {
  children: ReactNode;
  className?: string;
}
