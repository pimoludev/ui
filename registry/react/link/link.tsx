"use client";

import {
  forwardRef,
  type MouseEvent,
} from "react";

import type { PimoluLinkProps } from "./link.types";

import { linkVariants } from "./link.variants";

export const Link = forwardRef<
  HTMLAnchorElement,
  PimoluLinkProps
>(function Link(
  {
    variant = "primary",
    underline = "hover",
    external = false,
    showExternalIcon = true,
    disabled = false,

    href,
    target,
    rel,
    tabIndex,
    className,
    onClick,
    children,
    ...props
  },
  ref
) {
  function handleClick(
    event: MouseEvent<HTMLAnchorElement>
  ) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return (
    <a
      {...props}
      ref={ref}
      href={disabled ? undefined : href}
      role={disabled ? "link" : undefined}
      target={external ? target ?? "_blank" : target}
      rel={
        external ? rel ?? "noopener noreferrer" : rel
      }
      tabIndex={disabled ? -1 : tabIndex}
      aria-disabled={disabled || undefined}
      className={linkVariants(
        { variant, underline },
        className
      )}
      onClick={handleClick}
    >
      {children}

      {external && showExternalIcon && (
        <span
          className="pimolu-link__external"
          aria-hidden="true"
        >
          ↗
        </span>
      )}
    </a>
  );
});
