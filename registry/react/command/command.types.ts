import type { ReactNode } from "react";

/**
 * A single command shown by `Command` and `CommandPalette`.
 */
export interface PimoluCommandItem {
  /** Stable identifier, also used to track the active option. */
  id: string;

  /** Primary text of the command. */
  label: string;

  /** Optional secondary text shown under the label. */
  description?: string;

  /** Heading that groups related commands. */
  group?: string;

  /** Extra search terms matched case-insensitively. */
  keywords?: readonly string[];

  /** Keyboard hint shown on the right, for example "Ctrl+K". */
  shortcut?: string;

  /** Leading visual, hidden from assistive technology. */
  icon?: ReactNode;

  /** Keep the command visible but prevent selecting it. */
  disabled?: boolean;

  /** Called when the command is selected. */
  onSelect?: () => void;
}

export interface PimoluCommandProps {
  items: readonly PimoluCommandItem[];

  /** Placeholder of the search field. */
  placeholder?: string;

  /** Message shown when no command matches the query. */
  emptyMessage?: string;

  /** Accessible name of the search field and the listbox. */
  "aria-label"?: string;

  /** Called after the selected item's own `onSelect`. */
  onSelect?: (item: PimoluCommandItem) => void;

  /** Class applied to the command root. */
  className?: string;

  /** Focus the search field on mount. Defaults to true. */
  autoFocus?: boolean;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluCommandPaletteProps {
  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the palette asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  items: readonly PimoluCommandItem[];

  /** Accessible name of the dialog and its search field. */
  label?: string;

  /** Key that opens the palette with Cmd/Ctrl, for example "k". */
  shortcut?: string;

  /** Placeholder of the search field. */
  placeholder?: string;

  /** Message shown when no command matches the query. */
  emptyMessage?: string;

  /** Called after the selected item's own `onSelect`. */
  onSelect?: (item: PimoluCommandItem) => void;

  /** Class applied to the dialog panel. */
  className?: string;

  /** Focus the search field on mount. Defaults to true. */
  autoFocus?: boolean;
}
