import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FocusScope,
  HStack,
  Heading,
  Paragraph,
  Stack,
  Text,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

type InitialFocus = "first" | "container";

export function FocusScopePage() {
  const [active, setActive] = useState(false);
  const [trapped, setTrapped] = useState(true);
  const [restoreFocus, setRestoreFocus] = useState(true);
  const [initialFocus, setInitialFocus] =
    useState<InitialFocus>("first");
  const [containerActive, setContainerActive] =
    useState(false);

  return (
    <>
      <PageHeader
        title="FocusScope"
        hint="Moves focus inside a region when it activates, optionally traps Tab and restores the previous focus when it deactivates. It does not require a dialog: use it for inline confirmations, drawers or any keyboard-owned region. Styles come from @pimolu/web-styles/focus-scope.css."
      />

      <Section
        title="Playground"
        hint="Activate the scope, then use Tab and Shift+Tab. Deactivate it to see the restore behavior."
      >
        <Stack gap={4}>
          <HStack gap={2} wrap>
            <Badge variant={active ? "success" : "neutral"}>
              {active ? "active" : "inactive"}
            </Badge>

            <Badge variant={trapped ? "primary" : "secondary"}>
              {trapped ? "trapped" : "not trapped"}
            </Badge>

            <Badge variant="secondary">
              initialFocus: {initialFocus}
            </Badge>

            <Badge variant="secondary">
              restoreFocus: {String(restoreFocus)}
            </Badge>
          </HStack>

          <HStack gap={2} wrap>
            <Button
              size="sm"
              appearance="outline"
              aria-pressed={trapped}
              onClick={() => setTrapped((value) => !value)}
            >
              {trapped ? "Disable trap" : "Enable trap"}
            </Button>

            <Button
              size="sm"
              appearance="outline"
              aria-pressed={initialFocus === "container"}
              onClick={() =>
                setInitialFocus((value) =>
                  value === "first" ? "container" : "first"
                )
              }
            >
              Focus: {initialFocus}
            </Button>

            <Button
              size="sm"
              appearance="outline"
              aria-pressed={!restoreFocus}
              onClick={() =>
                setRestoreFocus((value) => !value)
              }
            >
              Restore focus: {String(restoreFocus)}
            </Button>
          </HStack>

          <HStack gap={3} align="center" wrap>
            <Button
              onClick={() => setActive(true)}
              disabled={active}
            >
              Open scope
            </Button>

            <Text size="sm" tone="muted">
              The trigger receives focus back when the scope
              closes.
            </Text>
          </HStack>

          <FocusScope
            active={active}
            trapped={trapped}
            restoreFocus={restoreFocus}
            initialFocus={initialFocus}
            role="group"
            aria-label="Focus scope demo"
          >
            <Card>
              <CardHeader>
                <CardTitle>Invite a teammate</CardTitle>
                <CardDescription>
                  Focus moves to the first control when the
                  scope activates, or to the container when
                  initialFocus is “container”.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Stack gap={3}>
                  <Stack gap={1}>
                    <Text size="sm" weight="medium">
                      Email
                    </Text>

                    <input
                      className="pimolu-input"
                      type="email"
                      placeholder="name@company.com"
                    />
                  </Stack>

                  <Stack gap={1}>
                    <Text size="sm" weight="medium">
                      Role
                    </Text>

                    <Box
                      padding={3}
                      background="muted"
                      style={{
                        borderRadius:
                          "var(--pimolu-radius-md)",
                      }}
                    >
                      <Text size="sm" tone="muted">
                        Member — can view projects and comment.
                      </Text>
                    </Box>
                  </Stack>

                  <HStack gap={2} justify="end" wrap>
                    <Button
                      size="sm"
                      appearance="ghost"
                      onClick={() => setActive(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setActive(false)}
                    >
                      Send invite
                    </Button>
                  </HStack>
                </Stack>
              </CardContent>
            </Card>
          </FocusScope>

          {!active ? (
            <Text size="sm" tone="muted">
              The scope is inactive: Tab uses the normal page
              order and no focus is captured.
            </Text>
          ) : null}
        </Stack>
      </Section>

      <Section
        title="Container focus"
        hint={'initialFocus="container" is useful when the region has no interactive control yet; the container is programmatically focusable and shows a ring.'}
      >
        <Stack gap={3}>
          <HStack gap={2} align="center" wrap>
            <Button
              size="sm"
              onClick={() =>
                setContainerActive((value) => !value)
              }
            >
              {containerActive
                ? "Deactivate container focus"
                : "Focus the container"}
            </Button>

            <Text size="sm" tone="muted">
              initialFocus=&quot;container&quot; focuses the
              panel itself.
            </Text>
          </HStack>

          <FocusScope
            active={containerActive}
            initialFocus="container"
            role="group"
            aria-label="Status details"
          >
            <Box
              padding={6}
              background="surface"
              style={{
                borderRadius: "var(--pimolu-radius-md)",
              }}
            >
              <Stack gap={2}>
                <Heading level={3} size="md">
                  Release in progress
                </Heading>

                <Paragraph size="sm" tone="muted">
                  Focus starts on this panel. When controls
                  appear, the same scope can move focus to
                  the first one instead.
                </Paragraph>
              </Stack>
            </Box>
          </FocusScope>

          <Text size="sm" tone="muted">
            {containerActive
              ? "The scope is active: Tab cycles inside the panel."
              : "The scope is inactive: the panel keeps the normal page order."}
          </Text>
        </Stack>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same focus owner."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Inline confirmation</CardTitle>
              <CardDescription>
                A non-modal confirmation that still owns the
                keyboard while it is open.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={3}>
                <HStack gap={2} align="center">
                  <Badge variant="warning">Draft</Badge>

                  <Text size="sm" tone="muted">
                    Unsaved changes in the editor.
                  </Text>
                </HStack>

                <Box
                  padding={4}
                  background="muted"
                  style={{
                    borderRadius:
                      "var(--pimolu-radius-md)",
                  }}
                >
                  <Stack gap={3}>
                    <Text size="sm">
                      Publish the draft and notify the team?
                    </Text>

                    <HStack gap={2} wrap>
                      <Button size="sm" appearance="outline">
                        Keep editing
                      </Button>

                      <Button size="sm">Publish</Button>
                    </HStack>
                  </Stack>
                </Box>

                <Text size="sm" tone="muted">
                  The confirmation can wrap the actions in a
                  FocusScope and set active while it is open;
                  the page behind it stays interactive.
                </Text>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skip link target</CardTitle>
              <CardDescription>
                Pair a focus scope with a skip link to move
                keyboard users into the main content.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={3}>
                <Text size="sm" tone="muted">
                  A skip link focuses the main region; the
                  scope then keeps Tab inside until the user
                  leaves it deliberately.
                </Text>

                <FocusScope
                  as="section"
                  aria-label="Main content demo"
                  active={false}
                >
                  <Box
                    padding={4}
                    background="surface"
                    style={{
                      borderRadius:
                        "var(--pimolu-radius-md)",
                    }}
                  >
                    <Stack gap={2}>
                      <Text weight="medium">
                        Main content
                      </Text>

                      <Text size="sm" tone="muted">
                        An inactive scope renders no trap and
                        leaves the normal page order intact.
                      </Text>
                    </Stack>
                  </Box>
                </FocusScope>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drawer body</CardTitle>
              <CardDescription>
                The same scope can live inside a drawer
                without importing the drawer.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Stack gap={3}>
                <HStack gap={2} align="center">
                  <Badge variant="secondary">Settings</Badge>

                  <Text size="sm" tone="muted">
                    Focus returns to the menu button on close.
                  </Text>
                </HStack>

                <Stack gap={2}>
                  <Button
                    size="sm"
                    appearance="outline"
                    fullWidth
                  >
                    Account
                  </Button>

                  <Button
                    size="sm"
                    appearance="outline"
                    fullWidth
                  >
                    Appearance
                  </Button>

                  <Button
                    size="sm"
                    appearance="outline"
                    fullWidth
                  >
                    Notifications
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
