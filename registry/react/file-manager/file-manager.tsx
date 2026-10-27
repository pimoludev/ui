"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  Fragment,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "../breadcrumbs/breadcrumbs";
import { Button } from "../button/button";
import { EmptyState } from "../empty-state/empty-state";
import { formatFileSize } from "../file-upload/file-upload";
import { Input } from "../input/input";
import { SegmentedControl } from "../segmented-control/segmented-control";

import type {
  PimoluFileEntry,
  PimoluFileManagerProps,
  PimoluFileManagerSort,
  PimoluFileManagerSortBy,
  PimoluFileManagerView,
} from "./file-manager.types";

/* =========================================
   DATA MODEL
========================================= */

interface NormalisedEntry extends PimoluFileEntry {
  parentId: string | null;
  source: PimoluFileEntry;
}

interface FileModel {
  entries: NormalisedEntry[];
  byId: Map<string, NormalisedEntry>;
  children: Map<string, NormalisedEntry[]>;
}

function buildModel(
  input: readonly PimoluFileEntry[]
): FileModel {
  const entries: NormalisedEntry[] = [];
  const byId = new Map<string, NormalisedEntry>();

  function visit(
    nodes: readonly PimoluFileEntry[],
    inheritedParent: string | null
  ) {
    nodes.forEach((node) => {
      if (byId.has(node.id)) return;

      const parentId =
        node.parentId !== undefined
          ? node.parentId
          : inheritedParent;

      const normalized: NormalisedEntry = {
        ...node,
        parentId,
        source: node,
      };

      byId.set(node.id, normalized);
      entries.push(normalized);

      if (node.children && node.children.length > 0) {
        visit(node.children, node.id);
      }
    });
  }

  visit(input, null);

  const children = new Map<string, NormalisedEntry[]>();

  entries.forEach((entry) => {
    let parentId = entry.parentId;

    if (
      parentId &&
      (parentId === entry.id ||
        byId.get(parentId)?.type !== "folder")
    ) {
      parentId = null;
    }

    const key = parentId ?? "";
    const bucket = children.get(key);

    if (bucket) {
      bucket.push(entry);
    } else {
      children.set(key, [entry]);
    }
  });

  return { entries, byId, children };
}

/* =========================================
   SORTING
========================================= */

function compareEntries(
  a: NormalisedEntry,
  b: NormalisedEntry,
  sort: PimoluFileManagerSort,
  foldersFirst: boolean,
  locale: string
) {
  if (foldersFirst && a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }

  let comparison = 0;

  if (sort.by === "name") {
    comparison = a.name.localeCompare(b.name, locale, {
      numeric: true,
      sensitivity: "base",
    });
  } else if (sort.by === "date") {
    comparison =
      (a.modified?.getTime() ?? 0) -
      (b.modified?.getTime() ?? 0);
  } else {
    comparison = (a.size ?? 0) - (b.size ?? 0);
  }

  if (comparison === 0) {
    comparison = a.name.localeCompare(b.name, locale, {
      numeric: true,
      sensitivity: "base",
    });
  }

  return sort.direction === "asc"
    ? comparison
    : -comparison;
}

/* =========================================
   ICONS
========================================= */

type FileKind =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "pdf"
  | "spreadsheet"
  | "code"
  | "document"
  | "file";

const EXTENSIONS: Record<
  Exclude<FileKind, "folder" | "file">,
  readonly string[]
> = {
  image: [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "avif",
    "svg",
    "bmp",
    "tif",
    "tiff",
  ],
  video: ["mp4", "mov", "webm", "avi", "mkv", "m4v"],
  audio: ["mp3", "wav", "ogg", "flac", "m4a", "aac"],
  archive: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  pdf: ["pdf"],
  spreadsheet: ["csv", "tsv", "xls", "xlsx", "ods"],
  code: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "css",
    "scss",
    "html",
    "json",
    "py",
    "rb",
    "go",
    "rs",
    "java",
    "php",
    "sh",
    "yml",
    "yaml",
  ],
  document: [
    "doc",
    "docx",
    "txt",
    "rtf",
    "odt",
    "pages",
    "md",
    "mdx",
  ],
};

