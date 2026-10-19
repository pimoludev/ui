import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Rating,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function InteractiveRating() {
  const [value, setValue] = useState(3);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Badge variant={value > 0 ? "primary" : "neutral"}>
          {value > 0 ? `${value} of 5` : "Not rated"}
        </Badge>

        <Button
          size="sm"
          appearance="ghost"
          onClick={() => setValue(0)}
          disabled={value === 0}
        >
          Reset
        </Button>
      </div>

      <Rating
        label="Product rating"
        value={value}
        onValueChange={setValue}
        allowClear
      />

      <p className="pg-meta">
        Click the selected star again to clear the rating.
        Arrow keys, Home and End also work.
      </p>
    </div>
  );
}

const products = [
  {
    name: "Aurora lamp",
    rating: 5,
    reviews: 128,
    tone: "success" as const,
  },
  {
    name: "Slate desk mat",
    rating: 3,
    reviews: 42,
    tone: "warning" as const,
  },
  {
    name: "Orbit headphones",
    rating: 4,
    reviews: 311,
    tone: "primary" as const,
  },
];

export function RatingPage() {
  return (
    <>
      <PageHeader
        title="Rating"
        hint="A controlled or uncontrolled star rating with a roving radiogroup, arrow/Home/End keys, optional clearing, read-only and disabled states, three sizes and inline SVG stars. Styles come from @pimolu/web-styles/rating.css."
      />

      <Section
        title="Controlled"
        hint="value and onValueChange drive the rating; allowClear makes the selected star clear it."
      >
        <Card>
          <CardHeader>
            <CardTitle>Rate this product</CardTitle>
            <CardDescription>
              Your feedback helps the next buyer.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <InteractiveRating />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Sizes"
        hint="sm, md and lg scale the stars and the visible label together."
      >
        <div className="pg-grid pg-grid--start">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Card key={size}>
              <CardHeader>
                <CardTitle>{size}</CardTitle>
              </CardHeader>

              <CardContent>
                <Rating
                  label="Build quality"
                  defaultValue={4}
                  size={size}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Read-only"
        hint="readOnly keeps the radiogroup semantics and announces aria-readonly, but clicks and keys do not change the value."
      >
        <div className="pg-grid pg-grid--start">
          {products.map((product) => (
            <Card key={product.name}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>

                <CardDescription>
                  {product.reviews} reviews
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="pg-stack">
                  <Rating
                    label="Average rating"
                    value={product.rating}
                    readOnly
                    size="sm"
                  />

                  <Badge variant={product.tone}>
                    {product.rating}.0 / 5
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Disabled and custom scales"
        hint="max changes the number of stars; getLabel replaces the default accessible star labels; disabled removes every star from the tab order."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Disabled</CardTitle>
              <CardDescription>
                A submitted review cannot be edited.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Rating
                label="Your rating"
                value={4}
                disabled
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Three-point scale</CardTitle>
              <CardDescription>
                Custom labels describe the scale.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Rating
                label="Likelihood to recommend"
                max={3}
                defaultValue={2}
                getLabel={(value: number) =>
                  ["Not likely", "Maybe", "Very likely"][
                    value - 1
                  ]
                }
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Example"
        hint="A review form pairs the rating with a heading, context and a primary action."
      >
        <Card>
          <CardHeader>
            <CardTitle>Review your recent order</CardTitle>

            <CardDescription>
              Order PM-1042 was delivered on 19 October.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <Rating
                label="How was the delivery?"
                defaultValue={0}
                size="lg"
                allowClear
              />

              <div className="pg-row">
                <Button size="sm">Submit review</Button>

                <Button
                  size="sm"
                  appearance="ghost"
                >
                  Not now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
