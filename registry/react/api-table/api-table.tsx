"use client";

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

import { forwardRef } from "react";
export const ApiTable = forwardRef<HTMLDivElement, PimoluApiTableProps>(function ApiTable({
  style: motionStyle,
  rows,
  title,
  caption,
  density = "md",
  emptyMessage = "No API entries.",
  className,
  ...props
}, ref) {
  const titleId = `pimolu-api-table-${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  )}`;

  const hasTitle = title != null;

  return (
    <div ref={ref} style={motionStyle}
      {...props}
      className={classes("pimolu-api-table", className)}
    >
      {hasTitle && (
        <div
          id={titleId}
          className="pimolu-api-table__title"
        >
          {title}
        </div>
      )}

      <Table
        density={density}
        caption={caption}
        className="pimolu-api-table__table"
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
                className="pimolu-api-table__empty"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${index}-${row.name}`}
                data-deprecated={row.deprecated || undefined}
                className="pimolu-api-table__row"
              >
                <TableCell className="pimolu-api-table__cell-name">
                  <span className="pimolu-api-table__name">
                    <code className="pimolu-api-table__code">
                      {row.name}
                    </code>

                    {row.required && (
                      <Badge
                        variant="danger"
                        appearance="soft"
                        size="sm"
                        className="pimolu-api-table__badge"
                      >
                        Required
                      </Badge>
                    )}

                    {row.deprecated && (
                      <Badge
                        variant="warning"
                        appearance="soft"
                        size="sm"
                        className="pimolu-api-table__badge"
                      >
                        Deprecated
                      </Badge>
                    )}
                  </span>
                </TableCell>

                <TableCell>
                  <code className="pimolu-api-table__code">
                    {row.type}
                  </code>
                </TableCell>

                <TableCell>
                  {row.default !== undefined &&
                  row.default !== null ? (
                    <code className="pimolu-api-table__code">
                      {row.default}
                    </code>
                  ) : (
                    <span
                      className="pimolu-api-table__default-empty"
                      aria-label="No default value"
                    >
                      —
                    </span>
                  )}
                </TableCell>

                <TableCell className="pimolu-api-table__cell-description">
                  {row.description}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

ApiTable.displayName = "PimoluApiTable";
