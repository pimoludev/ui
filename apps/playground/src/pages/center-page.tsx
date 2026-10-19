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
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function CenterPage() {
  return (
    <>
      <PageHeader
        title="Center"
        hint="Centers its children on both axes with flexbox, optionally as an inline-flex box, with a token-free minimum block size. Styles come from @pimolu/web-styles/center.css."
      />

      <Section
        title="Both axes"
        hint="The box stretches to the available width; minHeight gives the centering something to work with."
      >
        <Center minHeight={200}>
          <Box
            padding={4}
            background="surface"
            style={{ maxWidth: 320 }}
          >
            <Stack gap={2}>
              <Text weight="medium">
                Centered on both axes
              </Text>

              <Text size="sm" tone="muted">
                Horizontal because justify-content is center,
                vertical because min-height is 200px.
              </Text>
            </Stack>
          </Box>
        </Center>
      </Section>

      <Section
        title="Inline"
        hint="inline renders an inline-flex box that shrinks to its content and can sit in a line of text."
      >
        <HStack gap={3} align="center" wrap>
          <Center
            inline
            minHeight={48}
            className="pg-avatar"
          >
            <Text size="sm" weight="semibold">
              AB
            </Text>
          </Center>

          <Center inline minHeight={32}>
            <Badge variant="primary">Badge</Badge>
          </Center>

          <Center inline minHeight={48}>
            <Button size="sm">Action</Button>
          </Center>
        </HStack>
      </Section>

      <Section
        title="Minimum height"
        hint="Numbers are pixels; CSS lengths such as 40vh pass through."
      >
        <Stack gap={3}>
          {(
            [
              [120, "120px"],
              ["40vh", "40vh"],
            ] as const
          ).map(([minHeight, label]) => (
            <Center
              key={label}
              minHeight={minHeight}
              style={{
                border: "1px dashed var(--pimolu-border)",
                borderRadius: "var(--pimolu-radius-md)",
              }}
            >
              <Text size="sm" tone="muted">
                minHeight {label}
              </Text>
            </Center>
          ))}
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same centering box."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardContent>
              <Center minHeight={220}>
                <Stack gap={3} align="center">
                  <Center inline minHeight={64}>
                    <Badge variant="primary">+</Badge>
                  </Center>

                  <Stack gap={1} align="center">
                    <Heading level={3} size="lg">
                      No projects yet
                    </Heading>

                    <Paragraph
                      size="sm"
                      tone="muted"
                      style={{ textAlign: "center" }}
                    >
                      Create the first project to start
                      collecting feedback.
                    </Paragraph>
                  </Stack>

                  <Button size="sm">Create a project</Button>
                </Stack>
              </Center>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign-in panel</CardTitle>
              <CardDescription>
                Centering also works with a full-height
                section in a page layout.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Center
                minHeight={260}
                style={{
                  background: "var(--pimolu-muted)",
                  borderRadius: "var(--pimolu-radius-md)",
                }}
              >
                <Box
                  padding={6}
                  background="surface"
                  style={{ width: "100%", maxWidth: 280 }}
                >
                  <Stack gap={3}>
                    <Text weight="medium">
                      Welcome back
                    </Text>

                    <Text size="sm" tone="muted">
                      The panel is centered inside a muted
                      stage; the action stays full width.
                    </Text>

                    <Button size="sm" fullWidth>
                      Continue
                    </Button>
                  </Stack>
                </Box>
              </Center>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats row</CardTitle>
              <CardDescription>
                Inline centers keep icon and label on the
                same baseline.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <HStack gap={4} wrap>
                {[
                  ["12", "projects"],
                  ["4.2k", "followers"],
                  ["128", "reviews"],
                ].map(([value, label]) => (
                  <HStack key={label} gap={2} align="center">
                    <Center
                      inline
                      minHeight={36}
                      style={{
                        minWidth: 36,
                        borderRadius:
                          "var(--pimolu-radius-full)",
                        background: "var(--pimolu-muted)",
                      }}
                    >
                      <Text size="xs" weight="semibold">
                        {value}
                      </Text>
                    </Center>

                    <Text size="sm" tone="muted">
                      {label}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
