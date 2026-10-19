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
  Spacer,
  Stack,
  Text,
  VStack,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function Pill({
  children,
}: {
  children: string;
}) {
  return (
    <Box padding={2} paddingX={3} background="muted">
      <Text size="sm">{children}</Text>
    </Box>
  );
}

export function SpacerPage() {
  return (
    <>
      <PageHeader
        title="Spacer"
        hint="A flexible gap (flex: 1) or a fixed size taken from the spacing scale. It is always aria-hidden, so it never reaches the accessibility tree. Styles come from @pimolu/web-styles/spacer.css."
      />

      <Section
        title="Flexible"
        hint="Without size, the spacer absorbs the free space in a row or a column."
      >
        <Stack gap={4}>
          <Flex gap={2} align="center" fullWidth>
            <Pill>Brand</Pill>
            <Spacer />
            <Pill>Actions</Pill>
          </Flex>

          <Flex gap={2} align="center" fullWidth>
            <Pill>Left</Pill>
            <Spacer />
            <Pill>Center</Pill>
            <Spacer />
            <Pill>Right</Pill>
          </Flex>

          <VStack gap={2} style={{ minHeight: 160 }}>
            <Pill>Top</Pill>
            <Spacer />
            <Pill>Bottom</Pill>
          </VStack>
        </Stack>
      </Section>

      <Section
        title="Fixed size"
        hint="size uses the spacing scale and flex: 0 0 auto, so it never grows or shrinks."
      >
        <HStack gap={0} align="center" wrap>
          {([1, 2, 3, 4, 6, 8, 12] as const).map((size) => (
            <HStack
              key={size}
              gap={0}
              align="center"
            >
              <Box
                padding={1}
                background="surface"
                style={{ outline: "1px solid var(--pimolu-border)" }}
              >
                <Text size="xs">{size}</Text>
              </Box>

              <Spacer
                size={size}
                axis="horizontal"
                style={{
                  alignSelf: "stretch",
                  minHeight: 1,
                  background: "var(--pimolu-primary)",
                }}
              />
            </HStack>
          ))}
        </HStack>
      </Section>

      <Section
        title="Axis"
        hint="horizontal sizes the inline axis, vertical the block axis, both (default) does both."
      >
        <Stack gap={4}>
          <HStack gap={0} align="center">
            <Pill>inline start</Pill>
            <Spacer
              size={10}
              axis="horizontal"
              style={{
                height: 1,
                background: "var(--pimolu-primary)",
              }}
            />
            <Pill>inline end</Pill>
          </HStack>

          <VStack gap={0} style={{ minHeight: 160 }}>
            <Pill>block start</Pill>
            <Spacer
              size={8}
              axis="vertical"
              style={{
                width: 1,
                background: "var(--pimolu-primary)",
              }}
            />
            <Pill>block end</Pill>
          </VStack>

          <HStack gap={2} align="center">
            <Pill>both</Pill>
            <Spacer
              size={4}
              style={{
                background: "var(--pimolu-primary)",
              }}
            />
            <Pill>both</Pill>
          </HStack>
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same spacer."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>App bar</CardTitle>
              <CardDescription>
                The brand and the actions stay at opposite
                ends at every width.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Flex
                gap={3}
                align="center"
                wrap
                fullWidth
              >
                <Heading level={3} size="md">
                  Pimolu
                </Heading>

                <Spacer />

                <HStack gap={2} align="center">
                  <Badge variant="secondary">docs</Badge>

                  <Button size="sm" appearance="ghost">
                    Sign in
                  </Button>

                  <Button size="sm">Get started</Button>
                </HStack>
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card footer</CardTitle>
              <CardDescription>
                A spacer pushes the secondary action away
                from the primary one.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VStack gap={4}>
                <Text size="sm" tone="muted">
                  Changes are saved automatically when the
                  dialog closes.
                </Text>

                <HStack gap={2} align="center">
                  <Button size="sm" appearance="ghost">
                    Discard
                  </Button>

                  <Spacer />

                  <Button
                    size="sm"
                    appearance="outline"
                  >
                    Save draft
                  </Button>

                  <Button size="sm">Publish</Button>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Divider rhythm</CardTitle>
              <CardDescription>
                Fixed spacers separate label groups without
                extra margins.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <HStack gap={0} align="center" wrap>
                <Pill>Profile</Pill>

                <Spacer
                  size={4}
                  axis="horizontal"
                  style={{
                    height: 1,
                    background: "var(--pimolu-border)",
                  }}
                />

                <Pill>Security</Pill>

                <Spacer
                  size={4}
                  axis="horizontal"
                  style={{
                    height: 1,
                    background: "var(--pimolu-border)",
                  }}
                />

                <Pill>Notifications</Pill>
              </HStack>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
