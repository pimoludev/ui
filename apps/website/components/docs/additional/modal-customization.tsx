"use client";

import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "@pimolu/react";

export function DemoExample() {
  return (
    <>
      <Modal>
        <ModalTrigger>
          <Button appearance="outline">Project details</Button>
        </ModalTrigger>

        <ModalContent
          className="parts-modal-panel"
          classNames={{
            root: "custom-modal-root",
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

          <ModalFooter>
            <ModalClose>
              <Button size="sm">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <style>
        {`
.parts-modal-panel {
  border-color: var(--pimolu-primary);
}
.custom-modal-root {
  color: var(--pimolu-foreground);
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
