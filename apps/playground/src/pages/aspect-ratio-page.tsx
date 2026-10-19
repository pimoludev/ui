import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
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

const ratios = [
  [16 / 9, "16 / 9"],
  [4 / 3, "4 / 3"],
  [1, "1 / 1"],
  [21 / 9, "21 / 9"],
  [2.5, "2.5"],
] as const;

export function AspectRatioPage() {
  return (
    <>
      <PageHeader
        title="AspectRatio"
        hint="Reserves a fixed width-to-height ratio with the CSS aspect-ratio property, even before the media loads. Children fill the box; images and video cover it. Styles come from @pimolu/web-styles/aspect-ratio.css."
      />

      <Section
        title="Ratios"
        hint="The default is 16 / 9; any positive finite number works. Invalid values fall back to the default."
      >
        <Grid
          columns="auto-fit"
          minItemWidth={180}
          gap={4}
        >
          {ratios.map(([ratio, label]) => (
            <Stack key={label} gap={2}>
              <AspectRatio
                ratio={ratio}
                style={{
                  borderRadius: "var(--pimolu-radius-md)",
                  background: "var(--pimolu-muted)",
                }}
              >
                <img
                  src="/product.svg"
                  alt={`Pimolu Runner at ${label}`}
                />
              </AspectRatio>

              <Text size="sm" tone="muted">
                ratio {label}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Section>

      <Section
        title="Non-media content"
        hint="The content wrapper is a grid, so a non-image child stretches to the reserved area."
      >
        <Grid columns={3} gap={4}>
          {["Plan", "Build", "Ship"].map((label, index) => (
            <AspectRatio
              key={label}
              ratio={1}
              style={{
                borderRadius: "var(--pimolu-radius-md)",
                background: "var(--pimolu-muted)",
              }}
            >
              <Box
                padding={4}
                fullWidth
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Badge variant="secondary">
                  step {index + 1}
                </Badge>

                <Text weight="semibold">{label}</Text>
              </Box>
            </AspectRatio>
          ))}
        </Grid>
      </Section>

      <Section
        title="Invalid fallbacks"
        hint="Zero, negative and non-finite values keep the 16 / 9 default instead of collapsing the box."
      >
        <Grid columns={3} gap={2}>
          {[0, -2, Number.POSITIVE_INFINITY].map(
            (ratio, index) => (
              <AspectRatio
                key={index}
                ratio={ratio}
                style={{
                  borderRadius: "var(--pimolu-radius-md)",
                  background: "var(--pimolu-muted)",
                }}
              >
                <Text size="xs">
                  ratio {String(ratio)}
                </Text>
              </AspectRatio>
            )
          )}
        </Grid>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same ratio box."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <AspectRatio ratio={16 / 9}>
              <img
                src="/product.svg"
                alt="Pimolu Runner sneaker"
              />
            </AspectRatio>

            <CardHeader>
              <HStack justify="between" align="center">
                <CardTitle>Pimolu Runner</CardTitle>
                <Badge variant="success">New</Badge>
              </HStack>

              <CardDescription>
                The media reserves its space, so the card does
                not jump when the image arrives.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Text weight="semibold">€129</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video embed</CardTitle>
              <CardDescription>
                16 / 9 matches the default video frame.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AspectRatio
                ratio={16 / 9}
                style={{
                  borderRadius: "var(--pimolu-radius-md)",
                  overflow: "hidden",
                }}
              >
                <Box
                  background="muted"
                  fullWidth
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack gap={2} align="center">
                    <Text weight="medium">Video placeholder</Text>

                    <Text size="sm" tone="muted">
                      iframe, video or canvas fills the box
                    </Text>
                  </Stack>
                </Box>
              </AspectRatio>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery tile</CardTitle>
              <CardDescription>
                A square tile keeps a grid of different
                products aligned.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={3}>
                <AspectRatio ratio={1}>
                  <img
                    src="/product.svg"
                    alt="Pimolu Runner, square crop"
                  />
                </AspectRatio>

                <Stack gap={1}>
                  <Heading level={3} size="md">
                    Everyday collection
                  </Heading>

                  <Paragraph size="sm" tone="muted">
                    Square media is predictable in a masonry
                    or a carousel.
                  </Paragraph>

                  <Button size="sm" appearance="outline">
                    Browse the collection
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
