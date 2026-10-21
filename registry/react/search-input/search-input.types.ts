/**
 * Sizes supported by SearchInput. Exported so documentation and tests can
 * enumerate the axis instead of hard-coding it.
 */
export const searchInputSizes = [
  "sm",
  "md",
  "lg",
] as const;

export type PimoluSearchInputSize =
  (typeof searchInputSizes)[number];

export interface PimoluSearchInputProps {
  /** Controlled query. */
  value?: string;

  /** Initial query when uncontrolled. */
  defaultValue?: string;

  /** Called with every next query, including clear and Escape. */
  onValueChange?: (value: string) => void;

  /** Called with the current query when Enter is pressed. */
  onSearch?: (value: string) => void;

  /** Placeholder text. Defaults to "Search…". */
  placeholder?: string;

  /** Keyboard hint rendered as a Kbd, for example "/" or "⌘K". */
  shortcut?: string;

  /** Show the accessible clear button. Defaults to true. */
  clearable?: boolean;

  /** Accessible name for the clear button. */
  clearLabel?: string;

  /** Height and type scale. Defaults to "md". */
  size?: PimoluSearchInputSize;

  /** Visible label, also used as the accessible name. */
  label?: string;

  /** Accessible name when no visible label is supplied. */
  "aria-label"?: string;

  /** Additional accessible description. */
  "aria-describedby"?: string;

  /** Disable the field and its actions. */
  disabled?: boolean;

  /** Class applied to the outer wrapper. */
  className?: string;

  /** Native input name, useful inside a form. */
  name?: string;

  /** Forwarded to the native input. */
  autoComplete?: string;

  /** Focus the field on mount. */
  autoFocus?: boolean;

  /** Native input id, when an external label points at it. */
  id?: string;
}
