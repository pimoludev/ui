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
  {
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

  return (
    <div
      {...containerProps}
      className={wrapperClassName}
      tabIndex={containerProps?.tabIndex ?? 0}
    >
      <table {...props} ref={ref} className={tableClassName}>
        {caption != null && (
          <caption className="pimolu-table__caption">
            {caption}
          </caption>
        )}

        {children}
      </table>
    </div>
  );
});

Table.displayName = "PimoluTable";

/* =========================================
   SECTIONS
========================================= */

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  PimoluTableHeaderProps
>(function TableHeader(
  { className, children, ...props },
  ref
) {
  return (
    <thead
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__header",
        className
      )}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = "PimoluTableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  PimoluTableBodyProps
>(function TableBody(
  { className, children, ...props },
  ref
) {
  return (
    <tbody
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__body",
        className
      )}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = "PimoluTableBody";

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  PimoluTableFooterProps
>(function TableFooter(
  { className, children, ...props },
  ref
) {
  return (
    <tfoot
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__footer",
        className
      )}
    >
      {children}
    </tfoot>
  );
});

TableFooter.displayName = "PimoluTableFooter";

/* =========================================
   ROW
========================================= */

export const TableRow = forwardRef<
  HTMLTableRowElement,
  PimoluTableRowProps
>(function TableRow(
  { className, children, ...props },
  ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__row",
        className
      )}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = "PimoluTableRow";

/* =========================================
   HEADER CELL
========================================= */

export const TableHead = forwardRef<
  HTMLTableCellElement,
  PimoluTableHeadProps
>(function TableHead(
  {
    scope = "col",
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <th
      {...props}
      ref={ref}
      scope={scope}
      className={classes(
        "pimolu-table__head",
        className
      )}
    >
      {children}
    </th>
  );
});

TableHead.displayName = "PimoluTableHead";

/* =========================================
   CELL
========================================= */

export const TableCell = forwardRef<
  HTMLTableCellElement,
  PimoluTableCellProps
>(function TableCell(
  { className, children, ...props },
  ref
) {
  return (
    <td
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__cell",
        className
      )}
    >
      {children}
    </td>
  );
});

TableCell.displayName = "PimoluTableCell";

/* =========================================
   CAPTION
========================================= */

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  PimoluTableCaptionProps
>(function TableCaption(
  { className, children, ...props },
  ref
) {
  return (
    <caption
      {...props}
      ref={ref}
      className={classes(
        "pimolu-table__caption",
        className
      )}
    >
      {children}
    </caption>
  );
});

TableCaption.displayName = "PimoluTableCaption";
