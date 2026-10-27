import { CustomizationExample } from "./alert-dialog-customization-demo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

export function AlertDialogPage() {
  return (
    <>
      <PageHeader
        title="AlertDialog"
        hint="A modal confirmation that requires an explicit action. It uses the Dialog portal, focus trap and scroll lock, but the overlay click and Escape do not dismiss it and the corner close button is hidden. Styles come from @pimolu/web-styles/dialog.css."
      />

      <Section
        title="Destructive confirmation"
        hint="The action and cancel buttons are the only ways out."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="danger" appearance="soft">
              Delete workspace
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete workspace?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Every project, deployment and token in this
                workspace will be removed. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button appearance="outline">Cancel</Button>
              </AlertDialogCancel>

              <AlertDialogAction>
                <Button variant="danger">
                  Delete permanently
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section
        title="Non-destructive confirmation"
        hint="The same structure for an action that is important but reversible."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button appearance="outline">
              Transfer ownership
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Transfer this workspace?
              </AlertDialogTitle>

              <AlertDialogDescription>
                You will become an administrator. The new owner
                can invite and remove members.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button appearance="ghost">Stay owner</Button>
              </AlertDialogCancel>

              <AlertDialogAction>
                <Button>Transfer</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section
        title="Content"
        hint="Any content can sit between the header and the footer."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button appearance="outline">
              Review the migration
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Start the migration?
              </AlertDialogTitle>

              <AlertDialogDescription>
                The old tokens will be archived after the copy
                completes.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="pg-stack">
              <Badge variant="warning">3 projects</Badge>
              <Badge variant="neutral">12 components</Badge>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button appearance="outline">Later</Button>
              </AlertDialogCancel>

              <AlertDialogAction>
                <Button>Start migration</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section
        title="Anatomy"
        hint="AlertDialogContent sets role=alertdialog; the header, title, description and footer are the Dialog parts."
      >
        <Card>
          <CardHeader>
            <CardTitle>When to use it</CardTitle>
            <CardDescription>
              A confirmation where the user must choose; not a
              general form or a dismissible information panel.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="pg-copy">
              The overlay and Escape are disabled, so a
              destructive or irreversible action cannot be
              dismissed by accident.
            </p>
          </CardContent>
        </Card>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
