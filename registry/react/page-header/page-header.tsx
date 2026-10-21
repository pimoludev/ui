"use client";

import {
  Fragment,
  forwardRef,
  type ReactNode,
} from "react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "../breadcrumbs/breadcrumbs";

import type {
  PimoluPageHeaderBreadcrumb,
  PimoluPageHeaderBreadcrumbs,
  PimoluPageHeaderProps,
} from "./page-header.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

function isBreadcrumbList(
  value: PimoluPageHeaderBreadcrumbs
): value is PimoluPageHeaderBreadcrumb[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item != null &&
        typeof item === "object" &&
        "label" in item
    )
  );
}

export const PageHeader = forwardRef<
  HTMLElement,
  PimoluPageHeaderProps
>(function PageHeader(
  {
    title,
    titleAs = "h1",
    description,
    eyebrow,
    actions,
    breadcrumbs,
    meta,
    align = "start",
    className,
    ...props
  },
  ref
) {
  const crumbList = isBreadcrumbList(breadcrumbs)
    ? breadcrumbs
    : null;

  const isEmptyList =
    Array.isArray(breadcrumbs) &&
    breadcrumbs.length === 0;

  const breadcrumbNode: ReactNode =
    crumbList === null &&
    !isEmptyList &&
    breadcrumbs != null
      ? (breadcrumbs as ReactNode)
      : null;

  const hasBreadcrumbs =
    crumbList !== null || breadcrumbNode !== null;

  const Title = titleAs;

  return (
    <header
      {...props}
      ref={ref}
      data-align={align}
      className={classes(
        "pimolu-page-header",
        align === "center" && "pimolu-page-header--center",
        className
      )}
    >
      {hasBreadcrumbs && (
        <div className="pimolu-page-header__breadcrumbs">
          {crumbList !== null ? (
            <Breadcrumbs>
              {crumbList.map((crumb, index) => {
                const current =
                  index === crumbList.length - 1;

                return (
                  <Fragment key={index}>
                    {index > 0 && (
                      <BreadcrumbSeparator />
                    )}

                    <BreadcrumbItem>
                      {current ? (
                        <BreadcrumbPage>
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <span className="pimolu-page-header__crumb">
                          {crumb.label}
                        </span>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </Breadcrumbs>
          ) : (
            breadcrumbNode
          )}
        </div>
      )}

      <div className="pimolu-page-header__body">
        <div className="pimolu-page-header__content">
          {eyebrow != null && (
            <p className="pimolu-page-header__eyebrow">
              {eyebrow}
            </p>
          )}

          <Title className="pimolu-page-header__title">
            {title}
          </Title>

          {description != null && (
            <p className="pimolu-page-header__description">
              {description}
            </p>
          )}

          {meta != null && (
            <div className="pimolu-page-header__meta">
              {meta}
            </div>
          )}
        </div>

        {actions != null && (
          <div className="pimolu-page-header__actions">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
});

PageHeader.displayName = "PimoluPageHeader";
