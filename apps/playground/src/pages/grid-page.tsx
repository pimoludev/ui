import { CustomizationExample } from "./grid-customization-demo";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  HStack,
  Heading,
  Paragraph,
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const columns = [1, 2, 3, 4, 6] as const;

function Cell({
  children,
  tall,
}: {
  children: string;
  tall?: boolean;
}) {
  return (
    <Box
      padding={3}
      background="muted"
      style={tall ? { minHeight: 96 } : undefined}
    >
      <Text size="sm">{children}</Text>
    </Box>
  );
}

export function GridPage() {
  return (
    <>
      <PageHeader
        title="Grid"
        hint="A two-dimensional layout with a fixed column count or a responsive auto-fit/auto-fill track, a token gap and item alignment. Columns and minimum item width are exposed as CSS custom properties; styles come from @pimolu/web-styles/grid.css."
      />

      <Section
        title="Columns"
        hint="A number builds repeat(n, minmax(0, 1fr)): equal tracks that never overflow their cells."
      >
        <Stack gap={4}>
          {columns.map((count) => (
            <Stack key={count} gap={2}>
              <Text size="sm" tone="muted">
                columns {count}
              </Text>

              <Grid columns={count} gap={2}>
                {Array.from(
                  { length: count * 2 },
                  (_, index) => (
                    <Cell key={index}>
                      {`cell ${index + 1}`}
                    </Cell>
                  )
                )}
              </Grid>
            </Stack>
          ))}
        </Stack>
      </Section>

      <Section
        title="Responsive tracks"
        hint="auto-fit collapses empty tracks; auto-fill keeps them. The min() guard keeps a track from overflowing a narrow container."
      >
        <Stack gap={4}>
          <Grid
            columns="auto-fit"
            minItemWidth={200}
            gap={2}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <Cell key={index}>
                {`auto-fit ${index + 1}`}
              </Cell>
            ))}
          </Grid>

          <Grid
            columns="auto-fill"
            minItemWidth="14rem"
            gap={2}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <Cell key={index}>
                {`auto-fill ${index + 1}`}
              </Cell>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section
        title="Gap and alignment"
        hint="gap scales on the token system; align and justify drive align-items and justify-items."
      >
        <Stack gap={4}>
          <Grid columns={3} gap={6}>
            <Cell>gap 6</Cell>
            <Cell>gap 6</Cell>
            <Cell>gap 6</Cell>
          </Grid>

          <Grid
            columns={3}
            gap={2}
            align="center"
            justify="center"
          >
            <Cell tall>align center</Cell>
            <Cell>justify center</Cell>
            <Cell tall>justify center</Cell>
          </Grid>

          <Grid columns={3} gap={2} justify="end">
            <Cell>justify end</Cell>
            <Cell>justify end</Cell>
            <Cell>justify end</Cell>
          </Grid>
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same grid."
      >
        <Stack gap={4}>
          <Grid
            columns="auto-fit"
            minItemWidth={220}
            gap={4}
          >
            {[
              {
                name: "Pimolu Runner",
                price: "€129",
                tag: "Shoes",
              },
              {
                name: "Canvas tote",
                price: "€39",
                tag: "Bags",
              },
              {
                name: "Merino cap",
                price: "€29",
                tag: "Accessories",
              },
            ].map((product) => (
              <Card key={product.name}>
                <img
                  className="pg-media"
                  src="/product.svg"
                  alt={product.name}
                />

                <CardHeader>
                  <HStack
                    justify="between"
                    align="center"
                  >
                    <CardTitle>{product.name}</CardTitle>
                    <Badge variant="secondary">
                      {product.tag}
                    </Badge>
                  </HStack>

                  <CardDescription>
                    Ships in 2–3 working days.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Text weight="semibold">
                    {product.price}
                  </Text>
                </CardContent>

                <CardFooter>
                  <Button size="sm" fullWidth>
                    Add to cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>

          <Grid
            columns="auto-fit"
            minItemWidth={180}
            gap={4}
            align="stretch"
          >
            {[
              ["Revenue", "€24,180", "+12.4%"],
              ["Active users", "8,420", "+4.1%"],
              ["Churn", "1.8%", "−0.3%"],
              ["NPS", "62", "+6"],
            ].map(([label, value, delta]) => (
              <Box
                key={label}
                padding={4}
                background="surface"
              >
                <Stack gap={1}>
                  <Text size="sm" tone="muted">
                    {label}
                  </Text>

                  <Heading level={3} size="xl">
                    {value}
                  </Heading>

                  <Text size="sm" tone="success">
                    {delta}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Grid>

          <Grid
            columns="auto-fit"
            minItemWidth={240}
            gap={4}
          >
            <Box padding={6} background="surface">
              <Stack gap={2}>
                <Badge variant="primary">Feature</Badge>

                <Heading level={3} size="lg">
                  One system, every platform
                </Heading>

                <Paragraph size="sm" tone="muted">
                  Grid on web, Stack on native: the same
                  scale names describe the same rhythm.
                </Paragraph>
              </Stack>
            </Box>

            <Box padding={6} background="muted">
              <Stack gap={2}>
                <Text size="sm" tone="muted">
                  Track behaviour
                </Text>

                <Text size="sm">
                  auto-fit removes empty tracks; auto-fill
                  reserves them so the layout does not jump
                  when items are removed.
                </Text>
              </Stack>
            </Box>
          </Grid>
        </Stack>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
