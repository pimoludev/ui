import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CircularProgress,
} from "@pimolu/react";

import {
  circularProgressSizes,
  circularProgressVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

const services = [
  { name: "API", value: 99 },
  { name: "CDN", value: 92 },
  { name: "Workers", value: 64 },
] as const;

export function CircularProgressPage() {
  return (
    <>
      <PageHeader
        title="CircularProgress"
        hint="Completion as a ring, determinate or indeterminate. Sizes and variants are enumerated from circularProgressVariantMap; the styles come from @pimolu/web-styles/circular-progress.css."
      />

      <Section
        title="Sizes"
        hint="The stroke scales with the diameter. The compact readout sits beside the small ring; larger sizes keep it centered."
      >
        <div className="pg-row">
          {circularProgressSizes.map((size) => (
            <div key={size} className="pg-demo-item">
              <CircularProgress
                size={size}
                value={65}
                showValue
                label={`Size ${size}`}
              />
              <span className="pg-meta">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The variant sets the tone of the indicator."
      >
        <div className="pg-row">
          {circularProgressVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <CircularProgress
                variant={variant}
                value={70}
                size="lg"
                label={`Variant ${variant}`}
              />
              <span className="pg-meta">{variant}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Determinate, indeterminate, formatted, clamped."
      >
        <div className="pg-row">
          <div className="pg-demo-item">
            <CircularProgress
              label="Indeterminate"
              size="lg"
            />
            <span className="pg-meta">indeterminate</span>
          </div>

          <div className="pg-demo-item">
            <CircularProgress
              label="With readout"
              value={42}
              size="lg"
              showValue
            />
            <span className="pg-meta">showValue</span>
          </div>

          <div className="pg-demo-item">
            <CircularProgress
              label="Steps"
              value={3}
              max={8}
              size="lg"
              showValue
              formatValue={(value, max) =>
                `${value}/${max}`
              }
            />
            <span className="pg-meta">formatValue</span>
          </div>

          <div className="pg-demo-item">
            <CircularProgress
              label="Clamped"
              value={140}
              variant="warning"
              size="lg"
              showValue
            />
            <span className="pg-meta">value above max</span>
          </div>

          <div className="pg-demo-item">
            <CircularProgress
              label="Small"
              value={25}
              variant="success"
              size="sm"
            />
            <span className="pg-meta">sm, no readout</span>
          </div>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Upload</CardTitle>
              <CardDescription>
                The ring is small enough to sit next to a
                label, so the label stays outside.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <CircularProgress
                  label="design-system.zip"
                  value={68}
                  size="lg"
                  showValue
                  valueLabel="68 percent uploaded"
                />

                <div className="pg-stack">
                  <span className="pg-panel__name">
                    design-system.zip
                  </span>

                  <span className="pg-meta">
                    68% · 4.2 MB of 6.1 MB
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quota</CardTitle>
              <CardDescription>
                A success tone with the value read inside the
                ring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <CircularProgress
                  label="Storage quota"
                  value={42}
                  max={50}
                  size="lg"
                  variant="success"
                  showValue
                  formatValue={(value, max) =>
                    `${value}/${max}`
                  }
                />

                <span className="pg-meta">Go used</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Syncing</CardTitle>
              <CardDescription>
                No known duration: the ring rotates and nothing
                is announced as a value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-row">
                <CircularProgress
                  label="Syncing files"
                  size="lg"
                  variant="secondary"
                />

                <span className="pg-meta">Syncing…</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service health</CardTitle>
              <CardDescription>
                Three small gauges, one tone per state, with
                their labels outside the ring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="pg-row"
                  >
                    <CircularProgress
                      label={service.name}
                      value={service.value}
                      size="sm"
                      variant={
                        service.value >= 90
                          ? "success"
                          : service.value >= 70
                            ? "warning"
                            : "danger"
                      }
                    />

                    <span className="pg-grow">
                      {service.name}
                    </span>

                    <span className="pg-meta">
                      {service.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
