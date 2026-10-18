import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import {
  buttonVariants,
  type ButtonVariants,
} from "./button.variants";

import "./button.css";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
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
      type = "button",
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      buttonVariants(
        { variant, appearance, size, radius },
        className
      ),
      fullWidth && !iconOnly && "pimolu-button--full-width",
      iconOnly && "pimolu-button--icon-only",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={classes}
      >
        {loading ? (
          <span
            className="pimolu-button__spinner"
            aria-hidden="true"
          />
        ) : (
          startIcon && (
            <span aria-hidden="true">{startIcon}</span>
          )
        )}

        <span className="pimolu-button__label">
          {children}
        </span>

        {!loading && endIcon && (!iconOnly || !startIcon) && (
          <span aria-hidden="true">{endIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";