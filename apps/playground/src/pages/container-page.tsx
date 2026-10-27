import { CustomizationExample } from "./container-customization-demo";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Paragraph,
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const maxWidths = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;

export function ContainerPage() {
  return (
    <>
      <PageHeader
        title="Container"
        hint="A fluid width with a maximum and a token gutter, centered by default. maxWidth steps from 640px to 1536px, or full for no cap. Styles come from @pimolu/web-styles/container.css."
      />

      <Section
        title="Max widths"
        hint="Every container stays width: 100%; the max-width only caps it when the viewport is wider."
      >
        <Stack gap={3}>
          {maxWidths.map((maxWidth) => (
            <Container
              key={maxWidth}
              maxWidth={maxWidth}
              padding={2}
            >
              <Box padding={3} background="muted">
                <Text size="sm">
                  maxWidth {maxWidth}
                </Text>
              </Box>
            </Container>
          ))}
        </Stack>
      </Section>

      <Section
        title="Gutter"
        hint="padding uses the spacing scale; it applies to the inline axis so vertical rhythm stays with the content."
      >
        <Stack gap={3}>
          {([0, 2, 4, 6, 8] as const).map((padding) => (
            <Container
              key={padding}
              maxWidth="md"
              padding={padding}
            >
              <Box padding={2} background="surface">
                <Text size="sm">
                  padding {padding}
                </Text>
              </Box>
            </Container>
          ))}
        </Stack>
      </Section>

      <Section
        title="Alignment"
        hint="centered (default) centers the capped box; centered={false} keeps it at the inline start."
      >
        <Stack gap={4}>
          <Container maxWidth="sm">
            <Box padding={3} background="muted">
              <Text size="sm">
                centered — margin-inline auto
              </Text>
            </Box>
          </Container>

          <Container maxWidth="sm" centered={false}>
            <Box padding={3} background="muted">
              <Text size="sm">
                centered false — margin-inline 0
              </Text>
            </Box>
          </Container>
        </Stack>
      </Section>

      <Section
        title="Semantics"
        hint="as renders the landmark element while the container only handles width and gutter."
      >
        <Container
          as="article"
          maxWidth="md"
          aria-label="Release article"
        >
          <Stack gap={3}>
            <Badge variant="primary">Changelog</Badge>

            <Heading level={3} size="lg">
              Layout primitives, without a styling system
            </Heading>

            <Paragraph size="sm" tone="muted">
              Containers do not introduce a new color or a new
              spacing scale: they reuse the tokens the rest of
              the interface already consumes.
            </Paragraph>
          </Stack>
        </Container>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same container."
      >
        <Container maxWidth="lg" padding={0}>
          <Stack gap={4}>
            <Box padding={6} background="muted">
              <HStack gap={3} align="center" wrap>
                <Badge variant="success">Stable</Badge>

                <Stack gap={1}>
                  <Text weight="medium">
                    Documentation layout
                  </Text>

                  <Text size="sm" tone="muted">
                    A wide container for the body, a narrower
                    one for the reading column below.
                  </Text>
                </Stack>
              </HStack>
            </Box>

            <Container maxWidth="sm" padding={0}>
              <Stack gap={3}>
                <Heading level={3} size="md">
                  Reading column
                </Heading>

                <Paragraph size="sm" tone="muted">
                  The outer container caps the page at 1024px;
                  the inner one narrows the prose to 640px
                  without a second media query. The gutter is
                  removed here because the outer container
                  already provides it.
                </Paragraph>

                <HStack gap={2} wrap>
                  <Button size="sm">Read the guide</Button>

                  <Button
                    size="sm"
                    appearance="outline"
                  >
                    View source
                  </Button>
                </HStack>
              </Stack>
            </Container>
          </Stack>
        </Container>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
