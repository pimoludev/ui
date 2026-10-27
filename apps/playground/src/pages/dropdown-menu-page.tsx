import { CustomizationExample } from "./dropdown-menu-customization-demo";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ActionsMenu() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div className="pg-row">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button appearance="outline">Actions</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={() => setLastAction("Rename")}
          >
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => setLastAction("Duplicate")}
          >
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled
            onSelect={() => setLastAction("Archive")}
          >
            Archive
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => setLastAction("Delete")}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Badge variant="neutral">
        last action: {lastAction}
      </Badge>
    </div>
  );
}

export function DropdownMenuPage() {
  return (
    <>
      <PageHeader
        title="DropdownMenu"
        hint="An anchored menu of actions with a portal, fixed positioning, arrow/Home/End navigation, outside and Escape dismissal, and focus returned to the trigger after a selection. Styles come from @pimolu/web-styles/dropdown-menu.css."
      />

      <Section
        title="Actions"
        hint="Labels, separators and disabled items; the selected action is reported outside the menu."
      >
        <ActionsMenu />
      </Section>

      <Section
        title="Alignment and anchors"
        hint="The panel is centred under the trigger; use align='end' for a trailing menu."
      >
        <div className="pg-row">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button appearance="outline">
                Start aligned
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>One</DropdownMenuItem>
              <DropdownMenuItem>Two</DropdownMenuItem>
              <DropdownMenuItem>Three</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button appearance="outline">
                End aligned
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>One</DropdownMenuItem>
              <DropdownMenuItem>Two</DropdownMenuItem>
              <DropdownMenuItem>Three</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="A row menu next to a list and a compact icon-only trigger."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Row actions</CardTitle>
              <CardDescription>
                The menu stays anchored to the trigger while
                the page scrolls.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row pg-row--between">
                <span>Design tokens</span>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      size="sm"
                      appearance="ghost"
                      aria-label="Row actions"
                    >
                      ⋯
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact trigger</CardTitle>
              <CardDescription>
                The trigger can be any element that forwards
                props.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="sm" appearance="outline">
                    Settings
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
