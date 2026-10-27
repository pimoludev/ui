"use client";

import { RadioGroup, Radio } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <RadioGroup
              size="sm"
              orientation="horizontal"
              defaultValue="a"
              label="sm"
              classNames={{
                root: "custom-radio-root",
                label: "custom-radio-label"
              }}
            >
              <Radio
                value="a"
                label="Selected"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
              <Radio
                value="b"
                label="Other"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
            </RadioGroup>
            <RadioGroup
              size="md"
              orientation="horizontal"
              defaultValue="a"
              label="md"
              classNames={{
                root: "custom-radio-root",
                label: "custom-radio-label"
              }}
            >
              <Radio
                value="a"
                label="Selected"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
              <Radio
                value="b"
                label="Other"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
            </RadioGroup>
            <RadioGroup
              size="lg"
              orientation="horizontal"
              defaultValue="a"
              label="lg"
              classNames={{
                root: "custom-radio-root",
                label: "custom-radio-label"
              }}
            >
              <Radio
                value="a"
                label="Selected"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
              <Radio
                value="b"
                label="Other"
                classNames={{
                  root: "custom-radio-root",
                  label: "custom-radio-label"
                }}
              />
            </RadioGroup>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-radio-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-radio-label {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
