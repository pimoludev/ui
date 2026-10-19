import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Link,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function ProfileCard() {
  return (
    <HoverCard placement="bottom" openDelay={200} closeDelay={150}>
      <HoverCardTrigger>
        <Button appearance="ghost">Ada Lovelace</Button>
      </HoverCardTrigger>

      <HoverCardContent label="Ada Lovelace profile">
        <div className="pg-stack">
          <div className="pg-row pg-row--between">
            <strong>Ada Lovelace</strong>
            <Badge variant="success">Available</Badge>
          </div>

          <p className="pg-copy">
            Mathematician and writer, known for the first
            published algorithm intended for a machine.
          </p>

          <p className="pg-muted">
            London · she/her · joined 1843
          </p>

          <Link href="#hover-card" className="pimolu-link">
            View full profile
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function HoverCardPage() {
  return (
    <>
      <PageHeader
        title="HoverCard"
        hint="A rich preview opened by hover or focus after a delay. The panel is hoverable and focusable, closes after the pointer leaves both surfaces, and Escape dismisses it without stealing focus on open. Styles come from @pimolu/web-styles/hover-card.css."
      />

      <Section
        title="Profile preview"
        hint="Hover or focus the trigger; move into the card to keep it open."
      >
        <ProfileCard />
      </Section>

      <Section
        title="Delays"
        hint="The open delay prevents accidental previews while the pointer crosses the page."
      >
        <div className="pg-row">
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              <Button appearance="outline">Immediate</Button>
            </HoverCardTrigger>

            <HoverCardContent label="Immediate card">
              <p className="pg-copy">
                No open or close delay.
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={500} closeDelay={300}>
            <HoverCardTrigger>
              <Button appearance="outline">Deliberate</Button>
            </HoverCardTrigger>

            <HoverCardContent label="Deliberate card">
              <p className="pg-copy">
                Opens after 500 ms and closes after 300 ms.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Hover cards add context; they do not replace a click-through page."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
              <CardDescription>
                A short profile with a link to the full page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ProfileCard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                It must not contain essential actions that cannot
                be reached from the trigger.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="pg-copy">
                The trigger receives aria-haspopup and
                aria-expanded; the panel is a named dialog.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
