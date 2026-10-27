"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
import { pageHeaderVariants } from "./page-header.variants";

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
  { classNames,
    title,
    titleAs = "h1",
    description,
    eyebrow,
    actions,
    breadcrumbs,
    meta,
    align = "start",
    size = "md",
    className,
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("page-header", classNames, true);

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

  return scopeParts((
    <header
      {...props}
      ref={ref}
      data-align={align}
      data-size={size}
      className={mergeClasses(classes(
        pageHeaderVariants({ size }),
        align === "center" && "pimolu-page-header--center",
        className
      ), partClasses.root)}
    >
      {hasBreadcrumbs && (
        <div className={mergeClasses("pimolu-page-header__breadcrumbs", partClasses.breadcrumbs)}>
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
                        <span className={mergeClasses("pimolu-page-header__crumb", partClasses.crumb)}>
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

      <div className={mergeClasses("pimolu-page-header__body", partClasses.body)}>
        <div className={mergeClasses("pimolu-page-header__content", partClasses.content)}>
          {eyebrow != null && (
            <p className={mergeClasses("pimolu-page-header__eyebrow", partClasses.eyebrow)}>
              {eyebrow}
            </p>
          )}

          <Title className={mergeClasses("pimolu-page-header__title", partClasses.title)}>
            {title}
          </Title>

          {description != null && (
            <p className={mergeClasses("pimolu-page-header__description", partClasses.description)}>
              {description}
            </p>
          )}

          {meta != null && (
            <div className={mergeClasses("pimolu-page-header__meta", partClasses.meta)}>
              {meta}
            </div>
          )}
        </div>

        {actions != null && (
          <div className={mergeClasses("pimolu-page-header__actions", partClasses.actions)}>
            {actions}
          </div>
        )}
      </div>
    </header>
  ));
});

PageHeader.displayName = "PimoluPageHeader";
