"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import { useId } from "react";

import { Badge } from "../badge/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";

import type { PimoluApiTableProps } from "./api-table.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export function ApiTable({ classNames,
  rows,
  title,
  caption,
  density = "md",
  emptyMessage = "No API entries.",
  className,
  ...props
}: PimoluApiTableProps) {
  const [partClasses, scopeParts] = usePartClasses("api-table", classNames, true);

  const titleId = `pimolu-api-table-${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  )}`;

  const hasTitle = title != null;

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes("pimolu-api-table", className), partClasses.root)}
    >
      {hasTitle && (
        <div
          id={titleId}
          className={mergeClasses("pimolu-api-table__title", partClasses.title)}
        >
          {title}
        </div>
      )}

      <Table
        density={density}
        caption={caption}
        className={mergeClasses("pimolu-api-table__table", partClasses.table)}
        containerClassName="pimolu-api-table__scroll"
        aria-labelledby={
          hasTitle && caption == null ? titleId : undefined
        }
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col">Default</TableHead>
            <TableHead scope="col">Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className={mergeClasses("pimolu-api-table__empty", partClasses.empty)}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${index}-${row.name}`}
                data-deprecated={row.deprecated || undefined}
                className={mergeClasses("pimolu-api-table__row", partClasses.row)}
              >
                <TableCell className={mergeClasses("pimolu-api-table__cell-name", partClasses.cellName)}>
                  <span className={mergeClasses("pimolu-api-table__name", partClasses.name)}>
                    <code className={mergeClasses("pimolu-api-table__code", partClasses.code)}>
                      {row.name}
                    </code>

                    {row.required && (
                      <Badge
                        variant="danger"
                        appearance="soft"
                        size="sm"
                        className={mergeClasses("pimolu-api-table__badge", partClasses.badge)}
                      >
                        Required
                      </Badge>
                    )}

                    {row.deprecated && (
                      <Badge
                        variant="warning"
                        appearance="soft"
                        size="sm"
                        className={mergeClasses("pimolu-api-table__badge", partClasses.badge)}
                      >
                        Deprecated
                      </Badge>
                    )}
                  </span>
                </TableCell>

                <TableCell>
                  <code className={mergeClasses("pimolu-api-table__code", partClasses.code)}>
                    {row.type}
                  </code>
                </TableCell>

                <TableCell>
                  {row.default !== undefined &&
                  row.default !== null ? (
                    <code className={mergeClasses("pimolu-api-table__code", partClasses.code)}>
                      {row.default}
                    </code>
                  ) : (
                    <span
                      className={mergeClasses("pimolu-api-table__default-empty", partClasses.defaultEmpty)}
                      aria-label="No default value"
                    >
                      —
                    </span>
                  )}
                </TableCell>

                <TableCell className={mergeClasses("pimolu-api-table__cell-description", partClasses.cellDescription)}>
                  {row.description}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  ));
}

ApiTable.displayName = "PimoluApiTable";
