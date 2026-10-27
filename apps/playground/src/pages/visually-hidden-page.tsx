import { CustomizationExample } from "./visually-hidden-customization-demo";
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
  VisuallyHidden,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function VisuallyHiddenPage() {
  return (
    <>
      <PageHeader
        title="VisuallyHidden"
        hint="Keeps content available to assistive technology while removing it from sight with the standard clip technique. focusable reveals the content when it receives focus, which is what skip links need. Styles come from @pimolu/web-styles/visually-hidden.css."
      />

      <Section
        title="Labels"
        hint="Icon-only controls keep a real accessible name without adding visible text."
      >
        <HStack gap={3} align="center" wrap>
          <Button iconOnly>
            <span aria-hidden="true">×</span>
            <VisuallyHidden>Close dialog</VisuallyHidden>
          </Button>

          <Button iconOnly appearance="outline">
            <span aria-hidden="true">⌕</span>
            <VisuallyHidden>Search the documentation</VisuallyHidden>
          </Button>

          <HStack gap={2} align="center">
            <Badge variant="secondary">3 new</Badge>

            <VisuallyHidden>
              three unread notifications
            </VisuallyHidden>
          </HStack>
        </HStack>
      </Section>

      <Section
        title="Focusable skip link"
        hint="Tab into the page: the link is clipped, then becomes a fixed panel at the top-left while focused."
      >
        <Stack gap={3}>
          <Box
            padding={4}
            background="muted"
            style={{ borderRadius: "var(--pimolu-radius-md)" }}
          >
            <Text size="sm" tone="muted">
              Press Tab to reveal the skip link, then Enter
              to jump to the content below.
            </Text>
          </Box>

          <VisuallyHidden
            focusable
            as="a"
            href="#visually-hidden-target"
          >
            Skip to example content
          </VisuallyHidden>

          <Box
            id="visually-hidden-target"
            tabIndex={-1}
            padding={6}
            background="surface"
          >
            <Stack gap={2}>
              <Heading level={3} size="md">
                Example content
              </Heading>

              <Paragraph size="sm" tone="muted">
                The anchor is a real link. The wrapper only
                changes how it is painted until it receives
                focus.
              </Paragraph>
            </Stack>
          </Box>
        </Stack>
      </Section>

      <Section
        title="Live regions"
        hint="A polite status can stay hidden; screen readers announce it when the text changes."
      >
        <Stack gap={3}>
          <HStack gap={2} align="center">
            <Button size="sm" appearance="outline">
              Save draft
            </Button>

            <Text size="sm" tone="muted">
              The status below is always rendered.
            </Text>
          </HStack>

          <VisuallyHidden role="status" aria-live="polite">
            Draft saved
          </VisuallyHidden>
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same primitive."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Icon button toolbar</CardTitle>
              <CardDescription>
                Each icon keeps a name for voice control and
                screen readers.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <HStack gap={2} align="center">
                {[
                  ["←", "Previous page"],
                  ["→", "Next page"],
                  ["↻", "Refresh results"],
                  ["⋯", "More actions"],
                ].map(([glyph, label]) => (
                  <Button
                    key={label}
                    iconOnly
                    size="sm"
                    appearance="outline"
                  >
                    <span aria-hidden="true">{glyph}</span>
                    <VisuallyHidden>{label}</VisuallyHidden>
                  </Button>
                ))}
              </HStack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search field label</CardTitle>
              <CardDescription>
                A label can be present for assistive
                technology and absent from the visual layout.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={2}>
                <Text size="sm" tone="muted">
                  The input is labelled by the hidden text.
                </Text>

                <Box
                  padding={3}
                  background="muted"
                  style={{ borderRadius: "var(--pimolu-radius-md)" }}
                >
                  <Stack gap={1}>
                    <VisuallyHidden id="hidden-search-label">
                      Search the documentation
                    </VisuallyHidden>

                    <input
                      aria-labelledby="hidden-search-label"
                      placeholder="Search…"
                      className="pimolu-input"
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heading context</CardTitle>
              <CardDescription>
                Hidden text can disambiguate repeated visible
                headings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={3}>
                <Heading level={3} size="md">
                  Billing
                  <VisuallyHidden> for the Acme workspace</VisuallyHidden>
                </Heading>

                <Paragraph size="sm" tone="muted">
                  The heading reads “Billing for the Acme
                  workspace” in the accessibility tree while
                  the visual title stays short.
                </Paragraph>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
