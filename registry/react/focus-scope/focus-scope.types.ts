import type {
  ElementType,
  HTMLAttributes,
} from "react";

export type PimoluFocusScopeInitialFocus =
  | "first"
  | "container";

export interface PimoluFocusScopeProps
  extends HTMLAttributes<HTMLElement> {
  /** Element rendered by the scope. Defaults to `div`. */
  as?: ElementType;

  /**
   * Enables the scope: focus moves inside on activation, and is restored
   * on deactivation (see `restoreFocus`). When false, nothing happens.
   * Defaults to `true`.
   */
  active?: boolean;

  /**
   * Keep Tab and Shift+Tab inside the scope. Set it to false for a scope
   * that only owns the initial focus. Defaults to `true`.
   */
  trapped?: boolean;

  /**
   * Return focus to the element focused before activation. When false,
   * focus stays wherever it is when the scope deactivates.
   * Defaults to `true`.
   */
  restoreFocus?: boolean;

  /**
   * Focus the first focusable child, or the container itself (useful
   * when the scope holds no interactive control yet).
   * Defaults to `first`.
   */
  initialFocus?: PimoluFocusScopeInitialFocus;
}
