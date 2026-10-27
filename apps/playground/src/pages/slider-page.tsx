import { CustomizationExample } from "./slider-customization-demo";
import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Slider,
} from "@pimolu/react";

import { sliderSizes, sliderVariants } from "../demo-data";
import { PageHeader, Section } from "../section";

/* A real filter: the value drives a badge next to the label. */

function PriceFilter() {
  const [max, setMax] = useState(240);

  return (
    <Slider
      label="Maximum price"
      variant="danger"
      min={40}
      max={500}
      step={20}
      value={max}
      onValueChange={setMax}
      showValue
      formatValue={(value) => `${value} €`}
      helperText="Drag to set the budget ceiling."
    />
  );
}

export function SliderPage() {
  return (
    <>
      <PageHeader
        title="Slider"
        hint="A single value in a range, built on a native input[type=range]. Sizes and variants are enumerated from sliderVariantMap; the styles come from @pimolu/web-styles/slider.css."
      />

      <Section
        title="Sizes"
        hint="The size drives the track height, the thumb and the gap."
      >
        <div className="pg-grid pg-grid--start">
          {sliderSizes.map((size) => (
            <div key={size} className="pg-demo-item">
              <Slider
                label={`Size ${size}`}
                size={size}
                defaultValue={40}
                showValue
              />
              <span className="pg-meta">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The variant sets the tone of the filled part of the track."
      >
        <div className="pg-grid pg-grid--start">
          {sliderVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <Slider
                label={`Variant ${variant}`}
                variant={variant}
                defaultValue={60}
              />
              <span className="pg-meta">{variant}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled, invalid, with or without a readout."
      >
        <div className="pg-grid pg-grid--start">
          <div className="pg-demo-item">
            <Slider label="Disabled" defaultValue={30} disabled />
            <span className="pg-meta">disabled</span>
          </div>

          <div className="pg-demo-item">
            <Slider
              label="Quality"
              variant="success"
              defaultValue={90}
              invalid
              errorMessage="Above the allowed quality for this plan."
            />
            <span className="pg-meta">invalid + errorMessage</span>
          </div>

          <div className="pg-demo-item">
            <Slider
              label="Opacity"
              defaultValue={75}
              showValue
              formatValue={(value) => `${value}%`}
            />
            <span className="pg-meta">showValue + formatValue</span>
          </div>

          <div className="pg-demo-item">
            <Slider
              label="Zoom"
              min={50}
              max={200}
              step={10}
              defaultValue={110}
              showValue
            />
            <span className="pg-meta">
              min 50 · max 200 · step 10
            </span>
          </div>

          <div className="pg-demo-item">
            <Slider
              label="Monthly budget"
              defaultValue={400}
              showValue
              formatValue={(value) => `${value} €`}
              helperText="You can change this later."
            />
            <span className="pg-meta">helperText</span>
          </div>

          <div className="pg-demo-item">
            <Slider label="Notifications" defaultValue={20} required />
            <span className="pg-meta">required</span>
          </div>
        </div>
      </Section>

      <Section
        title="In a form"
        hint="The native input submits its value and the readout follows a native reset."
      >
        <form
          className="pg-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="pg-panel__head">
            <span className="pg-panel__name">Audio settings</span>

            <button type="reset" className="pg-inline-button">
              Reset
            </button>
          </div>

          <div className="pg-stack">
            <Slider
              name="mainVolume"
              label="Main volume"
              defaultValue={70}
              showValue
              formatValue={(value) => `${value}%`}
            />

            <Slider
              name="balance"
              label="Balance"
              min={-50}
              max={50}
              step={5}
              defaultValue={0}
              showValue
              formatValue={(value) =>
                value === 0
                  ? "centered"
                  : value > 0
                    ? `${value}% right`
                    : `${Math.abs(value)}% left`
              }
              helperText="Negative is left, positive is right."
            />

            <Slider
              name="bass"
              label="Bass"
              variant="warning"
              defaultValue={45}
              showValue
            />
          </div>
        </form>
      </Section>

      <Section title="Right-to-left layouts" hint="The native thumb and the filled track share the same direction.">
        <div dir="rtl"><Slider label="Volume" defaultValue={30} showValue /></div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Playback</CardTitle>
              <CardDescription>
                The readout is decorative: the native range
                already announces its own value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                label="Volume"
                defaultValue={65}
                showValue
                formatValue={(value) => `${value}%`}
                helperText="Applies to videos and previews."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage plan</CardTitle>
              <CardDescription>
                A bounded, step-aligned range with a semantic
                tone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                label="Included storage"
                variant="success"
                min={5}
                max={100}
                step={5}
                defaultValue={25}
                showValue
                formatValue={(value) => `${value} Go`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price ceiling</CardTitle>
              <CardDescription>
                A controlled slider: the parent owns the value
                and the badge reads it back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <PriceFilter />

                <div className="pg-row">
                  <span className="pg-meta">Showing results under</span>

                  <Badge variant="danger" appearance="soft">
                    up to 500 €
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sleep timer</CardTitle>
              <CardDescription>
                Minutes before the device pauses playback,
                with a disabled variant for the plan limit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pg-stack">
                <Slider
                  label="Timer"
                  min={0}
                  max={120}
                  step={15}
                  defaultValue={45}
                  showValue
                  formatValue={(value) =>
                    value === 0
                      ? "off"
                      : `${value} min`
                  }
                  helperText="Steps of 15 minutes."
                />

                <Slider
                  label="Screen dimming"
                  min={0}
                  max={100}
                  defaultValue={80}
                  showValue
                  formatValue={(value) => `${value}%`}
                  disabled
                  helperText="Unavailable while the timer is off."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
