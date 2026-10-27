
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { forwardRef } from "react";

import type {
  PimoluTableBodyProps,
  PimoluTableCellProps,
  PimoluTableCaptionProps,
  PimoluTableFooterProps,
  PimoluTableHeadProps,
  PimoluTableHeaderProps,
  PimoluTableProps,
  PimoluTableRowProps,
} from "./table.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

/* =========================================
   TABLE
========================================= */

export const Table = forwardRef<
  HTMLTableElement,
  PimoluTableProps
>(function Table(
  { classNames,
    density = "md",

    striped = false,
    bordered = false,
    stickyHeader = false,

    caption,
    children,

    className,
    containerClassName,
    containerProps,

    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, true);

  const tableClassName = classes(
    "pimolu-table",
    `pimolu-table--${density}`,
    striped && "pimolu-table--striped",
    bordered && "pimolu-table--bordered",
    stickyHeader && "pimolu-table--sticky-header",
    className
  );

  const wrapperClassName = classes(
    "pimolu-table__wrapper",
    containerClassName,
    containerProps?.className
  );

  return scopeParts((
    <div
      {...containerProps}
      className={mergeClasses(wrapperClassName, partClasses.wrapper)}
      tabIndex={containerProps?.tabIndex ?? 0}
    >
      <table {...props} ref={ref} className={mergeClasses(tableClassName, partClasses.root)}>
        {caption != null && (
          <caption className={mergeClasses("pimolu-table__caption", partClasses.caption)}>
            {caption}
          </caption>
        )}

        {children}
      </table>
    </div>
  ));
});

Table.displayName = "PimoluTable";

/* =========================================
   SECTIONS
========================================= */

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  PimoluTableHeaderProps
>(function TableHeader(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <thead
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__header",
        className
      ), partClasses.header, classNames?.root)}
    >
      {children}
    </thead>
  ));
});

TableHeader.displayName = "PimoluTableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  PimoluTableBodyProps
>(function TableBody(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <tbody
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__body",
        className
      ), partClasses.body, classNames?.root)}
    >
      {children}
    </tbody>
  ));
});

TableBody.displayName = "PimoluTableBody";

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  PimoluTableFooterProps
>(function TableFooter(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <tfoot
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__footer",
        className
      ), partClasses.footer, classNames?.root)}
    >
      {children}
    </tfoot>
  ));
});

TableFooter.displayName = "PimoluTableFooter";

/* =========================================
   ROW
========================================= */

export const TableRow = forwardRef<
  HTMLTableRowElement,
  PimoluTableRowProps
>(function TableRow(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <tr
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__row",
        className
      ), partClasses.row, classNames?.root)}
    >
      {children}
    </tr>
  ));
});

TableRow.displayName = "PimoluTableRow";

/* =========================================
   HEADER CELL
========================================= */

export const TableHead = forwardRef<
  HTMLTableCellElement,
  PimoluTableHeadProps
>(function TableHead(
  { classNames,
    scope = "col",
    className,
    children,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <th
      {...props}
      ref={ref}
      scope={scope}
      className={mergeClasses(classes(
        "pimolu-table__head",
        className
      ), partClasses.head, classNames?.root)}
    >
      {children}
    </th>
  ));
});

TableHead.displayName = "PimoluTableHead";

/* =========================================
   CELL
========================================= */

export const TableCell = forwardRef<
  HTMLTableCellElement,
  PimoluTableCellProps
>(function TableCell(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <td
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__cell",
        className
      ), partClasses.cell, classNames?.root)}
    >
      {children}
    </td>
  ));
});

TableCell.displayName = "PimoluTableCell";

/* =========================================
   CAPTION
========================================= */

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  PimoluTableCaptionProps
>(function TableCaption(
  { classNames, className, children, ...props },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("table", classNames, false);

  return scopeParts((
    <caption
      {...props}
      ref={ref}
      className={mergeClasses(classes(
        "pimolu-table__caption",
        className
      ), partClasses.caption, classNames?.root)}
    >
      {children}
    </caption>
  ));
});

TableCaption.displayName = "PimoluTableCaption";
