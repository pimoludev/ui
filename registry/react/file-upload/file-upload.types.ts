
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Validates one selected file.
 *
 * Return an error message to reject the file, or `null` / `undefined`
 * to accept it.
 */
export type PimoluFileValidator = (
  file: File
) => string | null | undefined;

/* Public props */

export interface PimoluFileUploadProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange"
  > {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"file-upload">;

  /** Controlled list of files. */
  files?: File[];

  /** Initial files when uncontrolled. Defaults to an empty list. */
  defaultFiles?: File[];

  /** Called with the complete next list after a selection or a removal. */
  onFilesChange?: (files: File[]) => void;

  /**
   * Native accept string, for example `"image/*,.pdf"`. Used both by the
   * file input and by the validation of dropped or selected files.
   */
  accept?: string;

  /** Allow more than one file. Defaults to true. */
  multiple?: boolean;

  /** Maximum number of files kept. Omit for no limit. */
  maxFiles?: number;

  /** Maximum size of a single file, in bytes. Omit for no limit. */
  maxSize?: number;

  /** Disable the trigger, the input and every remove button. */
  disabled?: boolean;

  /** Visible label. */
  label?: ReactNode;

  /** Supporting text below the label. */
  description?: ReactNode;

  /** Error text; also marks the control as invalid. */
  error?: ReactNode;

  /** Extra per-file validation, applied after accept and maxSize. */
  validateFile?: PimoluFileValidator;

  /** Text of the trigger button. */
  buttonLabel?: string;

  /** Text shown when no file is selected. */
  emptyText?: string;

  /** Accessible name of a remove button. Defaults to `Remove <name>`. */
  removeFileLabel?: (file: File) => string;

  /**
   * Show an image thumbnail for image files. Other files keep the document
   * icon. Defaults to true.
   */
  showPreviews?: boolean;
}
