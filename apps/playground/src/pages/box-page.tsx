import { CustomizationExample } from "./box-customization-demo";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Heading,
  Paragraph,
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const paddings = [0, 1, 2, 3, 4, 6, 8, 12] as const;

export function BoxPage() {
  return (
    <>
      <PageHeader
        title="Box"
        hint="The neutral layout container: padding on the token scale, semantic surfaces and an as prop for the markup. Padding is exposed as a CSS custom property; the styles come from @pimolu/web-styles/box.css."
      />

      <Section
        title="Padding scale"
        hint="0, 1, 2, 3, 4, 6, 8 and 12 map to --pimolu-spacing-* tokens; the surface makes the padded area visible."
      >
        <HStack gap={2} wrap align="start" className="pg-box-scale-demo">
          {paddings.map((padding) => (
            <Box
              key={padding}
              padding={padding}
              background="muted"
            >
              <Text size="sm">{padding}</Text>
            </Box>
          ))}
        </HStack>
      </Section>

      <Section
        title="Axes"
        hint="paddingX and paddingY refine the inline and block axes; p, px and py are aliases."
      >
        <Stack gap={3} className="pg-box-surface-demo">
          <Box
            padding={6}
            paddingX={12}
            background="surface"
          >
            <Text size="sm">
              padding 6 · paddingX 12
            </Text>
          </Box>

          <Box p={2} px={8} background="muted">
            <Text size="sm">
              p 2 · px 8
            </Text>
          </Box>

          <Box paddingY={8} paddingX={2} background="surface">
            <Text size="sm">
              paddingY 8 · paddingX 2
            </Text>
          </Box>
        </Stack>
      </Section>

      <Section
        title="Surfaces"
        hint="Only the semantic surface and muted tokens are available, so every preset and both themes stay consistent."
      >
        <Stack gap={3} className="pg-box-surface-demo">
          <Box padding={4} background="surface">
            <Text size="sm">surface</Text>
          </Box>

          <Box padding={4} background="muted">
            <Text size="sm">muted</Text>
          </Box>

          <Box padding={4}>
            <Text size="sm" tone="muted">
              none — transparent, no surface
            </Text>
          </Box>
        </Stack>
      </Section>

      <Section
        title="Polymorphism"
        hint="as keeps the document outline meaningful without changing the layout."
      >
        <Box
          as="article"
          aria-label="Release notes"
          padding={6}
          background="surface"
        >
          <Stack gap={2}>
            <Badge variant="secondary">release</Badge>

            <Heading level={3} size="lg">
              Version 0.6 is ready
            </Heading>

            <Paragraph size="sm" tone="muted">
              Layout primitives ship with token-driven spacing,
              so pages compose them instead of inventing
              one-off margins.
            </Paragraph>
          </Stack>
        </Box>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same spacing scale."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Team plan</CardTitle>
              <CardDescription>
                Everything a growing team needs.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={4}>
                <Box padding={4} background="muted">
                  <HStack
                    justify="between"
                    align="baseline"
                  >
                    <Text size="sm" tone="muted">
                      per month
                    </Text>

                    <Text size="xl" weight="semibold">
                      €24
                    </Text>
                  </HStack>
                </Box>

                <Stack gap={2}>
                  <Text size="sm">Unlimited projects</Text>
                  <Text size="sm">Shared themes</Text>
                  <Text size="sm">Priority support</Text>
                </Stack>

                <Button fullWidth>Choose the team plan</Button>
              </Stack>
            </CardContent>
          </Card>

          <Box padding={6} background="surface">
            <Stack gap={3}>
              <HStack gap={2} align="center">
                <Badge variant="primary">Tip</Badge>
                <Text size="sm" weight="medium">
                  Space with tokens
                </Text>
              </HStack>

              <Paragraph size="sm" tone="muted">
                Spacing follows the shared token scale. Use
                named aliases when the exact step matters less
                than a consistent rhythm.
              </Paragraph>

              <Box
                padding={4}
                paddingX={6}
                background="muted"
              >
                <Text size="sm">
                  A nested box resets the rhythm.
                </Text>
              </Box>
            </Stack>
          </Box>

          <Box
            as="section"
            aria-label="Notification summary"
            padding={4}
            paddingX={6}
            background="surface"
          >
            <HStack gap={3} align="start">
              <Badge variant="success">New</Badge>

              <Stack gap={1}>
                <Text weight="medium">
                  Three files changed
                </Text>

                <Text size="sm" tone="muted">
                  Review the pull request before the next
                  release.
                </Text>
              </Stack>
            </HStack>
          </Box>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
