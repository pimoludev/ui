export type PimoluFileEntryType = "file" | "folder";

export type PimoluFileManagerView = "list" | "grid";

export type PimoluFileManagerSortBy =
  | "name"
  | "date"
  | "size";

export type PimoluFileManagerSortDirection =
  | "asc"
  | "desc";

export interface PimoluFileManagerSort {
  by: PimoluFileManagerSortBy;
  direction: PimoluFileManagerSortDirection;
}

/**
 * A file or folder. Children can be nested (`children`) or linked through a
 * flat `parentId`; both shapes can be mixed in the same data set.
 */
export interface PimoluFileEntry {
  /** Stable identifier. */
  id: string;

  /** Visible name. */
  name: string;

  /** Whether the entry can be opened as a folder. */
  type: PimoluFileEntryType;

  /** Size in bytes, for files. */
  size?: number;

  /** Last modification date. */
  modified?: Date;

  /** MIME type, used to choose the icon. */
  mime?: string;

  /** Nested children. Their parent is inferred from this entry. */
  children?: readonly PimoluFileEntry[];

  /** Parent folder id for flat data. `null` means the root. */
  parentId?: string | null;
}

export interface PimoluFileManagerProps {
  /** Full data set. Only the direct children of the current folder are shown. */
  entries: readonly PimoluFileEntry[];

  /** Controlled view. */
  view?: PimoluFileManagerView;

  /** Initial view when uncontrolled. Defaults to "list". */
  defaultView?: PimoluFileManagerView;

  /** Called when the List/Grid toggle changes. */
  onViewChange?: (view: PimoluFileManagerView) => void;

  /** Controlled selected ids. */
  selected?: readonly string[];

  /** Initial selected ids when uncontrolled. */
  defaultSelected?: readonly string[];

  /** Called with the selected ids and their entries whenever selection changes. */
  onSelectionChange?: (
    ids: string[],
    entries: PimoluFileEntry[]
  ) => void;

  /** Called with the selected entries whenever selection changes. */
  onSelect?: (entries: PimoluFileEntry[]) => void;

  /** Controlled folder path, from the root to the current folder. */
  path?: readonly string[];

  /** Initial folder path when uncontrolled. Defaults to the root. */
  defaultPath?: readonly string[];

  /** Called when the current folder changes. */
  onPathChange?: (path: string[]) => void;

  /** "single" replaces the selection; "multiple" supports Ctrl/Cmd and Shift. */
  selectionMode?: "single" | "multiple";

  /** Controlled search term. */
  search?: string;

  /** Initial search term when uncontrolled. */
  defaultSearch?: string;

  /** Called whenever the search term changes. */
  onSearchChange?: (value: string) => void;

  /** Controlled sort. */
  sort?: PimoluFileManagerSort;

  /** Initial sort when uncontrolled. Defaults to name ascending. */
  defaultSort?: PimoluFileManagerSort;

  /** Called whenever the sort column or direction changes. */
  onSortChange?: (sort: PimoluFileManagerSort) => void;

  /**
   * Called when a folder is opened or when a file is double-clicked (or
   * activated with Enter).
   */
  onOpen?: (entry: PimoluFileEntry) => void;

  /** Called with the selected entries when Delete is pressed or the toolbar action is used. */
  onDelete?: (entries: PimoluFileEntry[]) => void;

  /** BCP 47 locale used for dates and name sorting. Defaults to "en-US". */
  locale?: string;

  /** Label of the root breadcrumb. Defaults to "Files". */
  rootLabel?: string;

  /** Keep folders before files regardless of the sort column. Defaults to true. */
  foldersFirst?: boolean;

  /** Class applied to the outer file manager. */
  className?: string;

  /** Accessible name of the file manager. Defaults to "File manager". */
  "aria-label"?: string;
}
