"use client";

import { alertVariantMap, type PimoluAlertVariant, Alert } from "@pimolu/react";

function AlertIcon({
  variant,
}: {
  variant: PimoluAlertVariant;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if(variant === "success") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if(variant === "warning") {
    return (
      <svg {...common}>
        <path
          d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
        />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if(variant === "danger") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }

  if(variant === "neutral") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16.5h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-stack">
            {
              Object.keys(alertVariantMap.variant).map(
                (variant) => {
                  const tone =
                    variant as PimoluAlertVariant;

                  return (
                    <Alert
                      key={tone}
                      variant={tone}
                      icon={<AlertIcon variant={tone} />}
                      title={`${tone} alert`}
                      description="A short message that stays close to the content it describes."
                      classNames={{
                        root: "custom-alert-root",
                        title: "custom-alert-title"
                      }}
                    />
                  );
                }
              )
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-alert-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-alert-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
