import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Center,
  HStack,
  Heading,
  Paragraph,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const gaps = [0, 1, 2, 3, 4, 6, 8, 12] as const;

function Block({
  children,
}: {
  children: string;
}) {
  return (
    <Box padding={3} background="muted">
      <Text size="sm">{children}</Text>
    </Box>
  );
}

export function StackPage() {
  return (
    <>
      <PageHeader
        title="Stack"
        hint="One-dimensional layout: column by default, with a token gap, alignment, justification and wrapping. HStack and VStack are thin fixed-direction wrappers. Styles come from @pimolu/web-styles/stack.css."
      />

      <Section
        title="Direction"
        hint={'Stack is a column by default; direction="row" makes it horizontal.'}
      >
        <div className="pg-grid pg-grid--two">
          <Stack gap={2}>
            <Text size="sm" tone="muted">
              column
            </Text>

            <Stack gap={2}>
              <Block>One</Block>
              <Block>Two</Block>
              <Block>Three</Block>
            </Stack>
          </Stack>

          <Stack gap={2}>
            <Text size="sm" tone="muted">
              row
            </Text>

            <Stack direction="row" gap={2}>
              <Block>One</Block>
              <Block>Two</Block>
              <Block>Three</Block>
            </Stack>
          </Stack>
        </div>
      </Section>

      <Section
        title="Gap scale"
        hint="Every step uses --pimolu-spacing-*: 0, 1, 2, 3, 4, 6, 8 and 12."
      >
        <Stack gap={3}>
          {gaps.map((gap) => (
            <HStack key={gap} gap={4} align="center">
              <Box style={{ minWidth: 32 }}>
                <Text size="sm" tone="muted">
                  {gap}
                </Text>
              </Box>

              <Stack direction="row" gap={gap}>
                <Block>A</Block>
                <Block>B</Block>
                <Block>C</Block>
              </Stack>
            </HStack>
          ))}
        </Stack>
      </Section>

      <Section
        title="Alignment and justification"
        hint="align works on the cross axis, justify on the main axis. The demo uses a centered 160px-tall stage."
      >
        <Stack gap={3}>
          {(
            [
              ["start", "center"],
              ["center", "between"],
              ["end", "end"],
            ] as const
          ).map(([align, justify]) => (
            <Center
              key={`${align}-${justify}`}
              minHeight={120}
              fullWidth
            >
              <Stack
                direction="row"
                gap={2}
                align={align}
                justify={justify}
                fullWidth
                style={{ minHeight: 88 }}
              >
                <Block>{`align ${align}`}</Block>
                <Block>{`justify ${justify}`}</Block>
              </Stack>
            </Center>
          ))}
        </Stack>
      </Section>

      <Section
        title="Wrapping"
        hint="HStack with wrap lets a long row of labels flow onto several lines."
      >
        <HStack gap={2} wrap fullWidth>
          {[
            "Design tokens",
            "Themes",
            "Presets",
            "Layout",
            "Accessibility",
            "Keyboard",
            "Focus",
            "Reduced motion",
            "Forced colors",
            "Contrast",
          ].map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </HStack>
      </Section>

      <Section
        title="HStack and VStack"
        hint="The wrappers remove the direction prop, so a section cannot drift from its chosen axis."
      >
        <div className="pg-grid pg-grid--two">
          <VStack gap={2}>
            <Text size="sm" tone="muted">
              VStack
            </Text>

            <Block>Profile</Block>
            <Block>Notifications</Block>
            <Block>Security</Block>
          </VStack>

          <HStack gap={2} wrap>
            <Text size="sm" tone="muted">
              HStack
            </Text>

            <Badge>Tokens</Badge>
            <Badge>Components</Badge>
            <Badge>Playground</Badge>
          </HStack>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same stack."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>
                Rows with a label, a hint and an action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VStack gap={4}>
                {[
                  [
                    "Product updates",
                    "A short summary every Friday.",
                  ],
                  [
                    "Security alerts",
                    "Sign-ins from a new device.",
                  ],
                  [
                    "Billing",
                    "Invoices and failed payments.",
                  ],
                ].map(([title, description]) => (
                  <HStack
                    key={title}
                    gap={3}
                    align="start"
                  >
                    <VStack gap={1}>
                      <Text weight="medium">{title}</Text>
                      <Text size="sm" tone="muted">
                        {description}
                      </Text>
                    </VStack>

                    <Spacer />

                    <Button size="sm" appearance="outline">
                      Manage
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article layout</CardTitle>
              <CardDescription>
                A vertical stack with a horizontal meta row.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VStack gap={3} align="start">
                <Badge variant="primary">Guide</Badge>

                <Heading level={3} size="lg">
                  Compose instead of override
                </Heading>

                <Paragraph size="sm" tone="muted">
                  Layout primitives keep spacing on the token
                  scale. When a page needs a new rhythm, the
                  scale gains a step rather than the page
                  gaining a magic number.
                </Paragraph>

                <HStack gap={2} align="center">
                  <Text size="sm" weight="medium">
                    Amélie Bernard
                  </Text>

                  <Text size="sm" tone="muted">
                    ·
                  </Text>

                  <Text size="sm" tone="muted">
                    6 min read
                  </Text>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkout summary</CardTitle>
              <CardDescription>
                HStack with a spacer keeps the total on the
                right.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VStack gap={3}>
                <HStack justify="between">
                  <Text size="sm" tone="muted">
                    Subtotal
                  </Text>
                  <Text size="sm">€148</Text>
                </HStack>

                <HStack justify="between">
                  <Text size="sm" tone="muted">
                    Shipping
                  </Text>
                  <Text size="sm">€9</Text>
                </HStack>

                <HStack align="center">
                  <Text weight="medium">Total</Text>
                  <Spacer />
                  <Text weight="semibold">€157</Text>
                </HStack>

                <Button fullWidth>Pay securely</Button>
              </VStack>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
