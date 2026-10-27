
import type { PimoluClassNames } from "../customization/customization.types";

import type { CSSProperties, ReactNode } from "react";

export interface PimoluMentionsOption {
  /** Stable identifier reported by `onSelect`. */
  id: string;

  /** Text inserted after the trigger. */
  label: string;

  /** Optional secondary line in the suggestion list. */
  description?: string;

  /** Optional avatar rendered before the label. */
  avatar?: ReactNode;
}

export interface PimoluMentionsProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"mentions">;

  id?: string;
  name?: string;

  options: readonly PimoluMentionsOption[];

  /** Controlled text value. */
  value?: string;

  /** Initial text when uncontrolled. */
  defaultValue?: string;

  onValueChange?: (value: string) => void;

  /** Called when a suggestion is chosen or created. */
  onSelect?: (option: PimoluMentionsOption) => void;

  /** Character that opens the suggestion list. Defaults to "@". */
  trigger?: string;

  /** Maximum number of suggestions rendered at once. */
  maxSuggestions?: number;

  placeholder?: string;
  label?: string;

  /** Supporting text rendered below the field. */
  helperText?: string;

  disabled?: boolean;

  /** Offer the current query as a new mention when nothing matches. */
  allowCreate?: boolean;

  rows?: number;
  maxLength?: number;
  required?: boolean;
  fullWidth?: boolean;

  className?: string;
  textareaClassName?: string;
  style?: CSSProperties;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
