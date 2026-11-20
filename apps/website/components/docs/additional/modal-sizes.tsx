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
  modalVariantMap,
} from "@pimolu/react";

const sizes = Object.keys(modalVariantMap.size) as Array<
  keyof typeof modalVariantMap.size
>;

export function DemoExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {sizes.map((size) => (
        <Modal key={size}>
          <ModalTrigger>
            <Button size="sm" appearance="soft">
              {size}
            </Button>
          </ModalTrigger>

          <ModalContent size={size}>
            <ModalHeader>
              <ModalTitle>{size} modal</ModalTitle>
              <ModalDescription>
                The panel is capped at the width declared by the {size}
                {" "}size.
              </ModalDescription>
            </ModalHeader>

            <ModalFooter>
              <ModalClose>
                <Button size="sm">Close</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  );
}
