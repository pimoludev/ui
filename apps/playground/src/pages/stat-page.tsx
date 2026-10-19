import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stat,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

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

const sizes = ["sm", "md", "lg"] as const;

export function StatPage() {
  return (
    <>
      <PageHeader
        title="Stat"
        hint="A labelled metric with a value, an optional delta, a description and a decorative icon. Direction is carried by an arrow and a hidden word as well as colour. Styles come from @pimolu/web-styles/stat.css."
      />

      <Section
        title="Dashboard"
        hint="Four metrics from a single reporting period, each labelled as a group."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardContent>
              <Stat
                label="Monthly revenue"
                value="$48,200"
                delta="+12.4%"
                trend="up"
                description="Compared with September"
                icon={<RevenueIcon />}
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
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="sm, md and lg scale the icon, the value and the supporting type together."
      >
        <div className="pg-grid pg-grid--start">
          {sizes.map((size) => (
            <Card key={size}>
              <CardHeader>
                <CardTitle>{size}</CardTitle>
              </CardHeader>

              <CardContent>
                <Stat
                  label="Trial starts"
                  value="1,204"
                  delta="+6.1%"
                  trend="up"
                  description="Last 30 days"
                  icon={<UsersIcon />}
                  size={size}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Trends"
        hint="Up and down use success and danger tokens; neutral stays muted. The arrow and the hidden label remain when colour is unavailable."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardContent>
              <Stat
                label="Response time"
                value="118 ms"
                delta="-24 ms"
                trend="down"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stat
                label="Seats used"
                value="18 of 20"
                delta="0"
                trend="neutral"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stat
                label="Open incidents"
                value="0"
                delta="No incidents"
                trend="neutral"
                description="All services operational"
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Stats work inside a summary card, next to a status badge and a short explanation."
      >
        <Card>
          <CardHeader>
            <CardTitle>Billing snapshot</CardTitle>
            <CardDescription>
              The current subscription at a glance.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-grid pg-grid--two pg-grid--start">
              <Stat
                label="Seats"
                value="12 of 20"
                delta="+3"
                trend="up"
                description="Invite up to eight more teammates"
                icon={<UsersIcon />}
                size="sm"
              />

              <Stat
                label="Renewal"
                value="19 Oct 2026"
                description={
                  <span className="pg-row">
                    Auto-renew is on
                    <Badge variant="success">
                      active
                    </Badge>
                  </span>
                }
                icon={<RevenueIcon />}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
