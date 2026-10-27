"use client";

import { type PimoluResultStatus, Card, CardContent, Result } from "@pimolu/react";

function ResultIcon({ status, }: {
  status: PimoluResultStatus;
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
  if(status === "success") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16.5 9" />
      </svg>
    );
  }
  if(status === "error") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }
  if(status === "warning") {
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
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 min-w-0 items-start"
          >
            <Card>
              <CardContent>
                <Result
                  status="success"
                  icon={<ResultIcon status="success" />}
                  title="success result"
                  description="A short explanation of what happened and what the reader can do next."
                  classNames={{
                    root: "custom-result-root",
                    title: "custom-result-title"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Result
                  status="error"
                  icon={<ResultIcon status="error" />}
                  title="error result"
                  description="A short explanation of what happened and what the reader can do next."
                  classNames={{
                    root: "custom-result-root",
                    title: "custom-result-title"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Result
                  status="warning"
                  icon={<ResultIcon status="warning" />}
                  title="warning result"
                  description="A short explanation of what happened and what the reader can do next."
                  classNames={{
                    root: "custom-result-root",
                    title: "custom-result-title"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Result
                  status="info"
                  icon={<ResultIcon status="info" />}
                  title="info result"
                  description="A short explanation of what happened and what the reader can do next."
                  classNames={{
                    root: "custom-result-root",
                    title: "custom-result-title"
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-result-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-result-title {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
