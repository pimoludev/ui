"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import { footerVariants } from "./footer.variants";

import { useId } from "react";

import { Link } from "../link/link";

import type { PimoluFooterProps } from "./footer.types";

export function Footer({ classNames,
  appearance = "surface",
  bordered = true,
  brand,
  description,
  columns,
  actions,
  copyright,
  bottom,
  className,
  ...props
}: PimoluFooterProps) {
  const [partClasses, scopeParts] = usePartClasses("footer", classNames, true);

  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const hasBrand =
    brand != null || description != null || actions != null;

  const hasBottom = copyright != null || bottom != null;

  return scopeParts((
    <footer
      {...props}
      data-bordered={bordered || undefined}
      className={mergeClasses(footerVariants({ appearance }, className), partClasses.root)}
    >
      <div className={mergeClasses("pimolu-footer__inner", partClasses.inner)}>
        {hasBrand && (
          <div className={mergeClasses("pimolu-footer__brand", partClasses.brand)}>
            {brand != null && (
              <div className={mergeClasses("pimolu-footer__brand-mark", partClasses.brandMark)}>
                {brand}
              </div>
            )}

            {description != null && (
              <p className={mergeClasses("pimolu-footer__description", partClasses.description)}>
                {description}
              </p>
            )}

            {actions != null && (
              <div className={mergeClasses("pimolu-footer__actions", partClasses.actions)}>
                {actions}
              </div>
            )}
          </div>
        )}

        {columns.length > 0 && (
          <div className={mergeClasses("pimolu-footer__columns", partClasses.columns)}>
            {columns.map((column, columnIndex) => {
              const titleId = `pimolu-footer-${id}-${columnIndex}`;

              return (
                <nav
                  key={columnIndex}
                  className={mergeClasses("pimolu-footer__column", partClasses.column)}
                  aria-labelledby={titleId}
                >
                  <h2
                    id={titleId}
                    className={mergeClasses("pimolu-footer__column-title", partClasses.columnTitle)}
                  >
                    {column.title}
                  </h2>

                  {column.links.length > 0 && (
                    <ul className={mergeClasses("pimolu-footer__links", partClasses.links)}>
                      {column.links.map((link, linkIndex) => (
                        <li
                          key={`${linkIndex}-${link.href}`}
                          className={mergeClasses("pimolu-footer__item", partClasses.item)}
                        >
                          <Link
                            href={link.href}
                            external={link.external}
                            variant="muted"
                            underline="hover"
                            className={mergeClasses("pimolu-footer__link", partClasses.link)}
                          >
                            {link.label}

                            {link.external && (
                              <span className={mergeClasses("pimolu-footer__external-hint", partClasses.externalHint)}>
                                {" "}
                                (opens in a new tab)
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </nav>
              );
            })}
          </div>
        )}
      </div>

      {hasBottom && (
        <div className={mergeClasses("pimolu-footer__bottom", partClasses.bottom)}>
          {copyright != null && (
            <p className={mergeClasses("pimolu-footer__copyright", partClasses.copyright)}>
              {copyright}
            </p>
          )}

          {bottom != null && (
            <div className={mergeClasses("pimolu-footer__legal", partClasses.legal)}>
              {bottom}
            </div>
          )}
        </div>
      )}
    </footer>
  ));
}
