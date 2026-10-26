import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  RangeSlider,
} from "@pimolu/react";

import {
  rangeSliderSizes,
  rangeSliderVariants,
} from "../demo-data";
import { PageHeader, Section } from "../section";

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    rest,
  ).padStart(2, "0")}`;
}

/* A real controlled filter: the badge reads the pair back. */

function PriceBracket() {
  const [range, setRange] = useState<[number, number]>([
    40, 180,
  ]);

  return (
    <div className="pg-stack">
      <RangeSlider
        label="Price bracket"
        min={0}
        max={400}
        step={10}
        value={range}
        onValueChange={setRange}
        showValue
        formatValue={([lower, upper]) =>
          `${lower} € \u2013 ${upper} €`
        }
      />

      <div className="pg-row">
        <span className="pg-meta">Active filter</span>

        <Badge appearance="soft">
          {range[0]} € – {range[1]} €
        </Badge>
      </div>
    </div>
  );
}

export function RangeSliderPage() {
  return (
    <>
      <PageHeader
        title="RangeSlider"
        hint="Two bounds in a single range, built on two stacked native inputs. Sizes and variants are enumerated from rangeSliderVariantMap; the styles come from @pimolu/web-styles/range-slider.css."
      />

      <Section
        title="Sizes"
        hint="The size drives the track, the two thumbs and the gap."
      >
        <div className="pg-grid pg-grid--start">
          {rangeSliderSizes.map((size) => (
            <div key={size} className="pg-demo-item">
              <RangeSlider
                label={`Size ${size}`}
                size={size}
                defaultValue={[25, 75]}
                showValue
              />
              <span className="pg-meta">{size}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Variants"
        hint="The variant sets the tone of the selected segment."
      >
        <div className="pg-grid pg-grid--start">
          {rangeSliderVariants.map((variant) => (
            <div key={variant} className="pg-demo-item">
              <RangeSlider
                label={`Variant ${variant}`}
                variant={variant}
                defaultValue={[30, 70]}
              />
              <span className="pg-meta">{variant}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="States"
        hint="Disabled, invalid, formatted readout, custom step."
      >
        <div className="pg-grid pg-grid--start">
          <div className="pg-demo-item">
            <RangeSlider
              label="Disabled"
              defaultValue={[20, 60]}
              disabled
              showValue
            />
            <span className="pg-meta">disabled</span>
          </div>

          <div className="pg-demo-item">
            <RangeSlider
              label="Bracket"
              variant="success"
              defaultValue={[30, 40]}
              invalid
              errorMessage="The bracket is too narrow to return results."
            />
            <span className="pg-meta">invalid + errorMessage</span>
          </div>

          <div className="pg-demo-item">
            <RangeSlider
              label="Budget"
              min={0}
              max={2000}
              step={50}
              defaultValue={[400, 1200]}
              showValue
              formatValue={([lower, upper]) =>
                `${lower} € \u2013 ${upper} €`
              }
            />
            <span className="pg-meta">showValue + formatValue</span>
          </div>

          <div className="pg-demo-item">
            <RangeSlider
              label="Opacity"
              defaultValue={[20, 80]}
              showValue
              formatValue={([lower, upper]) =>
                `${lower}% \u2013 ${upper}%`
              }
              helperText="Applies to every preview."
            />
            <span className="pg-meta">helperText</span>
          </div>
        </div>
      </Section>

      <Section
        title="In a form"
        hint="The two handles submit under <name>Min and <name>Max."
      >
        <form
          className="pg-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="pg-panel__head">
            <span className="pg-panel__name">
              Search filters
            </span>

            <button type="reset" className="pg-inline-button">
              Reset
            </button>
          </div>

          <div className="pg-stack">
            <RangeSlider
              name="price"
              label="Price bracket"
              min={0}
              max={400}
              step={10}
              defaultValue={[40, 180]}
              showValue
              formatValue={([lower, upper]) =>
                `${lower} € \u2013 ${upper} €`
              }
            />

            <RangeSlider
              name="surface"
              label="Surface"
              min={0}
              max={250}
              step={5}
              defaultValue={[40, 120]}
              showValue
              formatValue={([lower, upper]) =>
                `${lower} m² \u2013 ${upper} m²`
              }
              helperText="Submitted as priceMin/priceMax and surfaceMin/surfaceMax."
            />
          </div>
        </form>
      </Section>

      <Section title="Touch and right-to-left layouts" hint="Scroll the page from the track without changing a bound. Tap the track to move the closest handle; drag the native thumbs to adjust it. The fill follows the text direction.">
        <div dir="rtl"><RangeSlider label="Budget" min={0} max={400} defaultValue={[40, 180]} showValue /></div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Price bracket</CardTitle>
              <CardDescription>
                A controlled pair: the parent owns the value and
                the badge reads it back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceBracket />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opening hours</CardTitle>
              <CardDescription>
                Minutes of the day formatted as times, in 15
                minute steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RangeSlider
                label="Business hours"
                min={0}
                max={1440}
                step={15}
                defaultValue={[540, 1080]}
                showValue
                formatValue={([opens, closes]) =>
                  `${formatTime(opens)} \u2013 ${formatTime(
                    closes,
                  )}`
                }
                helperText="Lunch breaks are set per day."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age bracket</CardTitle>
              <CardDescription>
                Integer steps with a plain readout, used as a
                filter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RangeSlider
                label="Between the ages of"
                min={18}
                max={80}
                defaultValue={[25, 45]}
                showValue
                formatValue={([lower, upper]) =>
                  `${lower} \u2013 ${upper} years old`
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comfort range</CardTitle>
              <CardDescription>
                A range that crosses zero, with a semantic tone
                for the comfort zone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RangeSlider
                label="Thermostat"
                variant="warning"
                min={-10}
                max={40}
                step={1}
                defaultValue={[18, 24]}
                showValue
                formatValue={([lower, upper]) =>
                  `${lower} °C \u2013 ${upper} °C`
                }
                helperText="Below 16 °C the heating starts."
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