function getFileKind(entry: PimoluFileEntry): FileKind {
  if (entry.type === "folder") return "folder";

  const mime = entry.mime?.toLowerCase() ?? "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (
    mime.includes("zip") ||
    mime.includes("compressed") ||
    mime.includes("tar")
  ) {
    return "archive";
  }
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    mime.includes("csv")
  ) {
    return "spreadsheet";
  }
  if (
    mime.includes("json") ||
    mime.includes("javascript") ||
    mime.includes("xml") ||
    mime.includes("html")
  ) {
    return "code";
  }

  const extension = entry.name.includes(".")
    ? entry.name
        .split(".")
        .pop()
        ?.toLowerCase() ?? ""
    : "";

  for (const [kind, extensions] of Object.entries(
    EXTENSIONS
  ) as Array<
    [
      Exclude<FileKind, "folder" | "file">,
      readonly string[],
    ]
  >) {
    if (extensions.includes(extension)) {
      return kind;
    }
  }

  return mime.startsWith("text/") ? "document" : "file";
}

function EntryIcon({ classNames, kind }: {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"file-manager">;
 kind: FileKind }) {
  const [partClasses, scopeParts] = usePartClasses("file-manager", classNames, false);

  let content: ReactNode;

  if (kind === "folder") {
    content = (
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    );
  } else if (kind === "image") {
    content = (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m21 15-4.5-4.5L9 19" />
      </>
    );
  } else if (kind === "video") {
    content = (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m10 9 5 3-5 3z" />
      </>
    );
  } else if (kind === "audio") {
    content = (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
      </>
    );
  } else if (kind === "archive") {
    content = (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="M10 5v2m4-2v2m-4 2v2m4-2v2m-4 2v2m4-2v2" />
      </>
    );
  } else if (kind === "pdf") {
    content = (
      <>
        <path d="M6 3h7l5 5v13H6z" />
        <path d="M13 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </>
    );
  } else if (kind === "spreadsheet") {
    content = (
      <>
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M4 10h16M4 15h16M10 4v16" />
      </>
    );
  } else if (kind === "code") {
    content = (
      <>
        <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
      </>
    );
  } else {
    content = (
      <>
        <path d="M6 3h7l5 5v13H6z" />
        <path d="M13 3v5h5" />
        {kind === "document" && (
          <path d="M9 13h6M9 17h5" />
        )}
      </>
    );
  }

  return scopeParts((
    <span
      className={mergeClasses(`pimolu-file-manager__icon pimolu-file-manager__icon--${kind}`, partClasses.icon)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        data-kind={kind}
      >
        {content}
      </svg>
    </span>
  ));
}

function kindLabel(kind: FileKind) {
  if (kind === "folder") return "Folder";

  const labels: Record<
    Exclude<FileKind, "folder">,
    string
  > = {
    image: "Image",
    video: "Video",
    audio: "Audio",
    archive: "Archive",
    pdf: "PDF",
    spreadsheet: "Spreadsheet",
    code: "Code",
    document: "Document",
    file: "File",
  };

  return labels[kind];
}

/* =========================================
   FILE MANAGER
========================================= */

export function FileManager({ classNames,
  entries,
  view,
  defaultView = "list",
  onViewChange,
  selected,
  defaultSelected = [],
  onSelectionChange,
  onSelect,
  path,
  defaultPath = [],
  onPathChange,
  selectionMode = "multiple",
  search,
  defaultSearch = "",
  onSearchChange,
  sort,
  defaultSort = { by: "name", direction: "asc" },
  onSortChange,
  onOpen,
  onDelete,
  locale = "en-US",
  rootLabel = "Files",
  foldersFirst = true,
  className,
  "aria-label": ariaLabel = "File manager",
}: PimoluFileManagerProps) {
  const [partClasses, scopeParts] = usePartClasses("file-manager", classNames, true);

  const model = useMemo(
    () => buildModel(entries),
    [entries]
  );

  const viewControlled = view !== undefined;

  const [internalView, setInternalView] =
    useState<PimoluFileManagerView>(defaultView);

  const resolvedView = view ?? internalView;

  const selectionControlled = selected !== undefined;

  const [internalSelection, setInternalSelection] =
    useState<string[]>(() => [...defaultSelected]);

  const selectedIds = [
    ...(selected ?? internalSelection),
  ];

  const pathControlled = path !== undefined;

  const [internalPath, setInternalPath] =
    useState<string[]>(() => [...defaultPath]);

  const searchControlled = search !== undefined;

  const [internalSearch, setInternalSearch] =
    useState(defaultSearch);

  const searchValue = search ?? internalSearch;

  const sortControlled = sort !== undefined;

  const [internalSort, setInternalSort] =
    useState<PimoluFileManagerSort>(defaultSort);

  const resolvedSort = sort ?? internalSort;

  const [anchorId, setAnchorId] = useState<
    string | null
  >(null);

  const [focusedId, setFocusedId] = useState<
    string | null
  >(null);

  const itemsRef = useRef<HTMLDivElement | null>(null);

  const currentPath = useMemo(() => {
    const result: NormalisedEntry[] = [];

    (path ?? internalPath).forEach((id) => {
      const entry = model.byId.get(id);

      if (
        entry?.type === "folder" &&
        !result.some((item) => item.id === entry.id)
      ) {
        result.push(entry);
      }
    });

    return result;
  }, [model, path, internalPath]);

  const currentFolder =
    currentPath.length > 0
      ? currentPath[currentPath.length - 1]
      : null;

  const currentItems = useMemo(
    () =>
      model.children.get(currentFolder?.id ?? "") ??
      [],
    [model, currentFolder]
  );

  const visibleEntries = useMemo(() => {
    const term = searchValue
      .trim()
      .toLocaleLowerCase(locale);

    return currentItems
      .filter((entry) =>
        term.length === 0
          ? true
          : entry.name
              .toLocaleLowerCase(locale)
              .includes(term)
      )
      .sort((a, b) =>
        compareEntries(
          a,
          b,
          resolvedSort,
          foldersFirst,
          locale
        )
      );
  }, [
    currentItems,
    searchValue,
    resolvedSort,
    foldersFirst,
    locale,
  ]);

  const selectedEntries = useMemo(
    () =>
      selectedIds
        .map((id) => model.byId.get(id))
        .filter(
          (entry): entry is NormalisedEntry =>
            entry !== undefined
        ),
    [selectedIds, model]
  );

  const modifiedFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [locale]
  );

  const activeId = visibleEntries.some(
    (entry) => entry.id === focusedId
  )
    ? focusedId
    : visibleEntries[0]?.id ?? null;

  function emitSelection(next: string[]) {
    const unique = Array.from(new Set(next)).filter(
      (id) => model.byId.has(id)
    );

    if (!selectionControlled) {
      setInternalSelection(unique);
    }

    const nextEntries = unique
      .map((id) => model.byId.get(id))
      .filter(
        (entry): entry is NormalisedEntry =>
          entry !== undefined
      )
      .map((entry) => entry.source);

    onSelectionChange?.(unique, nextEntries);
    onSelect?.(nextEntries);
  }

  function commitPath(next: string[]) {
    if (!pathControlled) {
      setInternalPath(next);
    }

    onPathChange?.(next);
    setFocusedId(null);

    if (selectedIds.length > 0) {
      emitSelection([]);
    }
  }

  function openEntry(entry: NormalisedEntry) {
    if (entry.type === "folder") {
      commitPath([
        ...currentPath.map((folder) => folder.id),
        entry.id,
      ]);
    }

    onOpen?.(entry.source);
  }

  function selectEntry(
    entry: NormalisedEntry,
    modifiers: {
      shiftKey?: boolean;
      metaKey?: boolean;
      ctrlKey?: boolean;
    } = {}
  ) {
    let next: string[];

    if (selectionMode === "single") {
      next = [entry.id];
    } else if (
      modifiers.shiftKey &&
      anchorId !== null
    ) {
      const anchorIndex = visibleEntries.findIndex(
        (item) => item.id === anchorId
      );

      const targetIndex = visibleEntries.findIndex(
        (item) => item.id === entry.id
      );

      if (anchorIndex >= 0 && targetIndex >= 0) {
        const start = Math.min(
          anchorIndex,
          targetIndex
        );

        const end = Math.max(
          anchorIndex,
          targetIndex
        );

        next = visibleEntries
          .slice(start, end + 1)
          .map((item) => item.id);
      } else {
        next = [entry.id];
      }
    } else if (
      modifiers.metaKey ||
      modifiers.ctrlKey
    ) {
      next = selectedIds.includes(entry.id)
        ? selectedIds.filter((id) => id !== entry.id)
        : [...selectedIds, entry.id];
    } else {
      next = [entry.id];
    }

    setAnchorId(entry.id);
    emitSelection(next);
  }

  function deleteEntries(target: PimoluFileEntry[]) {
    if (!onDelete || target.length === 0) return;

    onDelete(target);
  }

  function focusItem(index: number) {
    const nodes =
      itemsRef.current?.querySelectorAll<HTMLElement>(
        "[data-file-id]"
      );

    nodes?.[index]?.focus();
  }

  function handleItemKeyDown(
    event: ReactKeyboardEvent<HTMLElement>,
    entry: NormalisedEntry,
    index: number
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      openEntry(entry);
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      selectEntry(entry, event);
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();

      const target = selectedIds.includes(entry.id)
        ? selectedEntries.map((item) => item.source)
        : [entry.source];

      deleteEntries(target);
      return;
    }

    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLocaleLowerCase() === "a"
    ) {
      event.preventDefault();
      emitSelection(
        visibleEntries.map((item) => item.id)
      );
      return;
    }

    const step =
      event.key === "ArrowDown" ||
      (resolvedView === "grid" &&
        event.key === "ArrowRight")
        ? 1
        : event.key === "ArrowUp" ||
            (resolvedView === "grid" &&
              event.key === "ArrowLeft")
          ? -1
          : 0;

    if (step !== 0) {
      event.preventDefault();

      const next = Math.min(
        visibleEntries.length - 1,
        Math.max(0, index + step)
      );

      setFocusedId(visibleEntries[next]?.id ?? null);
      focusItem(next);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setFocusedId(visibleEntries[0]?.id ?? null);
      focusItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      const last = visibleEntries.length - 1;

      setFocusedId(
        visibleEntries[last]?.id ?? null
      );
      focusItem(last);
    }
  }

  function handleItemClick(
    event: ReactMouseEvent<HTMLElement>,
    entry: NormalisedEntry
  ) {
    setFocusedId(entry.id);

    selectEntry(entry, {
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
    });
  }

  function commitView(next: PimoluFileManagerView) {
    if (!viewControlled) {
      setInternalView(next);
    }

    onViewChange?.(next);
  }

  function commitSearch(next: string) {
    if (!searchControlled) {
      setInternalSearch(next);
    }

    onSearchChange?.(next);
  }

  function commitSort(next: PimoluFileManagerSort) {
    if (!sortControlled) {
      setInternalSort(next);
    }

    onSortChange?.(next);
  }

  function toggleDirection() {
    commitSort({
      by: resolvedSort.by,
      direction:
        resolvedSort.direction === "asc"
          ? "desc"
          : "asc",
    });
  }

  function modifiedLabel(entry: NormalisedEntry) {
    if (
      !entry.modified ||
      Number.isNaN(entry.modified.getTime())
    ) {
      return "—";
    }

    return modifiedFormatter.format(entry.modified);
  }

  function sizeLabel(entry: NormalisedEntry) {
    if (entry.type === "folder") {
      const count =
        model.children.get(entry.id)?.length ?? 0;

      return count === 0
        ? "Empty"
        : `${count} item${count === 1 ? "" : "s"}`;
    }

    return entry.size === undefined
      ? "—"
      : formatFileSize(entry.size);
  }

  function entryAccessibleName(
    entry: NormalisedEntry
  ) {
    return `${entry.name}, ${kindLabel(getFileKind(entry))}, ${sizeLabel(entry)}, modified ${modifiedLabel(entry)}`;
  }

  function itemClassName(
    entry: NormalisedEntry,
    base: string
  ) {
    return [
      base,
      selectedIds.includes(entry.id)
        ? `${base}--selected`
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return scopeParts((
    <section
      className={mergeClasses([
        "pimolu-file-manager",
        `pimolu-file-manager--${resolvedView}`,
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
      aria-label={ariaLabel}
    >
      <div
        className={mergeClasses("pimolu-file-manager__toolbar", partClasses.toolbar)}
        role="toolbar"
        aria-label="File actions"
      >
        <Input
          type="search"
          size="sm"
          aria-label="Search files"
          placeholder="Search files…"
          value={searchValue}
          onValueChange={commitSearch}
          clearable
          clearLabel="Clear search"
          containerClassName="pimolu-file-manager__search"
        />

        <div className={mergeClasses("pimolu-file-manager__actions", partClasses.actions)}>
          <SegmentedControl
            aria-label="File view"
            size="sm"
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
            ]}
            value={resolvedView}
            onValueChange={(value) =>
              commitView(value as PimoluFileManagerView)
            }
          />

          <select
            className={mergeClasses("pimolu-native-select pimolu-file-manager__select", partClasses.select)}
            aria-label="Sort by"
            value={resolvedSort.by}
            onChange={(event) =>
              commitSort({
                ...resolvedSort,
                by: event.currentTarget
                  .value as PimoluFileManagerSortBy,
              })
            }
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
          </select>

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="outline"
            aria-label={
              resolvedSort.direction === "asc"
                ? "Sort descending"
                : "Sort ascending"
            }
            onClick={toggleDirection}
          >
            <span aria-hidden="true">
              {resolvedSort.direction === "asc"
                ? "↑"
                : "↓"}
            </span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="neutral"
            appearance="outline"
            aria-label={selectedEntries.length === 1 ? `Open ${selectedEntries[0].name}` : "Open selected"}
            disabled={selectedEntries.length !== 1 || (selectedEntries[0]?.type === "file" && !onOpen)}
            onClick={() => {
              if (selectedEntries.length === 1) openEntry(selectedEntries[0]);
            }}
          >
            Open
          </Button>

          {onDelete && (
            <Button
              type="button"
              size="sm"
              variant="danger"
              appearance="soft"
              aria-label="Delete selected"
              disabled={selectedEntries.length === 0}
              onClick={() =>
                deleteEntries(
                  selectedEntries.map(
                    (entry) => entry.source
                  )
                )
              }
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className={mergeClasses("pimolu-file-manager__location", partClasses.location)}>
        <Breadcrumbs label="Breadcrumb">
          {currentPath.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>
                {rootLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    commitPath([]);
                  }}
                >
                  {rootLabel}
                </BreadcrumbLink>
              </BreadcrumbItem>

              {currentPath.map((folder, index) => {
                const last =
                  index === currentPath.length - 1;

                return (
                  <Fragment key={folder.id}>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>
                          {folder.name}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();

                            commitPath(
                              currentPath
                                .slice(0, index + 1)
                                .map(
                                  (item) => item.id
                                )
                            );
                          }}
                        >
                          {folder.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </>
          )}
        </Breadcrumbs>

        <span
          className={mergeClasses("pimolu-file-manager__count", partClasses.count)}
          aria-live="polite"
        >
          {visibleEntries.length} item
          {visibleEntries.length === 1 ? "" : "s"}
        </span>
      </div>

      {visibleEntries.length === 0 ? (
        <EmptyState
          size="sm"
          icon={<EntryIcon kind="folder" />}
          title={
            searchValue.trim().length > 0
              ? "No matching files"
              : "This folder is empty"
          }
          description={
            searchValue.trim().length > 0
              ? `No files match “${searchValue.trim()}”.`
              : "Add files to this folder to see them here."
          }
        />
      ) : resolvedView === "list" ? (
        <div
          ref={itemsRef}
          className={mergeClasses("pimolu-file-manager__list", partClasses.list)}
          role="listbox"
          aria-label={`${rootLabel} items`}
          aria-multiselectable={
            selectionMode === "multiple"
              ? true
              : undefined
          }
        >
          {visibleEntries.map((entry, index) => {
            const kind = getFileKind(entry);
            const isSelected =
              selectedIds.includes(entry.id);

            return (
              <div
                key={entry.id}
                role="option"
                aria-selected={isSelected}
                aria-label={entryAccessibleName(entry)}
                tabIndex={activeId === entry.id ? 0 : -1}
                data-file-id={entry.id}
                data-kind={kind}
                className={mergeClasses(itemClassName(
                  entry,
                  "pimolu-file-manager__item"
                ), partClasses.item)}
                onClick={(event) =>
                  handleItemClick(event, entry)
                }
                onDoubleClick={() =>
                  openEntry(entry)
                }
                onFocus={() => setFocusedId(entry.id)}
                onKeyDown={(event) =>
                  handleItemKeyDown(
                    event,
                    entry,
                    index
                  )
                }
              >
                <EntryIcon kind={kind} />

                <span className={mergeClasses("pimolu-file-manager__name", partClasses.name)}>
                  {entry.name}
                </span>

                <span className={mergeClasses("pimolu-file-manager__meta pimolu-file-manager__meta--modified", partClasses.meta)}>
                  {modifiedLabel(entry)}
                </span>

                <span className={mergeClasses("pimolu-file-manager__meta pimolu-file-manager__meta--size", partClasses.meta)}>
                  {sizeLabel(entry)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={itemsRef}
          className={mergeClasses("pimolu-file-manager__grid", partClasses.grid)}
          role="listbox"
          aria-label={`${rootLabel} items`}
          aria-multiselectable={
            selectionMode === "multiple"
              ? true
              : undefined
          }
        >
          <div
            className={mergeClasses("pimolu-file-manager__grid-row", partClasses.gridRow)}
            role="presentation"
          >
            {visibleEntries.map((entry, index) => {
              const kind = getFileKind(entry);
              const isSelected =
                selectedIds.includes(entry.id);

              return (
                <div
                  key={entry.id}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={entryAccessibleName(entry)}
                  tabIndex={
                    activeId === entry.id ? 0 : -1
                  }
                  data-file-id={entry.id}
                  data-kind={kind}
                  className={mergeClasses(itemClassName(
                    entry,
                    "pimolu-file-manager__tile"
                  ), partClasses.tile)}
                  onClick={(event) =>
                    handleItemClick(event, entry)
                  }
                  onDoubleClick={() =>
                    openEntry(entry)
                  }
                  onFocus={() =>
                    setFocusedId(entry.id)
                  }
                  onKeyDown={(event) =>
                    handleItemKeyDown(
                      event,
                      entry,
                      index
                    )
                  }
                >
                  <EntryIcon kind={kind} />

                  <span className={mergeClasses("pimolu-file-manager__tile-name", partClasses.tileName)}>
                    {entry.name}
                  </span>

                  <span className={mergeClasses("pimolu-file-manager__tile-meta", partClasses.tileMeta)}>
                    {sizeLabel(entry)}
                  </span>

                  <span className={mergeClasses("pimolu-file-manager__tile-meta", partClasses.tileMeta)}>
                    {modifiedLabel(entry)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  ));
}
