"use client";

import { Card, CardContent, Stat } from "@pimolu/react";

function RevenueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ConversionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </svg>
  );
}

function ChurnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9" />
      <path d="M3 4v8h8" />
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
                <Stat
                  label="Monthly revenue"
                  value="$48,200"
                  delta="+12.4%"
                  trend="up"
                  description="Compared with September"
                  icon={<RevenueIcon />}
                  classNames={{
                    root: "custom-stat-root",
                    label: "custom-stat-label"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Active users"
                  value="12,840"
                  delta="+8.2%"
                  trend="up"
                  description="7,310 weekly active"
                  icon={<UsersIcon />}
                  classNames={{
                    root: "custom-stat-root",
                    label: "custom-stat-label"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Conversion"
                  value="3.8%"
                  delta="+0.4 pts"
                  trend="up"
                  description="Checkout to payment"
                  icon={<ConversionIcon />}
                  classNames={{
                    root: "custom-stat-root",
                    label: "custom-stat-label"
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Churn"
                  value="2.1%"
                  delta="-0.4 pts"
                  trend="down"
                  description="Lower is better"
                  icon={<ChurnIcon />}
                  classNames={{
                    root: "custom-stat-root",
                    label: "custom-stat-label"
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
.custom-stat-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-stat-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
