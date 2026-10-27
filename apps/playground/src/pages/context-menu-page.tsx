import { CustomizationExample } from "./context-menu-customization-demo";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function ContextMenuPage() {
  return (
    <>
      <PageHeader
        title="ContextMenu"
        hint="A menu opened by the secondary pointer button at the pointer coordinates. It is portalled, clamped to the viewport, keyboard navigable and dismissible with Escape or an outside press. Styles come from @pimolu/web-styles/context-menu.css."
      />

      <Section
        title="Right-click area"
        hint="Right-click anywhere inside the surface. The native menu is suppressed."
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="pg-surface-demo">
              Right-click this panel to open the project menu.
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuLabel>Project</ContextMenuLabel>

            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem disabled>Archive</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section
        title="Examples"
        hint="A row or card can own its context menu without changing the surrounding layout."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Project row</CardTitle>
              <CardDescription>
                Right-click the row, not the page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className="pg-surface-demo">
                    Project Atlas · production
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                  <ContextMenuItem>Open dashboard</ContextMenuItem>
                  <ContextMenuItem>Copy project id</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Remove from recents</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard</CardTitle>
              <CardDescription>
                Arrow keys, Home/End, Enter and Escape.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-row">
                <Badge variant="neutral">ArrowDown</Badge>
                <Badge variant="neutral">Escape</Badge>
                <Badge variant="neutral">Enter</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
