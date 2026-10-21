"use client";

import { forwardRef } from "react";

import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";

import type { PimoluSplitButtonProps } from "./split-button.types";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}

export const SplitButton = forwardRef<
  HTMLButtonElement,
  PimoluSplitButtonProps
>(function SplitButton(
  {
    children,
    label,
    onClick,
    items,
    variant,
    appearance,
    size,
    disabled = false,
    menuLabel = "More actions",
    align = "end",
    "aria-label": groupLabel,
    className,
    menuIcon,
  },
  ref
) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      data-disabled={disabled || undefined}
      className={[
        "pimolu-split-button",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        ref={ref}
        type="button"
        variant={variant}
        appearance={appearance}
        size={size}
        disabled={disabled}
        onClick={onClick}
        className="pimolu-split-button__primary"
      >
        {children ?? label}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant={variant}
            appearance={appearance}
            size={size}
            disabled={disabled}
            iconOnly
            aria-label={menuLabel}
            title={menuLabel}
            startIcon={menuIcon ?? <ChevronIcon />}
            className="pimolu-split-button__trigger"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="pimolu-split-button__menu"
        >
          {items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              <span className="pimolu-split-button__item">
                {item.icon && (
                  <span
                    className="pimolu-split-button__item-icon"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}

                <span className="pimolu-split-button__item-label">
                  {item.label}
                </span>

                {item.shortcut && (
                  <kbd className="pimolu-split-button__item-shortcut">
                    {item.shortcut}
                  </kbd>
                )}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

SplitButton.displayName = "PimoluSplitButton";
