import { CustomizationExample } from "./tabs-customization-demo";
import { SlidingIndicatorTabs } from "./tabs-sliding-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type PimoluTabsActivationMode,
  type PimoluTabsOrientation,
  type PimoluTabsSize,
  type PimoluTabsVariant,
} from "@pimolu/react";

import { tabsSizes, tabsVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

function ProjectTabs({
  label = "Project sections",
  variant = "line",
  size = "md",
  orientation = "horizontal",
  activationMode = "automatic",
  compact = false,
}: {
  label?: string;
  variant?: PimoluTabsVariant;
  size?: PimoluTabsSize;
  orientation?: PimoluTabsOrientation;
  activationMode?: PimoluTabsActivationMode;
  compact?: boolean;
}) {
  return (
    <Tabs
      defaultValue="overview"
      variant={variant}
      size={size}
      orientation={orientation}
      activationMode={activationMode}
    >
      <TabsList aria-label={label}>
        <TabsTrigger value="overview">
          {compact ? "One" : "Overview"}
        </TabsTrigger>

        <TabsTrigger value="activity">
          {compact ? "Two" : "Activity"}
        </TabsTrigger>

        <TabsTrigger value="settings" disabled>
          {compact ? "Three" : "Settings"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="pg-stack">
          <p className="pg-copy">
            The selected tab owns the panel and names it through
            aria-labelledby; the panel points back with
            aria-controls.
          </p>

          <p className="pg-copy">
            Panels stay mounted while hidden, so a form keeps
            what the user typed after a switch.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="activity">
        <div className="pg-stack">
          <p className="pg-copy">
            Three new deployments, two comments and one theme
            change happened this week.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <p className="pg-copy">
          This panel is unreachable because its trigger is
          disabled.
        </p>
      </TabsContent>
    </Tabs>
  );
}

function ControlledTabs() {
  const [value, setValue] = useState("profile");

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant="primary">{value}</Badge>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() =>
            setValue(
              value === "profile" ? "billing" : "profile"
            )
          }
        >
          Switch from outside
        </Button>
      </div>

      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label="Controlled sections">
          <TabsTrigger value="profile">
            Profile
          </TabsTrigger>

          <TabsTrigger value="billing">
            Billing
          </TabsTrigger>

          <TabsTrigger value="security">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <p className="pg-copy">
            The page owns the value; the button above changes it
            without touching the tablist.
          </p>
        </TabsContent>

        <TabsContent value="billing">
          <p className="pg-copy">
            Select Billing, then switch back from the button:
            onValueChange reports every change.
          </p>
        </TabsContent>

        <TabsContent value="security">
          <p className="pg-copy">
            Clicking a trigger calls onValueChange before the
            parent re-renders with the new value.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AccountTabs() {
  return (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList aria-label="Account settings">
        <TabsTrigger value="profile">
          Profile
        </TabsTrigger>

        <TabsTrigger value="notifications">
          Notifications
        </TabsTrigger>

        <TabsTrigger value="security">
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div className="pg-stack">
          <Input
            label="Display name"
            defaultValue="Ada Lovelace"
          />

          <Input
            label="Email"
            defaultValue="ada@example.com"
          />
        </div>
      </TabsContent>

      <TabsContent value="notifications">
        <div className="pg-stack">
          <Checkbox
            label="Deployment succeeded"
            defaultChecked
          />

          <Checkbox label="Weekly summary" defaultChecked />

          <Checkbox label="Product updates" />
        </div>
      </TabsContent>

      <TabsContent value="security">
        <div className="pg-stack">
          <p className="pg-copy">
            Two-factor authentication is enabled. The last
            session was opened from Paris.
          </p>

          <Button size="sm" appearance="outline">
            Review sessions
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function PricingTabs() {
  return (
    <Tabs defaultValue="monthly" variant="soft" size="sm">
      <TabsList aria-label="Billing period">
        <TabsTrigger value="monthly">
          Monthly
        </TabsTrigger>

        <TabsTrigger value="yearly">
          Yearly
        </TabsTrigger>
      </TabsList>

      <TabsContent value="monthly">
        <div className="pg-stack">
          <span className="pg-price">$19 / month</span>

          <p className="pg-copy">
            Monthly billing, cancel at any time. Every plan
            includes the full component set.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="yearly">
        <div className="pg-stack">
          <span className="pg-price">$190 / year</span>

          <div className="pg-row">
            <Badge variant="success">
              Two months free
            </Badge>

            <span className="pg-meta">
              billed once a year
            </span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function SegmentedTabs({
  dividers = false,
}: {
  dividers?: boolean;
}) {
  return (
    <Tabs defaultValue="overview" variant="segmented">
      <TabsList
        aria-label={
          dividers
            ? "Reporting, with dividers"
            : "Reporting"
        }
        dividers={dividers}
      >
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>

        <TabsTrigger value="analytics">
          Analytics
        </TabsTrigger>

        <TabsTrigger value="reports">
          Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <p className="pg-copy">
          A neutral pill track with an elevated active
          segment; no primary colour is involved.
        </p>
      </TabsContent>

      <TabsContent value="analytics">
        <p className="pg-copy">
          The active segment keeps the same shape in light,
          dark and every preset.
        </p>
      </TabsContent>

      <TabsContent value="reports">
        <p className="pg-copy">
          Dividers appear between inactive segments only.
        </p>
      </TabsContent>
    </Tabs>
  );
}

function SegmentedMenuTabs() {
  const sections = [
    {
      value: "account",
      label: "Account",
      copy: "Name, avatar and language.",
    },
    {
      value: "security",
      label: "Security",
      copy: "Password, sessions and two-factor.",
    },
    {
      value: "notifications",
      label: "Notifications",
      copy: "Deployments, comments and summaries.",
    },
    {
      value: "billing",
      label: "Billing",
      copy: "Plan, invoices and payment method.",
    },
  ];

  return (
    <Tabs
      defaultValue="billing"
      orientation="vertical"
      variant="segmented"
    >
      <TabsList aria-label="Account sections">
        {sections.map((section) => (
          <TabsTrigger
            key={section.value}
            value={section.value}
          >
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent
          key={section.value}
          value={section.value}
        >
          <p className="pg-copy">{section.copy}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ScrollableSegmentedTabs() {
  const [showScrollbar, setShowScrollbar] = useState(false);
  const analytics = [
    { value: "performance", label: "Performance" },
    { value: "engagement", label: "Engagement" },
    { value: "audience", label: "Audience" },
    { value: "acquisition", label: "Acquisition" },
    { value: "retention", label: "Retention" },
    { value: "revenue", label: "Revenue" },
    { value: "activation", label: "Activation" },
    { value: "cohorts", label: "Cohorts" },
  ];

  return (
    <div className="pg-stack">
    <Checkbox label="Show native scrollbar" checked={showScrollbar} onCheckedChange={setShowScrollbar} />
    <Tabs defaultValue="retention" variant="segmented">
      <TabsList
        aria-label="Analytics sections"
        scrollable
        showScrollbar={showScrollbar}
        scrollPreviousLabel="Previous tabs"
        scrollNextLabel="Next tabs"
      >
        {analytics.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {analytics.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
        >
          <p className="pg-copy">
            {item.label} panel. The bar scrolls with the
            previous and next buttons when the tabs overflow.
          </p>
        </TabsContent>
      ))}
    </Tabs>
    </div>
  );
}

export function TabsPage() {
  return (
    <>
      <PageHeader
        title="Tabs"
        hint="A tablist with roving focus, automatic or manual activation, horizontal or vertical layout and line, solid, soft or segmented variants. A segmented list can show dividers or scroll with previous/next buttons. Panels stay mounted so form state survives a switch. Styles come from @pimolu/web-styles/tabs.css."
      />

      <Section
        title="Anatomy"
        hint="Tabs, TabsList, TabsTrigger and TabsContent; the disabled Settings trigger is skipped by click and keyboard navigation."
      >
        <ProjectTabs />
      </Section>

      <Section
        title="Variants"
        hint="Enumerated from tabsVariantMap: line, solid and soft here; the segmented variant has its own section below."
      >
        <div className="pg-grid pg-grid--start">
          {tabsVariants
            .filter(
              (variant) => variant !== "segmented"
            )
            .map((variant) => (
              <Card key={variant}>
                <CardHeader>
                  <CardTitle>{variant}</CardTitle>

                  <CardDescription>
                    {variant === "line" &&
                      "An underline follows the active tab."}
                    {variant === "solid" &&
                      "The active tab carries the primary fill."}
                    {variant === "soft" &&
                      "The active tab gets a tinted background."}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ProjectTabs
                    label={`${variant} tabs`}
                    variant={variant}
                    compact
                  />
                </CardContent>
              </Card>
            ))}
        </div>
      </Section>

      <Section
        title="Segmented"
        hint="A neutral pill track with an elevated active segment. Dividers separate inactive segments; the vertical form becomes a menu; the scrollable form adds previous/next buttons when the tabs overflow."
      >
        <div className="pg-grid pg-grid--start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}>
          <Card>
            <CardHeader>
              <CardTitle>Pill track</CardTitle>

              <CardDescription>
                No primary colour: the active segment is a
                raised neutral pill.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SegmentedTabs />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dividers</CardTitle>

              <CardDescription>
                Separators appear between inactive segments
                only.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SegmentedTabs dividers />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vertical menu</CardTitle>

              <CardDescription>
                The same track as a vertical menu, with the
                active row as a pill.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SegmentedMenuTabs />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scrollable</CardTitle>

              <CardDescription>
                The bar stays on one line, the selected tab is
                brought into view, and arrows appear when the
                list overflows.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollableSegmentedTabs />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from tabsVariantMap: sm, md and lg set the trigger height and font size."
      >
        <div className="pg-stack">
          {tabsSizes.map((size) => (
            <ProjectTabs
              key={size}
              label={`${size} tabs`}
              size={size}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Orientation"
        hint="Vertical moves the list to the side, switches the arrow keys to Up and Down, and keeps the panel beside it."
      >
        <AccountTabs />
      </Section>

      <Section
        title="Behaviour"
        hint="Manual activation moves focus without selecting; a controlled value can be changed from outside the tablist."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Manual activation</CardTitle>

              <CardDescription>
                Arrow keys move focus; Enter or Space selects
                the focused tab.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ProjectTabs
                label="Manual tabs"
                activationMode="manual"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controlled</CardTitle>

              <CardDescription>
                value and onValueChange keep the selection in
                the page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ControlledTabs />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Account settings</CardTitle>

              <CardDescription>
                Vertical tabs with form panels that keep their
                values while hidden.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AccountTabs />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing period</CardTitle>

              <CardDescription>
                A soft, small tablist used as a segmented control
                for the price.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <PricingTabs />
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Sliding indicator" hint="A shared CSS indicator follows the selected tab, including unequal widths, vertical lists and interruptions. Customize its duration and easing, or disable animations with animated=false. Reduced motion always takes priority."><SlidingIndicatorTabs /></Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
