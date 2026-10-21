"use client";

import { footerVariants } from "./footer.variants";

import { useId } from "react";

import { Link } from "../link/link";

import type { PimoluFooterProps } from "./footer.types";

export function Footer({
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
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const hasBrand =
    brand != null || description != null || actions != null;

  const hasBottom = copyright != null || bottom != null;

  return (
    <footer
      {...props}
      data-bordered={bordered || undefined}
      className={footerVariants({ appearance }, className)}
    >
      <div className="pimolu-footer__inner">
        {hasBrand && (
          <div className="pimolu-footer__brand">
            {brand != null && (
              <div className="pimolu-footer__brand-mark">
                {brand}
              </div>
            )}

            {description != null && (
              <p className="pimolu-footer__description">
                {description}
              </p>
            )}

            {actions != null && (
              <div className="pimolu-footer__actions">
                {actions}
              </div>
            )}
          </div>
        )}

        {columns.length > 0 && (
          <div className="pimolu-footer__columns">
            {columns.map((column, columnIndex) => {
              const titleId = `pimolu-footer-${id}-${columnIndex}`;

              return (
                <nav
                  key={columnIndex}
                  className="pimolu-footer__column"
                  aria-labelledby={titleId}
                >
                  <h2
                    id={titleId}
                    className="pimolu-footer__column-title"
                  >
                    {column.title}
                  </h2>

                  {column.links.length > 0 && (
                    <ul className="pimolu-footer__links">
                      {column.links.map((link, linkIndex) => (
                        <li
                          key={`${linkIndex}-${link.href}`}
                          className="pimolu-footer__item"
                        >
                          <Link
                            href={link.href}
                            external={link.external}
                            variant="muted"
                            underline="hover"
                            className="pimolu-footer__link"
                          >
                            {link.label}

                            {link.external && (
                              <span className="pimolu-footer__external-hint">
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
        <div className="pimolu-footer__bottom">
          {copyright != null && (
            <p className="pimolu-footer__copyright">
              {copyright}
            </p>
          )}

          {bottom != null && (
            <div className="pimolu-footer__legal">
              {bottom}
            </div>
          )}
        </div>
      )}
    </footer>
  );
}
