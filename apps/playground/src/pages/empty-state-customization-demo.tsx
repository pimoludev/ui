"use client";

import {
  emptyStateVariantMap,
  type PimoluEmptyStateSize,
  Card,
  CardContent,
  EmptyState
} from "@pimolu/react";

type Illustration =
  | "projects"
  | "search"
  | "inbox"
  | "billing";

function EmptyIllustration({
  kind,
}: {
  kind: Illustration;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if(kind === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
        <path d="M8.5 11h5" />
      </svg>
    );
  }

  if(kind === "inbox") {
    return (
      <svg {...common}>
        <path d="M4 5h16l2 9v5H2v-5l2-9Z" />
        <path d="M2 14h5l1.5 2h7L17 14h5" />
      </svg>
    );
  }

  if(kind === "billing") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
      <path d="M4 12.5 12 17l8-4.5" />
      <path d="M4 17.5 12 22l8-4.5" />
    </svg>
  );
}

export function CustomizationExample() {
  const sizes = Object.keys(
    emptyStateVariantMap.size
  ) as PimoluEmptyStateSize[];
  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--start">
            {
              sizes.map((size) => (
                <Card key={size}>
                  <CardContent>
                    <EmptyState
                      size={size}
                      icon={<EmptyIllustration kind="projects" />}
                      title={`${size} empty state`}
                      description="The size changes the rhythm, never the meaning."
                      classNames={{
                        root: "custom-empty-state-root",
                        title: "custom-empty-state-title"
                      }}
                    />
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </>)
      }
      <style>
        {
          `
.custom-empty-state-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-empty-state-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
