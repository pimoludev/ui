
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { mergeClasses } from "../internal/merge-classes";

import {
  buttonVariants,
  type ButtonVariants,
} from "./button.variants";


export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
  /** Additive classes for stable named parts; className still targets the root. */
  classNames?: PimoluClassNames<"button">;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant,
      appearance,
      size,
      radius,
      loading = false,
      startIcon,
      endIcon,
      fullWidth = false,
      iconOnly = false,
      disabled,
      className = "",
      classNames,
      type = "button",
      children,
      ...props
    },
    ref
  ) {
  const [partClasses, scopeParts] = usePartClasses("button", classNames, true);

    const classes = [
      buttonVariants(
        { variant, appearance, size, radius },
        className
      ),
      fullWidth && !iconOnly && "pimolu-button--full-width",
      iconOnly && "pimolu-button--icon-only",
      partClasses.root,
    ]
      .filter(Boolean)
      .join(" ");

    return scopeParts((
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={mergeClasses(classes, partClasses.root)}
      >
        {loading ? (
          <span
            className={mergeClasses("pimolu-button__spinner", partClasses.spinner)}
            aria-hidden="true"
          />
        ) : (
          startIcon && (
            <span className={partClasses.startIcon} aria-hidden="true">{startIcon}</span>
          )
        )}

        <span className={mergeClasses("pimolu-button__label", partClasses.label)}>
          {children}
        </span>

        {!loading && endIcon && (!iconOnly || !startIcon) && (
          <span className={partClasses.endIcon} aria-hidden="true">{endIcon}</span>
        )}
      </button>
    ));
  }
);

Button.displayName = "Button";
