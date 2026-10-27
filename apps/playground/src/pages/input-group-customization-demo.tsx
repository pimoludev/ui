"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid">
            <InputGroup
              aria-label="Website"
              classNames={{
                root: "custom-input-group-root",
                control: "custom-input-group-control"
              }}
            >
              <InputGroupAddon align="inline-start">
                https://
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Website address"
                placeholder="pimolu.dev"
                autoComplete="url"
              />
            </InputGroup>
            <InputGroup
              aria-label="Unit price"
              classNames={{
                root: "custom-input-group-root",
                control: "custom-input-group-control"
              }}
            >
              <InputGroupInput
                aria-label="Price amount"
                placeholder="49.99"
                inputMode="decimal"
              />
              <InputGroupAddon align="inline-end">
                USD
              </InputGroupAddon>
            </InputGroup>
            <InputGroup
              aria-label="Domain"
              classNames={{
                root: "custom-input-group-root",
                control: "custom-input-group-control"
              }}
            >
              <InputGroupInput
                aria-label="Domain name"
                placeholder="pimolu"
              />
              <InputGroupText>.dev</InputGroupText>
            </InputGroup>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-input-group-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-input-group-control {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
