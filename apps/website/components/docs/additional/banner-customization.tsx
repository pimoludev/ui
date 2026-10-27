"use client";

import { type PimoluBannerVariant, Banner } from "@pimolu/react";

function BannerIcon({ variant, }: {
  variant: PimoluBannerVariant;
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
        <path d="M4 12.5 9 17.5 20 6.5" />
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
        <path d="M5 21V8l7-5 7 5v13" />
        <path d="M9 21v-6h6v6" />
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

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <Banner
              variant="info"
              icon={<BannerIcon variant="info" />}
              title="info banner"
              description="A page-level message with a regular content width."
              classNames={{
                root: "custom-banner-root",
                title: "custom-banner-title"
              }}
            />
            <Banner
              variant="success"
              icon={<BannerIcon variant="success" />}
              title="success banner"
              description="A page-level message with a regular content width."
              classNames={{
                root: "custom-banner-root",
                title: "custom-banner-title"
              }}
            />
            <Banner
              variant="warning"
              icon={<BannerIcon variant="warning" />}
              title="warning banner"
              description="A page-level message with a regular content width."
              classNames={{
                root: "custom-banner-root",
                title: "custom-banner-title"
              }}
            />
            <Banner
              variant="danger"
              icon={<BannerIcon variant="danger" />}
              title="danger banner"
              description="A page-level message with a regular content width."
              classNames={{
                root: "custom-banner-root",
                title: "custom-banner-title"
              }}
            />
            <Banner
              variant="neutral"
              icon={<BannerIcon variant="neutral" />}
              title="neutral banner"
              description="A page-level message with a regular content width."
              classNames={{
                root: "custom-banner-root",
                title: "custom-banner-title"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-banner-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-banner-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
