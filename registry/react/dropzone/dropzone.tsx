"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluDropzoneProps,
  PimoluDropzoneValidator,
} from "./dropzone.types";

import { FilePreview } from "../internal/file-preview";

/* =========================================
   HELPERS
======================================== */

interface Rejection {
  file: File;
  reason: "type" | "size" | "count" | "custom";
  message: string;
}

interface ValidationOptions {
  accept?: string;
  multiple: boolean;
  maxFiles?: number;
  maxSize?: number;
  validateFile?: PimoluDropzoneValidator;
}

function matchesAccept(
  file: File,
  accept?: string
) {
  const tokens = (accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return tokens.some((token) => {
    if (token === "*/*") return true;

    if (token.startsWith(".")) {
      return name.endsWith(token);
    }

    if (token.endsWith("/*")) {
      return type.startsWith(token.slice(0, -1));
    }

    return type === token;
  });
}

function fileLimit(maxFiles?: number) {
  if (maxFiles === undefined) return Infinity;

  if (!Number.isFinite(maxFiles)) return Infinity;

  return Math.max(0, Math.floor(maxFiles));
}

/** Human-readable file size, for example "1.5 KB". */
function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  const rounded =
    value >= 10
      ? Math.round(value)
      : Number(value.toFixed(1));

  return `${rounded} ${units[unit]}`;
}

function validateSelection(
  incoming: File[],
  current: File[],
  options: ValidationOptions
) {
  const rejections: Rejection[] = [];
  const next = [...current];

  const candidates = options.multiple
    ? incoming
    : incoming.slice(0, 1);

  if (!options.multiple && incoming.length > 1) {
    incoming.slice(1).forEach((file) => {
      rejections.push({
        file,
        reason: "count",
        message: `${file.name} was not added: only one file can be selected.`,
      });
    });
  }

  const limit = options.multiple
    ? fileLimit(options.maxFiles)
    : 1;

  candidates.forEach((file) => {
    if (!matchesAccept(file, options.accept)) {
      rejections.push({
        file,
        reason: "type",
        message: `${file.name} is not an accepted file type.`,
      });
      return;
    }

    if (
      options.maxSize !== undefined &&
      file.size > options.maxSize
    ) {
      rejections.push({
        file,
        reason: "size",
        message: `${file.name} is larger than ${formatFileSize(
          options.maxSize
        )}.`,
      });
      return;
    }

    if (options.multiple && next.length >= limit) {
      rejections.push({
        file,
        reason: "count",
        message: `${file.name} was not added: up to ${limit} file${
          limit === 1 ? "" : "s"
        } can be selected.`,
      });
      return;
    }

    const customMessage = options.validateFile?.(file);

    if (customMessage) {
      rejections.push({
        file,
        reason: "custom",
        message: `${file.name}: ${customMessage}`,
      });
      return;
    }

    if (options.multiple) {
      next.push(file);
    } else {
      next.splice(0, next.length, file);
    }
  });

  return { next, rejections };
}

function transferHasFiles(
  dataTransfer: DataTransfer | null
) {
  if (!dataTransfer) return false;

  return Array.from(dataTransfer.types ?? []).includes(
    "Files"
  );
}

/* =========================================
   DROPZONE
======================================== */

export const Dropzone = forwardRef<
  HTMLDivElement,
  PimoluDropzoneProps
