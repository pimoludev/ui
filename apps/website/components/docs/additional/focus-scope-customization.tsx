"use client";

import {
  Stack,
  HStack,
  Badge,
  Button,
  Text,
  FocusScope,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Box
} from "@pimolu/react";
import { useState } from "react";

type InitialFocus = "first" | "container";

export function DemoExample() {
  const [active, setActive] = useState(false);
  const [trapped, setTrapped] = useState(true);
  const [restoreFocus, setRestoreFocus] = useState(true);
  const [initialFocus, setInitialFocus] = useState<InitialFocus>("first");
  return (
    <div className="grid gap-6">
      {
        (<>
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
                onClick={() => setInitialFocus((value) => value === "first"
                  ? "container"
                  : "first")}
              >
                Focus: {initialFocus}
              </Button>
              <Button
                size="sm"
                appearance="outline"
                aria-pressed={!restoreFocus}
                onClick={() => setRestoreFocus((value) => !value)}
              >
                Restore focus: {String(restoreFocus)}
              </Button>
            </HStack>
            <HStack gap={3} align="center" wrap>
              <Button onClick={() => setActive(true)} disabled={active}>Open scope</Button>
              <Text size="sm" tone="muted">
                The trigger receives focus back when the scope closes.
              </Text>
            </HStack>
            <FocusScope
              active={active}
              trapped={trapped}
              restoreFocus={restoreFocus}
              initialFocus={initialFocus}
              role="group"
              aria-label="Focus scope demo"
              classNames={{
                root: "custom-focus-scope-root"
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Invite a teammate</CardTitle>
                  <CardDescription>
                    Focus moves to the first control when the scope activates, or to
                    the container when initialFocus is “container”.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack gap={3}>
                    <Stack gap={1}>
                      <Input
                        label="Invite email"
                        type="email"
                        placeholder="name@company.com"
                      />
                    </Stack>
                    <Stack gap={1}>
                      <Text size="sm" weight="medium">Role</Text>
                      <Box
                        padding={3}
                        background="muted"
                        style={{
                          borderRadius: "var(--pimolu-radius-md)",
                        }}
                      >
                        <Text size="sm" tone="muted">Member — can view projects and comment.</Text>
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
                      <Button size="sm" onClick={() => setActive(false)}>Send invite</Button>
                    </HStack>
                  </Stack>
                </CardContent>
              </Card>
            </FocusScope>
            {
              !active
                ? (<Text size="sm" tone="muted">
                  The scope is inactive: Tab uses the normal page order and no
                  focus is captured.
                </Text>)
                : null
            }
          </Stack>
        </>)
      }
      <style>
        {
          `
.custom-focus-scope-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </div>
  );
}
