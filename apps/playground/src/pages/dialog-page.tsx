import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@pimolu/react";

import { dialogSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

function AnatomyDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button appearance="outline">
          Open the full dialog
        </Button>
      </DialogTrigger>

      <DialogContent className="pg-dialog-accent">
        <DialogHeader>
          <DialogTitle id="dialog-anatomy-title">
            Project settings
          </DialogTitle>

          <DialogDescription id="dialog-anatomy-description">
            The title names the dialog and the description is
            announced after it; both ids are explicit here.
          </DialogDescription>
        </DialogHeader>

        <div className="pg-stack">
          <p className="pg-copy">
            Focus moves to the first control when the panel
            opens, Tab stays inside, and Escape returns focus to
            the trigger.
          </p>

          <p className="pg-copy">
            The accent border comes from a custom class on the
            panel, not from a new theme token.
          </p>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button appearance="ghost">Cancel</Button>
          </DialogClose>

          <DialogClose>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ControlledFormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Project Atlas");
  const [notify, setNotify] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button appearance="outline">Edit project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>

          <DialogDescription>
            The page owns the open state, so Save can decide when
            the panel closes.
          </DialogDescription>
        </DialogHeader>

        <div className="pg-stack">
          <Input
            label="Name"
            value={name}
            onValueChange={setName}
          />

          <Checkbox
            label="Email the team about every change"
            checked={notify}
            onCheckedChange={setNotify}
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button appearance="ghost">Cancel</Button>
          </DialogClose>

          <Button onClick={() => setOpen(false)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DestructiveDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="danger" appearance="soft">
          Delete workspace
        </Button>
      </DialogTrigger>

      <DialogContent size="sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete workspace?</DialogTitle>

          <DialogDescription>
            Every project, deployment and token in this
            workspace will be removed. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button appearance="outline">Cancel</Button>
          </DialogClose>

          <DialogClose>
            <Button variant="danger">Delete permanently</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LongContentDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button appearance="outline">
          Terms of service
        </Button>
      </DialogTrigger>

      <DialogContent size="lg" closeLabel="Dismiss">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>

          <DialogDescription>
            The panel is capped to the viewport and scrolls
            inside; the page behind it cannot scroll.
          </DialogDescription>
        </DialogHeader>

        <div className="pg-stack">
          {Array.from({ length: 18 }, (_, index) => (
            <p
              key={index}
              className="pg-copy"
            >
              <strong>Clause {index + 1}.</strong> This
              paragraph exists to make the dialog taller than
              the viewport, so the panel itself takes the
              scroll instead of letting the page move behind
              the overlay.
            </p>
          ))}
        </div>

        <DialogFooter>
          <DialogClose>
            <Button appearance="outline">Decline</Button>
          </DialogClose>

          <DialogClose>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeliberateDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button appearance="outline">
          Requires a choice
        </Button>
      </DialogTrigger>

      <DialogContent
        size="sm"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Confirm the migration</DialogTitle>

          <DialogDescription>
            Overlay click, Escape and the corner button are all
            disabled. Only the button below closes this panel.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button>I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NamedWithoutTitleDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button appearance="outline">
          Named without a title
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-label="Keyboard shortcuts"
        size="sm"
      >
        <div className="pg-stack">
          <p className="pg-copy">
            A dialog with no visible title still needs a name:
            aria-label carries it here, and screen readers
            announce “Keyboard shortcuts”.
          </p>

          <p className="pg-copy">
            Escape closes the panel; Tab wraps inside it.
          </p>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button size="sm">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CustomLabellingDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button appearance="outline">
          Custom labelling
        </Button>
      </DialogTrigger>

      <DialogContent
        size="sm"
        aria-labelledby="dialog-custom-title"
        aria-describedby="dialog-custom-description"
      >
        <h2
          id="dialog-custom-title"
          className="pimolu-dialog__title"
        >
          Custom heading
        </h2>

        <p
          id="dialog-custom-description"
          className="pimolu-dialog__description"
        >
          DialogContent can be pointed at any heading and
          paragraph with its aria-labelledby and
          aria-describedby overrides.
        </p>

        <DialogFooter>
          <DialogClose>
            <Button size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExternalTriggerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pg-row">
      <Button
        appearance="outline"
        onClick={() => setOpen(true)}
      >
        Open from outside
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opened from outside</DialogTitle>

            <DialogDescription>
              There is no DialogTrigger: the page sets open
              directly and focus returns to this button when the
              panel closes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DefaultOpenDialog() {
  const [mounted, setMounted] = useState(false);

  return (
    <div className="pg-row">
      <Button
        size="sm"
        appearance="ghost"
        disabled={mounted}
        onClick={() => setMounted(true)}
      >
        Mount with defaultOpen
      </Button>

      {mounted && (
        <Button
          size="sm"
          appearance="ghost"
          onClick={() => setMounted(false)}
        >
          Remove the demo
        </Button>
      )}

      {mounted && (
        <Dialog defaultOpen>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Open on mount</DialogTitle>

              <DialogDescription>
                defaultOpen made the panel visible on its very
                first render; closing it unmounts the panel,
                not the dialog instance.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button size="sm">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function DialogPage() {
  return (
    <>
      <PageHeader
        title="Dialog"
        hint="A modal panel with an overlay, focus trap, Escape and overlay dismissal, scroll lock and focus return. Header, title, description, footer and close button are separate parts, so the content stays ordinary JSX. Styles come from @pimolu/web-styles/dialog.css."
      />

      <Section
        title="Anatomy"
        hint="Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter and DialogClose, composed in the order a dialog is read."
      >
        <AnatomyDialog />
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from dialogVariantMap: sm, md and lg cap the panel width."
      >
        <div className="pg-row">
          {dialogSizes.map((size) => (
            <Dialog key={size}>
              <DialogTrigger>
                <Button size="sm" appearance="soft">
                  {size}
                </Button>
              </DialogTrigger>

              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle>
                    {size} dialog
                  </DialogTitle>

                  <DialogDescription>
                    The panel is capped at the width declared
                    by the {size} size.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose>
                    <Button size="sm">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </Section>

      <Section
        title="Forms"
        hint="A controlled dialog with a name field and a checkbox; Save closes it from the page."
      >
        <ControlledFormDialog />
      </Section>

      <Section
        title="Dismissal"
        hint="Overlay click, Escape and the corner button can each be turned off; a title-less dialog takes its name from aria-label, or from ids handed to DialogContent."
      >
        <div className="pg-row">
          <DeliberateDialog />
          <NamedWithoutTitleDialog />
          <CustomLabellingDialog />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Real compositions built from the same parts."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Destructive action</CardTitle>
              <CardDescription>
                No corner button on a confirmation: the two
                explicit actions are the only ways out.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DestructiveDialog />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Long content</CardTitle>
              <CardDescription>
                The panel scrolls inside while the body stays
                locked behind it.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LongContentDialog />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open from outside</CardTitle>
              <CardDescription>
                A controlled dialog with no trigger, still
                themed and still returning focus to the button
                that opened it.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ExternalTriggerDialog />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open on mount</CardTitle>
              <CardDescription>
                defaultOpen is for a dialog that must already be
                visible on its first render.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DefaultOpenDialog />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
