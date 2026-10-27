import { CustomizationExample } from "./flex-customization-demo";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  HStack,
  Heading,
  Paragraph,
  Spacer,
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function Block({
  children,
  grow,
}: {
  children: string;
  grow?: boolean;
}) {
  return (
    <Flex
      grow={grow ? 1 : undefined}
      basis={grow ? 0 : undefined}
      style={{ minWidth: 0 }}
    >
      <Box
        padding={3}
        background="muted"
        fullWidth
      >
        <Text size="sm">{children}</Text>
      </Box>
    </Flex>
  );
}

export function FlexPage() {
  return (
    <>
      <PageHeader
        title="Flex"
        hint="The full flexbox axes: direction, alignment, justification, wrapping and gap, plus grow, shrink and basis on the container itself. Styles come from @pimolu/web-styles/flex.css."
      />

      <Section
        title="Direction"
        hint="row (default), row-reverse, column and column-reverse."
      >
        <div className="pg-grid pg-grid--two">
          {(
            [
              "row",
              "row-reverse",
              "column",
              "column-reverse",
            ] as const
          ).map((direction) => (
            <Stack key={direction} gap={2}>
              <Text size="sm" tone="muted">
                {direction}
              </Text>

              <Flex
                direction={direction}
                gap={1}
                style={{ minHeight: 72 }}
              >
                <Block>One</Block>
                <Block>Two</Block>
                <Block>Three</Block>
              </Flex>
            </Stack>
          ))}
        </div>
      </Section>

      <Section
        title="Alignment"
        hint="align-items on the cross axis."
      >
        <Stack gap={3}>
          {(
            [
              "start",
              "center",
              "end",
              "stretch",
            ] as const
          ).map((align) => (
            <Flex
              key={align}
              gap={2}
              align={align}
              style={{ minHeight: 76 }}
            >
              <Block>{`align ${align}`}</Block>
              <Block>second</Block>
            </Flex>
          ))}
        </Stack>
      </Section>

      <Section
        title="Justification"
        hint="justify-content on the main axis, from start to space-evenly."
      >
        <Stack gap={3}>
          {(
            [
              "start",
              "center",
              "end",
              "between",
              "around",
              "evenly",
            ] as const
          ).map((justify) => (
            <Flex
              key={justify}
              gap={2}
              justify={justify}
            >
              <Block>{justify}</Block>
              <Block>second</Block>
              <Block>third</Block>
            </Flex>
          ))}
        </Stack>
      </Section>

      <Section
        title="Wrapping and gap"
        hint="wrap lets items flow onto new lines; the gap stays token-driven."
      >
        <Flex gap={2} wrap>
          {Array.from({ length: 12 }, (_, index) => (
            <Block key={index}>{`item ${index + 1}`}</Block>
          ))}
        </Flex>
      </Section>

      <Section
        title="Grow, shrink and basis"
        hint="These apply to a Flex that is itself a flex item."
      >
        <Stack gap={3}>
          <Flex gap={2} fullWidth>
            <Block grow>grow 1 · basis 0</Block>
            <Block>natural</Block>
            <Block>natural</Block>
          </Flex>

          <Flex gap={2} fullWidth>
            <Block>fixed content</Block>

            <Flex grow={1} basis={120}>
              <Box
                padding={3}
                background="muted"
                fullWidth
              >
                <Text size="sm">grow 1 · basis 120px</Text>
              </Box>
            </Flex>

            <Block>fixed content</Block>
          </Flex>

          <Flex gap={2} fullWidth>
            <Block>shrink 1 (default)</Block>

            <Flex shrink={0} basis={220}>
              <Box
                padding={3}
                background="muted"
                fullWidth
              >
                <Text size="sm">
                  shrink 0 · basis 220px
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same flex container."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Toolbar</CardTitle>
              <CardDescription>
                The actions stay on the right at every width.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Flex
                gap={2}
                align="center"
                wrap
                fullWidth
              >
                <Heading level={3} size="md">
                  Projects
                </Heading>

                <Spacer />

                <Button size="sm" appearance="outline">
                  Filter
                </Button>

                <Button size="sm">New project</Button>
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media object</CardTitle>
              <CardDescription>
                A fixed thumbnail next to fluid text.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Flex gap={3} align="start">
                <img
                  className="pg-media"
                  src="/product.svg"
                  alt="Pimolu Runner sneaker"
                  width={96}
                  height={96}
                  style={{
                    width: 96,
                    height: 96,
                    flex: "0 0 96px",
                  }}
                />

                <Stack gap={1}>
                  <Text weight="medium">
                    Pimolu Runner
                  </Text>

                  <Text size="sm" tone="muted">
                    Lightweight sneaker for everyday runs.
                    The text takes the remaining width and
                    wraps instead of pushing the image.
                  </Text>

                  <HStack gap={2} align="center">
                    <Badge variant="success">In stock</Badge>
                    <Text size="sm">€129</Text>
                  </HStack>
                </Stack>
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split layout</CardTitle>
              <CardDescription>
                Two equal panes with a token gap.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Flex gap={4} align="stretch">
                <Flex grow={1} basis={0}>
                  <Box
                    padding={4}
                    background="muted"
                    fullWidth
                  >
                    <Paragraph size="sm">
                      Primary pane: grows from a zero basis, so
                      both sides stay equal.
                    </Paragraph>
                  </Box>
                </Flex>

                <Flex grow={1} basis={0}>
                  <Box
                    padding={4}
                    background="muted"
                    fullWidth
                  >
                    <Paragraph size="sm">
                      Secondary pane: same rule, same width.
                    </Paragraph>
                  </Box>
                </Flex>
              </Flex>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
