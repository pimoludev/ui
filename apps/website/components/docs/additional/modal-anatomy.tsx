"use client";

import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@pimolu/react";

export function DemoExample() {
  return (
    <Modal>
      <ModalTrigger>
        <span style={{ color: "var(--pimolu-primary)", cursor: "pointer", textDecoration: "underline" }}>
          Open from a span
        </span>
      </ModalTrigger>

      <ModalContent>
        <ModalHeader>
          <ModalTitle>Publish the release</ModalTitle>
          <ModalDescription>
            The title names the modal and the description is announced
            after it.
          </ModalDescription>
        </ModalHeader>

        <p>
          The trigger is a span, so Pimolu adds tabIndex=0 and
          role=button. Focus moves into the panel on open, Tab stays
          inside, and Escape returns focus to the span.
        </p>

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
