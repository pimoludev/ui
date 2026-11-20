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
        <Button>Share the project</Button>
      </ModalTrigger>

      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Share Project Atlas</ModalTitle>
          <ModalDescription>
            Invite a teammate to review the migration plan before
            Friday.
          </ModalDescription>
        </ModalHeader>

        <p>
          They receive an email with a link to the project. You can
          change their role at any time.
        </p>

        <ModalFooter>
          <ModalClose>
            <Button appearance="outline" variant="neutral">
              Not now
            </Button>
          </ModalClose>

          <ModalClose>
            <Button>Send invite</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
