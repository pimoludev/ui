import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@pimolu/react";

import { modalSizes } from "../demo-data";
import { PageHeader, Section } from "../section";

function AnatomyModal() {
  return (
    <Modal>
      <ModalTrigger>
        <Button appearance="outline">
          Open the full modal
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalHeader>
          <ModalTitle id="modal-anatomy-title">
            Publish the release
          </ModalTitle>

          <ModalDescription id="modal-anatomy-description">
            The title names the modal and the description is
            announced after it; both ids are explicit here.
          </ModalDescription>
        </ModalHeader>

        <div className="pg-stack">
          <p className="pg-copy">
            Focus moves to the first control when the panel
            opens, Tab stays inside, and Escape returns focus to
            the trigger.
          </p>

          <p className="pg-copy">
            The header, footer and close button are separate
            parts, so the body stays ordinary JSX.
          </p>
        </div>

        <ModalFooter>
          <ModalClose>
            <Button appearance="ghost">Cancel</Button>
          </ModalClose>

          <ModalClose>
            <Button>Publish release</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SizeModal({
  size,
}: {
  size: (typeof modalSizes)[number];
}) {
  return (
    <Modal>
      <ModalTrigger>
        <Button size="sm" appearance="soft">
          {size}
        </Button>
      </ModalTrigger>

      <ModalContent size={size}>
        <ModalHeader>
          <ModalTitle>{size} modal</ModalTitle>

          <ModalDescription>
            The panel is capped at the width declared by the{" "}
            {size} size.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <Button size="sm">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function NonFocusableTriggerModal() {
  return (
    <Modal>
      <ModalTrigger>
        <span
          className="pg-copy"
          style={{
            color: "var(--pimolu-primary)",
            cursor: "pointer",
          }}
        >
          Open from a span
        </span>
      </ModalTrigger>

      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>A span can open it</ModalTitle>

          <ModalDescription>
            The child is not natively focusable, so Pimolu adds
            tabIndex=0 and role=button. Focus still returns to
            the span when the panel closes.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <Button size="sm">Got it</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ControlledModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(true);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <Button appearance="outline">Invite a teammate</Button>
      </ModalTrigger>

      <ModalContent>
        <ModalHeader>
          <ModalTitle>Invite to Project Atlas</ModalTitle>

          <ModalDescription>
            The page owns the open state, so Send can decide when
            the panel closes.
          </ModalDescription>
        </ModalHeader>

        <div className="pg-stack">
          <Input
            label="Email"
            type="email"
            value={email}
            onValueChange={setEmail}
          />

          <Checkbox
            label="Email the team when they accept"
            checked={notify}
            onCheckedChange={setNotify}
          />
        </div>

        <ModalFooter>
          <ModalClose>
            <Button appearance="ghost">Cancel</Button>
          </ModalClose>

          <Button onClick={() => setOpen(false)}>
            Send invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DeliberateModal() {
  return (
    <Modal>
      <ModalTrigger>
        <Button appearance="outline">
          Requires a choice
        </Button>
      </ModalTrigger>

      <ModalContent
        size="sm"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <ModalHeader>
          <ModalTitle>Confirm the migration</ModalTitle>

          <ModalDescription>
            Overlay click, Escape and the corner button are all
            disabled. Only the button below closes this panel.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <Button>I understand</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function NamedWithoutTitleModal() {
  return (
    <Modal>
      <ModalTrigger>
        <Button appearance="outline">
          Named without a title
        </Button>
      </ModalTrigger>

      <ModalContent
        aria-label="Keyboard shortcuts"
        size="sm"
        showCloseButton={false}
      >
        <div className="pg-stack">
          <p className="pg-copy">
            A modal with no visible title still needs a name:
            aria-label carries it here, and screen readers
            announce “Keyboard shortcuts”.
          </p>

          <p className="pg-copy">
            Escape closes the panel; Tab wraps inside it.
          </p>
        </div>

        <ModalFooter>
          <ModalClose>
            <Button size="sm">Got it</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function CustomizedParts() {
  return (
    <>
      <Modal>
        <ModalTrigger>
          <Button appearance="outline">Project details</Button>
        </ModalTrigger>

        <ModalContent
          className="pg-modal-panel"
          classNames={{
            content: "parts-modal-content",
            overlay: "parts-modal-overlay",
            closeButton: "parts-modal-close",
          }}
          style={{ maxWidth: "min(440px, calc(100vw - 32px))" }}
        >
          <ModalTitle>Make it yours</ModalTitle>
          <ModalDescription>
            Only this modal uses these part classes.
          </ModalDescription>
        </ModalContent>
      </Modal>

      <style>
        {`
.pg-modal-panel {
  border-color: var(--pimolu-primary);
}
.parts-modal-content {
  border-radius: 24px;
}
.parts-modal-overlay {
  background: color-mix(in srgb, var(--pimolu-background) 75%, transparent);
}
.parts-modal-close {
  border-radius: 50%;
}
`}
      </style>
    </>
  );
}

function DestructiveModal() {
  return (
    <Modal>
      <ModalTrigger>
        <Button variant="danger" appearance="soft">
          Delete workspace
        </Button>
      </ModalTrigger>

      <ModalContent size="sm" showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>Delete workspace?</ModalTitle>

          <ModalDescription>
            Every project, deployment and token in this
            workspace will be removed. This cannot be undone.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <Button appearance="outline">Cancel</Button>
          </ModalClose>

          <ModalClose>
            <Button variant="danger">Delete permanently</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function LongContentModal() {
  return (
    <Modal>
      <ModalTrigger>
        <Button appearance="outline">
          Terms of service
        </Button>
      </ModalTrigger>

      <ModalContent size="lg" closeLabel="Dismiss">
        <ModalHeader>
          <ModalTitle>Terms of service</ModalTitle>

          <ModalDescription>
            The panel is capped to the viewport and scrolls
            inside; the page behind it cannot scroll.
          </ModalDescription>
        </ModalHeader>

        <div className="pg-stack">
          {Array.from({ length: 18 }, (_, index) => (
            <p key={index} className="pg-copy">
              <strong>Clause {index + 1}.</strong> This
              paragraph exists to make the modal taller than the
              viewport, so the panel itself takes the scroll
              instead of letting the page move behind the
              overlay.
            </p>
          ))}
        </div>

        <ModalFooter>
          <ModalClose>
            <Button appearance="outline">Decline</Button>
          </ModalClose>

          <ModalClose>
            <Button>Accept</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ExternalTriggerModal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pg-row">
      <Button
        appearance="outline"
        onClick={() => setOpen(true)}
      >
        Open from outside
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Opened from outside</ModalTitle>

            <ModalDescription>
              There is no ModalTrigger: the page sets open
              directly and focus returns to this button when the
              panel closes.
            </ModalDescription>
          </ModalHeader>

          <ModalFooter>
            <ModalClose>
              <Button>Done</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export function ModalPage() {
  return (
    <>
      <PageHeader
        title="Modal"
        hint="A centered modal panel with an overlay, focus trap, Escape and overlay dismissal, scroll lock and focus return. Header, title, description, footer and close button are separate parts, so the content stays ordinary JSX. Styles come from @pimolu/web-styles/modal.css."
      />

      <Section
        title="Anatomy"
        hint="Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter and ModalClose, composed in the order a modal is read."
      >
        <AnatomyModal />
      </Section>

      <Section
        title="Sizes"
        hint="Enumerated from modalVariantMap: sm, md, lg and xl cap the panel width."
      >
        <div className="pg-row">
          {modalSizes.map((size) => (
            <SizeModal key={size} size={size} />
          ))}
        </div>
      </Section>

      <Section
        title="Non-focusable trigger"
        hint="A span child stays reachable: Pimolu adds tabIndex and a button role when the element is not focusable."
      >
        <NonFocusableTriggerModal />
      </Section>

      <Section
        title="Controlled usage"
        hint="A controlled modal with an email field and a checkbox; Send closes it from the page."
      >
        <ControlledModal />
      </Section>

      <Section
        title="Dismissal"
        hint="Overlay click, Escape and the corner button can each be turned off; a title-less modal takes its name from aria-label."
      >
        <div className="pg-row">
          <DeliberateModal />
          <NamedWithoutTitleModal />
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
              <DestructiveModal />
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
              <LongContentModal />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open from outside</CardTitle>
              <CardDescription>
                A controlled modal with no trigger, still themed
                and still returning focus to the button that
                opened it.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ExternalTriggerModal />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Named-part customization"
        hint="Add classes directly to stable parts, including portalled panels. Existing className props keep their targets."
      >
        <CustomizedParts />
      </Section>
    </>
  );
}