>(function Dropzone(
  {
    files,
    defaultFiles,
    onFilesChange,

    accept,
    multiple = true,
    maxFiles,
    maxSize,

    disabled = false,
    label,
    description,
    error,
    validateFile,

    removeFileLabel,
    showPreviews = true,

    className,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = `pimolu-dropzone-${generatedId}`;
  const labelId = `${inputId}-label`;
  const titleId = `${inputId}-title`;
  const hintId = `${inputId}-hint`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepth = useRef(0);

  const [dragging, setDragging] = useState(false);

  const isControlled = files !== undefined;

  const [internalFiles, setInternalFiles] = useState<File[]>(
    () => defaultFiles ?? []
  );

  const [rejections, setRejections] = useState<
    Rejection[]
  >([]);

  const currentFiles = isControlled ? files : internalFiles;

  const hasError = Boolean(error);

  const describedBy =
    [
      description ? descriptionId : null,
      hasError ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  function commit(next: File[]) {
    if (!isControlled) {
      setInternalFiles(next);
    }

    onFilesChange?.(next);
  }

  function openPicker() {
    if (disabled) return;

    inputRef.current?.click();
  }

  function processFiles(incoming: File[]) {
    if (disabled || incoming.length === 0) return;

    const { next, rejections: nextRejections } =
      validateSelection(incoming, currentFiles, {
        accept,
        multiple,
        maxFiles,
        maxSize,
        validateFile,
      });

    setRejections(nextRejections);

    const accepted =
      next.length !== currentFiles.length ||
      next.some((file, index) => file !== currentFiles[index]);

    if (accepted) {
      commit(next);
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(
      event.currentTarget.files ?? []
    );

    /* Allow the same file to be picked again. */
    event.currentTarget.value = "";

    processFiles(selected);
  }

  function removeFile(index: number) {
    if (disabled) return;

    const next = currentFiles.filter(
      (_, fileIndex) => fileIndex !== index
    );

    setRejections([]);
    commit(next);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openPicker();
  }

  function handleDragEnter(
    event: DragEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (disabled) return;

    if (!transferHasFiles(event.dataTransfer)) return;

    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragOver(
    event: DragEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (disabled) return;

    if (
      event.dataTransfer &&
      transferHasFiles(event.dataTransfer)
    ) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    dragDepth.current = Math.max(
      0,
      dragDepth.current - 1
    );

    if (dragDepth.current === 0) {
      setDragging(false);
    }
  }

  function handleDrop(
    event: DragEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    dragDepth.current = 0;
    setDragging(false);

    if (disabled) return;

    const dropped = Array.from(
      event.dataTransfer?.files ?? []
    );

    processFiles(dropped);
  }

  const removeLabel = (file: File) =>
    removeFileLabel?.(file) ?? `Remove ${file.name}`;

  return (
    <div
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      className={[
        "pimolu-dropzone",
        disabled && "pimolu-dropzone--disabled",
        dragging && "pimolu-dropzone--dragging",
        hasError && "pimolu-dropzone--invalid",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-dropzone__label"
        >
          {label}
        </span>
      )}

      {description && (
        <p
          id={descriptionId}
          className="pimolu-dropzone__description"
        >
          {description}
        </p>
      )}

      {hasError && (
        <p
          id={errorId}
          className="pimolu-dropzone__error"
          role="alert"
        >
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        id={inputId}
        className="pimolu-dropzone__input"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-labelledby={[
          label ? labelId : null,
          titleId,
          hintId,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        onChange={handleInputChange}
      />

      <button
        type="button"
        className="pimolu-dropzone__zone"
        disabled={disabled}
        data-dragging={dragging ? "true" : undefined}
        aria-labelledby={[
          label ? labelId : null,
          titleId,
          hintId,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={() => {
          dragDepth.current = 0;
          setDragging(false);
        }}
      >
        <span
          className="pimolu-dropzone__icon"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M4 14.5A4.5 4.5 0 0 1 6.4 6a6 6 0 0 1 11.5 1.6A3.7 3.7 0 0 1 18 15" />
            <path d="M12 21V11" />
            <path d="m8.5 14.5 3.5-3.5 3.5 3.5" />
          </svg>
        </span>

        <span
          id={titleId}
          className="pimolu-dropzone__title"
        >
          {multiple ? "Drag files here" : "Drag a file here"}
        </span>

        <span
          id={hintId}
          className="pimolu-dropzone__hint"
        >
          or click to browse
        </span>
      </button>

      {currentFiles.length > 0 && (
        <ul
          className="pimolu-dropzone__list"
          aria-label="Selected files"
        >
          {currentFiles.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="pimolu-dropzone__item"
            >
              {showPreviews ? (
                <FilePreview
                  file={file}
                  imageClassName="pimolu-dropzone__preview"
                  fallbackClassName="pimolu-dropzone__file-icon"
                />
              ) : (
                <span
                  className="pimolu-dropzone__file-icon"
                  data-file-preview="fallback"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    focusable="false"
                  >
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                    <path d="M14 3v5h5" />
                  </svg>
                </span>
              )}

              <span
                className="pimolu-dropzone__file-name"
                title={file.name}
              >
                {file.name}
              </span>

              <span className="pimolu-dropzone__file-size">
                {formatFileSize(file.size)}
              </span>

              <button
                type="button"
                className="pimolu-dropzone__remove"
                aria-label={removeLabel(file)}
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {rejections.length > 0 && (
        <div
          className="pimolu-dropzone__rejections"
          role="alert"
        >
          {rejections.map((rejection, index) => (
            <p
              key={`${rejection.file.name}-${index}`}
              className="pimolu-dropzone__rejection"
            >
              {rejection.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
});

Dropzone.displayName = "PimoluDropzone";
