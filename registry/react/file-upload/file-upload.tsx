"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type {
  PimoluFileUploadProps,
  PimoluFileValidator,
} from "./file-upload.types";

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
  validateFile?: PimoluFileValidator;
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
export function formatFileSize(bytes: number) {
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

/* =========================================
   FILE UPLOAD
======================================== */

export const FileUpload = forwardRef<
  HTMLDivElement,
  PimoluFileUploadProps
>(function FileUpload(
  { classNames,
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

    buttonLabel,
    emptyText = "No files selected",
    removeFileLabel,
    showPreviews = true,

    className,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("file-upload", classNames, true);

  const generatedId = useId();
  const inputId = `pimolu-file-upload-${generatedId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const buttonTextId = `${inputId}-button-text`;

  const inputRef = useRef<HTMLInputElement | null>(null);

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

    /*
     * Reset the native input so choosing the same file again still
     * fires a change event.
     */
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

  const triggerText =
    buttonLabel ??
    (currentFiles.length === 0
      ? multiple
        ? "Choose files"
        : "Choose a file"
      : multiple
        ? "Add files"
        : "Replace file");

  const removeLabel = (file: File) =>
    removeFileLabel?.(file) ?? `Remove ${file.name}`;

  return scopeParts((
    <div
      {...props}
      ref={ref}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      className={mergeClasses([
        "pimolu-file-upload",
        disabled && "pimolu-file-upload--disabled",
        hasError && "pimolu-file-upload--invalid",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.root)}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className={mergeClasses("pimolu-file-upload__label", partClasses.label)}
        >
          {label}
        </label>
      )}

      {description && (
        <p
          id={descriptionId}
          className={mergeClasses("pimolu-file-upload__description", partClasses.description)}
        >
          {description}
        </p>
      )}

      {hasError && (
        <p
          id={errorId}
          className={mergeClasses("pimolu-file-upload__error", partClasses.error)}
          role="alert"
        >
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        id={inputId}
        className={mergeClasses("pimolu-file-upload__input", partClasses.input)}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-label={
          label
            ? undefined
            : multiple
              ? "Choose files"
              : "Choose a file"
        }
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        onChange={handleInputChange}
      />

      {currentFiles.length === 0 ? (
        <div className={mergeClasses("pimolu-file-upload__empty", partClasses.empty)}>
          <span
            className={mergeClasses("pimolu-file-upload__empty-icon", partClasses.emptyIcon)}
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
              <path d="M12 16V4" />
              <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
              <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
          </span>

          <p className={mergeClasses("pimolu-file-upload__empty-text", partClasses.emptyText)}>
            {emptyText}
          </p>

          <button
            type="button"
            className={mergeClasses("pimolu-file-upload__trigger", partClasses.trigger)}
            disabled={disabled}
            aria-labelledby={
              label
                ? `${labelId} ${buttonTextId}`
                : undefined
            }
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            onClick={openPicker}
          >
            <span id={buttonTextId}>{triggerText}</span>
          </button>
        </div>
      ) : (
        <>
          <ul
            className={mergeClasses("pimolu-file-upload__list", partClasses.list)}
            aria-label="Selected files"
          >
            {currentFiles.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className={mergeClasses("pimolu-file-upload__item", partClasses.item)}
              >
                {showPreviews ? (
                  <FilePreview
                    file={file}
                    imageClassName="pimolu-file-upload__preview"
                    fallbackClassName="pimolu-file-upload__file-icon"
                  />
                ) : (
                  <span
                    className={mergeClasses("pimolu-file-upload__file-icon", partClasses.fileIcon)}
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
                  className={mergeClasses("pimolu-file-upload__file-name", partClasses.fileName)}
                  title={file.name}
                >
                  {file.name}
                </span>

                <span className={mergeClasses("pimolu-file-upload__file-size", partClasses.fileSize)}>
                  {formatFileSize(file.size)}
                </span>

                <button
                  type="button"
                  className={mergeClasses("pimolu-file-upload__remove", partClasses.remove)}
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

          <button
            type="button"
            className={mergeClasses("pimolu-file-upload__trigger", partClasses.trigger)}
            disabled={disabled}
            aria-labelledby={
              label
                ? `${labelId} ${buttonTextId}`
                : undefined
            }
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            onClick={openPicker}
          >
            <span id={buttonTextId}>{triggerText}</span>
          </button>
        </>
      )}

      {rejections.length > 0 && (
        <div
          className={mergeClasses("pimolu-file-upload__rejections", partClasses.rejections)}
          role="alert"
        >
          {rejections.map((rejection, index) => (
            <p
              key={`${rejection.file.name}-${index}`}
              className={mergeClasses("pimolu-file-upload__rejection", partClasses.rejection)}
            >
              {rejection.message}
            </p>
          ))}
        </div>
      )}
    </div>
  ));
});

FileUpload.displayName = "PimoluFileUpload";
