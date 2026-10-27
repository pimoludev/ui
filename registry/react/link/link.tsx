"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("link", classNames, true);

  function handleClick(
    event: MouseEvent<HTMLAnchorElement>
  ) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return scopeParts((
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
      className={mergeClasses(linkVariants(
        { variant, underline },
        className
      ), partClasses.root)}
      onClick={handleClick}
    >
      {children}

      {external && showExternalIcon && (
        <span
          className={mergeClasses("pimolu-link__external", partClasses.external)}
          aria-hidden="true"
        >
          ↗
        </span>
      )}
    </a>
  ));
});
