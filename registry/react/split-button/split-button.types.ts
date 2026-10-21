import type {
  MouseEventHandler,
  ReactNode,
} from "react";

import type {
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from "../button/button.variants";

export interface PimoluSplitButtonItem {
  /** Stable identity used as the menu item key. */
  id: string;

  /** Visible label of the menu action. */
  label: string;

  /** Called when the action is selected; the menu then closes. */
  onSelect?: () => void;

  disabled?: boolean;

  /** Decorative icon rendered before the label. */
  icon?: ReactNode;

  /** Optional keyboard shortcut hint, e.g. "⌘D". */
  shortcut?: string;
}

export interface PimoluSplitButtonProps {
  /** Content of the primary action. Takes precedence over `label`. */
  children?: ReactNode;

  /** Fallback content of the primary action. */
  label?: ReactNode;

  /** Primary action handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /** Actions listed in the attached menu. */
  items: PimoluSplitButtonItem[];

  /** Button semantic variant. Defaults to the Button default ("primary"). */
  variant?: ButtonVariant;

  /** Button appearance. Defaults to the Button default ("solid"). */
  appearance?: ButtonAppearance;

  /** Button size. Defaults to the Button default ("md"). */
  size?: ButtonSize;

  /** Disables both the primary action and the menu trigger. */
  disabled?: boolean;

  /** Accessible name of the menu trigger. Defaults to "More actions". */
  menuLabel?: string;

  /** Horizontal alignment of the menu panel. Defaults to "end". */
  align?: "start" | "end";

  /** Accessible name of the wrapping group. */
  "aria-label"?: string;

  className?: string;

  /** Replace the default chevron of the menu trigger. */
  menuIcon?: ReactNode;
}
